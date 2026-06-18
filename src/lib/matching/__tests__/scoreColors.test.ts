import { getMatchColor } from '@/lib/matching/scoreColors'

describe('getMatchColor()', () => {
  it('returns var(--color-match-high) for score >= 85', () => {
    expect(getMatchColor(90)).toBe('var(--color-match-high)')
  })

  it('returns var(--color-match-high) at exact boundary 85', () => {
    expect(getMatchColor(85)).toBe('var(--color-match-high)')
  })

  it('returns var(--color-match-high) for score 100', () => {
    expect(getMatchColor(100)).toBe('var(--color-match-high)')
  })

  it('returns var(--color-match-medium) for score 70', () => {
    expect(getMatchColor(70)).toBe('var(--color-match-medium)')
  })

  it('returns var(--color-match-medium) for score 84 (just below high threshold)', () => {
    expect(getMatchColor(84)).toBe('var(--color-match-medium)')
  })

  it('returns var(--color-match-low) for score 69 (just below medium threshold)', () => {
    expect(getMatchColor(69)).toBe('var(--color-match-low)')
  })

  it('returns var(--color-match-low) for score 0', () => {
    expect(getMatchColor(0)).toBe('var(--color-match-low)')
  })

  it('returns var(--color-match-low) for score 50', () => {
    expect(getMatchColor(50)).toBe('var(--color-match-low)')
  })
})
