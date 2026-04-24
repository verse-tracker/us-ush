import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Eye, MessageCircle, Star, TrendingUp, Shield, Mic } from 'lucide-react'

export default async function CandidatDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const { data: candidat } = await supabase
    .from('candidats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { count: messagesCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact' })
    .eq('candidat_id', candidat?.id)
    .eq('statut', 'en_attente')

  const { count: notifCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('lue', false)

  const stats = [
    { label: 'Demandes reçues', value: messagesCount || 0, icon: MessageCircle, color: 'text-blue-600' },
    { label: 'Profil actif', value: candidat?.is_active ? 'Oui' : 'Non', icon: Shield, color: 'text-green-600' },
    { label: 'Notifications', value: notifCount || 0, icon: Bell, color: 'text-orange-500' },
    { label: 'Références', value: '0', icon: Star, color: 'text-yellow-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">
          Bonjour, <span className="font-mono">{candidat?.pseudo || 'candidat'}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Votre profil est {candidat?.is_active ? 'actif et visible' : 'en pause'}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-black/8 p-5">
            <Icon size={20} className={`${color} mb-3`} />
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/candidat/messages" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <MessageCircle size={20} className="text-blue-600 mb-3" />
          <h3 className="font-bold mb-1">Messages</h3>
          <p className="text-sm text-gray-500">{messagesCount || 0} demande{(messagesCount || 0) > 1 ? 's' : ''} en attente</p>
        </Link>
        <Link href="/candidat/simulateur" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <Mic size={20} className="text-purple-600 mb-3" />
          <h3 className="font-bold mb-1">Simulateur d'entretien</h3>
          <p className="text-sm text-gray-500">Préparez-vous avec l'IA</p>
        </Link>
        <Link href="/candidat/references" className="bg-white rounded-2xl border border-black/8 p-6 hover:shadow-md transition-shadow">
          <Star size={20} className="text-yellow-500 mb-3" />
          <h3 className="font-bold mb-1">Mes références</h3>
          <p className="text-sm text-gray-500">Renforcez votre crédibilité</p>
        </Link>
      </div>

      {/* Profil preview */}
      {candidat && (
        <div className="bg-white rounded-2xl border border-black/8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Aperçu de votre profil</h2>
            <Link href="/candidat/profil" className="text-sm text-gray-500 hover:text-gray-900">Modifier →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Pseudo', candidat.pseudo],
              ['Fonction', candidat.fonction],
              ['Secteur', candidat.secteur],
              ['Niveau', candidat.niveau],
              ['Disponibilité', candidat.disponibilite],
              ['Domaines bloqués', `${candidat.domaines_bloques?.length || 0} domaine(s)`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Bell({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}
