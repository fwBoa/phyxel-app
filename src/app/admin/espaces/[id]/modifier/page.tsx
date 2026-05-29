import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { SpaceRow } from '@/types/database'
import SpaceForm from '../../SpaceForm'

type SpaceWithPhotos = SpaceRow & {
  space_photos?: { order_idx: number; url: string }[]
}

export default async function EditSpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const { data: space, error } = await supabase
    .from('spaces')
    .select('*, space_photos(*)')
    .eq('id', id)
    .single()

  if (error || !space) {
    notFound()
  }

  const s = space as unknown as SpaceWithPhotos

  const initialData = {
    id: s.id,
    title: s.title,
    type: s.type,
    city: s.city,
    district: s.district ?? '',
    address: s.address ?? '',
    area_sqm: s.area_sqm?.toString() ?? '',
    price_day: s.price_day?.toString() ?? '',
    description: s.description ?? '',
    is_available: s.is_available,
    photos: (s.space_photos ?? [])
      .sort((a, b) => a.order_idx - b.order_idx)
      .map((p) => p.url)
      .join('\n'),
  }

  return <SpaceForm mode="edit" spaceId={s.id} initialData={initialData} />
}
