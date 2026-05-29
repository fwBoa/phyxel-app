import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Maximize2 } from 'lucide-react'
import type { SpaceCardData } from '@/types/spaces'

const TYPE_LABELS: Record<string, string> = {
  showroom: 'Showroom',
  popup:    'Pop-up Store',
  corner:   'Corner',
  gallery:  'Espace Événementiel',
  boutique: 'Boutique Éphémère',
}

// Fonds pastels cycliques selon le type
const CARD_BG: Record<string, string> = {
  showroom: '#DDD6FE',
  popup:    '#FEF3C7',
  corner:   '#D1FAE5',
  gallery:  '#FCE7F3',
  boutique: '#CCFBF1',
}

const TYPE_BADGE_BG: Record<string, string> = {
  showroom: '#EDE9FE',
  popup:    '#FEF9C3',
  corner:   '#DCFCE7',
  gallery:  '#FCE7F3',
  boutique: '#CCFBF1',
}
const TYPE_BADGE_TEXT: Record<string, string> = {
  showroom: '#7C3AED',
  popup:    '#92400E',
  corner:   '#065F46',
  gallery:  '#9D174D',
  boutique: '#0F766E',
}

export function SpaceCard({ id, title, type, city, district, priceDay, areaSqm, matchScore, isAvailable, coverUrl }: SpaceCardData) {
  const bgColor = CARD_BG[type] ?? '#EDE9FE'
  const badgeBg = TYPE_BADGE_BG[type] ?? '#EDE9FE'
  const badgeText = TYPE_BADGE_TEXT[type] ?? '#7C3AED'

  return (
    <Link href={`/espaces/${id}`} className="group block bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-lg transition-shadow">
      {/* Image / placeholder pastel */}
      <div className="relative h-48 overflow-hidden" style={{ backgroundColor: bgColor }}>
        {coverUrl ? (
          <Image src={coverUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl border-2 border-white/60 bg-white/20" />
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Non disponible</span>
          </div>
        )}
        {/* Badge type */}
        <span
          className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ backgroundColor: badgeBg, color: badgeText }}
        >
          {TYPE_LABELS[type] ?? type}
        </span>
      </div>

      {/* Infos */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#0A0A0A] text-sm leading-snug">{title}</h3>
          {/* Match score badge */}
          <span className="shrink-0 text-[10px] font-bold text-white bg-[#7C3AED] px-2 py-0.5 rounded-full whitespace-nowrap">
            Match {matchScore}%
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-3">
          <MapPin size={11} className="shrink-0" />
          <span>{district ? `${district} · ` : ''}{city}</span>
        </div>

        {priceDay && (
          <p className="text-sm font-bold text-[#0A0A0A]">
            {priceDay.toLocaleString('fr-FR')} €{' '}
            <span className="text-xs font-normal text-[#6B7280]">/ jour</span>
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          {areaSqm && (
            <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <Maximize2 size={11} /> {areaSqm} m²
            </span>
          )}
          {isAvailable && (
            <span className="flex items-center gap-1 text-xs text-[#22C55E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Dispo
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
