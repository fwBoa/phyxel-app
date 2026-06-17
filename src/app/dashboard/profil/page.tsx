'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Plus, Loader2 } from 'lucide-react'
import { useAuth }    from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'
import type { ProfileUpdate } from '@/types/users'
import { getPreferences } from './actions'
import type { BrandPreferenceRow } from '@/types/database'

export default function ProfilPage() {
  const { user }             = useAuth()
  const { profile, loading } = useProfile(user?.id)

  const [fullName,  setFullName]  = useState('')
  const [brandName, setBrandName] = useState('')
  const [website,   setWebsite]   = useState('')
  const [saving,    setSaving]    = useState(false)
  const [message,   setMessage]   = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [avatarUrl,      setAvatarUrl]      = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [prefs,        setPrefs]        = useState<BrandPreferenceRow | null>(null)
  const [prefsLoading, setPrefsLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name  ?? '')
      setBrandName(profile.brand_name ?? '')
      setWebsite(profile.website    ?? '')
      setAvatarUrl(profile.avatar_url ?? null)
    }
  }, [profile])

  useEffect(() => {
    getPreferences().then((data) => { setPrefs(data); setPrefsLoading(false) })
  }, [])

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setAvatarUploading(true)
    setMessage(null)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'upload de l\'avatar.' })
      setAvatarUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    // Ajoute un timestamp pour forcer le rechargement du cache navigateur
    const urlWithBust = `${publicUrl}?t=${Date.now()}`

    const res = await fetch(`/api/profiles/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatar_url: publicUrl }),
    })

    setAvatarUploading(false)
    if (res.ok) {
      setAvatarUrl(urlWithBust)
      setMessage({ type: 'success', text: 'Avatar mis à jour.' })
    } else {
      setMessage({ type: 'error', text: 'Avatar uploadé mais erreur lors de la sauvegarde.' })
    }

    // Reset input pour permettre de re-sélectionner le même fichier
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setMessage(null)
    const update: ProfileUpdate = { full_name: fullName, brand_name: brandName, website }
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

  const initial = fullName.charAt(0).toUpperCase() || brandName.charAt(0).toUpperCase() || '?'

  if (loading) return <div className="animate-pulse h-64 rounded-2xl bg-gray-100" />

  return (
    <>
      <h1
        className="mb-6 text-2xl font-bold text-foreground sm:text-3xl"
        style={{ fontFamily: 'var(--font-bricolage)' }}
      >
        Mon profil
      </h1>

      {/* ── Bloc identité ── */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:p-8">
          <div className="flex flex-col gap-8 lg:flex-row">

            {/* Colonne gauche — avatar + infos + bouton */}
            <div className="flex flex-col items-start gap-4 lg:w-64 lg:shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full overflow-hidden bg-[#EEF2FF] text-2xl font-bold text-primary focus:outline-none"
                    aria-label="Changer l'avatar"
                  >
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt="Avatar" fill className="object-cover" unoptimized />
                    ) : (
                      initial
                    )}
                    {avatarUploading && (
                      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                        <Loader2 size={20} className="animate-spin text-white" />
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm"
                    style={{ background: '#0D58C6' }}
                    aria-label="Changer l'avatar"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-foreground">{brandName || fullName || 'Votre marque'}</p>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                </div>
              </div>

              {message && (
                <p className={`rounded-xl px-3 py-2 text-xs ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'
                }`}>
                  {message.text}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: '#0D58C6' }}
              >
                <Pencil size={13} />
                {saving ? 'Enregistrement...' : 'Modifier mes informations'}
              </button>
            </div>

            {/* Colonne droite — champs */}
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Nom complet">
                <input
                  type="text" value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </Field>

              <Field label="Nom de marque">
                <input
                  type="text" value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Votre marque"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </Field>

              <Field label="Adresse e-mail">
                <input
                  type="email" value={user?.email ?? ''} readOnly
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-text-secondary outline-none cursor-not-allowed"
                />
              </Field>

              <Field label="Site web" className="sm:col-span-2">
                <input
                  type="url" value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://votresite.fr"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </Field>
            </div>
          </div>
        </div>
      </form>

      {/* ── Bloc préférences ── */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            Mes préférences
          </h2>
          <Link
            href="/dashboard/profil/preferences"
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0" style={{ background: '#0D58C6' }}
          >
            <Pencil size={13} />
            Modifier mes préférences
          </Link>
        </div>

        {prefsLoading ? (
          <div className="animate-pulse h-48 rounded-xl bg-gray-100" />
        ) : prefs ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <PrefBox label="Secteur"           value={prefs.sector} />
            <PrefBox label="Produits"          value={parseJson(prefs.product_types)} />
            <PrefBox label="Ville principale"  value={prefs.main_city} />
            <PrefBox label="Taille"            value={prefs.company_size} />
            <PrefBox label="Budget approx."    value={prefs.approx_budget} />
            <PrefBox label="Objectifs"         value={parseJson(prefs.physical_objectives)} />
            <PrefBox label="Ville recherchée"  value={prefs.target_city} />
            <PrefBox label="Durée"             value={prefs.desired_duration} />
            <PrefBox label="Types de lieu"     value={parseJson(prefs.space_types)} />
            <PrefBox label="Surface"           value={prefs.desired_area} />
            <PrefBox label="Services"          value={parseJson(prefs.needed_services)} />
            <PrefBox label="Budget max"        value={prefs.max_budget} />
            <PrefBox label="Quartiers"         value={parseJson(prefs.preferred_districts)} />
            <PrefBox label="Ambiance"          value={parseJson(prefs.desired_ambiance)} />
            <PrefBox label="Dates idéales"     value={prefs.ideal_dates} />
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-text-secondary">Vous n&apos;avez pas encore renseigné vos préférences.</p>
            <Link
              href="/onboarding"
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Compléter l&apos;onboarding →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      {children}
    </div>
  )
}

function PrefBox({ label, value }: { label: string; value: string | string[] | null | undefined }) {
  const display = value
    ? (Array.isArray(value) ? value.filter(Boolean).join(', ') : String(value))
    : null

  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <p className="text-xs" style={{ color: '#65677A' }}>{label}</p>
      <p className="mt-1 text-sm font-semibold" style={{ color: '#10111A' }}>
        {display || <span className="font-normal" style={{ color: '#65677A' }}>—</span>}
      </p>
    </div>
  )
}

function parseJson(value: unknown): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value.filter(Boolean).join(', ')
  try {
    const parsed = JSON.parse(String(value))
    if (Array.isArray(parsed)) return parsed.filter(Boolean).join(', ')
    return String(parsed)
  } catch {
    return String(value)
  }
}
