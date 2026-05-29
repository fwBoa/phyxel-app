'use client'

import { useState } from 'react'
import { CalendarDays } from 'lucide-react'

type BookingFormProps = {
  spaceId:     string
  isAvailable: boolean
}

export default function BookingForm({ spaceId, isAvailable }: BookingFormProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate,   setEndDate]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [message,   setMessage]   = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ space_id: spaceId, start_date: startDate, end_date: endDate }),
    })

    setLoading(false)
    if (res.ok) {
      setMessage({ type: 'success', text: 'Demande envoyée ! Vous recevrez une réponse sous 48h.' })
      setStartDate('')
      setEndDate('')
    } else {
      const { error } = await res.json()
      setMessage({ type: 'error', text: error ?? 'Une erreur est survenue.' })
    }
  }

  if (!isAvailable) {
    return (
      <p className="mt-4 text-center text-sm text-match-low">
        Cet espace n&apos;est pas disponible à la réservation.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-text-secondary">Date d&apos;arrivée</label>
        <input
          type="date"
          required
          value={startDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-text-secondary">Date de départ</label>
        <input
          type="date"
          required
          value={endDate}
          min={startDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {message && (
        <p className={`rounded-xl p-3 text-sm ${
          message.type === 'success'
            ? 'bg-match-high/10 text-match-high'
            : 'bg-match-low/10 text-match-low'
        }`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
      >
        <CalendarDays size={16} />
        {loading ? 'Envoi...' : 'Demander une réservation'}
      </button>
    </form>
  )
}
