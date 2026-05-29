'use client'

import { useEffect, useState } from 'react'
import { useAuth }    from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import type { ProfileUpdate } from '@/types/users'

export default function ProfilPage() {
  const { user }      = useAuth()
  const { profile, loading } = useProfile(user?.id)

  const [fullName,   setFullName]   = useState('')
  const [brandName,  setBrandName]  = useState('')
  const [website,    setWebsite]    = useState('')
  const [bio,        setBio]        = useState('')
  const [saving,     setSaving]     = useState(false)
  const [message,    setMessage]    = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name  ?? '')
      setBrandName(profile.brand_name ?? '')
      setWebsite(profile.website    ?? '')
      setBio(profile.bio        ?? '')
    }
  }, [profile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setMessage(null)

    const update: ProfileUpdate = { full_name: fullName, brand_name: brandName, website, bio }
    const res = await fetch(`/api/profiles/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })

    setSaving(false)
    setMessage(res.ok
      ? { type: 'success', text: 'Profil mis à jour.' }
      : { type: 'error',   text: 'Erreur lors de la mise à jour.' }
    )
  }

  if (loading) return <div className="animate-pulse h-64 rounded-2xl bg-[#E5E5E5]" />

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-[#0A0A0A]">Mon profil</h1>

      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDE8F4] text-lg font-bold text-[#E91E8C]">
            {fullName.charAt(0).toUpperCase() || '?'}
          </span>
          <div>
            <p className="font-semibold text-[#0A0A0A]">{fullName || 'Votre nom'}</p>
            <p className="text-xs text-[#9B9B9B]">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: 'Nom complet',  value: fullName,   set: setFullName,  type: 'text' },
            { label: 'Nom de marque', value: brandName, set: setBrandName, type: 'text' },
            { label: 'Site web',      value: website,   set: setWebsite,   type: 'url'  },
          ].map(({ label, value, set, type }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#6B6B6B]">{label}</label>
              <input
                type={type} value={value}
                onChange={(e) => set(e.target.value)}
                className="rounded-xl border border-[#E5E5E5] px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
              />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#6B6B6B]">Bio</label>
            <textarea
              value={bio} rows={4}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-xl border border-[#E5E5E5] px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20 resize-none"
            />
          </div>

          {message && (
            <p className={`rounded-xl p-3 text-sm ${
              message.type === 'success' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
            }`}>
              {message.text}
            </p>
          )}

          <button
            type="submit" disabled={saving}
            className="self-start rounded-full bg-[#E91E8C] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B0156A] disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </>
  )
}
