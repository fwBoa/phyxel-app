'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { BookingWithSpace } from '@/lib/queries/bookings'
import { cancelBooking } from './actions'

interface BookingListProps {
  bookings: BookingWithSpace[]
}

function statusLabel(status: string) {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'confirmed':
      return 'Confirmée'
    case 'cancelled':
      return 'Annulée'
    default:
      return status
  }
}

function statusClasses(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-warning/10 text-warning'
    case 'confirmed':
      return 'bg-success/10 text-success'
    case 'cancelled':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export default function BookingList({ bookings }: BookingListProps) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'All' | 'pending' | 'confirmed' | 'cancelled'>('All')

  const filtered =
    filter === 'All'
      ? bookings
      : bookings.filter((b) => b.status === filter)

  async function handleCancel(id: string) {
    setMessage('')
    setError('')
    const result = await cancelBooking(id)
    if (result.error) setError(result.error)
    if (result.success) {
      setMessage(result.success)
      // Refresh page to show updated status
      window.location.reload()
    }
  }


  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-card"
      >
        <p className="text-muted-foreground"
        >Aucune réservation pour le moment.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Explorer les espaces →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4"
    >
      {/* Filters */}
      <div className="flex flex-wrap gap-2"
      >
        {(['All', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
              filter === f
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-foreground border-border hover:border-foreground'
            }`}
          >
            {f === 'All' ? 'Toutes' : statusLabel(f)}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive"
        >{error}
        </p>
      )}
      {message && (
        <p className="text-sm text-success"
        >{message}
        </p>
      )}

      <div className="space-y-3"
      >
        {filtered.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1"
            >
              <Link
                href={`/espaces/${booking.space?.id || ''}`}
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {booking.space?.title || 'Espace inconnu'}
              </Link>
              <p className="text-sm text-muted-foreground"
              >
                {booking.space?.district
                  ? `${booking.space.district}, ${booking.space.city}`
                  : booking.space?.city}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground"
              >
                <span>
                  Du{' '}
                  <strong className="text-foreground"
                  >
                    {new Date(booking.start_date).toLocaleDateString('fr-FR')}
                  </strong>
                </span>
                <span>
                  au{' '}
                  <strong className="text-foreground"
                  >
                    {new Date(booking.end_date).toLocaleDateString('fr-FR')}
                  </strong>
                </span>
                {booking.total_price && (
                  <span>
                    ·{' '}
                    <strong className="text-foreground"
                    >
                      {booking.total_price.toLocaleString('fr-FR')} €
                    </strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3"
            >
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(
                  booking.status
                )}`}
              >
                {statusLabel(booking.status)}
              </span>

              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="text-xs text-destructive hover:underline"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
