import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, status: 401 }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { ok: false, status: 403 }
  return { ok: true, user }
}

export async function GET() {
  const supabase = await createClient()
  const auth = await checkAdmin(supabase)
  if (!auth.ok) return NextResponse.json({ error: 'Forbidden' }, { status: auth.status })

  const { data, error } = await supabase
    .from('spaces')
    .select('*, space_photos(*)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const auth = await checkAdmin(supabase)
  if (!auth.ok) return NextResponse.json({ error: 'Forbidden' }, { status: auth.status })

  const body = await request.json()
  const {
    title,
    type,
    city,
    district,
    address,
    area_sqm,
    price_day,
    description,
    is_available,
    photos,
  } = body

  if (!title || !type || !city) {
    return NextResponse.json({ error: 'Titre, type et ville sont requis.' }, { status: 400 })
  }

  // Créer l'espace
  const { data: space, error: spaceError } = await supabase
    .from('spaces')
    .insert({
      title,
      type,
      city,
      district: district || null,
      address: address || null,
      area_sqm: area_sqm ?? null,
      price_day: price_day ?? null,
      description: description || null,
      is_available: is_available ?? true,
      host_id: auth.user!.id,
    })
    .select()
    .single()

  if (spaceError) return NextResponse.json({ error: spaceError.message }, { status: 400 })

  // Insérer les photos
  if (photos && Array.isArray(photos) && photos.length > 0) {
    const photoInserts = photos.map((url: string, idx: number) => ({
      space_id: space.id,
      url,
      is_cover: idx === 0,
      order_idx: idx,
    }))

    await supabase.from('space_photos').insert(photoInserts)
  }

  return NextResponse.json(space, { status: 201 })
}
