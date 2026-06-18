'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TYPE_OPTIONS = [
  { value: 'showroom', label: 'Showroom' },
  { value: 'popup', label: 'Pop-up' },
  { value: 'corner', label: 'Corner' },
  { value: 'gallery', label: 'Galerie' },
  { value: 'boutique', label: 'Boutique' },
]

type SpaceData = {
  id?: string
  title: string
  type: string
  city: string
  district: string
  address: string
  area_sqm: string
  price_day: string
  description: string
  is_available: boolean
  photos: string
  host_email: string
}

interface SpaceFormProps {
  initialData?: SpaceData
  mode: 'create' | 'edit'
  spaceId?: string
}

export default function SpaceForm({ initialData, mode, spaceId }: SpaceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Host (création à la volée depuis le champ email)
  const [hostStatus, setHostStatus] = useState<'unknown' | 'creating' | 'created' | 'exists' | 'error'>('unknown')
  const [hostMessage, setHostMessage] = useState('')

  async function ensureHost() {
    const email = form.host_email.trim().toLowerCase()
    if (!email) {
      setHostStatus('error')
      setHostMessage("Saisis d'abord l'email du host.")
      return
    }
    setHostStatus('creating')
    setHostMessage('')
    try {
      const res = await fetch('/api/admin/hosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setHostStatus('error')
        setHostMessage(data.error || 'Échec de la création du host.')
        return
      }
      setHostStatus(data.alreadyExists ? 'exists' : 'created')
      setHostMessage(
        data.alreadyExists
          ? `Host déjà enregistré (${email}).`
          : `Host "${email}" créé. Tu peux finaliser l'espace.`,
      )
    } catch {
      setHostStatus('error')
      setHostMessage('Erreur réseau. Réessaie.')
    }
  }

  const [form, setForm] = useState<SpaceData>(
    initialData ?? {
      title: '',
      type: 'showroom',
      city: '',
      district: '',
      address: '',
      area_sqm: '',
      price_day: '',
      description: '',
      is_available: true,
      photos: '',
      host_email: '',
    }
  )

  function handleChange(field: keyof SpaceData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Quand l'email du host change, on réinitialise le statut
    if (field === 'host_email') {
      setHostStatus('unknown')
      setHostMessage('')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const payload = {
      title: form.title,
      type: form.type,
      city: form.city,
      district: form.district || null,
      address: form.address || null,
      area_sqm: form.area_sqm ? Number(form.area_sqm) : null,
      price_day: form.price_day ? Number(form.price_day) : null,
      description: form.description || null,
      is_available: form.is_available,
      hostEmail: form.host_email || null,
      photos: form.photos
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0),
    }

    const url = mode === 'create' ? '/api/admin/spaces' : `/api/admin/spaces/${spaceId}`
    const method = mode === 'create' ? 'POST' : 'PUT'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }

      setSuccess(mode === 'create' ? 'Espace créé avec succès.' : 'Espace mis à jour.')
      setTimeout(() => router.push('/admin/espaces'), 800)
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/espaces" className="text-sm text-text-secondary hover:text-foreground">
          ← Retour à la liste
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-foreground">
        {mode === 'create' ? 'Nouvel espace' : 'Modifier l&apos;espace'}
      </h1>

      <div className="rounded-2xl border border-border-custom bg-white p-6 space-y-5">
        {/* Titre */}
        <div className="flex flex-col gap-1">
          <label htmlFor="sf-title" className="text-xs font-medium text-text-secondary">Titre * </label>
          <input
            id="sf-title"
            type="text"
            required
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Showroom design au Marais"
            className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Host email */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="sf-host-email" className="text-xs font-medium text-text-secondary">Email du host * </label>
            <button
              type="button"
              onClick={ensureHost}
              disabled={hostStatus === 'creating' || !form.host_email}
              className="rounded-full border border-primary px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {hostStatus === 'creating'
                ? 'Vérification…'
                : hostStatus === 'created' || hostStatus === 'exists'
                  ? '✓ Host OK'
                  : '+ Créer ce host'}
            </button>
          </div>
          <input
            id="sf-host-email"
            type="email"
            required
            value={form.host_email}
            onChange={(e) => handleChange('host_email', e.target.value)}
            placeholder="sophie@phyxel.demo"
            className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {hostMessage ? (
            <p
              className={`text-xs ${
                hostStatus === 'error' ? 'text-match-low' : 'text-match-high'
              }`}
            >
              {hostMessage}
            </p>
          ) : (
            <p className="text-xs text-text-muted">
              Si le host n&apos;existe pas encore, clique sur « + Créer ce host » pour l&apos;ajouter.
            </p>
          )}
        </div>

        {/* Type + Ville */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="sf-type" className="text-xs font-medium text-text-secondary">Type * </label>
            <select
              id="sf-type"
              required
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sf-city" className="text-xs font-medium text-text-secondary">Ville * </label>
            <input
              id="sf-city"
              type="text"
              required
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Paris"
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Quartier + Adresse */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="sf-district" className="text-xs font-medium text-text-secondary">Quartier</label>
            <input
              id="sf-district"
              type="text"
              value={form.district}
              onChange={(e) => handleChange('district', e.target.value)}
              placeholder="Le Marais"
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sf-address" className="text-xs font-medium text-text-secondary">Adresse</label>
            <input
              id="sf-address"
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="12 rue des Rosiers"
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Superficie + Prix */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="sf-area" className="text-xs font-medium text-text-secondary">Superficie (m²)</label>
            <input
              id="sf-area"
              type="number"
              min={0}
              value={form.area_sqm}
              onChange={(e) => handleChange('area_sqm', e.target.value)}
              placeholder="80"
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sf-price" className="text-xs font-medium text-text-secondary">Prix / jour (€) * </label>
            <input
              id="sf-price"
              type="number"
              required
              min={0}
              value={form.price_day}
              onChange={(e) => handleChange('price_day', e.target.value)}
              placeholder="250"
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="sf-description" className="text-xs font-medium text-text-secondary">Description</label>
          <textarea
            id="sf-description"
            rows={4}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Décrivez l&apos;espace, son ambiance, ses atouts..."
            className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Disponible */}
        <div className="flex items-center gap-3">
          <input
            id="is_available"
            type="checkbox"
            checked={form.is_available}
            onChange={(e) => handleChange('is_available', e.target.checked)}
            className="h-4 w-4 rounded border-border-custom text-primary focus:ring-[#7C3AED]"
          />
          <label htmlFor="is_available" className="text-sm text-foreground">
            Espace disponible à la réservation
          </label>
        </div>

        {/* Photos */}
        <div className="flex flex-col gap-1">
          <label htmlFor="sf-photos" className="text-xs font-medium text-text-secondary">Photos (une URL par ligne)</label>
          <textarea
            id="sf-photos"
            rows={4}
            value={form.photos}
            onChange={(e) => handleChange('photos', e.target.value)}
            placeholder="https://images.unsplash.com/photo-xxx&#10;https://images.unsplash.com/photo-yyy"
            className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none font-mono"
          />
          <p className="text-xs text-text-muted">La première URL sera utilisée comme photo principale.</p>
        </div>

        {/* Messages */}
        {error && (
          <p role="alert" className="rounded-xl bg-match-low/10 p-3 text-sm text-match-low">{error}</p>
        )}
        {success && (
          <p role="status" className="rounded-xl bg-match-high/10 p-3 text-sm text-match-high">{success}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50 transition-colors"
          >
            {loading ? 'Enregistrement...' : mode === 'create' ? 'Créer l&apos;espace' : 'Enregistrer les modifications'}
          </button>
          <Link
            href="/admin/espaces"
            className="text-sm text-text-secondary hover:text-foreground"
          >
            Annuler
          </Link>
        </div>
      </div>
    </form>
  )
}
