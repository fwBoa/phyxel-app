import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SpaceRow } from '@/types/database'
import DeleteButton from './DeleteButton'

export const revalidate = 0

type SpaceWithPhotos = SpaceRow & {
  space_photos?: { id: string; url: string }[]
  hosts?: { email: string; full_name: string | null } | null
}

const TYPE_LABELS: Record<string, string> = {
  showroom: 'Showroom',
  popup: 'Pop-up',
  corner: 'Corner',
  gallery: 'Galerie',
  boutique: 'Boutique',
}

export default async function AdminSpacesPage() {
  await requireAdmin()

  const supabase = createAdminClient()
  const { data: rawSpaces, error } = await supabase
    .from('spaces')
    .select('*, space_photos(*), hosts(email, full_name)')
    .order('created_at', { ascending: false })

  const spaces = (rawSpaces ?? []) as SpaceWithPhotos[]

  if (error) {
    return (
      <div className="rounded-2xl border border-border-custom bg-white p-8 text-center">
        <p className="text-text-secondary">Erreur lors du chargement des espaces.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Espaces</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {spaces?.length ?? 0} espace{(spaces?.length ?? 0) > 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/admin/espaces/nouveau"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
        >
          <Plus size={16} />
          Nouvel espace
        </Link>
      </div>

      <div className="rounded-2xl border border-border-custom bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Titre</th>
              <th className="px-5 py-3 text-left font-medium">Type</th>
              <th className="px-5 py-3 text-left font-medium">Ville</th>
              <th className="px-5 py-3 text-left font-medium">Prix/jour</th>
              <th className="px-5 py-3 text-left font-medium">Statut</th>
              <th className="px-5 py-3 text-left font-medium">Host</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {(spaces ?? []).map((space) => (
              <tr key={space.id} className="hover:bg-bg-secondary/50">
                <td className="px-5 py-3 font-medium text-foreground">{space.title}</td>
                <td className="px-5 py-3 text-text-secondary">{TYPE_LABELS[space.type] ?? space.type}</td>
                <td className="px-5 py-3 text-text-secondary">{space.city}</td>
                <td className="px-5 py-3 text-foreground">
                  {space.price_day?.toLocaleString('fr-FR')} €
                </td>
                <td className="px-5 py-3">
                  {space.is_available ? (
                    <span className="inline-flex rounded-full bg-match-high/10 px-2.5 py-0.5 text-xs font-medium text-match-high">
                      Disponible
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-match-low/10 px-2.5 py-0.5 text-xs font-medium text-match-low">
                      Indisponible
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-text-secondary">
                  {space.hosts?.full_name ?? space.hosts?.email ?? '—'}
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/espaces/${space.id}/modifier`}
                      className="rounded-lg p-2 text-text-secondary hover:bg-bg-secondary hover:text-foreground transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={14} />
                    </Link>
                    <DeleteButton spaceId={space.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!spaces || spaces.length === 0) && (
          <div className="p-12 text-center">
            <p className="text-text-muted">Aucun espace.</p>
            <Link
              href="/admin/espaces/nouveau"
              className="mt-3 inline-block text-sm font-semibold text-primary hover:text-[#5B21B6]"
            >
              Créer le premier espace →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
