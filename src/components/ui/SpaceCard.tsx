import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Maximize2, Euro } from 'lucide-react'
import MatchScore from './MatchScore'
import FavoriteButton from './FavoriteButton'

type SpaceCardProps = {
  id:          string
  title:       string
  type:        string
  city:        string
  district?:   string | null
  priceDay?:   number | null
  areaSqm?:    number | null
  matchScore?: number
  isAvailable: boolean
  coverUrl?:   string | null
}

const TYPE_LABELS: Record<string, string> = {
  showroom: 'Showroom',
  popup:    'Pop-up',
  corner:   'Corner',
  gallery:  'Galerie',
  boutique: 'Boutique',
}

export default function SpaceCard({
  id, title, type, city, district, priceDay, areaSqm, matchScore, isAvailable, coverUrl,
}: SpaceCardProps) {
  return (
    <Link
      href={`/espaces/${id}`}
      aria-label={`${title} — ${TYPE_LABELS[type] ?? type}, ${city}${district ? `, ${district}` : ''}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white transition-shadow hover:shadow-lg ${
        !isAvailable ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      {/* Photo */}
      <div className="relative h-48 w-full overflow-hidden bg-[#F9F9F9]">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#9B9B9B]">
            <Maximize2 size={32} />
          </div>
        )}
        {/* Badge type */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0A0A0A] backdrop-blur-sm">
          {TYPE_LABELS[type] ?? type}
        </span>
        {/* Bouton favori */}
        {isAvailable && (
          <div className="absolute right-3 top-3">
            <FavoriteButton spaceId={id} size="sm" variant="overlay" />
          </div>
        )}
        {/* Badge disponibilité */}
        {!isAvailable && (
          <span className="absolute right-3 top-3 rounded-full bg-[#EF4444]/10 px-2 py-1 text-xs font-medium text-[#EF4444]">
            Indisponible
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-[#0A0A0A] leading-snug line-clamp-2">
            {title}
          </h3>
          {matchScore !== undefined && <MatchScore score={matchScore} size="sm" />}
        </div>

        <p className="flex items-center gap-1 text-sm text-[#6B6B6B]">
          <MapPin size={14} className="shrink-0" />
          {city}{district ? `, ${district}` : ''}
        </p>

        {(areaSqm || priceDay) && (
          <div className="mt-auto flex items-center justify-between border-t border-[#E5E5E5] pt-3">
            {areaSqm && (
              <span className="text-sm text-[#6B6B6B]">{areaSqm} m²</span>
            )}
            {priceDay && (
              <span className="flex items-center gap-0.5 text-sm font-semibold text-[#0A0A0A]">
                <Euro size={14} />
                {priceDay.toLocaleString('fr-FR')} / jour
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
