import { redirect }         from 'next/navigation'
import Link                  from 'next/link'
import { getCurrentUser, getBookingsByUser } from '@/lib/queries/users'
import { BOOKING_STATUSES }  from '@/constants/spaces'
import { Euro, CalendarDays } from 'lucide-react'

export default async function ReservationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const bookings = await getBookingsByUser(user.id)

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-[#0A0A0A]">Mes réservations</h1>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-12 text-center">
          <CalendarDays className="mx-auto mb-3 text-[#9B9B9B]" size={32} />
          <p className="text-sm text-[#9B9B9B]">Aucune réservation pour l&apos;instant.</p>
          <Link
            href="/explorer"
            className="mt-3 inline-block text-sm font-semibold text-[#E91E8C] hover:text-[#B0156A]"
          >
            Explorer les espaces →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => {
            const space = (booking as { spaces?: { id: string; title: string; city: string; district: string | null } }).spaces
            const days  = Math.ceil(
              (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / 86400000
            )
            return (
              <div
                key={booking.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#0A0A0A]">{space?.title ?? 'Espace'}</p>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background: booking.status === 'confirmed' ? '#22C55E18' : booking.status === 'cancelled' ? '#EF444418' : '#F59E0B18',
                        color:      booking.status === 'confirmed' ? '#22C55E'   : booking.status === 'cancelled' ? '#EF4444'   : '#F59E0B',
                      }}
                    >
                      {BOOKING_STATUSES[booking.status]}
                    </span>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-[#6B6B6B]">
                    <CalendarDays size={14} />
                    {booking.start_date} → {booking.end_date}
                    <span className="text-[#9B9B9B]">({days} jour{days > 1 ? 's' : ''})</span>
                  </p>
                  {space?.city && (
                    <p className="text-xs text-[#9B9B9B]">{space.city}{space.district ? `, ${space.district}` : ''}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {booking.total_price && (
                    <p className="flex items-center gap-0.5 text-sm font-semibold text-[#0A0A0A]">
                      <Euro size={14} />
                      {booking.total_price.toLocaleString('fr-FR')}
                    </p>
                  )}
                  {space?.id && (
                    <Link
                      href={`/espaces/${space.id}`}
                      className="text-xs font-medium text-[#E91E8C] hover:text-[#B0156A]"
                    >
                      Voir l&apos;espace →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
