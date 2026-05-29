import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isSpaceFavorited, getFavoritesByUser } from '@/lib/queries/favorites'
import { createClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server')

describe('isSpaceFavorited()', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne true si le favori existe', async () => {
    const chain = {
      select:      vi.fn().mockReturnThis(),
      eq:          vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'fav-1' } }),
    }
    vi.mocked(createClient).mockResolvedValue({ from: vi.fn().mockReturnValue(chain) } as never)

    const result = await isSpaceFavorited('user-1', 'space-1')
    expect(result).toBe(true)
  })

  it('retourne false si le favori n\'existe pas', async () => {
    const chain = {
      select:      vi.fn().mockReturnThis(),
      eq:          vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
    }
    vi.mocked(createClient).mockResolvedValue({ from: vi.fn().mockReturnValue(chain) } as never)

    const result = await isSpaceFavorited('user-1', 'space-inexistant')
    expect(result).toBe(false)
  })
})

describe('getFavoritesByUser()', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne la liste des favoris', async () => {
    const mockFavorites = [
      { id: 'fav-1', created_at: '2025-01-01', spaces: { id: 'space-1', title: 'Loft' } },
    ]
    const chain = {
      select:  vi.fn().mockReturnThis(),
      eq:      vi.fn().mockReturnThis(),
      order:   vi.fn().mockResolvedValue({ data: mockFavorites, error: null }),
    }
    vi.mocked(createClient).mockResolvedValue({ from: vi.fn().mockReturnValue(chain) } as never)

    const result = await getFavoritesByUser('user-1')
    expect(result).toEqual(mockFavorites)
    expect(chain.eq).toHaveBeenCalledWith('user_id', 'user-1')
  })

  it('lève une erreur si Supabase échoue', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      order:  vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    }
    vi.mocked(createClient).mockResolvedValue({ from: vi.fn().mockReturnValue(chain) } as never)

    await expect(getFavoritesByUser('user-1')).rejects.toEqual({ message: 'DB error' })
  })

  it('retourne un tableau vide si data est null sans erreur', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      order:  vi.fn().mockResolvedValue({ data: null, error: null }),
    }
    vi.mocked(createClient).mockResolvedValue({ from: vi.fn().mockReturnValue(chain) } as never)

    const result = await getFavoritesByUser('user-1')
    expect(result).toEqual([])
  })
})
