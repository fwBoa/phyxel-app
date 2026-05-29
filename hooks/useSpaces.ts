'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SpaceWithPhotos } from '@/types/spaces'

type Filters = { city?: string; type?: string; maxPrice?: number }

export function useSpaces(filters?: Filters) {
  const [spaces, setSpaces] = useState<SpaceWithPhotos[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let query = supabase
      .from('spaces')
      .select('*, space_photos(*)')
      .eq('is_available', true)

    if (filters?.city) query = query.eq('city', filters.city)
    if (filters?.type) query = query.eq('type', filters.type)
    if (filters?.maxPrice) query = query.lte('price_day', filters.maxPrice)

    query.order('created_at', { ascending: false }).then(({ data, error: err }) => {
      if (err) setError(err.message)
      else setSpaces((data as SpaceWithPhotos[]) ?? [])
      setLoading(false)
    })
  }, [filters?.city, filters?.type, filters?.maxPrice])

  return { spaces, loading, error }
}
