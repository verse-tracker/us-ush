'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const ETAPES = ['Compte', 'Profil', 'Compétences', 'Conditions', 'Confidentialité', 'Finalisation']

const SECTEURS = ['RH / Formation', 'Finance / Audit', 'IT / Tech / Data', 'Commercial / Marketing', 
  'Industrie / Manufacturing', 'Santé / Médico-social', 'Juridique / Compliance', 'Logistique / Supply Chain']

const NIVEAUX = ['Junior', 'Confirmé', 'Senior', 'Manager / Responsable', 'Directeur', 'C-Level / DG']

const CONTRATS = ['CDI', 'CDD', 'Freelance / Mission', 'Alternance', 'Stage', 'Portage salarial']

const LANGUES = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Arabe', 'Mandarin', 'Portugais', 'Néerlandais']

export default function InscriptionPage() {
  const [etape, setEtape] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    // Compte
    email: '', password: '', pseudo: '',
    // Profil
    fonction: '', secteur: '', niveau: '', annees_experience: '',
    management: false, nb_managees: '',
    // Compétences
    specialites: '', logiciels: '',
    // Conditions
    localisation: '', mobilite: [] as string[], teletravail: 'Hybride',
    disponibilite: 'Immédiat', types_contrat: [] as string[], langues: ['Français'] as string[],
    salaire_confidentiel: true,
    // Confidentialité
    domaines_bloques: '',
    // CGU
    cgu_accepted: false, confidentialite_accepted: false,
  })

  function update(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function toggleArray(field: 'types_contrat' | 'langues' | 'mobilite', value: string) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v: string) => v !== value)
        : [...prev[field], value]
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    try {
      // 1. Créer le compte
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: 'candidat', pseudo: form.pseudo } }
      })
      if (authError) throw authError

      // 2. Créer le profil candidat
      const { error: profileError } = await supabase.from('candidats').insert({
        user_id: authData.user!.id,
        pseudo: form.pseudo,
        fonction: form.fonction,
        secteur: form.secteur,
        niveau: form.niveau,
        annees_experience: parseInt(form.annees_experience) || 0,
        management: form.management,
        nb_managees: form.nb_managees ? parseInt(form.nb_managees) : null,
        specialites: form.specialites.split(',').map(s => s.trim()).filter(Boolean),
        logiciels: form.logiciels.split(',').map(s => s.trim()).filter(Boolean),
        localisation: form.localisation,
        mobilite: form.mobilite,
        teletravail: form.teletravail,
        disponibilite: form.disponibilite,
        types_contrat: form.types_contrat,
        langues: form.langues,
        salaire_confidentiel: form.salaire_confidentiel,
        domaines_bloques: form.domaines_bloques.split('\n').map(d => d.trim()).filter(Boolean),
      })
      if (profileError) throw profileError

      router.push('/confirmation?type=candidat')
    } catch (err: unknown) {
      setError((err as Error).message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const progress = Math.round((etape / (ETAPES.length - 1)) * 100)

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Link href="/" className="block text-center font-black text-xl tracking-tight mb-6">USH-USH</Link>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Étape {etape + 1} / {ETAPES.length} — {ETAPES[etape]}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div className="h-1.5 bg-gray-900 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/8 p-8">
          
          {/* ÉTAPE 0 — Compte */}
          {etape === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Créez votre compte</h2>
              <Input label="Email" type="email" placeholder="vous@email.com" value={form.email} onChange={e => update('email', e.target.value)} required />
              <Input label="Mot de passe" type="password" placeholder="8 caractères minimum" value={form.password} onChange={e => update('password', e.target.value)} required />
              <Input label="Votre pseudo" placeholder="Ex: drh_paris_senior" value={form.pseudo} onChange={e => update('pseudo', e.target.value)} hint="Visible par les recruteurs à la place de votre identité" required />
            </div>
          )}

          {/* ÉTAPE 1 — Profil */}
          {etape === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Votre profil</h2>
              <Input label="Fonction / Intitulé de poste" placeholder="Ex: Directrice des Ressources Humaines" value={form.fonction} onChange={e => update('fonction', e.target.value)} required />
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Secteur</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg" value={form.secteur} onChange={e => update('secteur', e.target.value)}>
                  <option value="">Choisir...</option>
                  {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Niveau</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg" value={form.niveau} onChange={e => update('niveau', e.target.value)}>
                  <option value="">Choisir...</option>
                  {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <Input label="Années d'expérience" type="number" min="0" max="50" placeholder="Ex: 8" value={form.annees_experience} onChange={e => update('annees_experience', e.target.value)} />
              <div className="flex items-center gap-3">
                <input type="checkbox" id="mgmt" checked={form.management} onChange={e => update('management', e.target.checked)} className="w-4 h-4 accent-gray-900" />
                <label htmlFor="mgmt" className="text-sm font-medium cursor-pointer">Expérience en management d'équipe</label>
              </div>
              {form.management && (
                <Input label="Nombre de personnes managées" type="number" placeholder="Ex: 8" value={form.nb_managees} onChange={e => update('nb_managees', e.target.value)} />
              )}
            </div>
          )}

          {/* ÉTAPE 2 — Compétences */}
          {etape === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Compétences</h2>
              <Input label="Spécialités (séparées par des virgules)" placeholder="Ex: Transformation RH, CODIR, M&A, Relations sociales" value={form.specialites} onChange={e => update('specialites', e.target.value)} />
              <Input label="Logiciels & outils maîtrisés" placeholder="Ex: Sage X3, Mercateam, Beetween, SAP" value={form.logiciels} onChange={e => update('logiciels', e.target.value)} />
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Langues de travail</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUES.map(l => (
                    <button key={l} type="button" onClick={() => toggleArray('langues', l)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${form.langues.includes(l) ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — Conditions */}
          {etape === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Conditions souhaitées</h2>
              <Input label="Localisation" placeholder="Ex: Île-de-France" value={form.localisation} onChange={e => update('localisation', e.target.value)} />
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Type de contrat</label>
                <div className="flex flex-wrap gap-2">
                  {CONTRATS.map(c => (
                    <button key={c} type="button" onClick={() => toggleArray('types_contrat', c)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${form.types_contrat.includes(c) ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Disponibilité</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg" value={form.disponibilite} onChange={e => update('disponibilite', e.target.value)}>
                  <option>Immédiat</option>
                  <option>Préavis 1 mois</option>
                  <option>Préavis 3 mois</option>
                  <option>À partir d'une date</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="sal" checked={form.salaire_confidentiel} onChange={e => update('salaire_confidentiel', e.target.checked)} className="w-4 h-4 accent-gray-900" />
                <label htmlFor="sal" className="text-sm font-medium cursor-pointer">Salaire confidentiel</label>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 — Confidentialité */}
          {etape === 4 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Confidentialité</h2>
              <p className="text-sm text-gray-500">Entrez les domaines email des entreprises que vous souhaitez bloquer. Un recruteur avec ces emails ne pourra pas voir votre profil.</p>
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Domaines à bloquer (un par ligne)</label>
                <textarea
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg min-h-[100px] outline-none focus:border-gray-900"
                  placeholder="monentreprise.fr&#10;filiale.com&#10;ancienemployeur.fr"
                  value={form.domaines_bloques}
                  onChange={e => update('domaines_bloques', e.target.value)}
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
                💡 <strong>Conseil :</strong> Ajoutez votre employeur actuel, ses filiales et vos anciens employeurs pour être totalement invisible pour eux.
              </div>
            </div>
          )}

          {/* ÉTAPE 5 — Finalisation */}
          {etape === 5 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Presque terminé !</h2>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.cgu_accepted} onChange={e => update('cgu_accepted', e.target.checked)} className="w-4 h-4 mt-0.5 accent-gray-900" />
                <span className="text-sm text-gray-600">J'accepte les <Link href="/legal" className="font-semibold text-gray-900 hover:underline">CGU</Link> et la <Link href="/legal" className="font-semibold text-gray-900 hover:underline">Politique de confidentialité</Link> de USH-USH.</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.confidentialite_accepted} onChange={e => update('confidentialite_accepted', e.target.checked)} className="w-4 h-4 mt-0.5 accent-gray-900" />
                <span className="text-sm text-gray-600">Je comprends que mon identité reste confidentielle et ne sera jamais divulguée sans mon accord explicite.</span>
              </label>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {etape > 0 && (
              <Button variant="outline" onClick={() => setEtape(e => e - 1)} className="flex-1">
                ← Retour
              </Button>
            )}
            {etape < ETAPES.length - 1 ? (
              <Button onClick={() => setEtape(e => e + 1)} className="flex-1">
                Continuer →
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                loading={loading}
                disabled={!form.cgu_accepted || !form.confidentialite_accepted}
                className="flex-1"
              >
                Créer mon profil confidentiel →
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Déjà un compte ?{' '}
          <Link href="/auth/connexion" className="text-gray-900 font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
