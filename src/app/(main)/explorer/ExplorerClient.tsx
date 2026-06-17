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
          <div className="mb-6 w-[45%] flex items-center gap-3 rounded-xl bg-gray-100 border border-gray-200 px-5 py-4 animate-in fade-in duration-700 delay-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.99999 6.99747e-08C9.20899 6.99747e-08 8.44999 0.314 7.88999 0.874L6.99699 1.767C6.81139 1.95005 6.56166 2.05338 6.30099 2.055H5.03999C4.64795 2.05487 4.25974 2.13199 3.89752 2.28195C3.5353 2.43192 3.20619 2.65178 2.92898 2.92899C2.65177 3.2062 2.4319 3.53532 2.28194 3.89753C2.13197 4.25975 2.05486 4.64797 2.05499 5.04V6.302C2.05337 6.56267 1.95003 6.81241 1.76699 6.998L0.873987 7.891C0.314382 8.45061 0 9.2096 0 10.001C0 10.7924 0.314382 11.5514 0.873987 12.111L1.76699 13.004C1.95003 13.1896 2.05337 13.4393 2.05499 13.7V14.962C2.05499 15.7534 2.36937 16.5124 2.92898 17.072C3.48859 17.6316 4.24758 17.946 5.03899 17.946H6.30099C6.56199 17.946 6.81299 18.05 6.99699 18.234L7.88999 19.127C8.4496 19.6866 9.20858 20.001 9.99999 20.001C10.7914 20.001 11.5504 19.6866 12.11 19.127L13.003 18.234C13.1886 18.051 13.4383 17.9476 13.699 17.946H14.961C15.7524 17.946 16.5114 17.6316 17.071 17.072C17.6306 16.5124 17.945 15.7534 17.945 14.962V13.7C17.945 13.439 18.049 13.188 18.233 13.004L19.126 12.111C19.6856 11.5514 20 10.7924 20 10.001C20 9.2096 19.6856 8.45061 19.126 7.891L18.233 6.998C18.0499 6.81241 17.9466 6.56267 17.945 6.302V5.04C17.945 4.24859 17.6306 3.4896 17.071 2.92999C16.5114 2.37038 15.7524 2.056 14.961 2.056H13.699C13.4383 2.05438 13.1886 1.95105 13.003 1.768L12.11 0.875C11.8331 0.597552 11.5042 0.377451 11.1422 0.227305C10.7801 0.077158 10.392 -8.48687e-05 9.99999 6.99747e-08ZM13.683 7.73C13.7807 7.63827 13.8589 7.52785 13.9131 7.40529C13.9672 7.28274 13.9962 7.15054 13.9983 7.01656C14.0004 6.88258 13.9755 6.74955 13.9252 6.62537C13.8749 6.50119 13.8001 6.38839 13.7053 6.29368C13.6105 6.19896 13.4977 6.12426 13.3734 6.07401C13.2492 6.02376 13.1162 5.99899 12.9822 6.00117C12.8482 6.00334 12.716 6.03242 12.5935 6.08668C12.471 6.14093 12.3606 6.21926 12.269 6.317L8.01599 10.57L6.73899 9.293C6.55148 9.10536 6.29711 8.99989 6.03184 8.9998C5.76657 8.9997 5.51213 9.10499 5.32449 9.2925C5.13685 9.48001 5.03138 9.73438 5.03128 9.99965C5.03119 10.2649 5.13648 10.5194 5.32399 10.707L7.30899 12.691C7.49651 12.8785 7.75082 12.9838 8.01599 12.9838C8.28115 12.9838 8.53546 12.8785 8.72299 12.691L13.683 7.731V7.73Z" fill="url(#paint0_linear_1028_1228)"/>
              <defs>
                <linearGradient id="paint0_linear_1028_1228" x1="0.302488" y1="0.231087" x2="29.4257" y2="9.56756" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#141818"/>
                  <stop offset="0.146816" stopColor="#1A2B6B"/>
                  <stop offset="0.319337" stopColor="#0D58C6"/>
                  <stop offset="0.49602" stopColor="#6F8BEF"/>
                  <stop offset="1" stopColor="white"/>
                </linearGradient>
              </defs>
            </svg>
            <p className="text-base font-bold shimmer-blue">
              Ces espaces sont recommandés selon vos préférences
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
