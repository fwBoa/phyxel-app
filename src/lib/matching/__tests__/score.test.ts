import { calculateMatchScore } from '@/lib/matching/score'
import type { SpaceWithPhotos } from '@/types/spaces'
import type { BrandPreferenceRow } from '@/types/database'

function makeSpace(overrides: Partial<SpaceWithPhotos> = {}): SpaceWithPhotos {
  return {
    id:           'space-1',
    host_id:      'host-1',
    title:        'Test Space',
    type:         'popup',
    city:         'Paris',
    district:     null,
    address:      null,
    area_sqm:     null,
    price_day:    null,
    description:  null,
    is_available: true,
    created_at:   '2024-01-01',
    space_photos: [],
    ...overrides,
  }
}

function makePrefs(overrides: Partial<BrandPreferenceRow> = {}): BrandPreferenceRow {
  return {
    id:                  'prefs-1',
    user_id:             'user-1',
    sector:              null,
    product_types:       null,
    main_city:           null,
    company_size:        null,
    approx_budget:       null,
    physical_objectives: null,
    target_city:         null,
    desired_duration:    null,
    space_types:         null,
    desired_area:        null,
    needed_services:     null,
    max_budget:          null,
    preferred_districts: null,
    desired_ambiance:    null,
    ideal_dates:         null,
    created_at:          '2024-01-01',
    updated_at:          '2024-01-01',
    ...overrides,
  }
}

describe('calculateMatchScore()', () => {
  describe("retourne 0 quand aucune preference n'est definie", () => {
    it('score = 0 si toutes les prefs sont null (maxPossible = 0)', () => {
      const result = calculateMatchScore(makeSpace(), makePrefs())
      expect(result.score).toBe(0)
    })
  })

  describe('scoring ville cible (30 pts)', () => {
    it('donne un score de 100% pour une ville exactement identique', () => {
      const result = calculateMatchScore(
        makeSpace({ city: 'Paris' }),
        makePrefs({ target_city: 'Paris' })
      )
      expect(result.score).toBe(100)
    })

    it('matching insensible à la casse', () => {
      const result = calculateMatchScore(
        makeSpace({ city: 'paris' }),
        makePrefs({ target_city: 'PARIS' })
      )
      expect(result.score).toBe(100)
    })

    it('donne 50% (15/30 pts) pour une correspondance partielle', () => {
      const result = calculateMatchScore(
        makeSpace({ city: 'Paris 15e' }),
        makePrefs({ target_city: 'Paris' })
      )
      expect(result.score).toBe(50)
    })

    it('ajoute un point de vigilance si la ville ne correspond pas', () => {
      const result = calculateMatchScore(
        makeSpace({ city: 'Lyon' }),
        makePrefs({ target_city: 'Paris' })
      )
      expect(result.pointsVigilance).toContain('En dehors de votre ville cible (Paris)')
    })

    it('ignore le critère ville si target_city est null', () => {
      const result = calculateMatchScore(makeSpace(), makePrefs({ target_city: null }))
      expect(result.score).toBe(0)
      expect(result.pointsVigilance).toHaveLength(0)
    })
  })

  describe("scoring type d'espace (25 pts)", () => {
    it('donne 100% pour un type exactement identique', () => {
      const result = calculateMatchScore(
        makeSpace({ type: 'showroom' }),
        makePrefs({ space_types: JSON.stringify(['showroom']) })
      )
      expect(result.score).toBe(100)
    })

    it('normalise les alias — "pop-up store" → "popup"', () => {
      const result = calculateMatchScore(
        makeSpace({ type: 'popup' }),
        makePrefs({ space_types: JSON.stringify(['pop-up store']) })
      )
      expect(result.score).toBe(100)
    })

    it('normalise "pop-up" → "popup"', () => {
      const result = calculateMatchScore(
        makeSpace({ type: 'popup' }),
        makePrefs({ space_types: JSON.stringify(['pop-up']) })
      )
      expect(result.score).toBe(100)
    })

    it('accepte space_types comme array natif (pas de JSON)', () => {
      const result = calculateMatchScore(
        makeSpace({ type: 'corner' }),
        makePrefs({ space_types: ['corner'] as unknown as string })
      )
      expect(result.score).toBe(100)
    })

    it('ajoute un point de vigilance si le type ne correspond pas', () => {
      const result = calculateMatchScore(
        makeSpace({ type: 'gallery' }),
        makePrefs({ space_types: JSON.stringify(['popup']) })
      )
      expect(result.pointsVigilance[0]).toContain('gallery')
    })
  })

  describe('scoring budget (20 pts)', () => {
    it('donne 100% quand price_day <= max budget', () => {
      const result = calculateMatchScore(
        makeSpace({ price_day: 4000 }),
        makePrefs({ max_budget: '2 000 € — 5 000 €' })
      )
      expect(result.score).toBe(100)
    })

    it('donne 50% (10/20 pts) quand price_day <= max * 1.3', () => {
      const result = calculateMatchScore(
        makeSpace({ price_day: 6000 }),
        makePrefs({ max_budget: '5 000 €' })
      )
      expect(result.score).toBe(50)
    })

    it('donne 0pts budget quand price_day > max * 1.3', () => {
      const result = calculateMatchScore(
        makeSpace({ price_day: 10000 }),
        makePrefs({ max_budget: '5 000 €' })
      )
      expect(result.score).toBe(0)
      expect(result.pointsVigilance[0]).toContain('budget')
    })

    it('ignore le critère budget si max_budget est null', () => {
      const result = calculateMatchScore(
        makeSpace({ price_day: 99999 }),
        makePrefs({ max_budget: null })
      )
      expect(result.score).toBe(0)
    })

    it('parse une string budget simple "1000€"', () => {
      const result = calculateMatchScore(
        makeSpace({ price_day: 800 }),
        makePrefs({ max_budget: '1000€' })
      )
      expect(result.score).toBe(100)
    })
  })

  describe('scoring quartier (15 pts)', () => {
    it('donne 100% pour un quartier correspondant', () => {
      const result = calculateMatchScore(
        makeSpace({ district: 'Le Marais' }),
        makePrefs({ preferred_districts: JSON.stringify(['Marais']) })
      )
      expect(result.score).toBe(100)
    })

    it('matching quartier insensible à la casse', () => {
      const result = calculateMatchScore(
        makeSpace({ district: 'le marais' }),
        makePrefs({ preferred_districts: JSON.stringify(['Le Marais']) })
      )
      expect(result.score).toBe(100)
    })

    it('ignore le critère quartier si preferred_districts est null', () => {
      const result = calculateMatchScore(
        makeSpace({ district: 'Le Marais' }),
        makePrefs({ preferred_districts: null })
      )
      expect(result.score).toBe(0)
    })
  })

  describe('scoring surface (10 pts)', () => {
    it('donne 100% quand le ratio surface est dans 0.7–1.3', () => {
      const result = calculateMatchScore(
        makeSpace({ area_sqm: 80 }),
        makePrefs({ desired_area: '60-100 m²' })
      )
      expect(result.score).toBe(100)
    })

    it('donne 50% (5/10 pts) quand ratio est dans 0.5-0.7', () => {
      // desired_area '60-100 m²' → avg 80. area_sqm=50 → ratio=0.625 (entre 0.5 et 0.7)
      const result = calculateMatchScore(
        makeSpace({ area_sqm: 50 }),
        makePrefs({ desired_area: '60-100 m²' })
      )
      expect(result.score).toBe(50)
    })

    it('ajoute un point de vigilance quand surface < 50% du désiré', () => {
      const result = calculateMatchScore(
        makeSpace({ area_sqm: 10 }),
        makePrefs({ desired_area: '60-100 m²' })
      )
      expect(result.pointsVigilance.some((v) => v.includes('trop petite'))).toBe(true)
    })

    it('parse une string surface simple "80 m²" → 80', () => {
      const result = calculateMatchScore(
        makeSpace({ area_sqm: 80 }),
        makePrefs({ desired_area: '80 m²' })
      )
      expect(result.score).toBe(100)
    })
  })

  describe('normalisation et cas limites', () => {
    it('score toujours entre 0 et 100', () => {
      const cases = [
        makePrefs({ target_city: 'Paris', space_types: JSON.stringify(['popup']), max_budget: '2000€', preferred_districts: JSON.stringify(['Marais']), desired_area: '80 m²' }),
        makePrefs({ target_city: 'Lyon' }),
        makePrefs(),
      ]
      for (const prefs of cases) {
        const { score } = calculateMatchScore(makeSpace({ city: 'Paris', type: 'popup', price_day: 1500, district: 'Marais', area_sqm: 80 }), prefs)
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      }
    })

    it('ajoute un pointsFort générique si score > 0 mais pas de pointsForts', () => {
      // Seul le quartier match — aucun pointsFort explicite dans ce chemin
      const result = calculateMatchScore(
        makeSpace({ district: 'Marais' }),
        makePrefs({ preferred_districts: JSON.stringify(['Marais']) })
      )
      expect(result.pointsForts.length).toBeGreaterThan(0)
    })
  })
})
