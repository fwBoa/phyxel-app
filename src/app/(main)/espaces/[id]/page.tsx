import { notFound }        from 'next/navigation'
import Image                from 'next/image'
import { MapPin, Maximize2, Euro, CalendarDays } from 'lucide-react'
import { getSpaceById }     from '@/lib/queries/spaces'
import { isSpaceFavorited } from '@/lib/queries/favorites'
import { getCurrentUser }   from '@/lib/queries/users'
import MatchScore           from '@/components/ui/MatchScore'
import BookingForm          from '@/components/features/BookingForm'
import FavoriteButton       from '@/components/ui/FavoriteButton'

type PageProps = { params: Promise<{ id: string }> }

const TYPE_LABELS: Record<string, string> = {
  showroom: 'Showroom', popup: 'Pop-up', corner: 'Corner',
  gallery: 'Galerie',   boutique: 'Boutique',
}

export default async function SpaceDetailPage({ params }: PageProps) {
  const { id }  = await params
  const space   = await getSpaceById(id)
  if (!space) notFound()

  const photos  = space.space_photos ?? []
  const cover   = photos.find((p) => p.is_cover) ?? photos[0]
  const gallery = photos.filter((p) => p !== cover)

  const user            = await getCurrentUser()
  const initialFavorited = user ? await isSpaceFavorited(user.id, space.id) : false

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

        {/* Colonne principale */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Photo principale */}
          <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-[#F9F9F9] sm:h-96">
            {cover ? (
              <Image src={cover.url} alt={space.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[#9B9B9B]">
                <Maximize2 size={48} />
              </div>
            )}
          </div>

          {/* Galerie secondaire */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {gallery.slice(0, 3).map((photo) => (
                <div key={photo.id} className="relative h-28 overflow-hidden rounded-xl bg-[#F9F9F9]">
                  <Image src={photo.url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Infos */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#FDE8F4] px-3 py-1 text-sm font-medium text-[#E91E8C]">
                {TYPE_LABELS[space.type] ?? space.type}
              </span>
              {!space.is_available && (
                <span className="rounded-full bg-[#EF4444]/10 px-3 py-1 text-sm font-medium text-[#EF4444]">
                  Indisponible
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-bold text-[#0A0A0A]">{space.title}</h1>
              <FavoriteButton spaceId={space.id} initialFavorited={initialFavorited} />
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#6B6B6B]">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {space.city}{space.district ? `, ${space.district}` : ''}
              </span>
              {space.area_sqm && (
                <span className="flex items-center gap-1">
                  <Maximize2 size={14} /> {space.area_sqm} m²
                </span>
              )}
              {space.price_day && (
                <span className="flex items-center gap-1 font-semibold text-[#0A0A0A]">
                  <Euro size={14} /> {space.price_day.toLocaleString('fr-FR')} / jour
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {space.description && (
            <div>
              <h2 className="text-lg font-semibold text-[#0A0A0A]">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6B6B6B]">{space.description}</p>
            </div>
          )}
        </div>

        {/* Sidebar réservation */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-[#E5E5E5] p-6 shadow-sm">
            {space.price_day && (
              <p className="text-2xl font-bold text-[#0A0A0A]">
                {space.price_day.toLocaleString('fr-FR')} €
                <span className="ml-1 text-base font-normal text-[#9B9B9B]">/ jour</span>
              </p>
            )}
            <BookingForm spaceId={space.id} isAvailable={space.is_available} />
          </div>
        </div>

      </div>
    </div>
  )
}
