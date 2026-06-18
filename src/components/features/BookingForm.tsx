'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, RotateCcw } from 'lucide-react'

const SERVICE_FEE_RATE = 0.15

type BookingFormProps = {
  spaceId:     string
  isAvailable: boolean
  priceDay?:   number | null
}

function diffDays(start: string, end: string): number {
  const a = new Date(start).getTime()
  const b = new Date(end).getTime()
  return Math.max(0, Math.round((b - a) / 86400000))
}

function fmt(n: number) {
  return n.toLocaleString('fr-FR')
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function BookingForm({ spaceId, isAvailable, priceDay }: BookingFormProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate,   setEndDate]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const router = useRouter()

  const recap = useMemo(() => {
    if (!startDate || !endDate || !priceDay) return null
    const days = diffDays(startDate, endDate)
    if (days <= 0) return null
    const base = priceDay * days
    const fee  = Math.round(base * SERVICE_FEE_RATE)
    return { days, base, fee, total: base + fee }
  }, [startDate, endDate, priceDay])

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ space_id: spaceId, start_date: startDate, end_date: endDate }),
      })
      if (res.ok) {
        router.push('/reservation-confirmee')
      } else {
        const { error: msg } = await res.json()
        setError(msg ?? 'Une erreur est survenue.')
      }
    } catch {
      setError('Impossible de contacter le serveur. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Inputs dates — masqués quand les deux sont renseignées */}
      {!recap && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="bf-start" className="text-xs font-medium text-text-secondary">Date d&apos;arrivée</label>
            <input
              id="bf-start"
              type="date"
              required
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="bf-end" className="text-xs font-medium text-text-secondary">Date de départ</label>
            <input
              id="bf-end"
              type="date"
              required
              value={endDate}
              min={startDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </>
      )}

      {/* Récapitulatif */}
      {recap && (
        <div className="flex flex-col gap-2 border-t border-border-custom pt-4">
          <h4 className="text-sm font-semibold text-foreground">Récapitulatif</h4>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Dates</span>
            <span>{fmtDate(startDate)} au {fmtDate(endDate)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>{fmt(priceDay!)} € × {recap.days} jour{recap.days > 1 ? 's' : ''}</span>
            <span>{fmt(recap.base)} €</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Frais de service Phyxel (15%)</span>
            <span>{fmt(recap.fee)} €</span>
          </div>
          <div className="flex justify-between border-t border-border-custom pt-2 text-sm font-bold text-foreground">
            <span>Total</span>
            <span>{fmt(recap.total)} €</span>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-xl bg-match-low/10 p-3 text-sm text-match-low">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2"
      >
        {loading ? 'Envoi...' : 'Demander une réservation'}
        {!loading && <ArrowRight size={16} />}
      </button>

      {(startDate || endDate) && (
        <button
          type="button"
          onClick={() => { setStartDate(''); setEndDate('') }}
          className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
        >
          <RotateCcw size={14} />
          Modifier les dates
        </button>
      )}
    </form>
  )
}
