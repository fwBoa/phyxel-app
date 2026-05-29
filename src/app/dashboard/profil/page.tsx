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
      <h1 className="mb-6 text-2xl font-bold text-foreground">Mon profil</h1>

      <div className="rounded-2xl border border-border-custom bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-muted text-lg font-bold text-primary">
            {fullName.charAt(0).toUpperCase() || '?'}
          </span>
          <div>
            <p className="font-semibold text-foreground">{fullName || 'Votre nom'}</p>
            <p className="text-xs text-text-muted">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: 'Nom complet',  value: fullName,   set: setFullName,  type: 'text' },
            { label: 'Nom de marque', value: brandName, set: setBrandName, type: 'text' },
            { label: 'Site web',      value: website,   set: setWebsite,   type: 'url'  },
          ].map(({ label, value, set, type }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-secondary">{label}</label>
              <input
                type={type} value={value}
                onChange={(e) => set(e.target.value)}
                className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Bio</label>
            <textarea
              value={bio} rows={4}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {message && (
            <p className={`rounded-xl p-3 text-sm ${
              message.type === 'success' ? 'bg-match-high/10 text-match-high' : 'bg-match-low/10 text-match-low'
            }`}>
              {message.text}
            </p>
          )}

          <button
            type="submit" disabled={saving}
            className="self-start rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </>
  )
}
