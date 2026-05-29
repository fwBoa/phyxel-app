import { getMyBookings } from '@/lib/queries/bookings'
import BookingList from './BookingList'

export const revalidate = 0

export default async function ReservationsPage() {
  const bookings = await getMyBookings()

  return (
    <div className="space-y-6"
    >
      <div
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground"
        >Mes réservations
        </h1>
        <p className="mt-2 text-muted-foreground"
        >
          {bookings.length} réservation{bookings.length > 1 ? 's' : ''} au total
        </p>
      </div>

      <BookingList bookings={bookings} />
    </div>
  )
}
