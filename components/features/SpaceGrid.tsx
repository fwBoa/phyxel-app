'use client'

import { useSpaces } from '@/hooks/useSpaces'
import { SpaceCard } from './SpaceCard'
import type { SpaceWithPhotos } from '@/types/spaces'

type Props = {
  filters?: { city?: string; type?: string; maxPrice?: number }
  initialData?: SpaceWithPhotos[]
}

function toCardData(space: SpaceWithPhotos) {
  const cover = space.space_photos?.find(p => p.is_cover) ?? space.space_photos?.[0]
  return {
    id:          space.id,
    title:       space.title,
    type:        space.type,
    city:        space.city,
    district:    space.district,
    priceDay:    space.price_day,
    areaSqm:     space.area_sqm,
    matchScore:  Math.floor(70 + Math.random() * 30),
    isAvailable: space.is_available,
    coverUrl:    cover?.url ?? '',
  }
}

export function SpaceGrid({ filters, initialData }: Props) {
  const { spaces, loading, error } = useSpaces(initialData ? undefined : filters)
  const data = initialData ?? spaces

  if (loading && !initialData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 rounded-2xl bg-[#F9F9F9] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) return <p className="text-center text-red-500">{error}</p>

  if (!data.length) {
    return (
      <div className="text-center py-16">
        <p className="text-[#9B9B9B] text-lg">Aucun espace trouvé</p>
        <p className="text-[#9B9B9B] text-sm mt-2">Modifiez vos filtres pour voir plus de résultats</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map(space => (
        <SpaceCard key={space.id} {...toCardData(space)} />
      ))}
    </div>
  )
}
