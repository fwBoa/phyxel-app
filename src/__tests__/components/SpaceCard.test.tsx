import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SpaceCard from '@/components/ui/SpaceCard'

// Mock FavoriteButton (dépend de Supabase)
vi.mock('@/components/ui/FavoriteButton', () => ({
  default: () => <button aria-label="favori" />,
}))

const baseProps = {
  id:          'space-1',
  title:       'Loft Haussmann',
  type:        'showroom',
  city:        'Paris',
  district:    '9e',
  priceDay:    1200,
  areaSqm:     80,
  matchScore:  91,
  isAvailable: true,
  coverUrl:    null,
}

describe('SpaceCard', () => {
  it('affiche le titre', () => {
    render(<SpaceCard {...baseProps} />)
    expect(screen.getByText('Loft Haussmann')).toBeInTheDocument()
  })

  it('affiche la ville et le district', () => {
    render(<SpaceCard {...baseProps} />)
    expect(screen.getByText(/Paris/)).toBeInTheDocument()
    expect(screen.getByText(/9e/)).toBeInTheDocument()
  })

  it('affiche le badge type "Showroom"', () => {
    render(<SpaceCard {...baseProps} />)
    expect(screen.getByText('Showroom')).toBeInTheDocument()
  })

  it('affiche le prix par jour', () => {
    render(<SpaceCard {...baseProps} />)
    expect(screen.getByText(/1\s*200/)).toBeInTheDocument()
  })

  it('affiche la surface en m²', () => {
    render(<SpaceCard {...baseProps} />)
    expect(screen.getByText(/80 m²/)).toBeInTheDocument()
  })

  it('affiche le match score', () => {
    render(<SpaceCard {...baseProps} />)
    expect(screen.getByText(/91%/)).toBeInTheDocument()
  })

  it('crée un lien vers la fiche espace', () => {
    render(<SpaceCard {...baseProps} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/espaces/space-1')
  })

  it('est désactivé quand isAvailable = false', () => {
    render(<SpaceCard {...baseProps} isAvailable={false} />)
    const link = screen.getByRole('link')
    expect(link.className).toContain('pointer-events-none')
    expect(screen.getByText('Indisponible')).toBeInTheDocument()
  })

  it('affiche le placeholder quand coverUrl est null', () => {
    render(<SpaceCard {...baseProps} coverUrl={null} />)
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('affiche l\'image quand coverUrl est défini', () => {
    render(<SpaceCard {...baseProps} coverUrl="https://images.unsplash.com/photo-123" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://images.unsplash.com/photo-123')
  })

  it('n\'affiche pas le match score quand undefined', () => {
    render(<SpaceCard {...baseProps} matchScore={undefined} />)
    expect(screen.queryByText(/match/)).toBeNull()
  })

  it('fonctionne sans district', () => {
    render(<SpaceCard {...baseProps} district={null} />)
    expect(screen.getByText('Paris')).toBeInTheDocument()
  })

  it('fonctionne sans prix ni surface', () => {
    render(<SpaceCard {...baseProps} priceDay={null} areaSqm={null} />)
    expect(screen.queryByText(/jour/)).toBeNull()
    expect(screen.queryByText(/m²/)).toBeNull()
  })
})
