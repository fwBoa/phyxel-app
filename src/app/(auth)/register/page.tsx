'use client'

import Link         from 'next/link'
import Image        from 'next/image'
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name:  `${firstName} ${lastName}`.trim(),
          brand_name: brandName,
          website,
        },
      },
    })

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    setLoading(false)

    // Si la confirmation par email est activée, Supabase ne crée pas de session tout de suite.
    // On informe l'utilisateur au lieu de rediriger vers '/'.
    if (!data.session) {
      setError('Un email de confirmation vous a été envoyé. Veuillez cliquer sur le lien pour activer votre compte.')
      return
    }

    router.push('/')
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

          {/* Logo + Testimonial card — groupe haut */}
          <div className="flex flex-col gap-28">
            <Link href="/" className="mt-2 ml-1">
              <Image src="/logo-white.png" alt="Phyxel" width={120} height={32} className="object-contain" />
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

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white"
              style={{ background: 'rgba(255, 255, 255, 0)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span className="text-[#6F8BEF] font-semibold">+</span> 500 marques accompagnées
            </div>
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white"
              style={{ background: 'rgba(255, 255, 255, 0)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <svg className="h-4 w-4 shrink-0 text-[#6F8BEF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Un réseau qualifié de partenaires et de lieux
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right panel — form ── */}
      <main
        className="flex items-center justify-center p-6"
        style={{ background: 'linear-gradient(180deg, #ffffffff, #fafafa)' }}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(124,58,237,0.12)' }}
        >
          {/* Mobile logo */}
          <div className="mb-6 md:hidden">
            <PhyxelLogo />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-bricolage)' }}>Créer mon compte</h1>
          <p className="mt-1 text-sm text-gray-500 font-sans">Votre première expérience physique commence ici.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="font-medium text-gray-900">Prénom</span>
              <input
                type="text" required value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Sophie"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-900">Nom</span>
              <input
                type="text" required value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Martin"
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
              placeholder="Lumio Studio"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-gray-900">Site e-commerce</span>
            <input
              type="url" value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://lumiostudio.fr"
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
            <p className={`mt-4 rounded-xl p-3 text-sm ${error.includes('confirmation') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="mt-6 w-full rounded-full bg-gray-900 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
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
