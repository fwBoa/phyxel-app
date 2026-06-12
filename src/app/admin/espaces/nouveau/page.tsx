import { requireAdmin } from '@/lib/admin/auth'
import SpaceForm from '../SpaceForm'

export default async function NewSpacePage() {
  await requireAdmin()
  return <SpaceForm mode="create" />
}
