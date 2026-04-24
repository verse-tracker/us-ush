'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ConnexionPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    // Rediriger selon le rôle
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', data.user.id)
      .single()

    const redirects: Record<string, string> = {
      candidat: '/candidat',
      recruteur: '/recruteur',
      cabinet: '/cabinet',
      entreprise: '/entreprise',
    }

    router.push(redirects[profile?.role || 'candidat'])
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-black text-xl tracking-tight mb-8">USH-USH</Link>
        
        <div className="bg-white rounded-2xl border border-black/8 p-8">
          <h1 className="text-xl font-black mb-1">Connexion</h1>
          <p className="text-sm text-gray-500 mb-6">Bienvenue sur USH-USH</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="vous@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Link href="/auth/mot-de-passe-oublie" className="text-xs text-gray-400 hover:text-gray-700 text-right -mt-2">
              Mot de passe oublié ?
            </Link>
            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Se connecter
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Pas encore de compte ?{' '}
            <Link href="/auth/inscription" className="text-gray-900 font-semibold hover:underline">
              Créer un profil
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
