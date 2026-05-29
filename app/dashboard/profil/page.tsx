'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/useProfile'

export default function ProfilPage() {
  const { profile, loading } = useProfile()
  const [fullName, setFullName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setBrandName(profile.brand_name ?? '')
      setBio(profile.bio ?? '')
      setWebsite(profile.website ?? '')
    }
  }, [profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('profiles') as any).update({ full_name: fullName, brand_name: brandName, bio, website }).eq('id', profile.id)
    setSaving(false); setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) return <div className="animate-pulse h-80 bg-white rounded-2xl" />

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#0A0A0A]">Mon profil</h2>
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A0A0A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">Nom de marque</label>
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A0A0A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">Site web</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://mamarque.com"
              className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A0A0A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              placeholder="Décrivez votre marque..."
              className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0A0A0A] resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#E91E8C] text-white font-semibold rounded-xl hover:bg-[#B0156A] transition-colors disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            {success && <p className="text-green-600 text-sm font-medium">Profil mis à jour ✓</p>}
          </div>
        </form>
      </div>
    </div>
  )
}
