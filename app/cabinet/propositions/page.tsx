'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Eye, CheckCircle, XCircle, Send } from 'lucide-react'

type Proposition = {
  id: string
  statut: 'soumise' | 'vue' | 'selectionnee' | 'refusee'
  honoraires_pct: number | null
  delai_presentation: string | null
  garantie: string | null
  created_at: string
  ao: { titre: string; fonction: string; localisation: string } | null
}

const STATUT_CONFIG: Record<Proposition['statut'], { label: string; icon: React.ElementType; color: string }> = {
  soumise: { label: 'Envoyée', icon: Send, color: 'text-gray-600 bg-gray-50' },
  vue: { label: 'Consultée', icon: Eye, color: 'text-blue-600 bg-blue-50' },
  selectionnee: { label: 'Sélectionnée', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  refusee: { label: 'Refusée', icon: XCircle, color: 'text-red-600 bg-red-50' },
}

export default function CabinetPropositionsPage() {
  const [props, setProps] = useState<Proposition[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: cabinet } = await supabase.from('recruteurs').select('id').eq('user_id', user.id).single()
    if (!cabinet) { setLoading(false); return }

    const { data } = await supabase
      .from('ao_propositions')
      .select('id, statut, honoraires_pct, delai_presentation, garantie, created_at, appels_offres(titre, fonction, localisation)')
      .eq('recruteur_id', cabinet.id)
      .order('created_at', { ascending: false })

    setProps((data || []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      statut: p.statut as Proposition['statut'],
      honoraires_pct: p.honoraires_pct as number | null,
      delai_presentation: p.delai_presentation as string | null,
      garantie: p.garantie as string | null,
      created_at: p.created_at as string,
      ao: p.appels_offres as Proposition['ao'],
    })))
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">Mes propositions</h1>
        <p className="text-gray-500 mt-1">Suivi de vos candidatures sur les appels d&apos;offres</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-black/8 p-12 text-center text-sm text-gray-400">
          Chargement…
        </div>
      ) : props.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/8 p-12 text-center">
          <FileText size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold mb-1">Aucune proposition envoyée</p>
          <p className="text-xs text-gray-400">Consultez les appels d&apos;offres actifs pour commencer.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {props.map(p => {
            const s = STATUT_CONFIG[p.statut]
            const Icon = s.icon
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-black/8 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>
                        <Icon size={10} /> {s.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-base">{p.ao?.titre}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{p.ao?.fonction} · {p.ao?.localisation}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      {p.honoraires_pct && <span>Honoraires : <strong className="text-gray-900">{p.honoraires_pct}%</strong></span>}
                      {p.delai_presentation && <span>Délai : <strong className="text-gray-900">{p.delai_presentation}</strong></span>}
                      {p.garantie && <span>Garantie : <strong className="text-gray-900">{p.garantie}</strong></span>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(p.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
