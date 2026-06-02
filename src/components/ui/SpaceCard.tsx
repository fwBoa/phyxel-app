import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Maximize2, Euro } from 'lucide-react'
import FavoriteButton from './FavoriteButton'

type SpaceCardProps = {
  id:          string
  title:       string
  type:        string
  city:        string
  district?:   string | null
  priceDay?:   number | null
  areaSqm?:    number | null
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
  id, title, type, city, district, priceDay, areaSqm, isAvailable, coverUrl,
}: SpaceCardProps) {
  return (
    <Link
      href={`/espaces/${id}`}
      aria-label={`${title} — ${TYPE_LABELS[type] ?? type}, ${city}${district ? `, ${district}` : ''}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border-custom bg-white transition-shadow hover:shadow-lg ${
        !isAvailable ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      {/* Photo */}
      <div className="relative h-48 w-full overflow-hidden bg-bg-secondary">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <Maximize2 size={32} />
          </div>
        )}
        {/* Badge type */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
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
          <span className="absolute right-3 top-3 rounded-full bg-match-low/10 px-2 py-1 text-xs font-medium text-match-low">
            Indisponible
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2">
          {title}
        </h3>

        <p className="flex items-center gap-1 text-sm text-text-secondary">
          <MapPin size={14} className="shrink-0" />
          {city}{district ? `, ${district}` : ''}
        </p>

        {(areaSqm || priceDay) && (
          <div className="mt-auto flex items-center justify-between border-t border-border-custom pt-3">
            {areaSqm && (
              <span className="text-sm text-text-secondary">{areaSqm} m²</span>
            )}
            {priceDay && (
              <span className="flex items-center gap-0.5 text-sm font-semibold text-foreground">
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
