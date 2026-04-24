import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FilePlus, MessageCircle, Briefcase, TrendingUp } from 'lucide-react'

export default async function EntrepriseDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const { data: entreprise } = await supabase
    .from('recruteurs')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!entreprise) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-black/8 p-8 mt-12">
        <h1 className="text-xl font-black mb-2">Profil entreprise manquant</h1>
        <p className="text-sm text-gray-500 mb-6">Complétez votre inscription pour publier un appel d&apos;offres.</p>
        <Link href="/auth/inscription-recruteur" className="inline-block bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm">
          Finaliser mon inscription
        </Link>
      </div>
    )
  }

  const { count: aoCount } = await supabase
    .from('appels_offres')
    .select('*', { count: 'exact' })
    .eq('recruteur_id', entreprise.id)

  const { count: aoActifs } = await supabase
    .from('appels_offres')
    .select('*', { count: 'exact' })
    .eq('recruteur_id', entreprise.id)
    .eq('statut', 'actif')

  const { data: mesAO } = await supabase
    .from('appels_offres')
    .select('id')
    .eq('recruteur_id', entreprise.id)

  const aoIds = (mesAO || []).map(a => a.id)
  const { count: propositionsCount } = aoIds.length > 0
    ? await supabase.from('ao_propositions').select('*', { count: 'exact' }).in('ao_id', aoIds)
    : { count: 0 }

  const stats = [
    { label: 'AO publiés', value: aoCount || 0, icon: FilePlus, color: 'text-blue-600' },
    { label: 'AO actifs', value: aoActifs || 0, icon: Briefcase, color: 'text-green-600' },
    { label: 'Propositions reçues', value: propositionsCount || 0, icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Conversations', value: 0, icon: MessageCircle, color: 'text-orange-500' },
  ]

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Bonjour, {entreprise.contact_nom} 👋</h1>
          <p className="text-gray-500 mt-1">{entreprise.raison_sociale}</p>
        </div>
        <Link href="/entreprise/ao/nouveau" className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm">
          <FilePlus size={14} /> Nouveau AO
        </Link>
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
        <Link href="/entreprise/ao" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <FilePlus size={20} className="text-blue-600 mb-3" />
          <h3 className="font-bold mb-1">Mes appels d&apos;offres</h3>
          <p className="text-sm text-gray-500">Publiez et suivez vos AO</p>
        </Link>
        <Link href="/entreprise/messages" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <MessageCircle size={20} className="text-green-600 mb-3" />
          <h3 className="font-bold mb-1">Messages</h3>
          <p className="text-sm text-gray-500">Échanges avec les cabinets</p>
        </Link>
        <div className="bg-white rounded-2xl border border-black/8 p-6">
          <TrendingUp size={20} className="text-purple-600 mb-3" />
          <h3 className="font-bold mb-1">Propositions</h3>
          <p className="text-sm text-gray-500">{propositionsCount || 0} reçue{(propositionsCount || 0) > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/8 p-6">
        <h2 className="font-bold mb-4">Votre entreprise</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ['Raison sociale', entreprise.raison_sociale],
            ['SIRET', entreprise.siret],
            ['Secteur', entreprise.secteur || '—'],
            ['Taille', entreprise.taille || '—'],
            ['Contact', entreprise.contact_nom],
            ['Fonction', entreprise.contact_fonction],
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
