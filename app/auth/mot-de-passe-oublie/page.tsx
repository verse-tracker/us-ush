'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-black text-xl tracking-tight mb-8">USH-USH</Link>
        <div className="bg-white rounded-2xl border border-black/8 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 className="font-bold text-lg mb-2">Email envoyé !</h2>
              <p className="text-sm text-gray-500 mb-6">Vérifiez votre boîte mail.</p>
              <Link href="/auth/connexion" className="text-sm font-semibold text-gray-900 hover:underline">Retour connexion</Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-black mb-1">Mot de passe oublié</h1>
              <p className="text-sm text-gray-500 mb-6">Un lien de réinitialisation vous sera envoyé.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input label="Email" type="email" placeholder="vous@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                <Button type="submit" loading={loading} size="lg" className="w-full">Envoyer le lien</Button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-4">
                <Link href="/auth/connexion" className="hover:underline">Retour à la connexion</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
