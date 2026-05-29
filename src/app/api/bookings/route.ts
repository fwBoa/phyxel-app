import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { BookingInsert } from '@/types/spaces'
import type { SpaceRow }      from '@/types/database'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data, error } = await supabase
    .from('bookings')
    .select('*, spaces(*, space_photos(*))')
    .eq('brand_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { space_id, start_date, end_date } = await request.json()
  if (!space_id || !start_date || !end_date)
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })

  // Calcul du prix total
  const { data: space } = await supabase
    .from('spaces')
    .select('price_day')
    .eq('id', space_id)
    .single() as { data: Pick<SpaceRow, 'price_day'> | null; error: unknown }

  const days  = Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / 86400000)
  const total = space?.price_day ? space.price_day * days : null

  const booking: BookingInsert = { space_id, brand_id: user.id, start_date, end_date, total_price: total }
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
