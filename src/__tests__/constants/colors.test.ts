import { describe, it, expect } from 'vitest'
import { COLORS, TAILWIND_TOKENS } from '@/constants/colors'

describe('COLORS', () => {
  it('contient les couleurs de fond', () => {
    expect(COLORS.background.primary).toBe('#FFFFFF')
    expect(COLORS.background.secondary).toBe('#F9F9F9')
    expect(COLORS.background.dark).toBe('#0A0A0A')
  })

  it('contient la couleur brand principale', () => {
    expect(COLORS.brand.primary).toBe('#E91E8C')
    expect(COLORS.brand.dark).toBe('#B0156A')
  })

  it('les seuils de match sont bien définis', () => {
    expect(COLORS.match.high).toBe('#22C55E')
    expect(COLORS.match.medium).toBe('#F59E0B')
    expect(COLORS.match.low).toBe('#EF4444')
  })

  it('les couleurs de status sont présentes', () => {
    expect(COLORS.status.success).toBe('#22C55E')
    expect(COLORS.status.error).toBe('#EF4444')
    expect(COLORS.status.warning).toBe('#F59E0B')
    expect(COLORS.status.info).toBe('#3B82F6')
  })
})

describe('TAILWIND_TOKENS', () => {
  it('expose le token brand-primary', () => {
    expect(TAILWIND_TOKENS['brand-primary']).toBe(COLORS.brand.primary)
  })

  it('expose le token bg-secondary', () => {
    expect(TAILWIND_TOKENS['bg-secondary']).toBe(COLORS.background.secondary)
  })
})
