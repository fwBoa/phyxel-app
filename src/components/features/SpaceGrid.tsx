'use client'

import SpaceCard from '@/components/ui/SpaceCard'
import { useSpaces } from '@/hooks/useSpaces'
import type { SpaceFilters, SpaceWithPhotos } from '@/types/spaces'

function getCoverUrl(space: SpaceWithPhotos): string | null {
  const cover = space.space_photos?.find((p) => p.is_cover) ?? space.space_photos?.[0]
  return cover?.url ?? null
}

type SpaceGridProps = {
  filters?:      SpaceFilters
  initialSpaces?: SpaceWithPhotos[]
}

export default function SpaceGrid({ filters, initialSpaces }: SpaceGridProps) {
  const { spaces: fetched, loading, error } = useSpaces(filters)
  const spaces = initialSpaces ?? fetched

  if (loading && !initialSpaces) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-[#F9F9F9]" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-sm text-[#EF4444]">{error}</p>
  }

  if (!spaces.length) {
    return (
      <p className="text-center text-sm text-[#9B9B9B]">
        Aucun espace ne correspond à votre recherche.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
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
  )
}
