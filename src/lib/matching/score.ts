import type { SpaceWithPhotos } from '@/types/spaces'
import type { BrandPreferenceRow } from '@/types/database'

export interface MatchScore {
  score: number        // 0-100
  reasons: string[]    // legacy
  pointsForts: string[]
  pointsVigilance: string[]
}

/**
 * Calcule un score de matching entre un espace et les préférences utilisateur.
 * 100 = match parfait, 0 = aucun match.
 */
export function calculateMatchScore(
  space: SpaceWithPhotos,
  prefs: BrandPreferenceRow
): MatchScore {
  let score = 0
  let maxPossible = 0
  const reasons: string[] = []
  const pointsForts: string[] = []
  const pointsVigilance: string[] = []

  // 1. Ville cible (30 pts)
  if (prefs.target_city && space.city) {
    maxPossible += 30
    const prefCity = prefs.target_city.toLowerCase().trim()
    const spaceCity = space.city.toLowerCase().trim()
    if (spaceCity === prefCity) {
      score += 30
      const msg = `Dans votre ville cible (${space.city})`
      reasons.push(msg)
      pointsForts.push(msg)
    } else if (spaceCity.includes(prefCity) || prefCity.includes(spaceCity)) {
      score += 15
      const msg = `Dans la région de ${space.city}`
      reasons.push(msg)
      pointsForts.push(msg)
    } else {
      pointsVigilance.push(`En dehors de votre ville cible (${prefs.target_city})`)
    }
  }

  // 2. Type d'espace (25 pts)
  const prefSpaceTypes = parseJsonArray(prefs.space_types)
  if (prefSpaceTypes.length > 0 && space.type) {
    maxPossible += 25
    const spaceTypeLabel = normalizeSpaceType(space.type)
    const match = prefSpaceTypes.some(
      (pt: string) => normalizeSpaceType(pt) === spaceTypeLabel
    )
    if (match) {
      score += 25
      const msg = "Correspond au type d'espace recherché"
      reasons.push(msg)
      pointsForts.push(msg)
    } else {
      pointsVigilance.push(`Le style (${space.type}) ne correspond pas à vos priorités`)
    }
  }

  // 3. Budget (20 pts)
  const maxBudgetValue = parseBudgetValue(prefs.max_budget)
  if (maxBudgetValue > 0 && space.price_day) {
    maxPossible += 20
    if (space.price_day <= maxBudgetValue) {
      score += 20
      const msg = 'Dans votre budget'
      reasons.push(msg)
      pointsForts.push(msg)
    } else if (space.price_day <= maxBudgetValue * 1.3) {
      score += 10
      const msg = 'Légèrement au-dessus de votre budget'
      reasons.push(msg)
      pointsVigilance.push(msg)
    } else {
      pointsVigilance.push(`Dépasse votre budget max (${maxBudgetValue}€/j)`)
    }
  }

  // 4. Quartier (15 pts)
  const prefDistricts = parseJsonArray(prefs.preferred_districts)
  if (prefDistricts.length > 0 && space.district) {
    maxPossible += 15
    const spaceDistrict = space.district.toLowerCase().trim()
    const match = prefDistricts.some(
      (d: string) => spaceDistrict.includes(d.toLowerCase().trim()) ||
        d.toLowerCase().trim().includes(spaceDistrict)
    )
    if (match) {
      score += 15
      const msg = `Quartier idéal (${space.district})`
      reasons.push(msg)
      pointsForts.push(msg)
    }
  }

  // 5. Surface (10 pts)
  const desiredAreaValue = parseAreaValue(prefs.desired_area)
  if (desiredAreaValue > 0 && space.area_sqm) {
    maxPossible += 10
    const ratio = space.area_sqm / desiredAreaValue
    if (ratio >= 0.7 && ratio <= 1.3) {
      score += 10
      const msg = `Surface adaptée (${space.area_sqm} m²)`
      reasons.push(msg)
      pointsForts.push(msg)
    } else if (ratio >= 0.5 && ratio <= 1.5) {
      score += 5
      const msg = `Surface proche (${space.area_sqm} m²)`
      reasons.push(msg)
      pointsForts.push(msg)
    } else if (ratio < 0.5) {
      pointsVigilance.push(`Surface de ${space.area_sqm}m² potentiellement trop petite`)
    } else {
      pointsVigilance.push(`Surface potentiellement trop grande (${space.area_sqm}m²)`)
    }
  }

  // Calcul du vrai pourcentage
  const percentage = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0

  if (pointsForts.length === 0 && percentage > 0) {
    pointsForts.push("Cet espace a des caractéristiques uniques à découvrir")
  }

  return { score: percentage, reasons, pointsForts, pointsVigilance }
}

/* ─── Helpers ─── */

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
    } catch {
      return []
    }
  }
  return []
}

function normalizeSpaceType(type: string): string {
  const map: Record<string, string> = {
    'pop-up store': 'popup',
    'pop-up': 'popup',
    'popup store': 'popup',
    'boutique éphémère': 'boutique',
    'événementiel': 'popup',
    showroom: 'showroom',
    corner: 'corner',
    gallery: 'gallery',
    boutique: 'boutique',
  }
  const key = type.toLowerCase().trim()
  return map[key] ?? key
}

/** Extrait la valeur numérique max d'une string budget ex: "2 000 € — 5 000 €" → 5000 */
function parseBudgetValue(budgetStr: string | null): number {
  if (!budgetStr) return 0
  const numbers = budgetStr.match(/[\d\s]+/g)
  if (!numbers) return 0
  const last = numbers[numbers.length - 1].replace(/\s/g, '')
  const val = Number(last)
  return Number.isFinite(val) ? val : 0
}

/** Extrait la valeur moyenne d'une string surface ex: "50-100 m²" → 75 */
function parseAreaValue(areaStr: string | null): number {
  if (!areaStr) return 0
  const match = areaStr.match(/(\d+)(?:\s*-\s*(\d+))?/)
  if (!match) return 0
  const min = Number(match[1])
  const max = match[2] ? Number(match[2]) : min
  return (min + max) / 2
}
