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
      <p className="mt-4 text-center text-sm text-[#EF4444]">
        Cet espace n&apos;est pas disponible à la réservation.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#6B6B6B]">Date d&apos;arrivée</label>
        <input
          type="date"
          required
          value={startDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-xl border border-[#E5E5E5] px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#6B6B6B]">Date de départ</label>
        <input
          type="date"
          required
          value={endDate}
          min={startDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-xl border border-[#E5E5E5] px-4 py-2.5 text-sm outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20"
        />
      </div>

      {message && (
        <p className={`rounded-xl p-3 text-sm ${
          message.type === 'success'
            ? 'bg-[#22C55E]/10 text-[#22C55E]'
            : 'bg-[#EF4444]/10 text-[#EF4444]'
        }`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-full bg-[#E91E8C] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B0156A] disabled:opacity-50"
      >
        <CalendarDays size={16} />
        {loading ? 'Envoi...' : 'Demander une réservation'}
      </button>
    </form>
  )
}
