import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentAdmin } from '@/lib/admin/auth'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('spaces')
    .select('*, space_photos(*), hosts(email, full_name)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createAdminClient()

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

  // Si hostEmail fourni, on update aussi host_id (sinon on garde l'existant)
  let hostId: string | undefined
  if (hostEmail && typeof hostEmail === 'string') {
    const { data: host, error: hostError } = await supabase
      .from('hosts')
      .select('id, is_active')
      .eq('email', hostEmail.toLowerCase().trim())
      .maybeSingle()

    if (hostError) return NextResponse.json({ error: hostError.message }, { status: 500 })
    if (!host) {
      return NextResponse.json(
        { error: `Aucun host enregistré avec l'email "${hostEmail}".` },
        { status: 400 },
      )
    }
    if (!host.is_active) {
      return NextResponse.json(
        { error: `Le host "${hostEmail}" est désactivé.` },
        { status: 400 },
      )
    }
    hostId = host.id
  }

  // Mettre à jour l'espace
  const { data: space, error: spaceError } = await supabase
    .from('spaces')
    .update({
      title,
      type,
      city,
      district: district || null,
      address: address || null,
      area_sqm: area_sqm ?? null,
      price_day: price_day ?? null,
      description: description || null,
      is_available: is_available ?? true,
      ...(hostId ? { host_id: hostId } : {}),
    })
    .eq('id', id)
    .select()
    .single()

  if (spaceError) return NextResponse.json({ error: spaceError.message }, { status: 400 })

  // Remplacer les photos
  await supabase.from('space_photos').delete().eq('space_id', id)

  if (photos && Array.isArray(photos) && photos.length > 0) {
    const photoInserts = photos.map((url: string, idx: number) => ({
      space_id: id,
      url,
      is_cover: idx === 0,
      order_idx: idx,
    }))

    await supabase.from('space_photos').insert(photoInserts)
  }

  return NextResponse.json(space)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createAdminClient()
  const { error } = await supabase.from('spaces').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
