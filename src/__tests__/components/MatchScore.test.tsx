import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MatchScore from '@/components/ui/MatchScore'
import { COLORS } from '@/constants/colors'

describe('MatchScore', () => {
  it('affiche le score avec "%  match"', () => {
    render(<MatchScore score={91} />)
    expect(screen.getByText('91% match')).toBeInTheDocument()
  })

  it('utilise la couleur high pour un score ≥ 85', () => {
    const { container } = render(<MatchScore score={90} />)
    const span = container.querySelector('span')
    expect(span).toHaveStyle({ color: COLORS.match.high })
  })

  it('utilise la couleur medium pour un score entre 70 et 84', () => {
    const { container } = render(<MatchScore score={75} />)
    const span = container.querySelector('span')
    expect(span).toHaveStyle({ color: COLORS.match.medium })
  })

  it('utilise la couleur low pour un score < 70', () => {
    const { container } = render(<MatchScore score={60} />)
    const span = container.querySelector('span')
    expect(span).toHaveStyle({ color: COLORS.match.low })
  })

  it('applique les classes sm quand size="sm"', () => {
    const { container } = render(<MatchScore score={80} size="sm" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('text-xs')
  })

  it('applique les classes md par défaut', () => {
    const { container } = render(<MatchScore score={80} />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('text-sm')
  })

  it('fonctionne sur la frontière haute (score = 85)', () => {
    const { container } = render(<MatchScore score={85} />)
    const span = container.querySelector('span')
    expect(span).toHaveStyle({ color: COLORS.match.high })
  })

  it('fonctionne sur la frontière basse (score = 70)', () => {
    const { container } = render(<MatchScore score={70} />)
    const span = container.querySelector('span')
    expect(span).toHaveStyle({ color: COLORS.match.medium })
  })
})
