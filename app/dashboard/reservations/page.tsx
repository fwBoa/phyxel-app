'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}
const STATUS_LABELS: Record<string, string> = {
  pending:   'En attente', confirmed: 'Confirmé', cancelled: 'Annulé',
}

type BookingRow = {
  id: string
  start_date: string
  end_date: string
  status: string
  total_price: number | null
  spaces: { title: string; city: string; type: string } | null
}

export default function ReservationsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('bookings')
      .select('*, spaces(title, city, type)')
      .eq('brand_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBookings((data as BookingRow[]) ?? [])
        setLoading(false)
      })
  }, [user?.id])

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length:4}).map((_,i) => <div key={i} className="h-24 bg-white rounded-2xl" />)}</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#0A0A0A]">Mes réservations</h2>

      {!bookings.length ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center">
          <Calendar size={40} className="mx-auto text-[#9B9B9B] mb-3" />
          <p className="text-[#6B6B6B]">Aucune réservation pour le moment</p>
        </div>
      ) : (
        bookings.map(b => (
          <div key={b.id} className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-[#0A0A0A]">{b.spaces?.title ?? 'Espace'}</p>
                <div className="flex items-center gap-1 text-sm text-[#6B6B6B] mt-1">
                  <MapPin size={13} /> {b.spaces?.city}
                </div>
                <div className="flex items-center gap-1 text-sm text-[#6B6B6B] mt-1">
                  <Calendar size={13} />
                  {new Date(b.start_date).toLocaleDateString('fr-FR')} → {new Date(b.end_date).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="text-right">
                <Badge className={`text-xs border ${STATUS_STYLES[b.status]}`}>
                  {STATUS_LABELS[b.status]}
                </Badge>
                {b.total_price && (
                  <p className="text-sm font-bold text-[#0A0A0A] mt-2">
                    {b.total_price.toLocaleString('fr-FR')} €
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
