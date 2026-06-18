import { renderHook, waitFor } from '@testing-library/react'
import { useSpaces } from '@/hooks/useSpaces'

const mockFetch = global.fetch as jest.Mock

describe('useSpaces()', () => {
  it('appelle /api/spaces sans params si aucun filtre', async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve([]) })

    renderHook(() => useSpaces())

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    const url = (mockFetch.mock.calls[0][0] as string)
    expect(url).toMatch(/^\/api\/spaces/)
  })

  it('construit les URLSearchParams corrects depuis les filtres', async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve([]) })

    renderHook(() => useSpaces({ city: 'Paris', type: 'popup', minPrice: 100, maxPrice: 500 }))

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('city=Paris')
    expect(url).toContain('type=popup')
    expect(url).toContain('minPrice=100')
    expect(url).toContain('maxPrice=500')
  })

  it('définit spaces avec les données reçues', async () => {
    const fakeSpaces = [{ id: 'space-1', title: 'Le Studio' }]
    mockFetch.mockResolvedValue({ json: () => Promise.resolve(fakeSpaces) })

    const { result } = renderHook(() => useSpaces())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.spaces).toEqual(fakeSpaces)
  })

  it('définit error si fetch échoue', async () => {
    mockFetch.mockRejectedValue(new Error('network error'))

    const { result } = renderHook(() => useSpaces())

    await waitFor(() => expect(result.current.error).not.toBeNull())
    expect(result.current.error).toBeTruthy()
    expect(result.current.loading).toBe(false)
  })

  it('loading=false après fetch réussi', async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve([]) })

    const { result } = renderHook(() => useSpaces())

    await waitFor(() => expect(result.current.loading).toBe(false))
  })

  it('re-fetch quand le filtre city change', async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve([]) })

    const { rerender } = renderHook(
      ({ city }) => useSpaces({ city }),
      { initialProps: { city: 'Paris' } }
    )

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))

    rerender({ city: 'Lyon' })

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    const secondUrl = mockFetch.mock.calls[1][0] as string
    expect(secondUrl).toContain('city=Lyon')
  })
})
