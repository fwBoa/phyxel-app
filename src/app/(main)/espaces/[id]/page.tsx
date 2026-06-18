import { notFound }        from 'next/navigation'
import Image                from 'next/image'
import { MapPin, Maximize2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getSpaceById, hasBookingForSpace } from '@/lib/queries/spaces'
import { isSpaceFavorited } from '@/lib/queries/favorites'
import { getCurrentUser, getProfile }   from '@/lib/queries/users'
import { getBrandPreferences } from '@/lib/queries/preferences'
import { calculateMatchScore } from '@/lib/matching/score'
import BookingForm          from '@/components/features/BookingForm'
import FavoriteButton       from '@/components/ui/FavoriteButton'
import MatchWidget          from '@/components/features/MatchWidget'
import PhotoGallery         from '@/components/features/PhotoGallery'
import FeatureBadgeList     from '@/components/features/FeatureBadgeList'

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

  const user             = await getCurrentUser()
  const profile          = user ? await getProfile(user.id) : null
  const initialFavorited    = user ? await isSpaceFavorited(user.id, space.id) : false
  const hasExistingBooking  = user ? await hasBookingForSpace(user.id, space.id) : false

  const prefs     = user ? await getBrandPreferences(user.id) : null
  const idealDates = prefs?.ideal_dates ?? null
  let matchData = null
  if (prefs && profile?.brand_name) matchData = calculateMatchScore(space, prefs)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/explorer" className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#65677A' }}>
        <ArrowLeft size={16} />
        Retour
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

        {/* ── Colonne principale ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Galerie photos */}
          <div className="relative">
            <PhotoGallery photos={photos} spaceName={space.title} />
            {user && (
              <div className="absolute right-4 top-4 z-10">
                <FavoriteButton spaceId={space.id} initialFavorited={initialFavorited} variant="overlay" size="md" />
              </div>
            )}
          </div>

          {/* Badge dispo + prix */}
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              space.is_available
                ? 'bg-match-high/15 text-match-high'
                : 'bg-match-low/10 text-match-low'
            }`}>
              {space.is_available ? 'DISPONIBLE À VOS DATES' : 'INDISPONIBLE'}
            </span>
            {space.price_day && (
              <p className="text-xl font-bold text-foreground">
                {space.price_day.toLocaleString('fr-FR')} €
                <span className="ml-1 text-sm font-normal text-text-muted">/ jour</span>
              </p>
            )}
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-foreground">{space.title}</h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-border-custom px-3 py-1 text-sm text-foreground">
              {TYPE_LABELS[space.type] ?? space.type}
            </span>
            {space.area_sqm && (
              <span className="rounded-full border border-border-custom px-3 py-1 text-sm text-foreground">
                {space.area_sqm} m²
              </span>
            )}
            {(space.district || space.city) && (
              <span className="flex items-center gap-1 rounded-full border border-border-custom px-3 py-1 text-sm text-foreground">
                <MapPin size={12} />
                {space.district ? `${space.district}, ${space.city}` : space.city}
              </span>
            )}
          </div>

          {/* Description */}
          {space.description && (
            <div>
              <p className="text-sm leading-relaxed text-text-secondary">{space.description}</p>
            </div>
          )}

          {/* Services inclus */}
          {Array.isArray(space.included_services) && space.included_services.length > 0 && (
            <div className="mt-2">
              <h2 className="mb-4 text-base font-bold text-foreground">Services inclus</h2>
              <FeatureBadgeList items={space.included_services as { label: string; icon?: string }[]} />
            </div>
          )}

          {/* Équipements */}
          {Array.isArray(space.equipment) && space.equipment.length > 0 && (
            <div className="mt-2">
              <h2 className="mb-4 text-base font-bold text-foreground">Équipements</h2>
              <FeatureBadgeList items={space.equipment as { label: string; icon?: string }[]} />
            </div>
          )}

          {/* Conditions de location */}
          {space.rental_conditions && (
            <div className="mt-2">
              <h2 className="mb-3 text-base font-bold text-foreground">Conditions de location</h2>
              <p className="text-sm leading-relaxed text-text-secondary">{space.rental_conditions}</p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
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
            <BookingForm
              spaceId={space.id}
              isAvailable={space.is_available}
              priceDay={space.price_day}
              hasExistingBooking={hasExistingBooking}
              idealDates={idealDates}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
