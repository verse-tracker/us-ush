'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { FileText, Eye, CheckCircle, XCircle, Send } from 'lucide-react'
import Button from '@/components/ui/Button'

type Proposition = {
  id: string
  statut: 'soumise' | 'vue' | 'selectionnee' | 'refusee'
  honoraires_pct: number | null
  delai_presentation: string | null
  garantie: string | null
  approche: string | null
  references_similaires: string | null
  created_at: string
  ao: { id: string; titre: string; fonction: string } | null
  cabinet: { id: string; raison_sociale: string; contact_nom: string; secteur: string | null } | null
}

const STATUT_CONFIG: Record<Proposition['statut'], { label: string; icon: React.ElementType; color: string }> = {
  soumise: { label: 'Reçue', icon: Send, color: 'text-gray-600 bg-gray-50' },
  vue: { label: 'Consultée', icon: Eye, color: 'text-blue-600 bg-blue-50' },
  selectionnee: { label: 'Sélectionnée', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  refusee: { label: 'Refusée', icon: XCircle, color: 'text-red-600 bg-red-50' },
}

export default function EntrepriseMessagesPage() {
  const [items, setItems] = useState<Proposition[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Proposition | null>(null)
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: entreprise } = await supabase.from('recruteurs').select('id').eq('user_id', user.id).single()
    if (!entreprise) { setLoading(false); return }

    const { data: mesAO } = await supabase.from('appels_offres').select('id').eq('recruteur_id', entreprise.id)
    const aoIds = (mesAO || []).map(a => a.id)
    if (aoIds.length === 0) { setItems([]); setLoading(false); return }

    const { data } = await supabase
      .from('ao_propositions')
      .select('id, statut, honoraires_pct, delai_presentation, garantie, approche, references_similaires, created_at, appels_offres(id, titre, fonction), recruteurs(id, raison_sociale, contact_nom, secteur)')
      .in('ao_id', aoIds)
      .order('created_at', { ascending: false })

    setItems((data || []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      statut: p.statut as Proposition['statut'],
      honoraires_pct: p.honoraires_pct as number | null,
      delai_presentation: p.delai_presentation as string | null,
      garantie: p.garantie as string | null,
      approche: p.approche as string | null,
      references_similaires: p.references_similaires as string | null,
      created_at: p.created_at as string,
      ao: p.appels_offres as Proposition['ao'],
      cabinet: p.recruteurs as Proposition['cabinet'],
    })))
    setLoading(false)
  }

  async function updateStatut(id: string, statut: Proposition['statut']) {
    await supabase.from('ao_propositions').update({ statut }).eq('id', id)
    await load()
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, statut } : null)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">Propositions reçues</h1>
        <p className="text-gray-500 mt-1">Étudiez les offres des cabinets et sélectionnez vos partenaires</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-black/8 p-12 text-center text-sm text-gray-400">
          Chargement…
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/8 p-12 text-center">
          <FileText size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold mb-1">Aucune proposition reçue</p>
          <p className="text-xs text-gray-400">
            <Link href="/entreprise/ao" className="text-gray-900 underline">Publiez un AO</Link> pour attirer des cabinets.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(p => {
            const s = STATUT_CONFIG[p.statut]
            const Icon = s.icon
            return (
              <button key={p.id} onClick={() => { setSelected(p); if (p.statut === 'soumise') updateStatut(p.id, 'vue') }}
                className="bg-white rounded-2xl border border-black/8 p-5 text-left hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>
                        <Icon size={10} /> {s.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-base">{p.cabinet?.raison_sociale}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Sur : <span className="font-medium text-gray-700">{p.ao?.titre}</span>
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      {p.honoraires_pct && <span>Honoraires : <strong className="text-gray-900">{p.honoraires_pct}%</strong></span>}
                      {p.delai_presentation && <span>Délai : <strong className="text-gray-900">{p.delai_presentation}</strong></span>}
                      {p.garantie && <span>Garantie : <strong className="text-gray-900">{p.garantie}</strong></span>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-1">{selected.cabinet?.raison_sociale}</h2>
            <p className="text-sm text-gray-500 mb-4">Proposition sur : {selected.ao?.titre}</p>

            <div className="flex flex-col gap-3 text-sm">
              {selected.cabinet?.contact_nom && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Contact</span>
                  <span className="font-medium">{selected.cabinet.contact_nom}</span>
                </div>
              )}
              {selected.honoraires_pct && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Honoraires</span>
                  <span className="font-medium">{selected.honoraires_pct}%</span>
                </div>
              )}
              {selected.delai_presentation && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Délai</span>
                  <span className="font-medium">{selected.delai_presentation}</span>
                </div>
              )}
              {selected.garantie && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Garantie</span>
                  <span className="font-medium">{selected.garantie}</span>
                </div>
              )}
              {selected.approche && (
                <div>
                  <p className="text-xs text-gray-400 mb-1 mt-2">Approche méthodologique</p>
                  <p className="text-sm bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{selected.approche}</p>
                </div>
              )}
              {selected.references_similaires && (
                <div>
                  <p className="text-xs text-gray-400 mb-1 mt-2">Références similaires</p>
                  <p className="text-sm bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{selected.references_similaires}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <Button variant="outline" onClick={() => setSelected(null)} className="flex-1">Fermer</Button>
              {selected.statut !== 'refusee' && (
                <Button variant="outline" onClick={() => updateStatut(selected.id, 'refusee')}>Refuser</Button>
              )}
              {selected.statut !== 'selectionnee' && (
                <Button onClick={() => updateStatut(selected.id, 'selectionnee')} className="flex-1">Sélectionner</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
