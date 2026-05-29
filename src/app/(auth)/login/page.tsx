'use client'

import Link        from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[#0A0A0A]">Connexion</h1>
      <p className="mt-1 text-sm text-[#6B6B6B]">Bon retour sur Phyxel.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#6B6B6B]">Email</label>
          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            className="rounded-xl border border-[#E5E5E5] px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#6B6B6B]">Mot de passe</label>
          <input
            type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-xl border border-[#E5E5E5] px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-[#EF4444]/10 p-3 text-sm text-[#EF4444]">{error}</p>
        )}

        <button
          type="submit" disabled={loading}
          className="mt-2 rounded-full bg-[#E91E8C] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B0156A] disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B6B6B]">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-semibold text-[#E91E8C] hover:text-[#B0156A]">
          Créer un compte
        </Link>
      </p>
    </>
  )
}
