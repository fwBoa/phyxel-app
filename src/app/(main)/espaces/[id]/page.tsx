import { notFound }        from 'next/navigation'
import Image                from 'next/image'
import { MapPin, Maximize2, Euro } from 'lucide-react'
import { getSpaceById }     from '@/lib/queries/spaces'
import { isSpaceFavorited } from '@/lib/queries/favorites'
import { getCurrentUser, getProfile }   from '@/lib/queries/users'
import { getBrandPreferences } from '@/lib/queries/preferences'
import { calculateMatchScore } from '@/lib/matching/score'
import BookingForm          from '@/components/features/BookingForm'
import FavoriteButton       from '@/components/ui/FavoriteButton'
import MatchWidget          from '@/components/features/MatchWidget'

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
  const profile         = user ? await getProfile(user.id) : null
  const initialFavorited = user ? await isSpaceFavorited(user.id, space.id) : false

  // Calcul du match
  let matchData = null
  if (user && profile?.brand_name) {
    const prefs = await getBrandPreferences(user.id)
    if (prefs) {
      matchData = calculateMatchScore(space, prefs)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

        {/* Colonne principale */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Photo principale */}
          <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-bg-secondary sm:h-96">
            {cover ? (
              <Image src={cover.url} alt={space.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-text-muted">
                <Maximize2 size={48} />
              </div>
            )}
          </div>

          {/* Galerie secondaire */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {gallery.slice(0, 3).map((photo) => (
                <div key={photo.id} className="relative h-28 overflow-hidden rounded-xl bg-bg-secondary">
                  <Image src={photo.url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Infos */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-muted px-3 py-1 text-sm font-medium text-primary">
                {TYPE_LABELS[space.type] ?? space.type}
              </span>
              {!space.is_available && (
                <span className="rounded-full bg-match-low/10 px-3 py-1 text-sm font-medium text-match-low">
                  Indisponible
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-bold text-foreground">{space.title}</h1>
              <FavoriteButton spaceId={space.id} initialFavorited={initialFavorited} />
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-secondary">
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
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Euro size={14} /> {space.price_day.toLocaleString('fr-FR')} / jour
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {space.description && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{space.description}</p>
            </div>
          )}
        </div>

        {/* Sidebar réservation */}
        <div className="flex flex-col gap-6">

          {matchData && matchData.score > 0 && (
            <MatchWidget 
              score={matchData.score}
              brandName={profile?.brand_name}
              pointsForts={matchData.pointsForts}
              pointsVigilance={matchData.pointsVigilance}
            />
          )}

          <div className="rounded-2xl border border-border-custom p-6 shadow-sm">
            {space.price_day && (
              <p className="text-2xl font-bold text-foreground">
                {space.price_day.toLocaleString('fr-FR')} €
                <span className="ml-1 text-base font-normal text-text-muted">/ jour</span>
              </p>
            )}
            <BookingForm spaceId={space.id} isAvailable={space.is_available} />
          </div>
        </div>

      </div>
    </div>
  )
}
