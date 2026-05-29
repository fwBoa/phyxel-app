import { describe, it, expect } from 'vitest'
import { SPACE_TYPES, CITIES } from '@/constants/spaces'

describe('SPACE_TYPES', () => {
  it('contient les 5 types attendus', () => {
    const values = SPACE_TYPES.map(t => t.value)
    expect(values).toContain('showroom')
    expect(values).toContain('popup')
    expect(values).toContain('corner')
    expect(values).toContain('gallery')
    expect(values).toContain('boutique')
    expect(SPACE_TYPES).toHaveLength(5)
  })

  it('chaque type a un label non vide', () => {
    SPACE_TYPES.forEach(t => {
      expect(t.label).toBeTruthy()
      expect(typeof t.label).toBe('string')
    })
  })
})

describe('CITIES', () => {
  it('contient Paris', () => {
    expect(CITIES).toContain('Paris')
  })

  it('contient au moins 5 villes', () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(5)
  })

  it('toutes les villes sont des chaînes non vides', () => {
    CITIES.forEach(city => {
      expect(typeof city).toBe('string')
      expect(city.length).toBeGreaterThan(0)
    })
  })
})
