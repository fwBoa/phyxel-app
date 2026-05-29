'use client'

import Link         from 'next/link'
import { useState }  from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ROLES = [
  { value: 'brand', label: 'Marque e-commerce — Je cherche un espace' },
  { value: 'host',  label: 'Propriétaire — Je propose un espace' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [role,      setRole]      = useState<'brand' | 'host'>('brand')
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
      options: { data: { full_name: fullName, role } },
    })

    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[#0A0A0A]">Créer un compte</h1>
      <p className="mt-1 text-sm text-[#6B6B6B]">Rejoignez la communauté Phyxel.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#6B6B6B]">Nom complet</label>
          <input
            type="text" required value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Marie Dupont"
            className="rounded-xl border border-[#E5E5E5] px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
          />
        </div>

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
            type="password" required minLength={8} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            className="rounded-xl border border-[#E5E5E5] px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[#6B6B6B]">Je suis</label>
          <div className="grid grid-cols-1 gap-2">
            {ROLES.map(({ value, label }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
                  role === value
                    ? 'border-[#E91E8C] bg-[#FDE8F4] text-[#E91E8C]'
                    : 'border-[#E5E5E5] text-[#6B6B6B] hover:border-[#0A0A0A]'
                }`}
              >
                <input
                  type="radio" name="role" value={value}
                  checked={role === value}
                  onChange={() => setRole(value as 'brand' | 'host')}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-[#EF4444]/10 p-3 text-sm text-[#EF4444]">{error}</p>
        )}

        <button
          type="submit" disabled={loading}
          className="mt-2 rounded-full bg-[#E91E8C] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B0156A] disabled:opacity-50"
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B6B6B]">
        Déjà un compte ?{' '}
        <Link href="/login" className="font-semibold text-[#E91E8C] hover:text-[#B0156A]">
          Se connecter
        </Link>
      </p>
    </>
  )
}
