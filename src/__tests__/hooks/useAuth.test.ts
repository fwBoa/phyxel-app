import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

vi.mock('@/lib/supabase/client')

function mockClientWith(user: unknown) {
  vi.mocked(createClient).mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  } as never)
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockClientWith(null) // mock par défaut
  })

  it('retourne loading=true initialement', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.loading).toBe(true)
  })

  it('retourne user=null quand non connecté', async () => {
    mockClientWith(null)
    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
  })

  it('retourne l\'user quand connecté', async () => {
    const fakeUser = { id: 'user-123', email: 'test@test.com' }
    mockClientWith(fakeUser)
    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toEqual(fakeUser)
  })

  it('se désabonne à l\'unmount', async () => {
    const unsubscribe = vi.fn()
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe } },
        }),
      },
    } as never)
    const { unmount } = renderHook(() => useAuth())
    unmount()
    expect(unsubscribe).toHaveBeenCalledOnce()
  })
})
