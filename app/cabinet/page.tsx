import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, FileText, MessageCircle, TrendingUp } from 'lucide-react'

export default async function CabinetDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const { data: cabinet } = await supabase
    .from('recruteurs')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!cabinet) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-black/8 p-8 mt-12">
        <h1 className="text-xl font-black mb-2">Profil cabinet manquant</h1>
        <p className="text-sm text-gray-500 mb-6">Complétez votre inscription pour accéder aux appels d&apos;offres.</p>
        <Link href="/auth/inscription-recruteur" className="inline-block bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm">
          Finaliser mon inscription
        </Link>
      </div>
    )
  }

  const { count: aoActifsCount } = await supabase
    .from('appels_offres')
    .select('*', { count: 'exact' })
    .eq('statut', 'actif')

  const { count: propositionsCount } = await supabase
    .from('ao_propositions')
    .select('*', { count: 'exact' })
    .eq('recruteur_id', cabinet.id)

  const { count: selectionneesCount } = await supabase
    .from('ao_propositions')
    .select('*', { count: 'exact' })
    .eq('recruteur_id', cabinet.id)
    .eq('statut', 'selectionnee')

  const { count: accesCount } = await supabase
    .from('ao_acces')
    .select('*', { count: 'exact' })
    .eq('recruteur_id', cabinet.id)

  const stats = [
    { label: 'AO disponibles', value: aoActifsCount || 0, icon: Briefcase, color: 'text-blue-600' },
    { label: 'AO achetés', value: accesCount || 0, icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Propositions', value: propositionsCount || 0, icon: FileText, color: 'text-gray-700' },
    { label: 'Sélectionnées', value: selectionneesCount || 0, icon: MessageCircle, color: 'text-green-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Bonjour, {cabinet.contact_nom} 👋</h1>
        <p className="text-gray-500 mt-1">Tableau de bord · {cabinet.raison_sociale}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-black/8 p-5">
            <Icon size={20} className={`${color} mb-3`} />
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/cabinet/ao" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <Briefcase size={20} className="text-blue-600 mb-3" />
          <h3 className="font-bold mb-1">Appels d&apos;offres</h3>
          <p className="text-sm text-gray-500">{aoActifsCount || 0} AO actifs à étudier</p>
        </Link>
        <Link href="/cabinet/propositions" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <FileText size={20} className="text-gray-700 mb-3" />
          <h3 className="font-bold mb-1">Mes propositions</h3>
          <p className="text-sm text-gray-500">{propositionsCount || 0} envoyée{(propositionsCount || 0) > 1 ? 's' : ''}</p>
        </Link>
        <Link href="/cabinet/messages" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <MessageCircle size={20} className="text-green-600 mb-3" />
          <h3 className="font-bold mb-1">Messages</h3>
          <p className="text-sm text-gray-500">Échanges avec les entreprises</p>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-black/8 p-6">
        <h2 className="font-bold mb-4">Votre cabinet</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ['Raison sociale', cabinet.raison_sociale],
            ['SIRET', cabinet.siret],
            ['Secteur', cabinet.secteur || '—'],
            ['Taille', cabinet.taille || '—'],
            ['Formule', cabinet.formule],
            ['Statut', cabinet.siret_verifie ? 'Vérifié' : 'En vérification'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
