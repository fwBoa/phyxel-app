import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city     = searchParams.get('city') ?? undefined
  const type     = searchParams.get('type') ?? undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined

  const supabase = await createServerClient()
  let query = supabase.from('spaces').select('*, space_photos(*)').eq('is_available', true)
  if (city)     query = query.eq('city', city)
  if (type)     query = query.eq('type', type)
  if (maxPrice) query = query.lte('price_day', maxPrice)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase.from('spaces').insert({ ...body, host_id: user.id }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
