'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { SlidersHorizontal, X, MapPin, Euro, Sparkles } from 'lucide-react'
import SpaceCard from '@/components/ui/SpaceCard'
import { SPACE_TYPES, CITIES } from '@/constants/spaces'
import type { SpaceWithPhotos } from '@/types/spaces'

const BUDGET_OPTIONS = [
  { label: 'Tous les budgets', value: '' },
  { label: '≤ 500 € / jour',   value: '500' },
  { label: '≤ 1 000 € / jour', value: '1000' },
  { label: '≤ 2 500 € / jour', value: '2500' },
  { label: '≤ 5 000 € / jour', value: '5000' },
]

function getCoverUrl(space: SpaceWithPhotos): string | null {
  const cover = space.space_photos?.find((p) => p.is_cover) ?? space.space_photos?.[0]
  return cover?.url ?? null
}

type Props = {
  initialSpaces:  SpaceWithPhotos[]
  activeType:     string | null
  activeCity:     string | null
  activeMaxPrice: number | null
  matchScores?:   Record<string, number>
  hasPreferences?: boolean
}

export default function ExplorerClient({ initialSpaces, activeType, activeCity, activeMaxPrice, matchScores = {}, hasPreferences = false }: Props) {
  const router   = useRouter()
  const pathname = usePathname()

  const navigate = useCallback((overrides: Record<string, string | null>) => {
    const params = new URLSearchParams()
    const merged = {
      type:     activeType     ?? null,
      city:     activeCity     ?? null,
      maxPrice: activeMaxPrice ? String(activeMaxPrice) : null,
      ...overrides,
    }
    if (merged.type)     params.set('type',     merged.type)
    if (merged.city)     params.set('city',     merged.city)
    if (merged.maxPrice) params.set('maxPrice', merged.maxPrice)
    router.push(`${pathname}?${params.toString()}`)
  }, [activeType, activeCity, activeMaxPrice, router, pathname])

  const hasFilters = activeType || activeCity || activeMaxPrice

  return (
    <div className="min-h-screen bg-bg-secondary">

      {/* Bandeau header */}
      <div className="bg-white border-b border-border-custom">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">Explorer les espaces</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Trouvez l&apos;espace idéal pour votre pop-up, showroom ou événement.
          </p>

          {/* Ligne de filtres */}
          <div className="mt-6 flex flex-wrap items-center gap-2">

            {/* Pills types */}
            <button
              onClick={() => navigate({ type: null })}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                !activeType
                  ? 'border-[#0A0A0A] bg-foreground text-white'
                  : 'border-border-custom bg-white text-text-secondary hover:border-[#0A0A0A] hover:text-foreground'
              }`}
            >
              Tous
            </button>

            {SPACE_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => navigate({ type: activeType === value ? null : value })}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeType === value
                    ? 'border-primary bg-primary text-white'
                    : 'border-border-custom bg-white text-text-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}

            <div className="h-5 w-px bg-[#E5E5E5] hidden sm:block" />

            {/* Ville */}
            <div className="relative flex items-center">
              <MapPin size={14} className="absolute left-3 text-text-muted pointer-events-none" />
              <select
                value={activeCity ?? ''}
                onChange={(e) => navigate({ city: e.target.value || null })}
                className="rounded-full border border-border-custom bg-white pl-8 pr-4 py-1.5 text-sm text-text-secondary focus:outline-none focus:border-[#0A0A0A] focus:text-foreground transition-colors appearance-none cursor-pointer"
              >
                <option value="">Toutes les villes</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="relative flex items-center">
              <Euro size={14} className="absolute left-3 text-text-muted pointer-events-none" />
              <select
                value={activeMaxPrice ? String(activeMaxPrice) : ''}
                onChange={(e) => navigate({ maxPrice: e.target.value || null })}
                className="rounded-full border border-border-custom bg-white pl-8 pr-4 py-1.5 text-sm text-text-secondary focus:outline-none focus:border-[#0A0A0A] focus:text-foreground transition-colors appearance-none cursor-pointer"
              >
                {BUDGET_OPTIONS.map(({ label, value }) => (
                  <option key={label} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Reset */}
            {hasFilters && (
              <button
                onClick={() => navigate({ type: null, city: null, maxPrice: null })}
                className="flex items-center gap-1 rounded-full border border-border-custom bg-white px-3 py-1.5 text-sm text-text-secondary hover:border-[#EF4444] hover:text-match-low transition-colors"
              >
                <X size={13} />
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Bandeau recommandations */}
        {hasPreferences && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-brand-muted px-4 py-3">
            <Sparkles size={18} className="text-primary shrink-0" />
            <p className="text-sm text-primary font-medium">
              Ces espaces sont recommandés selon vos préférences
              {activeCity && <span> pour <span className="font-semibold">{activeCity}</span></span>}
              {activeType && <span> · <span className="font-semibold">{SPACE_TYPES.find((t) => t.value === activeType)?.label}</span></span>}
            </p>
          </div>
        )}

        {/* Filtres actifs + compteur */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-foreground">{initialSpaces.length}</span>
            {' '}espace{initialSpaces.length !== 1 ? 's' : ''} trouvé{initialSpaces.length !== 1 ? 's' : ''}
            {activeCity && <span> · <span className="text-primary">{activeCity}</span></span>}
            {activeType && (
              <span> · <span className="text-primary">
                {SPACE_TYPES.find((t) => t.value === activeType)?.label}
              </span></span>
            )}
            {activeMaxPrice && (
              <span> · <span className="text-primary">≤ {activeMaxPrice.toLocaleString('fr-FR')} €/j</span></span>
            )}
          </p>
        </div>

        {/* Grille — les espaces sont déjà triés par pertinence côté serveur */}
        {initialSpaces.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initialSpaces.map((space) => (
              <SpaceCard
                key={space.id}
                id={space.id}
                title={space.title}
                type={space.type}
                city={space.city}
                district={space.district}
                priceDay={space.price_day}
                areaSqm={space.area_sqm}
                isAvailable={space.is_available}
                coverUrl={getCoverUrl(space)}
                matchScore={matchScores[space.id] ?? null}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: '#EDE9FE' }}
            >
              <SlidersHorizontal size={32} className="text-primary" />
            </div>
            <p className="mt-5 text-lg font-semibold text-foreground">Aucun espace trouvé</p>
            <p className="mt-2 text-sm text-text-secondary">
              Essayez de modifier vos filtres pour élargir la recherche.
            </p>
            <button
              onClick={() => navigate({ type: null, city: null, maxPrice: null })}
              className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
            >
              Voir tous les espaces
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
