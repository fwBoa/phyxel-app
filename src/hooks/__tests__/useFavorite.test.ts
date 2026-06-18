jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}))

import { renderHook, act, waitFor } from '@testing-library/react'
import { useFavorite } from '@/hooks/useFavorite'
import { createClient } from '@/lib/supabase/client'

function makeMockClient({
  user = null as unknown,
  favData = null as unknown,
} = {}) {
  const maybySingleFav = jest.fn().mockResolvedValue({ data: favData })
  const deleteChain = { eq: jest.fn().mockReturnThis() }
  const insertChain = { then: jest.fn() }
  const fromFavorites = {
    select:      jest.fn().mockReturnThis(),
    eq:          jest.fn().mockReturnThis(),
    maybeSingle: maybySingleFav,
    delete:      jest.fn(() => deleteChain),
    insert:      jest.fn().mockResolvedValue({ error: null }),
  }

  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user } }),
    },
    from: jest.fn((table: string) => {
      if (table === 'favorites') return fromFavorites
      return {}
    }),
    _fromFavorites: fromFavorites,
  }
}

describe('useFavorite()', () => {
  describe('état initial', () => {
    it('isFavorited = initialFavorited prop', () => {
      const mockClient = makeMockClient()
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      const { result } = renderHook(() => useFavorite('space-1', true))
      expect(result.current.isFavorited).toBe(true)
    })

    it('ready=false tant que le check auth n\'est pas terminé', () => {
      const mockClient = makeMockClient()
      mockClient.auth.getUser.mockReturnValue(new Promise(() => {}))
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      const { result } = renderHook(() => useFavorite('space-1'))
      expect(result.current.ready).toBe(false)
    })

    it('ready=true et userId=null quand l\'utilisateur n\'est pas connecté', async () => {
      const mockClient = makeMockClient({ user: null })
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      const { result } = renderHook(() => useFavorite('space-1'))
      await waitFor(() => expect(result.current.ready).toBe(true))
      expect(result.current.userId).toBeNull()
    })
  })

  describe('avec utilisateur connecté, initialFavorited=false', () => {
    it('fetch la table favorites pour connaître l\'état réel', async () => {
      const fakeUser = { id: 'user-1' }
      const mockClient = makeMockClient({ user: fakeUser })
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      renderHook(() => useFavorite('space-1', false))

      await waitFor(() => expect(mockClient._fromFavorites.maybeSingle).toHaveBeenCalled())
      expect(mockClient._fromFavorites.eq).toHaveBeenCalledWith('user_id', 'user-1')
      expect(mockClient._fromFavorites.eq).toHaveBeenCalledWith('space_id', 'space-1')
    })

    it('isFavorited=true si l\'enregistrement est trouvé', async () => {
      const fakeUser = { id: 'user-1' }
      const mockClient = makeMockClient({ user: fakeUser, favData: { id: 'fav-1' } })
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      const { result } = renderHook(() => useFavorite('space-1', false))
      await waitFor(() => expect(result.current.ready).toBe(true))
      expect(result.current.isFavorited).toBe(true)
    })

    it('isFavorited=false si aucun enregistrement', async () => {
      const fakeUser = { id: 'user-1' }
      const mockClient = makeMockClient({ user: fakeUser, favData: null })
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      const { result } = renderHook(() => useFavorite('space-1', false))
      await waitFor(() => expect(result.current.ready).toBe(true))
      expect(result.current.isFavorited).toBe(false)
    })
  })

  describe('avec initialFavorited=true', () => {
    it('ne fetch pas la table favorites (déjà initialisé)', async () => {
      const fakeUser = { id: 'user-1' }
      const mockClient = makeMockClient({ user: fakeUser })
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      renderHook(() => useFavorite('space-1', true))

      await waitFor(() =>
        expect(mockClient.auth.getUser).toHaveBeenCalled()
      )
      // maybeSingle ne devrait PAS avoir été appelé
      expect(mockClient._fromFavorites.maybeSingle).not.toHaveBeenCalled()
    })
  })

  describe('toggle()', () => {
    it('ne fait rien si userId est null', async () => {
      const mockClient = makeMockClient({ user: null })
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      const { result } = renderHook(() => useFavorite('space-1'))
      await waitFor(() => expect(result.current.ready).toBe(true))

      await act(async () => { await result.current.toggle() })

      expect(mockClient.from).not.toHaveBeenCalledWith('favorites')
    })

    it('bascule isFavorited optimistement avant la DB', async () => {
      const fakeUser = { id: 'user-1' }
      const mockClient = makeMockClient({ user: fakeUser, favData: { id: 'fav-1' } })
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      const { result } = renderHook(() => useFavorite('space-1', true))
      await waitFor(() => expect(result.current.ready).toBe(true))

      expect(result.current.isFavorited).toBe(true)
      act(() => { result.current.toggle() })
      expect(result.current.isFavorited).toBe(false)
    })

    it('appelle favorites.insert quand on toggle ON', async () => {
      const fakeUser = { id: 'user-1' }
      const mockClient = makeMockClient({ user: fakeUser, favData: null })
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      const { result } = renderHook(() => useFavorite('space-1', false))
      await waitFor(() => expect(result.current.ready).toBe(true))

      await act(async () => { await result.current.toggle() })

      expect(mockClient._fromFavorites.insert).toHaveBeenCalledWith({
        user_id:  'user-1',
        space_id: 'space-1',
      })
    })

    it('appelle favorites.delete quand on toggle OFF', async () => {
      const fakeUser = { id: 'user-1' }
      const mockClient = makeMockClient({ user: fakeUser, favData: { id: 'fav-1' } })
      ;(createClient as jest.Mock).mockReturnValue(mockClient)

      const { result } = renderHook(() => useFavorite('space-1', true))
      await waitFor(() => expect(result.current.ready).toBe(true))

      await act(async () => { await result.current.toggle() })

      expect(mockClient._fromFavorites.delete).toHaveBeenCalled()
    })
  })
})
