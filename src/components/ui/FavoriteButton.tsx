'use client'

import { Heart } from 'lucide-react'
import { useFavorite } from '@/hooks/useFavorite'

type Props = {
  spaceId:          string
  initialFavorited?: boolean
  size?:            'sm' | 'md'
  /** overlay = cercle blanc semi-transparent pour les cards, standalone = bouton pill */
  variant?:         'overlay' | 'standalone'
}

export default function FavoriteButton({
  spaceId,
  initialFavorited = false,
  size    = 'md',
  variant = 'standalone',
}: Props) {
  const { isFavorited, userId, ready, toggle } = useFavorite(spaceId, initialFavorited)

  // Ne rien afficher si non connecté ou en cours de chargement
  if (!ready || !userId) return null

  const iconSize = size === 'sm' ? 16 : 20

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggle()
  }

  if (variant === 'overlay') {
    return (
      <button
        onClick={handleClick}
        aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-transform active:scale-90 hover:scale-110"
      >
        <Heart
          size={iconSize}
          className={`transition-all duration-150 ${
            isFavorited
              ? 'fill-[#E91E8C] stroke-[#E91E8C]'
              : 'stroke-[#6B6B6B] fill-transparent'
          }`}
        />
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
        isFavorited
          ? 'border-[#E91E8C] bg-[#FDE8F4] text-[#E91E8C]'
          : 'border-[#E5E5E5] bg-white text-[#6B6B6B] hover:border-[#E91E8C] hover:text-[#E91E8C]'
      }`}
    >
      <Heart
        size={iconSize}
        className={`transition-all duration-150 ${
          isFavorited ? 'fill-[#E91E8C] stroke-[#E91E8C]' : 'fill-transparent'
        }`}
      />
      {isFavorited ? 'Sauvegardé' : 'Sauvegarder'}
    </button>
  )
}
