'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false) }
    else router.push('/dashboard')
  }

  const inputClass = "w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] transition-colors"

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex-col justify-between p-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">P</div>
          <span className="text-white font-semibold">Phyxel</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-white mb-3">Bon retour !</h2>
          <p className="text-white/70 text-sm">Retrouvez vos espaces et réservations.</p>
        </div>
        <p className="text-white/40 text-xs">© 2025 Phyxel</p>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8">
            <h1 className="text-xl font-bold text-[#0A0A0A] mb-1">Connexion</h1>
            <p className="text-sm text-[#6B7280] mb-6">Bienvenue de retour sur Phyxel.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#0A0A0A] mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0A0A0A] mb-1">Mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required />
              </div>

              {error && <p className="text-red-500 text-xs bg-red-50 rounded-lg p-3">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0A0A0A] text-white font-medium rounded-full hover:bg-[#333] transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? 'Connexion...' : <>Se connecter <ArrowRight size={16} /></>}
              </button>
            </form>

            <p className="text-center text-xs text-[#6B7280] mt-5">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[#7C3AED] font-medium hover:underline">S&apos;inscrire</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
