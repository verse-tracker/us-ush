'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { FilePlus, MapPin, Users, FileText, Plus } from 'lucide-react'
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
  statut: 'actif' | 'cloture' | 'pause'
  criteres_max_cabinets: number
  cabinets_selectionnes: number
  created_at: string
  propositions_count?: number
}

const SECTEURS = ['RH / Formation', 'Finance / Audit', 'IT / Tech / Data', 'Commercial / Marketing',
  'Industrie / Manufacturing', 'Santé / Médico-social', 'Juridique / Compliance', 'Logistique / Supply Chain']

const NIVEAUX = ['Junior', 'Confirmé', 'Senior', 'Manager / Responsable', 'Directeur', 'C-Level / DG']

export default function EntrepriseAOPage() {
  const [ao, setAo] = useState<AO[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [entrepriseId, setEntrepriseId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    titre: '',
    fonction: '',
    secteur: '',
    localisation: '',
    niveau: '',
    type_contrat: 'CDI',
    salaire_min: '',
    salaire_max: '',
    demarrage: '',
    missions_cles: '',
    criteres_max_cabinets: '5',
  })

  const supabase = createClient()

  useEffect(() => { init() }, [])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('recruteurs').select('id').eq('user_id', user.id).single()
    if (data) setEntrepriseId(data.id)
    await load(data?.id || null)
  }

  async function load(id: string | null) {
    if (!id) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('appels_offres')
      .select('*')
      .eq('recruteur_id', id)
      .order('created_at', { ascending: false })

    const aoList = (data as AO[]) || []
    if (aoList.length > 0) {
      const aoIds = aoList.map(a => a.id)
      const { data: props } = await supabase
        .from('ao_propositions')
        .select('ao_id')
        .in('ao_id', aoIds)
      const counts = new Map<string, number>()
      ;(props || []).forEach(p => counts.set(p.ao_id, (counts.get(p.ao_id) || 0) + 1))
      aoList.forEach(a => { a.propositions_count = counts.get(a.id) || 0 })
    }

    setAo(aoList)
    setLoading(false)
  }

  async function creerAO() {
    if (!entrepriseId) return
    setCreating(true)
    setError('')

    const { error: err } = await supabase.from('appels_offres').insert({
      recruteur_id: entrepriseId,
      titre: form.titre,
      fonction: form.fonction,
      secteur: form.secteur,
      localisation: form.localisation,
      niveau: form.niveau,
      type_contrat: form.type_contrat,
      salaire_min: form.salaire_min ? parseInt(form.salaire_min) : null,
      salaire_max: form.salaire_max ? parseInt(form.salaire_max) : null,
      demarrage: form.demarrage,
      missions_cles: form.missions_cles,
      criteres_max_cabinets: parseInt(form.criteres_max_cabinets) || 5,
      statut: 'actif',
    })

    if (err) {
      setError(err.message)
      setCreating(false)
      return
    }

    setShowModal(false)
    setForm({ titre: '', fonction: '', secteur: '', localisation: '', niveau: '',
      type_contrat: 'CDI', salaire_min: '', salaire_max: '', demarrage: '',
      missions_cles: '', criteres_max_cabinets: '5' })
    await load(entrepriseId)
    setCreating(false)
  }

  async function changerStatut(id: string, statut: AO['statut']) {
    await supabase.from('appels_offres').update({ statut }).eq('id', id)
    await load(entrepriseId)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Mes appels d&apos;offres</h1>
          <p className="text-gray-500 mt-1">Recevez des propositions de cabinets spécialisés</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={14} className="mr-1.5" /> Nouveau AO
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-black/8 p-12 text-center text-sm text-gray-400">
          Chargement…
        </div>
      ) : ao.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/8 p-12 text-center">
          <FilePlus size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold mb-1">Aucun appel d&apos;offres</p>
          <p className="text-xs text-gray-400 mb-4">Publiez votre premier AO pour attirer les meilleurs cabinets.</p>
          <Button onClick={() => setShowModal(true)}>Créer un AO</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ao.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-black/8 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      a.statut === 'actif' ? 'bg-green-50 text-green-700'
                      : a.statut === 'pause' ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>{a.statut}</span>
                  </div>
                  <h3 className="font-bold text-base">{a.titre}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {a.fonction} · {a.niveau} · {a.type_contrat}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {a.localisation}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {a.cabinets_selectionnes}/{a.criteres_max_cabinets} cabinets</span>
                    <span className="flex items-center gap-1"><FileText size={12} /> {a.propositions_count || 0} proposition{(a.propositions_count || 0) > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {a.statut === 'actif' ? (
                    <Button size="sm" variant="outline" onClick={() => changerStatut(a.id, 'pause')}>Mettre en pause</Button>
                  ) : a.statut === 'pause' ? (
                    <Button size="sm" variant="outline" onClick={() => changerStatut(a.id, 'actif')}>Réactiver</Button>
                  ) : null}
                  {a.statut !== 'cloture' && (
                    <Button size="sm" variant="outline" onClick={() => changerStatut(a.id, 'cloture')}>Clôturer</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-4">Nouvel appel d&apos;offres</h2>
            <div className="flex flex-col gap-3">
              <Input label="Titre de la mission" placeholder="Ex: Remplacement DRH confidentiel"
                value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} required />
              <Input label="Fonction" placeholder="Ex: Directeur des Ressources Humaines"
                value={form.fonction} onChange={e => setForm(f => ({ ...f, fonction: e.target.value }))} required />
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Secteur</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  value={form.secteur} onChange={e => setForm(f => ({ ...f, secteur: e.target.value }))}>
                  <option value="">Choisir...</option>
                  {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Input label="Localisation" placeholder="Ex: Île-de-France"
                value={form.localisation} onChange={e => setForm(f => ({ ...f, localisation: e.target.value }))} />
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Niveau</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  value={form.niveau} onChange={e => setForm(f => ({ ...f, niveau: e.target.value }))}>
                  <option value="">Choisir...</option>
                  {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Salaire min (k€)" type="number"
                  value={form.salaire_min} onChange={e => setForm(f => ({ ...f, salaire_min: e.target.value }))} />
                <Input label="Salaire max (k€)" type="number"
                  value={form.salaire_max} onChange={e => setForm(f => ({ ...f, salaire_max: e.target.value }))} />
              </div>
              <Input label="Démarrage" placeholder="Ex: Sous 1 mois"
                value={form.demarrage} onChange={e => setForm(f => ({ ...f, demarrage: e.target.value }))} />
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Missions clés</label>
                <textarea rows={3}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-900"
                  value={form.missions_cles}
                  onChange={e => setForm(f => ({ ...f, missions_cles: e.target.value }))} />
              </div>
              <Input label="Nombre max de cabinets sélectionnés" type="number" min="1" max="20"
                value={form.criteres_max_cabinets}
                onChange={e => setForm(f => ({ ...f, criteres_max_cabinets: e.target.value }))} />
            </div>

            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

            <div className="flex gap-2 mt-5">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Annuler</Button>
              <Button onClick={creerAO} loading={creating}
                disabled={!form.titre || !form.fonction || !form.secteur || !form.localisation || !form.niveau}
                className="flex-1">Publier</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
