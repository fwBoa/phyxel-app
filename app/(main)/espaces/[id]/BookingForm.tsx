'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

type Props = { spaceId: string; priceDay: number | null }

export function BookingForm({ spaceId, priceDay }: Props) {
  const { user } = useAuth()
  const router = useRouter()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const nights = startDate && endDate
    ? Math.max(0, (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
    : 0

  const total = priceDay && nights ? priceDay * nights : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/login'); return }
    if (!startDate || !endDate) { setError('Sélectionnez des dates'); return }
    setLoading(true); setError('')

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase.from('bookings') as any).insert({
      space_id:    spaceId,
      brand_id:    user.id,
      start_date:  startDate,
      end_date:    endDate,
      total_price: total ?? undefined,
      status:      'pending',
    })

    if (err) setError(err.message)
    else setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-bold text-lg text-[#0A0A0A]">Réservation envoyée !</h3>
        <p className="text-[#6B6B6B] text-sm mt-2">Le propriétaire va confirmer votre demande.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] sticky top-24">
      <h2 className="font-bold text-lg text-[#0A0A0A] mb-1">Réserver cet espace</h2>
      {priceDay && (
        <p className="text-[#E91E8C] font-semibold text-lg mb-4">
          {priceDay.toLocaleString('fr-FR')} €<span className="text-[#9B9B9B] font-normal text-sm"> / jour</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1">Date de début</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1">Date de fin</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split('T')[0]}
            className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors"
          />
        </div>

        {total && (
          <div className="bg-[#F9F9F9] rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#6B6B6B]">
              <span>{priceDay?.toLocaleString('fr-FR')} € × {nights} jour{nights > 1 ? 's' : ''}</span>
              <span>{total.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between font-bold text-[#0A0A0A] pt-2 border-t border-[#E5E5E5]">
              <span>Total</span><span>{total.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#E91E8C] hover:bg-[#B0156A] text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? 'Envoi...' : user ? 'Demander la réservation' : 'Se connecter pour réserver'}
        </button>
      </form>
    </div>
  )
}
