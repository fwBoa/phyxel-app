jest.mock('@/hooks/useFavorite')

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FavoriteButton from '@/components/ui/FavoriteButton'
import { useFavorite } from '@/hooks/useFavorite'

const mockToggle = jest.fn()

describe('<FavoriteButton />', () => {
  describe('non connecté ou en chargement', () => {
    it('ne rend rien (null) si ready=false', () => {
      ;(useFavorite as jest.Mock).mockReturnValue({ isFavorited: false, userId: null, ready: false, toggle: mockToggle })
      const { container } = render(<FavoriteButton spaceId="s1" />)
      expect(container).toBeEmptyDOMElement()
    })

    it('ne rend rien si ready=true mais userId=null (non connecté)', () => {
      ;(useFavorite as jest.Mock).mockReturnValue({ isFavorited: false, userId: null, ready: true, toggle: mockToggle })
      const { container } = render(<FavoriteButton spaceId="s1" />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('utilisateur connecté — variant standalone (défaut)', () => {
    beforeEach(() => {
      ;(useFavorite as jest.Mock).mockReturnValue({ isFavorited: false, userId: 'u1', ready: true, toggle: mockToggle })
    })

    it('affiche le texte "Sauvegarder" si non favori', () => {
      render(<FavoriteButton spaceId="s1" />)
      expect(screen.getByText('Sauvegarder')).toBeInTheDocument()
    })

    it('a l\'aria-label "Ajouter aux favoris" si non favori', () => {
      render(<FavoriteButton spaceId="s1" />)
      expect(screen.getByRole('button', { name: /Ajouter aux favoris/i })).toBeInTheDocument()
    })

    it('affiche le texte "Sauvegardé" si favori', () => {
      ;(useFavorite as jest.Mock).mockReturnValue({ isFavorited: true, userId: 'u1', ready: true, toggle: mockToggle })
      render(<FavoriteButton spaceId="s1" />)
      expect(screen.getByText('Sauvegardé')).toBeInTheDocument()
    })

    it('appelle toggle() au clic', async () => {
      const user = userEvent.setup()
      render(<FavoriteButton spaceId="s1" />)
      await user.click(screen.getByRole('button'))
      expect(mockToggle).toHaveBeenCalledTimes(1)
    })

    it('stopPropagation au clic — le parent ne reçoit pas l\'event', async () => {
      const parentHandler = jest.fn()
      const user = userEvent.setup()
      render(
        <div onClick={parentHandler}>
          <FavoriteButton spaceId="s1" />
        </div>
      )
      await user.click(screen.getByRole('button'))
      expect(parentHandler).not.toHaveBeenCalled()
    })
  })

  describe('variant overlay', () => {
    it('rend un bouton circulaire sans texte', () => {
      ;(useFavorite as jest.Mock).mockReturnValue({ isFavorited: false, userId: 'u1', ready: true, toggle: mockToggle })
      const { container } = render(<FavoriteButton spaceId="s1" variant="overlay" />)
      expect(container.firstChild).toHaveClass('rounded-full')
      expect(screen.queryByText('Sauvegarder')).not.toBeInTheDocument()
    })
  })
})
