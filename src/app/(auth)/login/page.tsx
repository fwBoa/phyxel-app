'use client'

import Link        from 'next/link'
import Image       from 'next/image'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { COLORS } from '@/constants/colors'
import { Globe, Plus, Eye, EyeOff } from 'lucide-react'

// N'accepte que des chemins internes commençant par "/" — bloque les open-redirects.
function sanitizeRedirect(value: string | null): string {
  if (!value) return '/'
  if (!value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router         = useRouter()
  const searchParams   = useSearchParams()
  const redirectTo     = sanitizeRedirect(searchParams.get('redirect'))
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [showPwd,  setShowPwd]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) { setError(error.message); return }
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">

      {/* ── Left panel — photo + overlay ── */}
      <aside className="relative hidden md:flex flex-col justify-between overflow-hidden">

        {/* Background photo */}
        <Image
          src="/register-hero.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(20, 10, 40, 0) 0%, rgba(20, 10, 40, 0) 100%)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10">

          {/* Logo + Testimonial — groupe haut */}
          <div className="flex flex-col gap-28">
            <Link href="/">
              <Image src="/logo-phyxel.svg" alt="Phyxel" width={120} height={32} className="object-contain" />
            </Link>

            {/* Testimonial card */}
            <div
              className="max-w-xs rounded-2xl p-5 ml-[27%]"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.18)',
                animation: 'fadeSlideIn 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
              }}
            >
              <Image src="/vector.svg" alt="" width={20} height={20} className="mb-3" aria-hidden />
              <p className="text-xl font-semibold text-white leading-tight" style={{ fontFamily: 'var(--font-bricolage)' }}>Jules ASTON</p>
              <p className="mt-1 text-sm text-white/80 italic">
                « Le pop-up a changé notre façon de vendre »
              </p>
            </div>
          </div>

          {/* Badges bas de l'image */}
          <div className="flex flex-wrap gap-3">
            <div style={{ display: 'flex', padding: '17px', alignItems: 'center', gap: '8px' }}
              className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/40 text-white text-sm font-medium">
              <Plus size={20} style={{ color: COLORS.brand.electric }} className="shrink-0" />
              500 marques accompagnées
            </div>
            <div style={{ display: 'flex', padding: '17px', alignItems: 'center', gap: '8px' }}
              className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/40 text-white text-sm font-medium">
              <Globe size={20} style={{ color: COLORS.brand.electric }} className="shrink-0" />
              Un réseau qualifié de partenaires et de lieux
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right panel — form (desktop) + full mobile layout ── */}
      <main className="relative flex min-h-screen flex-col items-center justify-between p-6 md:min-h-0 md:justify-center md:bg-gradient-to-b md:from-white md:to-[#fafafa]">

        {/* Mobile background image + blur overlay */}
        <div className="absolute inset-0 md:hidden" aria-hidden>
          <Image src="/register-hero.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ backdropFilter: 'blur(2px)', background: 'rgba(10,5,30,0.45)' }} />
        </div>

        {/* Mobile logo — bleu */}
        <div className="relative z-10 w-full pt-4 md:hidden">
          <Link href="/">
            <Image src="/logo-white.png" alt="Phyxel" width={110} height={30} className="object-contain" />
          </Link>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 md:border md:bg-white"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(124,58,237,0.12)' }}
        >
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-bricolage)' }}>Bon retour 👋</h1>
          <p className="mt-1 text-sm text-gray-500 font-sans">Connectez-vous à votre espace marque.</p>

          <label className="mt-6 block text-sm">
            <span className="font-medium text-gray-900">Email professionnel</span>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@entreprise.fr"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-gray-900">Mot de passe</span>
            <div className="relative mt-1.5">
              <input
                type={showPwd ? 'text' : 'password'} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="mt-6 w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <Link href="/register" className="font-medium hover:underline" style={{ color: '#6F8BEF' }}>
              Créer mon compte
            </Link>
          </p>
        </form>

      </main>
    </div>
  )
}
