jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}))

import { renderHook, waitFor } from '@testing-library/react'
import { useProfile } from '@/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'

function makeMockClient(result: { data: unknown; error: unknown } = { data: null, error: null }) {
  const chain = {
    select:  jest.fn().mockReturnThis(),
    eq:      jest.fn().mockReturnThis(),
    single:  jest.fn().mockResolvedValue(result),
  }
  return { from: jest.fn(() => chain), _chain: chain }
}

describe('useProfile()', () => {
  it('retourne loading=false immédiatement si userId est undefined', async () => {
    const mockClient = makeMockClient()
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    const { result } = renderHook(() => useProfile(undefined))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.profile).toBeNull()
    expect(mockClient.from).not.toHaveBeenCalled()
  })

  it('démarre en loading=true quand userId est fourni', () => {
    const mockClient = makeMockClient()
    mockClient._chain.single.mockReturnValue(new Promise(() => {}))
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    const { result } = renderHook(() => useProfile('user-1'))
    expect(result.current.loading).toBe(true)
  })

  it('fait une requête sur la table profiles avec le bon userId', async () => {
    const mockClient = makeMockClient({ data: { id: 'user-1', full_name: 'Alice' }, error: null })
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    renderHook(() => useProfile('user-1'))

    await waitFor(() => expect(mockClient.from).toHaveBeenCalledWith('profiles'))
    expect(mockClient._chain.eq).toHaveBeenCalledWith('id', 'user-1')
  })

  it('définit profile avec les données reçues', async () => {
    const profileData = { id: 'user-1', full_name: 'Alice', email: null }
    const mockClient = makeMockClient({ data: profileData, error: null })
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    const { result } = renderHook(() => useProfile('user-1'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.profile).toEqual(profileData)
  })

  it('définit profile=null si data est null', async () => {
    const mockClient = makeMockClient({ data: null, error: null })
    ;(createClient as jest.Mock).mockReturnValue(mockClient)

    const { result } = renderHook(() => useProfile('user-1'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.profile).toBeNull()
  })
})
