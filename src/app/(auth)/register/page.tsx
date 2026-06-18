'use client'

import Link         from 'next/link'
import Image        from 'next/image'
import { useState }  from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { COLORS } from '@/constants/colors'
import { Globe, Plus, Eye, EyeOff, ArrowRight } from 'lucide-react'
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
  const [showPwd,   setShowPwd]   = useState(false)

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
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-5 py-8 md:min-h-0 md:gap-0 md:justify-center md:p-6 md:bg-gradient-to-b md:from-white md:to-[#fafafa] overflow-y-auto bg-[#BFDBFE]">

        {/* Mobile logo — bleu, en haut à gauche */}
        <div className="absolute left-5 top-6 z-10 md:hidden">
          <Link href="/">
            <Image src="/logo-phyxel.svg" alt="Phyxel" width={110} height={30} className="object-contain" priority />
          </Link>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-md rounded-[32px] bg-white p-6 sm:p-8 md:rounded-3xl md:border md:border-gray-200"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(124,58,237,0.12)' }}
        >
          <h1 className="text-2xl font-semibold tracking-tight text-[#10111A]" style={{ fontFamily: 'var(--font-bricolage)' }}>Créer mon compte</h1>
          <p className="mt-1 text-sm text-[#65677A] font-sans">Votre première expérience physique commence ici.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Prénom</span>
              <input
                type="text" required value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Sophie"
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Nom</span>
              <input
                type="text" required value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Martin"
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[#10111A]">Email professionnel</span>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophie@lumio.fr"
              className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[#10111A]">Nom de votre marque</span>
            <input
              type="text" required value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Lumio Studio"
              className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[#10111A]">Site e-commerce</span>
            <input
              type="url" value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://lumiostudio.fr"
              className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-[#10111A]">Mot de passe</span>
            <div className="relative mt-1.5">
              <input
                type={showPwd ? 'text' : 'password'} required minLength={8} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
                className="w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#65677A]"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && (
            <p className={`mt-4 rounded-xl p-3 text-sm ${error.includes('confirmation') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="mt-6 w-full rounded-full bg-[#10111A] px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
            {!loading && <ArrowRight size={16} />}
          </button>

          <p className="mt-3 text-center text-xs text-[#9B9B9B]">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/cgu" className="underline hover:text-[#65677A]">CGU</Link>.
          </p>

          <p className="mt-4 text-center text-sm text-[#65677A]">
            Déjà inscrit ?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: '#0D58C6' }}>
              Se connecter
            </Link>
          </p>
        </form>

      </main>
    </div>
  )
}
