import { redirect }          from 'next/navigation'
import Image                  from 'next/image'
import Link                   from 'next/link'
import { CalendarDays }       from 'lucide-react'
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

export default async function ReservationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const bookings: BookingWithSpace[] = await getBookingsByUser(user.id).catch(() => [])

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-foreground sm:text-3xl"
          style={{ fontFamily: 'var(--font-bricolage)' }}
        >
          Mes réservations
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          <span className="font-semibold text-foreground">{bookings.length}</span> réservation{bookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white py-20 text-center">
          <CalendarDays size={32} className="text-gray-300" />
          <p className="text-sm text-text-secondary">Aucune réservation pour l&apos;instant.</p>
          <Link
            href="/explorer"
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Explorer les espaces →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => {
            const space  = booking.spaces
            const photo  = space?.space_photos?.[0]?.url
            const bStyle = STATUS_STYLE[booking.status] ?? STATUS_STYLE.pending
            const days   = Math.ceil(
              (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / 86400000
            )

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
                  <span
                    className="block w-full rounded-full py-2 text-center text-xs font-semibold sm:w-auto sm:self-start sm:py-1 sm:px-3"
                    style={{ background: bStyle.bg, color: bStyle.color }}
                  >
                    {BOOKING_STATUSES[booking.status as keyof typeof BOOKING_STATUSES]}
                  </span>

                  <div>
                    <p className="font-semibold text-foreground">{space?.title ?? 'Espace'}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                      <CalendarDays size={13} />
                      {booking.start_date} → {booking.end_date}
                      <span className="text-text-muted">({days} jour{days > 1 ? 's' : ''})</span>
                    </p>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
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
                    {space?.id && (
                      <Link
                        href={`/espaces/${space.id}`}
                        className="text-xs font-medium text-primary hover:underline shrink-0"
                      >
                        Voir l&apos;espace →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
