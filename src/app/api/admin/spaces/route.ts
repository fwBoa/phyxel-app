import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentAdmin } from '@/lib/admin/auth'

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('spaces')
    .select('*, space_photos(*), hosts(email, full_name)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
    hostEmail,
  } = body

  if (!title || !type || !city) {
    return NextResponse.json({ error: 'Titre, type et ville sont requis.' }, { status: 400 })
  }

  if (!hostEmail || typeof hostEmail !== 'string') {
    return NextResponse.json({ error: 'Email du host requis.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // 1. Lookup host par email
  const { data: host, error: hostError } = await supabase
    .from('hosts')
    .select('id, is_active')
    .eq('email', hostEmail.toLowerCase().trim())
    .maybeSingle()

  if (hostError) return NextResponse.json({ error: hostError.message }, { status: 500 })
  if (!host) {
    return NextResponse.json(
      { error: `Aucun host enregistré avec l'email "${hostEmail}". Ajoutez ce host avant de créer un espace.` },
      { status: 400 },
    )
  }
  if (!host.is_active) {
    return NextResponse.json(
      { error: `Le host "${hostEmail}" est désactivé.` },
      { status: 400 },
    )
  }

  // 2. Créer l'espace
  const { data: space, error: spaceError } = await supabase
    .from('spaces')
    .insert({
      title,
      type,
      city,
      district:    district    || null,
      address:     address     || null,
      area_sqm:    area_sqm    ?? null,
      price_day:   price_day   ?? null,
      description: description || null,
      is_available: is_available ?? true,
      host_id:     host.id,
    })
    .select()
    .single()

  if (spaceError) return NextResponse.json({ error: spaceError.message }, { status: 400 })

  // 3. Insérer les photos
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
