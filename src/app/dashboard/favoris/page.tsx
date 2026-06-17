import { redirect }           from 'next/navigation'
import Link                    from 'next/link'
import { Heart, Search }       from 'lucide-react'
import { getCurrentUser }      from '@/lib/queries/users'
import { getFavoritesByUser }  from '@/lib/queries/favorites'
import SpaceCard               from '@/components/ui/SpaceCard'

function getCoverUrl(photos: { url: string; is_cover: boolean }[]): string | null {
  const cover = photos?.find((p) => p.is_cover) ?? photos?.[0]
  return cover?.url ?? null
}

export default async function FavorisPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const favorites = await getFavoritesByUser(user.id).catch(() => [])

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-muted">
          <Heart size={20} className="fill-primary stroke-primary" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes favoris</h1>
          <p className="text-sm text-text-secondary">
            {favorites.length} espace{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-custom bg-white py-20 text-center">
          <Search size={32} className="text-text-muted" aria-hidden />
          <p className="text-sm text-text-muted">Vous n&apos;avez pas encore sauvegardé d&apos;espace.</p>
          <Link
            href="/explorer"
            className="inline-flex items-center gap-2 rounded-full border border-border-custom px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-[#0A0A0A]"
          >
            Explorer les espaces →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map(({ id, spaces }) => (
            <SpaceCard
              key={id}
              id={spaces.id}
              title={spaces.title}
              type={spaces.type}
              city={spaces.city}
              district={spaces.district}
              priceDay={spaces.price_day}
              areaSqm={spaces.area_sqm}
              isAvailable={spaces.is_available}
              coverUrl={getCoverUrl(spaces.space_photos)}
            />
          ))}
        </div>
      )}
    </>
  )
}
