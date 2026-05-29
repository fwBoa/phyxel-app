'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [brandName, setBrandName] = useState('')
  const [website, setWebsite] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err || !data.user) { setError(err?.message ?? 'Erreur inconnue'); setLoading(false); return }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('profiles') as any).insert({
      id:         data.user.id,
      full_name:  `${firstName} ${lastName}`.trim(),
      role:       'brand',
      brand_name: brandName,
      website,
    })

    router.push('/onboarding')
  }

  const inputClass = "w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] transition-colors"

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche — violet */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex-col justify-between p-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">P</div>
          <span className="text-white font-semibold">Phyxel</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-white mb-3">Rejoindre Phyxel</h2>
          <p className="text-white/70 text-sm">Votre premier espace physique à portée de clic.</p>
        </div>
        <p className="text-white/40 text-xs">© 2025 Phyxel</p>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8">
            <h1 className="text-xl font-bold text-[#0A0A0A] mb-1">Créer mon compte</h1>
            <p className="text-sm text-[#6B7280] mb-6">Votre première expérience physique commence ici.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#0A0A0A] mb-1">Prénom</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Sophie" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0A0A0A] mb-1">Nom</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Martin" className={inputClass} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0A0A0A] mb-1">Email professionnel</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sophie@lumio.fr" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0A0A0A] mb-1">Nom de votre marque</label>
                <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Lumio Studio" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0A0A0A] mb-1">Site e-commerce</label>
                <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://lumiostudio.fr" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0A0A0A] mb-1">Mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} className={inputClass} required />
              </div>

              {error && <p className="text-red-500 text-xs bg-red-50 rounded-lg p-3">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0A0A0A] text-white font-medium rounded-full hover:bg-[#333] transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? 'Création...' : <>Créer mon compte <ArrowRight size={16} /></>}
              </button>
            </form>

            <p className="text-center text-xs text-[#9CA3AF] mt-4">
              En créant un compte, vous acceptez nos{' '}
              <Link href="#" className="text-[#6B7280] underline">CGU</Link>.
            </p>
            <p className="text-center text-xs text-[#6B7280] mt-3">
              Déjà inscrit ?{' '}
              <Link href="/login" className="text-[#7C3AED] font-medium hover:underline">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
