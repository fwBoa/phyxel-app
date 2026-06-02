import { createClient } from '@/lib/supabase/server'
import { getSpaces } from '@/lib/queries/spaces'
import { getBrandPreferences } from '@/lib/queries/preferences'
import { calculateMatchScore } from '@/lib/matching/score'
import type { SpaceFilters, SpaceWithPhotos } from '@/types/spaces'
import type { City, SpaceType } from '@/constants/spaces'
import type { MatchScore } from '@/lib/matching/score'
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

  // Récupère les préférences utilisateur (si connecté)
  let scoredSpaces: (SpaceWithPhotos & { match?: MatchScore })[] = spaces
  let userPrefs = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userPrefs = await getBrandPreferences(user.id)
      if (userPrefs) {
        scoredSpaces = spaces.map((space) => ({
          ...space,
          match: calculateMatchScore(space, userPrefs!),
        }))
        // Trie par score décroissant
        scoredSpaces.sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0))
      }
    }
  } catch {
    // Ignore — si pas connecté ou erreur, on montre les espaces normalement
  }

  return (
    <ExplorerClient
      initialSpaces={scoredSpaces}
      activeType={params.type ?? null}
      activeCity={params.city ?? null}
      activeMaxPrice={params.maxPrice ? Number(params.maxPrice) : null}
      hasPreferences={!!userPrefs}
    />
  )
}
