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
    router.push('/')
    router.refresh()
  }

  return (
    <div
      className="grid min-h-screen md:grid-cols-2"
      style={{ background: 'linear-gradient(180deg, #fdf2f8, #fafafa)' }}
    >
      {/* Left panel — hidden on mobile */}
      <aside
        className="hidden flex-col justify-between p-10 md:flex"
        style={{ background: 'linear-gradient(135deg, #E91E8C, #C026D3)' }}
      >
        <PhyxelLogo dark />
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Du digital au réel,<br />en quelques clics.
          </h2>
          <p className="mt-3 text-white/80">
            Retrouvez vos espaces sauvegardés, vos demandes en cours et vos recommandations personnalisées.
          </p>
        </div>
        <p className="text-xs text-white/70">© 2025 Phyxel</p>
      </aside>

      {/* Right panel — form */}
      <main className="flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(233,30,140,0.12)' }}
        >
          {/* Mobile logo */}
          <div className="mb-6 md:hidden">
            <PhyxelLogo />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Bon retour 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Connectez-vous à votre espace marque.</p>

          <label className="mt-6 block text-sm">
            <span className="font-medium text-gray-900">Email professionnel</span>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@entreprise.fr"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-gray-900">Mot de passe</span>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
            />
          </label>
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="mt-6 w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <Link href="/register" className="font-medium text-[#E91E8C] hover:underline">
              Créer mon compte
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}

function PhyxelLogo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span
        className="grid h-7 w-7 place-items-center rounded-lg text-sm font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #E91E8C, #C026D3)' }}
      >
        P
      </span>
      <span className={dark ? 'text-white' : 'text-gray-900'}>Phyxel</span>
    </Link>
  )
}
