import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#0A0A0A]">Espaces à la une</h2>
            <p className="mt-2 text-[#6B6B6B]">Les espaces les plus plébiscités de la semaine.</p>
          </div>
          <Link
            href="/explorer"
            className="flex items-center gap-1 text-sm font-semibold text-[#E91E8C] hover:text-[#B0156A] transition-colors"
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
            <p className="text-center text-sm text-[#9B9B9B] py-12">
              Les premiers espaces arrivent bientôt.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
