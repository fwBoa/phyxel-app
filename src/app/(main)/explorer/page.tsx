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

/** Mappe un label onboarding vers une valeur technique SpaceType */
function onboardingLabelToSpaceType(label: string): SpaceType | null {
  const map: Record<string, SpaceType> = {
    'pop-up store': 'popup',
    'pop-up': 'popup',
    'popup store': 'popup',
    showroom: 'showroom',
    corner: 'corner',
    'boutique éphémère': 'boutique',
    'événementiel': 'popup',
    boutique: 'boutique',
  }
  return map[label.toLowerCase().trim()] ?? null
}

/** Extrait la valeur max d'un string budget ex: "2 000 € — 5 000 €" → 5000 */
function parseBudgetMax(budgetStr: string | null): number {
  if (!budgetStr) return 0
  const numbers = budgetStr.match(/[\d\s]+/g)
  if (!numbers) return 0
  const last = numbers[numbers.length - 1].replace(/\s/g, '')
  const val = Number(last)
  return Number.isFinite(val) ? val : 0
}

export default async function ExplorerPage({ searchParams }: PageProps) {
  const params = await searchParams

  // Détecte si l'utilisateur a déjà des filtres actifs dans l'URL
  const hasUrlFilters = !!(params.city || params.type || params.maxPrice)

  let activeCity: City | null = (params.city as City) ?? null
  let activeType: SpaceType | null = (params.type as SpaceType) ?? null
  let activeMaxPrice: number | null = params.maxPrice ? Number(params.maxPrice) : null

  // Si aucun filtre URL, on essaie de pré-remplir depuis les préférences utilisateur
  if (!hasUrlFilters) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const prefs = await getBrandPreferences(user.id)
        if (prefs) {
          // Ville cible
          if (prefs.target_city) {
            const city = prefs.target_city.trim()
            // Vérifie que la ville est dans la liste autorisée
            const validCities = [
              'Paris','Lyon','Marseille','Bordeaux','Lille','Nantes',
              'Toulouse','Strasbourg','Nice','Rennes','Montpellier','Grenoble',
            ]
            if (validCities.includes(city)) {
              activeCity = city as City
            }
          }

          // Type d'espace préféré (prend le premier qui match)
          const prefTypes = Array.isArray(prefs.space_types)
            ? prefs.space_types.filter((t): t is string => typeof t === 'string')
            : []
          for (const label of prefTypes) {
            const mapped = onboardingLabelToSpaceType(label)
            if (mapped) {
              activeType = mapped
              break
            }
          }

          // Budget max
          if (prefs.max_budget) {
            activeMaxPrice = parseBudgetMax(prefs.max_budget)
          }
        }
      }
    } catch {
      // Ignore — pas de préférences ou pas connecté
    }
  }

  const filters: SpaceFilters = {
    ...(activeCity ? { city: activeCity } : {}),
    ...(activeType ? { type: activeType } : {}),
    ...(activeMaxPrice ? { maxPrice: activeMaxPrice } : {}),
  }

  // Récupère les espaces filtrées
  const spaces = await getSpaces(filters).catch(() => [])

  // Si utilisateur connecté avec préférences, on calcule les scores
  // et on trie silencieusement sans rien afficher au user.
  let sortedSpaces = spaces
  const matchScores: Record<string, number> = {}
  let hasPreferences = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const prefs = await getBrandPreferences(user.id)
      if (prefs) {
        hasPreferences = true
        const scored = spaces.map((space) => {
          const match = calculateMatchScore(space, prefs)
          matchScores[space.id] = match.score
          return {
            ...space,
            _matchScore: match,
          }
        })
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
      activeType={activeType}
      activeCity={activeCity}
      activeMaxPrice={activeMaxPrice}
      matchScores={matchScores}
      hasPreferences={hasPreferences}
    />
  )
}
