import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Search, MessageCircle, Inbox, CheckCircle, Clock, Users } from 'lucide-react'

export default async function RecruteurDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const { data: recruteur } = await supabase
    .from('recruteurs')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!recruteur) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-black/8 p-8 mt-12">
        <h1 className="text-xl font-black mb-2">Profil recruteur manquant</h1>
        <p className="text-sm text-gray-500 mb-6">
          Vous devez compléter votre inscription recruteur avant d&apos;accéder à la CVthèque.
        </p>
        <Link href="/auth/inscription-recruteur" className="inline-block bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm">
          Finaliser mon inscription
        </Link>
      </div>
    )
  }

  const { count: demandesCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact' })
    .eq('recruteur_id', recruteur.id)

  const { count: accepteesCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact' })
    .eq('recruteur_id', recruteur.id)
    .eq('statut', 'acceptee')

  const { count: attenteCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact' })
    .eq('recruteur_id', recruteur.id)
    .eq('statut', 'en_attente')

  const { count: candidatsCount } = await supabase
    .from('candidats')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  const stats = [
    { label: 'Candidats disponibles', value: candidatsCount || 0, icon: Users, color: 'text-blue-600' },
    { label: 'Demandes envoyées', value: demandesCount || 0, icon: Inbox, color: 'text-gray-700' },
    { label: 'En attente', value: attenteCount || 0, icon: Clock, color: 'text-orange-500' },
    { label: 'Acceptées', value: accepteesCount || 0, icon: CheckCircle, color: 'text-green-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">
          Bonjour, {recruteur.contact_nom} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {recruteur.siret_verifie ? 'SIRET vérifié · Compte actif' : 'Vérification SIRET en cours…'}
        </p>
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
        <Link href="/recruteur/recherche" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <Search size={20} className="text-blue-600 mb-3" />
          <h3 className="font-bold mb-1">CVthèque</h3>
          <p className="text-sm text-gray-500">Parcourez les profils confidentiels</p>
        </Link>
        <Link href="/recruteur/demandes" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <Inbox size={20} className="text-gray-700 mb-3" />
          <h3 className="font-bold mb-1">Mes demandes</h3>
          <p className="text-sm text-gray-500">{attenteCount || 0} en attente de réponse</p>
        </Link>
        <Link href="/recruteur/messages" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <MessageCircle size={20} className="text-green-600 mb-3" />
          <h3 className="font-bold mb-1">Messages</h3>
          <p className="text-sm text-gray-500">{accepteesCount || 0} conversation{(accepteesCount || 0) > 1 ? 's' : ''} active{(accepteesCount || 0) > 1 ? 's' : ''}</p>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-black/8 p-6">
        <h2 className="font-bold mb-4">Votre structure</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ['Raison sociale', recruteur.raison_sociale],
            ['SIRET', recruteur.siret],
            ['Type', recruteur.type_structure],
            ['Secteur', recruteur.secteur || '—'],
            ['Taille', recruteur.taille || '—'],
            ['Formule', recruteur.formule],
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
