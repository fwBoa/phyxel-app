'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { SlidersHorizontal, X, MapPin, Euro } from 'lucide-react'
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
}

export default function ExplorerClient({ initialSpaces, activeType, activeCity, activeMaxPrice }: Props) {
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
    <div className="min-h-screen bg-[#F9F9F9]">

      {/* Bandeau header */}
      <div className="bg-white border-b border-[#E5E5E5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-[#0A0A0A]">Explorer les espaces</h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Trouvez l&apos;espace idéal pour votre pop-up, showroom ou événement.
          </p>

          {/* Ligne de filtres */}
          <div className="mt-6 flex flex-wrap items-center gap-2">

            {/* Pills types */}
            <button
              onClick={() => navigate({ type: null })}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                !activeType
                  ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                  : 'border-[#E5E5E5] bg-white text-[#6B6B6B] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
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
                    ? 'border-[#E91E8C] bg-[#E91E8C] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#6B6B6B] hover:border-[#E91E8C] hover:text-[#E91E8C]'
                }`}
              >
                {label}
              </button>
            ))}

            <div className="h-5 w-px bg-[#E5E5E5] hidden sm:block" />

            {/* Ville */}
            <div className="relative flex items-center">
              <MapPin size={14} className="absolute left-3 text-[#9B9B9B] pointer-events-none" />
              <select
                value={activeCity ?? ''}
                onChange={(e) => navigate({ city: e.target.value || null })}
                className="rounded-full border border-[#E5E5E5] bg-white pl-8 pr-4 py-1.5 text-sm text-[#6B6B6B] focus:outline-none focus:border-[#0A0A0A] focus:text-[#0A0A0A] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Toutes les villes</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="relative flex items-center">
              <Euro size={14} className="absolute left-3 text-[#9B9B9B] pointer-events-none" />
              <select
                value={activeMaxPrice ? String(activeMaxPrice) : ''}
                onChange={(e) => navigate({ maxPrice: e.target.value || null })}
                className="rounded-full border border-[#E5E5E5] bg-white pl-8 pr-4 py-1.5 text-sm text-[#6B6B6B] focus:outline-none focus:border-[#0A0A0A] focus:text-[#0A0A0A] transition-colors appearance-none cursor-pointer"
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
                className="flex items-center gap-1 rounded-full border border-[#E5E5E5] bg-white px-3 py-1.5 text-sm text-[#6B6B6B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
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

        {/* Filtres actifs + compteur */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#6B6B6B]">
            <span className="font-semibold text-[#0A0A0A]">{initialSpaces.length}</span>
            {' '}espace{initialSpaces.length !== 1 ? 's' : ''} trouvé{initialSpaces.length !== 1 ? 's' : ''}
            {activeCity && <span> · <span className="text-[#E91E8C]">{activeCity}</span></span>}
            {activeType && (
              <span> · <span className="text-[#E91E8C]">
                {SPACE_TYPES.find((t) => t.value === activeType)?.label}
              </span></span>
            )}
            {activeMaxPrice && (
              <span> · <span className="text-[#E91E8C]">≤ {activeMaxPrice.toLocaleString('fr-FR')} €/j</span></span>
            )}
          </p>
        </div>

        {/* Grille */}
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
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: '#FDE8F4' }}
            >
              <SlidersHorizontal size={32} className="text-[#E91E8C]" />
            </div>
            <p className="mt-5 text-lg font-semibold text-[#0A0A0A]">Aucun espace trouvé</p>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Essayez de modifier vos filtres pour élargir la recherche.
            </p>
            <button
              onClick={() => navigate({ type: null, city: null, maxPrice: null })}
              className="mt-6 rounded-full bg-[#E91E8C] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#B0156A] transition-colors"
            >
              Voir tous les espaces
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
