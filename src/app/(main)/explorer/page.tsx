import { createClient } from '@/lib/supabase/server'
import { getSpaces } from '@/lib/queries/spaces'
import { getBrandPreferences } from '@/lib/queries/preferences'
import { calculateMatchScore } from '@/lib/matching/score'
import type { SpaceFilters, SpaceWithPhotos } from '@/types/spaces'
import type { City, SpaceType } from '@/constants/spaces'
import ExplorerClient from './ExplorerClient'

type PageProps = {
  searchParams: Promise<{ city?: string; type?: string; maxPrice?: string }>
}

export default async function ExplorerPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: SpaceFilters = {
    ...(params.city ? { city: params.city as City } : {}),
    ...(params.type ? { type: params.type as SpaceType } : {}),
    ...(params.maxPrice ? { maxPrice: Number(params.maxPrice) } : {}),
  }

  // Récupère les espaces
  const spaces = await getSpaces(filters).catch(() => [])

  // Si utilisateur connecté avec préférences, on calcule les scores
  // et on trie silencieusement sans rien afficher au user.
  let sortedSpaces = spaces

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const prefs = await getBrandPreferences(user.id)
      if (prefs) {
        const scored = spaces.map((space) => ({
          ...space,
          _matchScore: calculateMatchScore(space, prefs),
        }))
        scored.sort((a, b) => (b._matchScore?.score ?? 0) - (a._matchScore?.score ?? 0))
        sortedSpaces = scored.map(({ _matchScore, ...space }) => space)
      }
    }
  } catch {
    // Ignore — fallback sur la liste normale
  }

  return (
    <ExplorerClient
      initialSpaces={sortedSpaces}
      activeType={params.type ?? null}
      activeCity={params.city ?? null}
      activeMaxPrice={params.maxPrice ? Number(params.maxPrice) : null}
    />
  )
}
