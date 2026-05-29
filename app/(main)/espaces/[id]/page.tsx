export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Maximize2, Euro, ArrowLeft, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MatchScore } from '@/components/ui/MatchScore'
import { getSpaceById } from '@/lib/queries/spaces'
import { BookingForm } from './BookingForm'

const TYPE_LABELS: Record<string, string> = {
  showroom: 'Showroom', popup: 'Pop-up store', corner: 'Corner',
  gallery: 'Galerie', boutique: 'Boutique',
}

type Props = { params: Promise<{ id: string }> }

export default async function SpacePage({ params }: Props) {
  const { id } = await params
  const { data: rawSpace, error } = await getSpaceById(id)

  if (error || !rawSpace) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const space = rawSpace as any
  const cover = space.space_photos?.find((p: { is_cover: boolean }) => p.is_cover) ?? space.space_photos?.[0]
  const gallery: { id: string; url: string }[] = space.space_photos?.slice(0, 5) ?? []

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#E91E8C] mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour aux espaces
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-[#F9F9F9]">
              {cover?.url ? (
                <Image src={cover.url} alt={space.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FDE8F4] to-[#F9F9F9]">
                  <span className="text-6xl">🏪</span>
                </div>
              )}
              <Badge className="absolute top-4 left-4 bg-white/90 text-[#0A0A0A] border-0">
                {TYPE_LABELS[space.type] ?? space.type}
              </Badge>
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {gallery.slice(1).map(photo => (
                  <div key={photo.id} className="relative h-20 rounded-xl overflow-hidden">
                    <Image src={photo.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
              <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">{space.title}</h1>
              <div className="flex items-center gap-1 text-[#6B6B6B] text-sm mb-4">
                <MapPin size={14} />
                <span>{space.district ? `${space.district}, ` : ''}{space.city}</span>
              </div>
              <MatchScore score={85} />

              {space.description && (
                <p className="mt-6 text-[#6B6B6B] leading-relaxed">{space.description}</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E5E5E5]">
                {space.area_sqm && (
                  <div className="text-center p-3 bg-[#F9F9F9] rounded-xl">
                    <Maximize2 size={18} className="mx-auto mb-1 text-[#E91E8C]" />
                    <div className="text-lg font-bold">{space.area_sqm} m²</div>
                    <div className="text-xs text-[#9B9B9B]">Surface</div>
                  </div>
                )}
                {space.price_day && (
                  <div className="text-center p-3 bg-[#F9F9F9] rounded-xl">
                    <Euro size={18} className="mx-auto mb-1 text-[#E91E8C]" />
                    <div className="text-lg font-bold">{space.price_day.toLocaleString('fr-FR')} €</div>
                    <div className="text-xs text-[#9B9B9B]">Par jour</div>
                  </div>
                )}
                <div className="text-center p-3 bg-[#F9F9F9] rounded-xl">
                  <Calendar size={18} className="mx-auto mb-1 text-[#E91E8C]" />
                  <div className="text-lg font-bold">{space.is_available ? 'Dispo' : 'Indispo'}</div>
                  <div className="text-xs text-[#9B9B9B]">Disponibilité</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingForm spaceId={space.id} priceDay={space.price_day} />
          </div>
        </div>
      </div>
    </div>
  )
}
