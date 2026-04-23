'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Filter, MapPin, Briefcase, Clock, Send, Shield } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type Candidat = {
  id: string
  pseudo: string
  fonction: string
  secteur: string
  niveau: string
  annees_experience: number
  localisation: string
  disponibilite: string
  management: boolean
  specialites: string[]
  langues: string[]
  teletravail: string
}

const SECTEURS = ['RH / Formation', 'Finance / Audit', 'IT / Tech / Data', 'Commercial / Marketing',
  'Industrie / Manufacturing', 'Santé / Médico-social', 'Juridique / Compliance', 'Logistique / Supply Chain']

const NIVEAUX = ['Junior', 'Confirmé', 'Senior', 'Manager / Responsable', 'Directeur', 'C-Level / DG']

const DISPOS = ['Immédiat', 'Préavis 1 mois', 'Préavis 3 mois', 'À partir d\'une date']

export default function RecherchePage() {
  const [candidats, setCandidats] = useState<Candidat[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Candidat | null>(null)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState('')

  const [filters, setFilters] = useState({
    keyword: '',
    secteur: '',
    niveau: '',
    disponibilite: '',
    localisation: '',
    management: false,
  })

  const supabase = createClient()

  useEffect(() => { loadCandidats() }, [])

  async function loadCandidats() {
    setLoading(true)
    let query = supabase
      .from('candidats')
      .select('id, pseudo, fonction, secteur, niveau, annees_experience, localisation, disponibilite, management, specialites, langues, teletravail')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(100)

    if (filters.secteur) query = query.eq('secteur', filters.secteur)
    if (filters.niveau) query = query.eq('niveau', filters.niveau)
    if (filters.disponibilite) query = query.eq('disponibilite', filters.disponibilite)
    if (filters.localisation) query = query.ilike('localisation', `%${filters.localisation}%`)
    if (filters.management) query = query.eq('management', true)
    if (filters.keyword) query = query.or(`fonction.ilike.%${filters.keyword}%,pseudo.ilike.%${filters.keyword}%`)

    const { data } = await query
    setCandidats((data as Candidat[]) || [])
    setLoading(false)
  }

  async function contactCandidat() {
    if (!selected || !message.trim()) return
    setSending(true)
    setFeedback('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setFeedback('Session expirée'); setSending(false); return }

    const { data: recruteur } = await supabase
      .from('recruteurs')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!recruteur) {
      setFeedback('Profil recruteur introuvable')
      setSending(false)
      return
    }

    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .upsert({
        candidat_id: selected.id,
        recruteur_id: recruteur.id,
        statut: 'en_attente',
      }, { onConflict: 'candidat_id,recruteur_id' })
      .select()
      .single()

    if (convErr || !conv) {
      setFeedback('Impossible de créer la conversation')
      setSending(false)
      return
    }

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conv.id, content: message }),
    })

    if (res.ok) {
      setFeedback('Demande envoyée ✓')
      setMessage('')
      setTimeout(() => { setSelected(null); setFeedback('') }, 1500)
    } else {
      setFeedback('Erreur à l\'envoi')
    }
    setSending(false)
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">CVthèque confidentielle</h1>
          <p className="text-gray-500 mt-1">Profils anonymisés de talents en poste</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-black/8 rounded-lg px-3 py-1.5">
          <Shield size={12} /> Identités protégées
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filtres */}
        <aside className="col-span-3">
          <div className="bg-white rounded-2xl border border-black/8 p-5 sticky top-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={14} />
              <h2 className="font-bold text-sm">Filtres</h2>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Mot-clé"
                placeholder="Ex: DRH, Data…"
                value={filters.keyword}
                onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
              />
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Secteur</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  value={filters.secteur}
                  onChange={e => setFilters(f => ({ ...f, secteur: e.target.value }))}>
                  <option value="">Tous</option>
                  {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Niveau</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  value={filters.niveau}
                  onChange={e => setFilters(f => ({ ...f, niveau: e.target.value }))}>
                  <option value="">Tous</option>
                  {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Disponibilité</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  value={filters.disponibilite}
                  onChange={e => setFilters(f => ({ ...f, disponibilite: e.target.value }))}>
                  <option value="">Toutes</option>
                  {DISPOS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <Input
                label="Localisation"
                placeholder="Ex: Île-de-France"
                value={filters.localisation}
                onChange={e => setFilters(f => ({ ...f, localisation: e.target.value }))}
              />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={filters.management}
                  onChange={e => setFilters(f => ({ ...f, management: e.target.checked }))}
                  className="w-4 h-4 accent-gray-900" />
                <span>Expérience en management</span>
              </label>

              <Button onClick={loadCandidats} loading={loading} className="w-full mt-2">
                <Search size={14} className="mr-2" /> Rechercher
              </Button>
            </div>
          </div>
        </aside>

        {/* Résultats */}
        <div className="col-span-9">
          {loading ? (
            <div className="bg-white rounded-2xl border border-black/8 p-12 text-center text-sm text-gray-400">
              Chargement…
            </div>
          ) : candidats.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black/8 p-12 text-center">
              <p className="text-sm font-semibold mb-1">Aucun profil trouvé</p>
              <p className="text-xs text-gray-400">Ajustez vos filtres pour voir plus de candidats.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-400">{candidats.length} profil{candidats.length > 1 ? 's' : ''} trouvé{candidats.length > 1 ? 's' : ''}</p>
              {candidats.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-black/8 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{c.pseudo}</span>
                        {c.management && (
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Manager</span>
                        )}
                      </div>
                      <h3 className="font-bold text-base">{c.fonction}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {c.secteur} · {c.niveau} · {c.annees_experience} ans d&apos;expérience
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                        {c.localisation && <span className="flex items-center gap-1"><MapPin size={12} /> {c.localisation}</span>}
                        <span className="flex items-center gap-1"><Clock size={12} /> {c.disponibilite}</span>
                        <span className="flex items-center gap-1"><Briefcase size={12} /> {c.teletravail}</span>
                      </div>
                      {c.specialites?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {c.specialites.slice(0, 5).map(s => (
                            <span key={s} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-lg">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button onClick={() => setSelected(c)} size="sm">
                      <Send size={12} className="mr-1.5" /> Contacter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de contact */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-1">Contacter <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{selected.pseudo}</span></h2>
            <p className="text-sm text-gray-500 mb-4">{selected.fonction} · {selected.secteur}</p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Présentez votre offre de manière concise et respectueuse…"
              rows={5}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-900 resize-none"
            />
            {feedback && <p className="text-xs text-center mt-3 text-gray-500">{feedback}</p>}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelected(null)} className="flex-1">Annuler</Button>
              <Button onClick={contactCandidat} loading={sending} disabled={!message.trim()} className="flex-1">
                Envoyer la demande
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
