'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, Check, X } from 'lucide-react'
import Button from '@/components/ui/Button'

type Conversation = {
  id: string
  statut: string
  recruteur: { raison_sociale: string; type_structure: string }
  dernierMessage?: string
  nonLus?: number
}

type Message = {
  id: string
  content: string
  sender_id: string
  created_at: string
}

export default function MessagesPage() {
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

    const { data: candidat } = await supabase.from('candidats').select('id').eq('user_id', user.id).single()
    if (!candidat) return

    const { data } = await supabase
      .from('conversations')
      .select(`id, statut, recruteurs(raison_sociale, type_structure)`)
      .eq('candidat_id', candidat.id)
      .order('updated_at', { ascending: false })

    setConversations((data || []).map((c: Record<string, unknown>) => ({
      id: c.id as string,
      statut: c.statut as string,
      recruteur: c.recruteurs as { raison_sociale: string; type_structure: string },
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

    // Realtime
    const channel = supabase.channel(`conv-${conv.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conv.id}` },
        (payload) => setMessages(prev => [...prev, payload.new as Message])
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selected) return
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: selected.id, content: newMessage }),
    })
    setNewMessage('')
    setSending(false)
  }

  async function updateStatut(conv_id: string, statut: string) {
    await supabase.from('conversations').update({ statut }).eq('id', conv_id)
    loadConversations()
    if (selected?.id === conv_id) setSelected(prev => prev ? { ...prev, statut } : null)
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-6">Messages</h1>
      <div className="bg-white rounded-2xl border border-black/8 overflow-hidden" style={{ height: '70vh' }}>
        <div className="grid grid-cols-3 h-full">
          
          {/* Liste conversations */}
          <div className="border-r border-black/8 overflow-y-auto">
            <div className="p-4 border-b border-black/8 text-xs font-bold text-gray-400 uppercase tracking-wider">Conversations</div>
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">Aucune conversation</div>
            ) : conversations.map(conv => (
              <button key={conv.id} onClick={() => selectConversation(conv)}
                className={`w-full p-4 text-left border-b border-black/5 transition-colors hover:bg-gray-50 ${selected?.id === conv.id ? 'bg-gray-50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{conv.recruteur?.raison_sociale}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{conv.recruteur?.type_structure}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    conv.statut === 'acceptee' ? 'bg-green-100 text-green-700' :
                    conv.statut === 'refusee' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{conv.statut}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Zone messages */}
          <div className="col-span-2 flex flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                Sélectionnez une conversation
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-black/8 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">{selected.recruteur?.raison_sociale}</p>
                    <p className="text-xs text-gray-400">{selected.recruteur?.type_structure} · SIRET vérifié</p>
                  </div>
                  {selected.statut === 'en_attente' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatut(selected.id, 'acceptee')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                        <Check size={12} />Accepter
                      </button>
                      <button onClick={() => updateStatut(selected.id, 'refusee')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                        <X size={12} />Refuser
                      </button>
                    </div>
                  )}
                </div>

                {/* Messages */}
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

                {/* Input */}
                <div className="p-4 border-t border-black/8 flex gap-3">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
