import SearchBar   from '@/components/features/SearchBar'
import SpaceGrid   from '@/components/features/SpaceGrid'
import { getSpaces } from '@/lib/queries/spaces'
import type { SpaceFilters } from '@/types/spaces'
import type { City, SpaceType } from '@/constants/spaces'

type PageProps = {
  searchParams: Promise<{ city?: string; type?: string; minPrice?: string; maxPrice?: string }>
}

export default async function ExplorerPage({ searchParams }: PageProps) {
  const params  = await searchParams
  const filters: SpaceFilters = {
    ...(params.city     ? { city:     params.city     as City }      : {}),
    ...(params.type     ? { type:     params.type     as SpaceType } : {}),
    ...(params.minPrice ? { minPrice: Number(params.minPrice) }      : {}),
    ...(params.maxPrice ? { maxPrice: Number(params.maxPrice) }      : {}),
  }

  const spaces = await getSpaces(filters).catch(() => [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#0A0A0A]">Explorer les espaces</h1>
      <p className="mt-2 text-[#6B6B6B]">{spaces.length} espace{spaces.length > 1 ? 's' : ''} disponible{spaces.length > 1 ? 's' : ''}</p>

      <div className="mt-8">
        <SearchBar variant="explorer" initialFilters={filters} />
      </div>

      <div className="mt-10">
        <SpaceGrid initialSpaces={spaces} />
      </div>
    </div>
  )
}
