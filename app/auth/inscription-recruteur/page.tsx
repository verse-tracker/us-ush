'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const ETAPES = ['Structure', 'Compte', 'Contact', 'Formule', 'Validation']

const TYPES_STRUCTURE = [
  { value: 'entreprise', label: 'Entreprise', desc: 'Je recrute pour ma propre entreprise' },
  { value: 'cabinet', label: 'Cabinet de recrutement', desc: 'J\'aide mes clients à recruter' },
  { value: 'interim', label: 'Agence d\'intérim', desc: 'Je place des profils en mission' },
  { value: 'independant', label: 'Recruteur indépendant', desc: 'Je travaille en freelance' },
]

const SECTEURS = ['RH / Formation', 'Finance / Audit', 'IT / Tech / Data', 'Commercial / Marketing',
  'Industrie / Manufacturing', 'Santé / Médico-social', 'Juridique / Compliance', 'Logistique / Supply Chain', 'Multi-sectoriel']

const TAILLES = ['1-10', '11-50', '51-250', '251-1000', '1000+']

const FORMULES = [
  { value: 'decouverte', label: 'Découverte', price: '0€', desc: '5 prises de contact / mois' },
  { value: 'pro', label: 'Pro', price: '199€/mois', desc: 'Prises de contact illimitées + AO' },
  { value: 'entreprise', label: 'Entreprise', price: 'Sur devis', desc: 'Multi-utilisateurs + SLA' },
]

export default function InscriptionRecruteurPage() {
  const [etape, setEtape] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    type_structure: '',
    raison_sociale: '',
    siret: '',
    secteur: '',
    taille: '',
    site_web: '',
    linkedin: '',

    email: '',
    password: '',

    contact_nom: '',
    contact_fonction: '',
    email_pro: '',
    telephone: '',

    formule: 'decouverte',

    cgu_accepted: false,
  })

  function update<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const role = form.type_structure === 'entreprise' ? 'entreprise'
        : form.type_structure === 'cabinet' ? 'cabinet'
        : 'recruteur'

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role } },
      })
      if (authError) throw authError

      const { error: profileError } = await supabase.from('recruteurs').insert({
        user_id: authData.user!.id,
        type_structure: form.type_structure,
        raison_sociale: form.raison_sociale,
        siret: form.siret,
        email_pro: form.email_pro,
        telephone: form.telephone,
        site_web: form.site_web,
        linkedin: form.linkedin,
        secteur: form.secteur,
        taille: form.taille,
        contact_nom: form.contact_nom,
        contact_fonction: form.contact_fonction,
        formule: form.formule,
      })
      if (profileError) throw profileError

      const redirects: Record<string, string> = {
        entreprise: '/entreprise',
        cabinet: '/cabinet',
        recruteur: '/recruteur',
      }
      router.push(redirects[role])
    } catch (err: unknown) {
      setError((err as Error).message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const canNext = () => {
    if (etape === 0) return form.type_structure && form.raison_sociale && form.siret
    if (etape === 1) return form.email && form.password.length >= 8
    if (etape === 2) return form.contact_nom && form.contact_fonction && form.email_pro
    if (etape === 3) return form.formule
    return form.cgu_accepted
  }

  const progress = Math.round((etape / (ETAPES.length - 1)) * 100)

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Link href="/" className="block text-center font-black text-xl tracking-tight mb-6">USH-USH</Link>

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

          {etape === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Votre structure</h2>

              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Type de structure</label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES_STRUCTURE.map(t => (
                    <button key={t.value} type="button" onClick={() => update('type_structure', t.value)}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        form.type_structure === t.value ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                      }`}>
                      <p className="text-sm font-semibold">{t.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Input label="Raison sociale" placeholder="Ex: Acme Recrutement SAS"
                value={form.raison_sociale} onChange={e => update('raison_sociale', e.target.value)} required />

              <Input label="SIRET" placeholder="14 chiffres"
                value={form.siret}
                onChange={e => update('siret', e.target.value.replace(/\D/g, '').slice(0, 14))}
                hint="Votre SIRET sera vérifié avant activation du compte" required />

              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Secteur principal</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  value={form.secteur} onChange={e => update('secteur', e.target.value)}>
                  <option value="">Choisir...</option>
                  {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-1">Taille de la structure</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  value={form.taille} onChange={e => update('taille', e.target.value)}>
                  <option value="">Choisir...</option>
                  {TAILLES.map(t => <option key={t} value={t}>{t} personnes</option>)}
                </select>
              </div>

              <Input label="Site web (facultatif)" placeholder="https://…" value={form.site_web} onChange={e => update('site_web', e.target.value)} />
              <Input label="LinkedIn (facultatif)" placeholder="https://linkedin.com/company/…" value={form.linkedin} onChange={e => update('linkedin', e.target.value)} />
            </div>
          )}

          {etape === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Votre compte</h2>
              <Input label="Email de connexion" type="email" placeholder="vous@email.com"
                value={form.email} onChange={e => update('email', e.target.value)} required />
              <Input label="Mot de passe" type="password" placeholder="8 caractères minimum"
                value={form.password} onChange={e => update('password', e.target.value)}
                hint="Utilisez un mot de passe unique" required />
            </div>
          )}

          {etape === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Contact professionnel</h2>
              <Input label="Nom et prénom" placeholder="Marie Dupont"
                value={form.contact_nom} onChange={e => update('contact_nom', e.target.value)} required />
              <Input label="Fonction" placeholder="Ex: Responsable recrutement"
                value={form.contact_fonction} onChange={e => update('contact_fonction', e.target.value)} required />
              <Input label="Email professionnel" type="email" placeholder="marie@entreprise.fr"
                value={form.email_pro} onChange={e => update('email_pro', e.target.value)}
                hint="Utilisé pour valider votre domaine et respecter les blocages des candidats" required />
              <Input label="Téléphone" placeholder="+33 …" value={form.telephone} onChange={e => update('telephone', e.target.value)} />
            </div>
          )}

          {etape === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Choisissez votre formule</h2>
              <div className="flex flex-col gap-2">
                {FORMULES.map(f => (
                  <button key={f.value} type="button" onClick={() => update('formule', f.value)}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      form.formule === f.value ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold">{f.label}</p>
                      <p className="text-sm font-bold">{f.price}</p>
                    </div>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">Vous pourrez changer de formule à tout moment.</p>
            </div>
          )}

          {etape === 4 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black">Validation</h2>
              <div className="bg-gray-50 rounded-xl p-4 text-sm flex flex-col gap-2">
                <p><span className="text-gray-400">Structure :</span> <strong>{form.raison_sociale}</strong></p>
                <p><span className="text-gray-400">SIRET :</span> <strong>{form.siret}</strong></p>
                <p><span className="text-gray-400">Contact :</span> <strong>{form.contact_nom}</strong> ({form.contact_fonction})</p>
                <p><span className="text-gray-400">Formule :</span> <strong>{FORMULES.find(f => f.value === form.formule)?.label}</strong></p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.cgu_accepted}
                  onChange={e => update('cgu_accepted', e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-gray-900" />
                <span className="text-sm text-gray-600">
                  J&apos;accepte les <Link href="/legal" className="font-semibold text-gray-900 hover:underline">CGU</Link> et
                  m&apos;engage à respecter la <Link href="/legal" className="font-semibold text-gray-900 hover:underline">charte de confidentialité</Link> USH-USH.
                </span>
              </label>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {etape > 0 && (
              <Button variant="outline" onClick={() => setEtape(e => e - 1)} className="flex-1">← Retour</Button>
            )}
            {etape < ETAPES.length - 1 ? (
              <Button onClick={() => setEtape(e => e + 1)} disabled={!canNext()} className="flex-1">
                Continuer →
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={loading} disabled={!canNext()} className="flex-1">
                Créer mon compte →
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
