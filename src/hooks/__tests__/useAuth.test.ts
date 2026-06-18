jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}))

import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

function makeMockClient(user: unknown = null) {
  const mockUnsubscribe = jest.fn()
  let authStateCallback: ((event: string, session: unknown) => void) | null = null

  return {
    mockUnsubscribe,
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user } }),
      onAuthStateChange: jest.fn().mockImplementation((cb) => {
        authStateCallback = cb
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
      }),
      _triggerStateChange: (event: string, session: unknown) => {
        authStateCallback?.(event, session)
      },
    },
  }
}

describe('useAuth()', () => {
  it('initialise avec user=null et loading=true', () => {
    const mockClient = makeMockClient()
    ;(createClient as jest.Mock).mockReturnValue(mockClient)
    mockClient.auth.getUser.mockReturnValue(new Promise(() => {})) // never resolves

    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('définit user et loading=false après résolution de getUser', async () => {
    const fakeUser = { id: 'user-1', email: 'user@test.com' }
    const mockClient = makeMockClient(fakeUser)
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toEqual(fakeUser)
  })

  it('définit user=null si getUser retourne null', async () => {
    const mockClient = makeMockClient(null)
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
  })

  it("s'abonne a onAuthStateChange au montage", async () => {
    const mockClient = makeMockClient()
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    renderHook(() => useAuth())
    await waitFor(() => expect(mockClient.auth.onAuthStateChange).toHaveBeenCalledTimes(1))
  })

  it('se désabonne au démontage', async () => {
    const mockClient = makeMockClient()
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    const { unmount } = renderHook(() => useAuth())
    await waitFor(() => expect(mockClient.auth.onAuthStateChange).toHaveBeenCalled())

    unmount()
    expect(mockClient.mockUnsubscribe).toHaveBeenCalledTimes(1)
  })

  it('met à jour user quand auth state change retourne une session', async () => {
    const mockClient = makeMockClient()
    ;(createClient as jest.Mock).mockReturnValue(mockClient)
    const newUser = { id: 'user-2', email: 'new@test.com' }

    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(mockClient.auth.onAuthStateChange).toHaveBeenCalled())

    act(() => {
      mockClient.auth._triggerStateChange('SIGNED_IN', { user: newUser })
    })

    expect(result.current.user).toEqual(newUser)
  })

  it('set user=null quand auth state change retourne session null', async () => {
    const initialUser = { id: 'user-1' }
    const mockClient = makeMockClient(initialUser)
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      mockClient.auth._triggerStateChange('SIGNED_OUT', null)
    })

    expect(result.current.user).toBeNull()
  })
})
