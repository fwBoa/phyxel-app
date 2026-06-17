'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { CITIES, SPACE_TYPES } from '@/constants/spaces'
import type { SpaceFilters } from '@/types/spaces'

type SearchBarProps = {
  initialFilters?: SpaceFilters
  onSearch?:       (filters: SpaceFilters) => void
  variant?:        'hero' | 'explorer'
}

export default function SearchBar({ initialFilters, onSearch, variant = 'hero' }: SearchBarProps) {
  const router = useRouter()
  const [city, setCity] = useState(initialFilters?.city ?? '')
  const [type, setType] = useState(initialFilters?.type ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const filters: SpaceFilters = {
      ...(city ? { city: city as SpaceFilters['city'] } : {}),
      ...(type ? { type: type as SpaceFilters['type'] } : {}),
    }
    if (onSearch) {
      onSearch(filters)
    } else {
      const params = new URLSearchParams()
      if (city) params.set('city', city)
      if (type) params.set('type', type)
      router.push(`/explorer?${params.toString()}`)
    }
  }

  const isHero = variant === 'hero'

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-lg sm:flex-row sm:items-center ${
        isHero ? 'sm:rounded-full' : 'border border-border-custom'
      }`}
    >
      {/* Ville */}
      <label className="flex-1">
        <span className="sr-only">Ville</span>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-xl bg-bg-secondary px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#7C3AED]"
        >
          <option value="">Toutes les villes</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      {/* Type d'espace */}
      <label className="flex-1">
        <span className="sr-only">Type d&apos;espace</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-xl bg-bg-secondary px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#7C3AED]"
        >
          <option value="">Type d&apos;espace</option>
          {SPACE_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      {/* Bouton */}
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:rounded-full"
      >
        <Search size={16} />
        Rechercher
      </button>
    </form>
  )
}
