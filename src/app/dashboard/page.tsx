import { redirect }          from 'next/navigation'
import Image                  from 'next/image'
import Link                   from 'next/link'
import { getCurrentUser, getBookingsByUser } from '@/lib/queries/users'
import { BOOKING_STATUSES, SPACE_TYPES }     from '@/constants/spaces'
import type { BookingWithSpace }             from '@/types/spaces'

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:   { bg: '#E8610A', color: '#ffffff' },
  confirmed: { bg: '#2E7D32', color: '#ffffff' },
  cancelled: { bg: '#C62828', color: '#ffffff' },
}

function spaceTypeLabel(type: string) {
  return SPACE_TYPES.find((t) => t.value === type)?.label.toUpperCase() ?? type.toUpperCase()
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const bookings: BookingWithSpace[] = await getBookingsByUser(user.id).catch(() => [])

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: 'var(--font-bricolage)' }}
        >
          Notifications &amp; messages
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Suivez l&apos;état de vos demandes de réservation.
        </p>
      </div>

      {/* Stats — carte totale pleine largeur sur mobile, puis 2 côte à côte */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {[
          { label: 'Réservations totales',   value: stats.total,     active: true  },
          { label: 'Réservations en attente',value: stats.pending,   active: false },
          { label: 'Réservations confirmées',value: stats.confirmed, active: false },
        ].map(({ label, value, active }) => (
          <div
            key={label}
            className="rounded-2xl border p-4 sm:p-5"
            style={{
              background:  active ? '#D1E2FF' : '#ffffff',
              borderColor: active ? '#C7D2FE' : '#E5E7EB',
            }}
          >
            <div className="flex items-center gap-1.5 text-xs text-text-secondary sm:text-sm">
              <span style={{ color: '#4361EE' }}>✦</span>
              <span className="truncate">{label}</span>
            </div>
            <p
              className="mt-2 text-3xl font-bold sm:mt-3 sm:text-4xl"
              style={{ color: active ? '#0D58C6' : '#0A0A0A', fontFamily: 'var(--font-bricolage)' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Bookings list */}
      <div className="mt-10 sm:mt-12">
        <h2
          className="mb-4 text-base font-semibold text-foreground sm:mb-5 sm:text-lg"
          style={{ fontFamily: 'var(--font-bricolage)' }}
        >
          Vos dernières réservations
        </h2>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-text-muted">Vous n&apos;avez pas encore de réservation.</p>
            <Link href="/explorer" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Explorer les espaces →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.slice(0, 10).map((booking) => {
              const space  = booking.spaces
              const photo  = space?.space_photos?.[0]?.url
              const bStyle = STATUS_STYLE[booking.status] ?? STATUS_STYLE.pending

              return (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white sm:flex"
                >
                  {/* Photo */}
                  <div className="relative w-full sm:w-60 sm:shrink-0 lg:w-80">
                    <div className="relative aspect-video sm:aspect-auto sm:h-full" style={{ minHeight: '180px' }}>
                      {photo ? (
                        <Image
                          src={photo}
                          alt={space?.title ?? ''}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 240px, 320px"
                        />
                      ) : (
                        <div className="h-full bg-gray-100" />
                      )}
                      {space?.type && (
                        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                          {spaceTypeLabel(space.type)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-3 p-4 sm:p-6">

                    {/* Badge statut — pill aligné à gauche */}
                    <span
                      className="block w-full rounded-full px-3 py-2 text-center text-xs font-semibold sm:w-auto sm:self-start sm:py-1"
                      style={{ background: bStyle.bg, color: bStyle.color }}
                    >
                      {BOOKING_STATUSES[booking.status as keyof typeof BOOKING_STATUSES]}
                    </span>

                    {/* Titre + dates */}
                    <div>
                      <p className="font-semibold text-foreground leading-snug">
                        {space?.title ?? 'Espace'}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {booking.start_date} → {booking.end_date}
                      </p>
                    </div>

                    {/* Séparateur */}
                    <hr className="border-gray-100" />

                    {/* Détails */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                      {space?.area_sqm && <span>{space.area_sqm} m²</span>}
                      {space?.city && (
                        <span>{space.city}{space.district ? `, ${space.district}` : ''}</span>
                      )}
                      {space?.price_day && (
                        <span className="font-semibold text-foreground">
                          {space.price_day.toLocaleString('fr-FR')} €{' '}
                          <span className="text-xs font-normal text-text-secondary">/ JOUR</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
