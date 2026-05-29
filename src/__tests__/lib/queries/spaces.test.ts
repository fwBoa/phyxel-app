import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getFeaturedSpaces, getSpaces, getSpaceById } from '@/lib/queries/spaces'
import { createClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server')

const MOCK_SPACES = [
  { id: 'space-1', title: 'Loft Haussmann', type: 'showroom', city: 'Paris', is_available: true, space_photos: [] },
  { id: 'space-2', title: 'Corner Marais',  type: 'corner',   city: 'Paris', is_available: true, space_photos: [] },
]

function buildSupabase(data: unknown, error: unknown = null) {
  const chain = {
    select:  vi.fn().mockReturnThis(),
    eq:      vi.fn().mockReturnThis(),
    order:   vi.fn().mockReturnThis(),
    limit:   vi.fn().mockResolvedValue({ data, error }),
    single:  vi.fn().mockResolvedValue({ data: Array.isArray(data) ? data[0] : data, error }),
    gte:     vi.fn().mockReturnThis(),
    lte:     vi.fn().mockReturnThis(),
  }
  return { from: vi.fn().mockReturnValue(chain), _chain: chain }
}

describe('getFeaturedSpaces()', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne les espaces disponibles (max 3)', async () => {
    const { _chain, ...sb } = buildSupabase(MOCK_SPACES)
    vi.mocked(createClient).mockResolvedValue(sb as never)
    const result = await getFeaturedSpaces()
    expect(_chain.eq).toHaveBeenCalledWith('is_available', true)
    expect(_chain.limit).toHaveBeenCalledWith(3)
    expect(result).toEqual(MOCK_SPACES)
  })

  it('lève une erreur si Supabase échoue', async () => {
    const { _chain: _, ...sb } = buildSupabase(null, { message: 'DB error' })
    vi.mocked(createClient).mockResolvedValue(sb as never)
    // limit renvoie { data: null, error } → throw error
    await expect(getFeaturedSpaces()).rejects.toEqual({ message: 'DB error' })
  })

  it('retourne un tableau vide si data est null', async () => {
    const { _chain, ...sb } = buildSupabase(null, null)
    // override limit pour retourner data:null sans erreur
    _chain.limit.mockResolvedValue({ data: null, error: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)
    const result = await getFeaturedSpaces()
    expect(result).toEqual([])
  })
})

describe('getSpaces()', () => {
  beforeEach(() => vi.clearAllMocks())

  it('filtre par ville si fournie', async () => {
    const { _chain, ...sb } = buildSupabase(MOCK_SPACES)
    _chain.limit = vi.fn().mockReturnThis()
    _chain.lte   = vi.fn().mockReturnThis()
    // order retourne une promesse en fin de chaîne
    _chain.order = vi.fn().mockResolvedValue({ data: MOCK_SPACES, error: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    await getSpaces({ city: 'Paris' })
    expect(_chain.eq).toHaveBeenCalledWith('city', 'Paris')
  })

  it('filtre par type si fourni', async () => {
    const { _chain, ...sb } = buildSupabase(MOCK_SPACES)
    _chain.order = vi.fn().mockResolvedValue({ data: MOCK_SPACES, error: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    await getSpaces({ type: 'showroom' })
    expect(_chain.eq).toHaveBeenCalledWith('type', 'showroom')
  })

  it('filtre par prix max si fourni', async () => {
    const { _chain, ...sb } = buildSupabase(MOCK_SPACES)
    _chain.order = vi.fn().mockResolvedValue({ data: MOCK_SPACES, error: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    await getSpaces({ maxPrice: 1000 })
    expect(_chain.lte).toHaveBeenCalledWith('price_day', 1000)
  })
})

describe('getSpaceById()', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne l\'espace correspondant à l\'id', async () => {
    const space = MOCK_SPACES[0]
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: space, error: null }),
    }
    vi.mocked(createClient).mockResolvedValue({ from: vi.fn().mockReturnValue(chain) } as never)

    const result = await getSpaceById('space-1')
    expect(result).toEqual(space)
    expect(chain.eq).toHaveBeenCalledWith('id', 'space-1')
  })

  it('retourne null si erreur', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
    }
    vi.mocked(createClient).mockResolvedValue({ from: vi.fn().mockReturnValue(chain) } as never)

    const result = await getSpaceById('inexistant')
    expect(result).toBeNull()
  })
})
