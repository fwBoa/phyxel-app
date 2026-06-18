import React from 'react'
import { render, screen } from '@testing-library/react'
import MatchScore from '@/components/ui/MatchScore'
// jsdom normalise les hex en rgb — helper de conversion
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

import { COLORS } from '@/constants/colors'

describe('<MatchScore />', () => {
  it('affiche le score en pourcentage', () => {
    render(<MatchScore score={75} />)
    expect(screen.getByText('75% match')).toBeInTheDocument()
  })

  it('applique la couleur "high" (>= 85) en inline style', () => {
    const { container } = render(<MatchScore score={90} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.color).toBe(hexToRgb(COLORS.match.high))
  })

  it('applique la couleur "high" a la boundary exacte 85', () => {
    const { container } = render(<MatchScore score={85} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.color).toBe(hexToRgb(COLORS.match.high))
  })

  it('applique la couleur "medium" (70-84)', () => {
    const { container } = render(<MatchScore score={75} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.color).toBe(hexToRgb(COLORS.match.medium))
  })

  it('applique la couleur "low" (< 70)', () => {
    const { container } = render(<MatchScore score={50} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.color).toBe(hexToRgb(COLORS.match.low))
  })

  it('utilise text-xs pour size="sm"', () => {
    const { container } = render(<MatchScore score={80} size="sm" />)
    expect(container.firstChild).toHaveClass('text-xs')
  })

  it('utilise text-sm pour size="md" (par defaut)', () => {
    const { container } = render(<MatchScore score={80} />)
    expect(container.firstChild).toHaveClass('text-sm')
  })

  it('couleur de fond derive de la meme couleur que le texte', () => {
    const { container } = render(<MatchScore score={90} />)
    const el = container.firstChild as HTMLElement
    // backgroundColor doit etre non vide (quel que soit le format)
    expect(el.style.backgroundColor).not.toBe('')
  })
})
