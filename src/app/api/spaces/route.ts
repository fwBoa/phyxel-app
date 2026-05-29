import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSpaces }    from '@/lib/queries/spaces'
import type { SpaceFilters, SpaceInsert } from '@/types/spaces'
import type { City, SpaceType } from '@/constants/spaces'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const filters: SpaceFilters = {
    ...(searchParams.get('city')     ? { city:     searchParams.get('city')     as City }      : {}),
    ...(searchParams.get('type')     ? { type:     searchParams.get('type')     as SpaceType } : {}),
    ...(searchParams.get('minPrice') ? { minPrice: Number(searchParams.get('minPrice')) }      : {}),
    ...(searchParams.get('maxPrice') ? { maxPrice: Number(searchParams.get('maxPrice')) }      : {}),
  }

  try {
    const spaces = await getSpaces(filters)
    return NextResponse.json(spaces)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await request.json() as SpaceInsert
  const { data, error } = await supabase
    .from('spaces')
    .insert({ ...body, host_id: user.id } as SpaceInsert)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
