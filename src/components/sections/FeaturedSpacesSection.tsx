import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import SpaceCard from '@/components/ui/SpaceCard'
import type { SpaceWithPhotos } from '@/types/spaces'

type FeaturedSpacesSectionProps = {
  spaces: SpaceWithPhotos[]
}

function getCoverUrl(space: SpaceWithPhotos): string | null {
  const cover = space.space_photos?.find((p) => p.is_cover) ?? space.space_photos?.[0]
  return cover?.url ?? null
}

export default function FeaturedSpacesSection({ spaces }: FeaturedSpacesSectionProps) {
  return (
    <section id="explorer" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Espaces à la une</h2>
            <p className="mt-2 text-text-secondary">Les espaces les plus plébiscités de la semaine.</p>
          </div>
          <Link
            href="/explorer"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-[#5B21B6] transition-colors"
          >
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10">
          {spaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {spaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  id={space.id}
                  title={space.title}
                  type={space.type}
                  city={space.city}
                  district={space.district}
                  priceDay={space.price_day}
                  areaSqm={space.area_sqm}
                  isAvailable={space.is_available}
                  coverUrl={getCoverUrl(space)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <Search size={32} className="text-text-muted" aria-hidden />
              <p className="text-sm text-text-muted">Les premiers espaces arrivent bientôt.</p>
              <Link
                href="/explorer"
                className="inline-flex items-center gap-2 rounded-full border border-border-custom px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-[#0A0A0A]"
              >
                Explorer les espaces <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
