'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Briefcase, Clock, TrendingUp, Lock, Unlock } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type AO = {
  id: string
  titre: string
  fonction: string
  secteur: string
  localisation: string
  niveau: string
  type_contrat: string
  salaire_min: number | null
  salaire_max: number | null
  demarrage: string | null
  criteres_max_cabinets: number
  cabinets_selectionnes: number
  statut: string
  hasAcces?: boolean
}

const SECTEURS = ['RH / Formation', 'Finance / Audit', 'IT / Tech / Data', 'Commercial / Marketing',
  'Industrie / Manufacturing', 'Santé / Médico-social', 'Juridique / Compliance', 'Logistique / Supply Chain']

export default function CabinetAOPage() {
  const [ao, setAo] = useState<AO[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AO | null>(null)
  const [cabinetId, setCabinetId] = useState<string | null>(null)
  const [filters, setFilters] = useState({ keyword: '', secteur: '', localisation: '' })

  const [proposition, setProposition] = useState({
    honoraires_pct: '',
    delai_presentation: '',
    garantie: '',
    approche: '',
    references_similaires: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  const supabase = createClient()

  useEffect(() => { init() }, [])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('recruteurs').select('id').eq('user_id', user.id).single()
    if (data) setCabinetId(data.id)
    await loadAO(data?.id || null)
  }

  async function loadAO(currentCabinetId: string | null) {
    setLoading(true)
    let q = supabase
      .from('appels_offres')
      .select('id, titre, fonction, secteur, localisation, niveau, type_contrat, salaire_min, salaire_max, demarrage, criteres_max_cabinets, cabinets_selectionnes, statut')
      .eq('statut', 'actif')
      .order('created_at', { ascending: false })

    if (filters.secteur) q = q.eq('secteur', filters.secteur)
    if (filters.localisation) q = q.ilike('localisation', `%${filters.localisation}%`)
    if (filters.keyword) q = q.or(`titre.ilike.%${filters.keyword}%,fonction.ilike.%${filters.keyword}%`)

    const { data } = await q

    let withAcces: AO[] = (data as AO[]) || []
    if (currentCabinetId) {
      const { data: acces } = await supabase
        .from('ao_acces').select('ao_id').eq('recruteur_id', currentCabinetId)
      const accesSet = new Set((acces || []).map(a => a.ao_id))
      withAcces = withAcces.map(a => ({ ...a, hasAcces: accesSet.has(a.id) }))
    }

    setAo(withAcces)
    setLoading(false)
  }

  async function acheterAcces(aoId: string) {
    const res = await fetch('/api/paiement/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ produit: 'ao_acces', metadata: { ao_id: aoId } }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  async function soumettreProposition() {
    if (!selected || !cabinetId) return
    setSubmitting(true)
    setFeedback('')
    const { error } = await supabase.from('ao_propositions').upsert({
      ao_id: selected.id,
      recruteur_id: cabinetId,
      honoraires_pct: proposition.honoraires_pct ? parseFloat(proposition.honoraires_pct) : null,
      delai_presentation: proposition.delai_presentation,
      garantie: proposition.garantie,
      approche: proposition.approche,
      references_similaires: proposition.references_similaires,
      statut: 'soumise',
    }, { onConflict: 'ao_id,recruteur_id' })

    if (error) {
      setFeedback('Erreur à l\'envoi')
    } else {
      setFeedback('Proposition envoyée ✓')
      setTimeout(() => { setSelected(null); setFeedback('') }, 1500)
    }
    setSubmitting(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Appels d&apos;offres</h1>
        <p className="text-gray-500 mt-1">Missions confidentielles à pourvoir pour des entreprises vérifiées</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3">
          <div className="bg-white rounded-2xl border border-black/8 p-5 sticky top-8">
            <h2 className="font-bold text-sm mb-4">Filtres</h2>
            <div className="flex flex-col gap-4">
              <Input label="Mot-clé" value={filters.keyword} onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))} />
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Secteur</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  value={filters.secteur} onChange={e => setFilters(f => ({ ...f, secteur: e.target.value }))}>
                  <option value="">Tous</option>
                  {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Input label="Localisation" value={filters.localisation} onChange={e => setFilters(f => ({ ...f, localisation: e.target.value }))} />
              <Button onClick={() => loadAO(cabinetId)} loading={loading} className="w-full">Rechercher</Button>
            </div>
          </div>
        </aside>

        <div className="col-span-9">
          {loading ? (
            <div className="bg-white rounded-2xl border border-black/8 p-12 text-center text-sm text-gray-400">
              Chargement…
            </div>
          ) : ao.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black/8 p-12 text-center">
              <p className="text-sm font-semibold mb-1">Aucun AO disponible</p>
              <p className="text-xs text-gray-400">Revenez bientôt, de nouvelles missions sont publiées chaque semaine.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-400">{ao.length} appel{ao.length > 1 ? 's' : ''} d&apos;offres</p>
              {ao.map(a => (
                <div key={a.id} className="bg-white rounded-2xl border border-black/8 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base">{a.titre}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {a.fonction} · {a.niveau} · {a.type_contrat}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {a.localisation}</span>
                        <span className="flex items-center gap-1"><Briefcase size={12} /> {a.secteur}</span>
                        {a.demarrage && <span className="flex items-center gap-1"><Clock size={12} /> {a.demarrage}</span>}
                        {a.salaire_min && a.salaire_max && (
                          <span className="flex items-center gap-1"><TrendingUp size={12} /> {a.salaire_min}k – {a.salaire_max}k€</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-3">
                        {a.cabinets_selectionnes}/{a.criteres_max_cabinets} cabinets sélectionnés
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {a.hasAcces ? (
                        <Button size="sm" onClick={() => setSelected(a)}>
                          <Unlock size={12} className="mr-1.5" /> Proposer
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => acheterAcces(a.id)}>
                          <Lock size={12} className="mr-1.5" /> Débloquer 49€
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-1">Soumettre une proposition</h2>
            <p className="text-sm text-gray-500 mb-4">{selected.titre}</p>

            <div className="flex flex-col gap-3">
              <Input label="Honoraires (% du salaire annuel brut)" type="number" step="0.5"
                value={proposition.honoraires_pct}
                onChange={e => setProposition(p => ({ ...p, honoraires_pct: e.target.value }))}
                placeholder="Ex: 18" />
              <Input label="Délai de présentation" placeholder="Ex: 2 semaines"
                value={proposition.delai_presentation}
                onChange={e => setProposition(p => ({ ...p, delai_presentation: e.target.value }))} />
              <Input label="Garantie" placeholder="Ex: 6 mois remplacement"
                value={proposition.garantie}
                onChange={e => setProposition(p => ({ ...p, garantie: e.target.value }))} />
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Approche méthodologique</label>
                <textarea rows={3}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
                  value={proposition.approche}
                  onChange={e => setProposition(p => ({ ...p, approche: e.target.value }))}
                  placeholder="Votre méthode de sourcing…" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Références similaires</label>
                <textarea rows={2}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
                  value={proposition.references_similaires}
                  onChange={e => setProposition(p => ({ ...p, references_similaires: e.target.value }))}
                  placeholder="Missions comparables réalisées…" />
              </div>
            </div>

            {feedback && <p className="text-xs text-center mt-3 text-gray-500">{feedback}</p>}

            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelected(null)} className="flex-1">Annuler</Button>
              <Button onClick={soumettreProposition} loading={submitting} className="flex-1">Envoyer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
