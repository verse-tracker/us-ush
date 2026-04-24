'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, MessageCircle, Inbox, Settings, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/recruteur', icon: Home, label: 'Tableau de bord' },
  { href: '/recruteur/recherche', icon: Search, label: 'CVthèque' },
  { href: '/recruteur/demandes', icon: Inbox, label: 'Mes demandes' },
  { href: '/recruteur/messages', icon: MessageCircle, label: 'Messages', badge: true },
]

export default function RecruteurLayout({ children }: { children: React.ReactNode }) {
  const [recruteur, setRecruteur] = useState<{ raison_sociale?: string; formule?: string } | null>(null)
  const [notifications, setNotifications] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push('/auth/connexion'); return }

      const { data } = await supabase
        .from('recruteurs')
        .select('raison_sociale, formule')
        .eq('user_id', authUser.id)
        .single()
      setRecruteur(data)

      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', authUser.id)
        .eq('lue', false)
      setNotifications(count || 0)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex">
      <aside className="w-64 bg-white border-r border-black/8 flex flex-col fixed h-full">
        <div className="p-6 border-b border-black/8">
          <Link href="/" className="font-black text-lg tracking-tight">USH-USH</Link>
          {recruteur?.raison_sociale && (
            <p className="text-xs text-gray-500 mt-1 truncate">{recruteur.raison_sociale}</p>
          )}
          {recruteur?.formule && (
            <span className="inline-block mt-2 text-xs font-semibold bg-gray-900 text-white px-2 py-0.5 rounded-full">
              {recruteur.formule}
            </span>
          )}
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === href ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <Icon size={16} />
              <span>{label}</span>
              {badge && notifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{notifications}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-black/8 flex flex-col gap-1">
          <Link href="/recruteur/parametres" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Settings size={16} /><span>Paramètres</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-left">
            <LogOut size={16} /><span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  )
}
