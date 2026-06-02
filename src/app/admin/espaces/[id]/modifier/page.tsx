import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SpaceRow } from '@/types/database'
import SpaceForm from '../../SpaceForm'

type SpaceWithPhotos = SpaceRow & {
  space_photos?: { order_idx: number; url: string }[]
  hosts?: { email: string } | null
}

export default async function EditSpacePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params

  const supabase = createAdminClient()
  const { data: space, error } = await supabase
    .from('spaces')
    .select('*, space_photos(*), hosts(email)')
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
    host_email: (s.hosts?.email) ?? '',
    photos: (s.space_photos ?? [])
      .sort((a, b) => a.order_idx - b.order_idx)
      .map((p) => p.url)
      .join('\n'),
  }

  return <SpaceForm mode="edit" spaceId={s.id} initialData={initialData} />
}
