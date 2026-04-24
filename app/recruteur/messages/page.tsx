'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send } from 'lucide-react'
import Button from '@/components/ui/Button'

type Conversation = {
  id: string
  statut: string
  candidat: { pseudo: string; fonction: string; secteur: string } | null
}

type Message = {
  id: string
  content: string
  sender_id: string
  created_at: string
}

export default function RecruteurMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userId, setUserId] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadConversations()
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || ''))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadConversations() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: recruteur } = await supabase
      .from('recruteurs').select('id').eq('user_id', user.id).single()
    if (!recruteur) return

    const { data } = await supabase
      .from('conversations')
      .select(`id, statut, candidats(pseudo, fonction, secteur)`)
      .eq('recruteur_id', recruteur.id)
      .order('updated_at', { ascending: false })

    setConversations((data || []).map((c: Record<string, unknown>) => ({
      id: c.id as string,
      statut: c.statut as string,
      candidat: c.candidats as Conversation['candidat'],
    })))
  }

  async function selectConversation(conv: Conversation) {
    setSelected(conv)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])

    const channel = supabase.channel(`conv-${conv.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conv.id}` },
        (payload) => setMessages(prev => [...prev, payload.new as Message])
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selected) return
    if (selected.statut !== 'acceptee') return
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: selected.id, content: newMessage }),
    })
    setNewMessage('')
    setSending(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-6">Messages</h1>
      <div className="bg-white rounded-2xl border border-black/8 overflow-hidden" style={{ height: '70vh' }}>
        <div className="grid grid-cols-3 h-full">

          <div className="border-r border-black/8 overflow-y-auto">
            <div className="p-4 border-b border-black/8 text-xs font-bold text-gray-400 uppercase tracking-wider">Conversations</div>
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">Aucune conversation</div>
            ) : conversations.map(conv => (
              <button key={conv.id} onClick={() => selectConversation(conv)}
                className={`w-full p-4 text-left border-b border-black/5 transition-colors hover:bg-gray-50 ${selected?.id === conv.id ? 'bg-gray-50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold font-mono truncate">{conv.candidat?.pseudo}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{conv.candidat?.fonction}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                    conv.statut === 'acceptee' ? 'bg-green-100 text-green-700' :
                    conv.statut === 'refusee' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{conv.statut}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="col-span-2 flex flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                Sélectionnez une conversation
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-black/8">
                  <p className="font-bold text-sm font-mono">{selected.candidat?.pseudo}</p>
                  <p className="text-xs text-gray-400">{selected.candidat?.fonction} · {selected.candidat?.secteur}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender_id === userId ? 'bg-gray-900 text-white' : 'bg-white border border-black/8'
                      }`}>
                        {msg.content}
                        <div className={`text-xs mt-1 ${msg.sender_id === userId ? 'text-white/40' : 'text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-black/8">
                  {selected.statut !== 'acceptee' ? (
                    <p className="text-xs text-center text-gray-400">
                      {selected.statut === 'en_attente'
                        ? 'En attente de l\'acceptation du candidat'
                        : 'Conversation fermée'}
                    </p>
                  ) : (
                    <div className="flex gap-3">
                      <textarea
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                        placeholder="Votre message..."
                        rows={1}
                        className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 resize-none transition-colors"
                      />
                      <Button onClick={sendMessage} loading={sending} className="px-3 aspect-square">
                        <Send size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
