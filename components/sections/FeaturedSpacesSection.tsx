import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SpaceGrid } from '@/components/features/SpaceGrid'
import type { SpaceWithPhotos } from '@/types/spaces'

type Props = { spaces: SpaceWithPhotos[] }

export function FeaturedSpacesSection({ spaces }: Props) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0A0A0A]">Espaces à la une</h2>
            <p className="text-sm text-[#6B7280] mt-1">Sélection premium de lieux disponibles cette semaine.</p>
          </div>
          <Link
            href="/explorer"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#7C3AED] hover:underline"
          >
            Voir tous les espaces <ArrowRight size={14} />
          </Link>
        </div>

        <SpaceGrid initialData={spaces} />

        <div className="mt-8 text-center md:hidden">
          <Link href="/explorer" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C3AED]">
            Voir tous les espaces <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
