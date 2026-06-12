import { redirect }         from 'next/navigation'
import { getCurrentUser }    from '@/lib/queries/users'
import { getProfile }        from '@/lib/queries/users'
import { getBookingsByUser } from '@/lib/queries/users'
import { BOOKING_STATUSES }  from '@/constants/spaces'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [profile, bookings] = await Promise.all([
    getProfile(user.id),
    getBookingsByUser(user.id),
  ])

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Bonjour{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Voici un résumé de votre activité.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Réservations totales', value: stats.total,     color: '#0A0A0A' },
          { label: 'En attente',           value: stats.pending,   color: '#F59E0B' },
          { label: 'Confirmées',           value: stats.confirmed, color: '#22C55E' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-border-custom bg-white p-5">
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="mt-1 text-3xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Dernières réservations */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Dernières réservations</h2>
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-border-custom bg-white p-8 text-center">
            <p className="text-sm text-text-muted">Vous n&apos;avez pas encore de réservation.</p>
            <a
              href="/explorer"
              className="mt-3 inline-block text-sm font-semibold text-primary hover:text-[#5B21B6]"
            >
              Explorer les espaces →
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-2xl border border-border-custom bg-white px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {(booking as { spaces?: { title: string } }).spaces?.title ?? 'Espace'}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {booking.start_date} → {booking.end_date}
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: booking.status === 'confirmed' ? '#22C55E18' : booking.status === 'cancelled' ? '#EF444418' : '#F59E0B18',
                    color:      booking.status === 'confirmed' ? '#22C55E'   : booking.status === 'cancelled' ? '#EF4444'   : '#F59E0B',
                  }}
                >
                  {BOOKING_STATUSES[booking.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
