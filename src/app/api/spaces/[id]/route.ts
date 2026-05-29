import { NextRequest, NextResponse } from 'next/server'
import { createClient }  from '@/lib/supabase/server'
import { getSpaceById }  from '@/lib/queries/spaces'
import type { SpaceUpdate } from '@/types/spaces'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const space  = await getSpaceById(id)
  if (!space) return NextResponse.json({ error: 'Espace introuvable' }, { status: 404 })
  return NextResponse.json(space)
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id }    = await params
  const supabase  = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await request.json() as SpaceUpdate
  const { data, error } = await supabase
    .from('spaces')
    .update(body as SpaceUpdate)
    .eq('id', id)
    .eq('host_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id }   = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { error } = await supabase
    .from('spaces')
    .delete()
    .eq('id', id)
    .eq('host_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return new NextResponse(null, { status: 204 })
}
