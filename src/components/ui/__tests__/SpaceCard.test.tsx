jest.mock('@/hooks/useFavorite', () => ({
  useFavorite: jest.fn().mockReturnValue({ isFavorited: false, userId: 'u1', ready: true, toggle: jest.fn() }),
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import SpaceCard from '@/components/ui/SpaceCard'

const baseProps = {
  id:          'space-1',
  title:       'Le Studio Marais',
  type:        'popup',
  city:        'Paris',
  isAvailable: true,
}

describe('<SpaceCard />', () => {
  it('affiche le titre de l\'espace', () => {
    render(<SpaceCard {...baseProps} />)
    expect(screen.getByRole('heading', { name: /Le Studio Marais/i })).toBeInTheDocument()
  })

  it('pointe vers la bonne URL de détail', () => {
    render(<SpaceCard {...baseProps} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/espaces/space-1')
  })

  it('affiche ville et district si fourni', () => {
    render(<SpaceCard {...baseProps} district="Le Marais" />)
    expect(screen.getByText('Paris, Le Marais')).toBeInTheDocument()
  })

  it('affiche uniquement la ville si district est null', () => {
    render(<SpaceCard {...baseProps} district={null} />)
    expect(screen.getByText('Paris')).toBeInTheDocument()
    expect(screen.queryByText(/,/)).not.toBeInTheDocument()
  })

  it('affiche la surface en m² si fournie', () => {
    render(<SpaceCard {...baseProps} areaSqm={80} />)
    expect(screen.getByText('80 m²')).toBeInTheDocument()
  })

  it('affiche le badge "Indisponible" si isAvailable=false', () => {
    render(<SpaceCard {...baseProps} isAvailable={false} />)
    expect(screen.getByText('Indisponible')).toBeInTheDocument()
  })

  it('applique la classe opacity-60 si isAvailable=false', () => {
    const { container } = render(<SpaceCard {...baseProps} isAvailable={false} />)
    expect(container.firstChild).toHaveClass('opacity-60')
  })

  it('affiche le badge match score si matchScore > 0', () => {
    render(<SpaceCard {...baseProps} matchScore={85} />)
    expect(screen.getByText('85% match')).toBeInTheDocument()
  })

  it('n\'affiche pas de badge match score si matchScore est null', () => {
    render(<SpaceCard {...baseProps} matchScore={null} />)
    expect(screen.queryByText(/match/)).not.toBeInTheDocument()
  })

  it('n\'affiche pas de badge match score si matchScore vaut 0', () => {
    render(<SpaceCard {...baseProps} matchScore={0} />)
    expect(screen.queryByText(/match/)).not.toBeInTheDocument()
  })

  it('affiche l\'image si coverUrl est fourni', () => {
    render(<SpaceCard {...baseProps} coverUrl="https://example.com/img.jpg" />)
    expect(screen.getByRole('img', { name: 'Le Studio Marais' })).toBeInTheDocument()
  })

  it('affiche le type formaté (popup → Pop-up) en badge', () => {
    render(<SpaceCard {...baseProps} />)
    expect(screen.getByText('Pop-up')).toBeInTheDocument()
  })
})
