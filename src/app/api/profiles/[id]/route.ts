import { NextRequest, NextResponse } from 'next/server'
import { createClient }  from '@/lib/supabase/server'
import { getProfile }    from '@/lib/queries/users'
import type { ProfileUpdate } from '@/types/users'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id }    = await params
  const profile   = await getProfile(id)
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
  return NextResponse.json(profile)
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id }   = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== id)
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const body = await request.json() as ProfileUpdate
  const { data, error } = await supabase
    .from('profiles')
    .update(body as ProfileUpdate)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
