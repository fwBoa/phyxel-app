import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useFavorite } from '@/hooks/useFavorite'
import { createClient } from '@/lib/supabase/client'

vi.mock('@/lib/supabase/client')

const mockDelete   = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({}) }) })
const mockInsert   = vi.fn().mockResolvedValue({})
const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null })

function buildClient(userId: string | null, isFav = false) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: userId ? { id: userId } : null } }),
    },
    from: vi.fn().mockReturnValue({
      select:      vi.fn().mockReturnThis(),
      eq:          vi.fn().mockReturnThis(),
      maybeSingle: isFav
        ? vi.fn().mockResolvedValue({ data: { id: 'fav-1' } })
        : mockMaybeSingle,
      delete:      mockDelete,
      insert:      mockInsert,
    }),
  }
}

describe('useFavorite', () => {
  beforeEach(() => vi.clearAllMocks())

  it('ready=false initialement', () => {
    vi.mocked(createClient).mockReturnValue(buildClient(null) as never)
    const { result } = renderHook(() => useFavorite('space-1'))
    expect(result.current.ready).toBe(false)
  })

  it('userId=null si non connecté', async () => {
    vi.mocked(createClient).mockReturnValue(buildClient(null) as never)
    const { result } = renderHook(() => useFavorite('space-1'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.userId).toBeNull()
  })

  it('isFavorited=false par défaut quand non favori', async () => {
    vi.mocked(createClient).mockReturnValue(buildClient('user-1', false) as never)
    const { result } = renderHook(() => useFavorite('space-1'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.isFavorited).toBe(false)
  })

  it('isFavorited=true quand initialFavorited=true', async () => {
    vi.mocked(createClient).mockReturnValue(buildClient('user-1') as never)
    const { result } = renderHook(() => useFavorite('space-1', true))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.isFavorited).toBe(true)
  })

  it('toggle ne fait rien si non connecté', async () => {
    vi.mocked(createClient).mockReturnValue(buildClient(null) as never)
    const { result } = renderHook(() => useFavorite('space-1'))
    await waitFor(() => expect(result.current.ready).toBe(true))
    await act(() => result.current.toggle())
    expect(mockInsert).not.toHaveBeenCalled()
  })
})
