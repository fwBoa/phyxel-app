'use client'

import { useEffect, useState } from 'react'
import type { SpaceFilters, SpaceWithPhotos } from '@/types/spaces'

export function useSpaces(filters?: SpaceFilters) {
  const [spaces, setSpaces]   = useState<SpaceWithPhotos[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters?.city)     params.set('city', filters.city)
    if (filters?.type)     params.set('type', filters.type)
    if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))

    fetch(`/api/spaces?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => { setSpaces(data); setLoading(false) })
      .catch(() => { setError('Erreur lors du chargement des espaces'); setLoading(false) })
  }, [filters?.city, filters?.type, filters?.minPrice, filters?.maxPrice])

  return { spaces, loading, error }
}
