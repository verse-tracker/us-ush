'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react'

type Demande = {
  id: string
  statut: 'en_attente' | 'acceptee' | 'refusee' | 'archivee'
  created_at: string
  updated_at: string
  candidat: { pseudo: string; fonction: string; secteur: string } | null
}

const STATUT_LABEL: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  en_attente: { label: 'En attente', icon: Clock, color: 'text-orange-500 bg-orange-50' },
  acceptee: { label: 'Acceptée', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  refusee: { label: 'Refusée', icon: XCircle, color: 'text-red-600 bg-red-50' },
  archivee: { label: 'Archivée', icon: XCircle, color: 'text-gray-500 bg-gray-50' },
}

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([])
  const [filter, setFilter] = useState<'all' | 'en_attente' | 'acceptee' | 'refusee'>('all')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: recruteur } = await supabase
      .from('recruteurs').select('id').eq('user_id', user.id).single()
    if (!recruteur) { setLoading(false); return }

    const { data } = await supabase
      .from('conversations')
      .select('id, statut, created_at, updated_at, candidats(pseudo, fonction, secteur)')
      .eq('recruteur_id', recruteur.id)
      .order('updated_at', { ascending: false })

    setDemandes((data || []).map((d: Record<string, unknown>) => ({
      id: d.id as string,
      statut: d.statut as Demande['statut'],
      created_at: d.created_at as string,
      updated_at: d.updated_at as string,
      candidat: d.candidats as Demande['candidat'],
    })))
    setLoading(false)
  }

  const filtered = filter === 'all' ? demandes : demandes.filter(d => d.statut === filter)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">Mes demandes</h1>
        <p className="text-gray-500 mt-1">Suivi de vos prises de contact</p>
      </div>

      <div className="flex gap-2 mb-6">
        {([
          ['all', 'Toutes'],
          ['en_attente', 'En attente'],
          ['acceptee', 'Acceptées'],
          ['refusee', 'Refusées'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              filter === key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-black/8 p-12 text-center text-sm text-gray-400">
          Chargement…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/8 p-12 text-center">
          <p className="text-sm font-semibold mb-1">Aucune demande</p>
          <p className="text-xs text-gray-400">
            <Link href="/recruteur/recherche" className="text-gray-900 underline">Parcourez la CVthèque</Link> pour commencer.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/8 overflow-hidden">
          {filtered.map(d => {
            const s = STATUT_LABEL[d.statut]
            const Icon = s.icon
            return (
              <div key={d.id} className="flex items-center justify-between p-4 border-b border-black/5 last:border-b-0 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{d.candidat?.pseudo}</span>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>
                      <Icon size={10} /> {s.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{d.candidat?.fonction}</p>
                  <p className="text-xs text-gray-400">{d.candidat?.secteur} · Envoyée le {new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <Link href="/recruteur/messages" className="text-xs font-semibold text-gray-900 flex items-center gap-1 hover:underline">
                  <MessageCircle size={12} /> Voir les messages
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
