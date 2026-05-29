import { getSpaces }      from '@/lib/queries/spaces'
import type { SpaceFilters } from '@/types/spaces'
import type { City, SpaceType } from '@/constants/spaces'
import ExplorerClient      from './ExplorerClient'

type PageProps = {
  searchParams: Promise<{ city?: string; type?: string; maxPrice?: string }>
}

export default async function ExplorerPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: SpaceFilters = {
    ...(params.city     ? { city:     params.city     as City }      : {}),
    ...(params.type     ? { type:     params.type     as SpaceType } : {}),
    ...(params.maxPrice ? { maxPrice: Number(params.maxPrice) }      : {}),
  }

  const spaces = await getSpaces(filters).catch(() => [])

  return (
    <ExplorerClient
      initialSpaces={spaces}
      activeType={params.type ?? null}
      activeCity={params.city ?? null}
      activeMaxPrice={params.maxPrice ? Number(params.maxPrice) : null}
    />
  )
}
