import { getMyBookings, getHostBookings } from '@/lib/queries/bookings'
import { getMyProfile } from '@/lib/queries/profile'
import BookingList from './BookingList'

export const revalidate = 0

export default async function ReservationsPage() {
  const profile = await getMyProfile()

  if (!profile) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card"
      >
        <p className="text-muted-foreground"
        >Impossible de charger vos réservations.</p>
      </div>
    )
  }

  const bookings =
    profile.role === 'brand'
      ? await getMyBookings()
      : await getHostBookings()

  const title =
    profile.role === 'brand'
      ? 'Mes réservations'
      : 'Réservations sur mes espaces'

  return (
    <div className="space-y-6"
    >
      <div
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground"
        >{title}
        </h1>
        <p className="mt-2 text-muted-foreground"
        >
          {bookings.length} réservation{bookings.length > 1 ? 's' : ''} au total
        </p>
      </div>

      <BookingList
        bookings={bookings}
        userRole={profile.role}
      />
    </div>
  )
}
