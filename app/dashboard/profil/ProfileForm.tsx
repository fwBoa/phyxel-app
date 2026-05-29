'use client'

import { useState } from 'react'

interface Profile {
  full_name: string | null
  brand_name: string | null
  website: string | null
  bio: string | null
  role: 'brand' | 'host'
}

interface ProfileFormProps {
  profile: Profile
  updateProfile: (formData: FormData) => Promise<{ error?: string; success?: string }>
}

export default function ProfileForm({ profile, updateProfile }: ProfileFormProps) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setMessage('')
    setError('')

    const result = await updateProfile(formData)

    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setMessage(result.success)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-1"
        >
          Nom complet
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={profile.full_name || ''}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Marie Dupont"
        />
      </div>

      {profile.role === 'brand' && (
        <div>
          <label htmlFor="brand_name" className="block text-sm font-medium text-foreground mb-1"
          >
            Nom de la marque
          </label>
          <input
            id="brand_name"
            name="brand_name"
            type="text"
            defaultValue={profile.brand_name || ''}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Ma Marque"
          />
        </div>
      )}

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-foreground mb-1"
        >
          Site web
        </label>
        <input
          id="website"
          name="website"
          type="url"
          defaultValue={profile.website || ''}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="https://mamarque.com"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1"
        >
          Bio / Description
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile.bio || ''}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Décrivez votre marque ou votre activité..."
        />
      </div>

      <div className="rounded-lg bg-secondary p-3 text-sm"
      >
        <p className="text-muted-foreground"
        >
          Rôle :{' '}
          <span className="font-medium text-foreground"
          >
            {profile.role === 'brand' ? 'Marque' : 'Hôte'}
          </span>
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive"
        >{error}
        </p>
      )}

      {message && (
        <p className="text-sm text-success"
        >{message}
        </p>
      )}

      <button
        type="submit"
        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
      >
        Enregistrer les modifications
      </button>
    </form>
  )
}
