'use client'

import Link         from 'next/link'
import { useState }  from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [brandName, setBrandName] = useState('')
  const [website,   setWebsite]   = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [loading,   setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`.trim(),
          brand_name: brandName,
          website,
        },
      },
    })

    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/')
    router.refresh()
  }

  return (
    <div
      className="grid min-h-screen md:grid-cols-2"
      style={{ background: 'linear-gradient(180deg, #f5f3ff, #fafafa)' }}
    >
      {/* Left panel — hidden on mobile */}
      <aside
        className="hidden flex-col justify-between p-10 md:flex"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
      >
        <PhyxelLogo dark />
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Rejoindre Phyxel
          </h2>
          <p className="mt-3 text-white/80">
            Votre premier espace physique à portée de clic.
          </p>
        </div>
        <p className="text-xs text-white/70">© 2025 Phyxel</p>
      </aside>

      {/* Right panel — form */}
      <main className="flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(124,58,237,0.12)' }}
        >
          {/* Mobile logo */}
          <div className="mb-6 md:hidden">
            <PhyxelLogo />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Créer mon compte</h1>
          <p className="mt-1 text-sm text-gray-500">Votre première expérience physique commence ici.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="font-medium text-gray-900">Prénom</span>
              <input
                type="text" required value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Marie"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-900">Nom</span>
              <input
                type="text" required value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-gray-900">Email professionnel</span>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@entreprise.fr"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-gray-900">Nom de votre marque</span>
            <input
              type="text" required value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ma Marque"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-gray-900">Site e-commerce</span>
            <input
              type="url" value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://mamarque.fr"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-gray-900">Mot de passe</span>
            <input
              type="password" required minLength={8} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="mt-6 w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer mon compte →'}
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/cgu" className="underline hover:text-gray-600">CGU</Link>.
          </p>

          <p className="mt-4 text-center text-sm text-gray-500">
            Déjà inscrit ?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Se connecter
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
        style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
      >
        P
      </span>
      <span className={dark ? 'text-white' : 'text-gray-900'}>Phyxel</span>
    </Link>
  )
}
