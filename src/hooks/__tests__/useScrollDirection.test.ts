import { renderHook, act } from '@testing-library/react'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useMotionValueEvent, useScroll } from 'motion/react'

describe('useScrollDirection()', () => {
  let capturedCallback: ((y: number) => void) | null = null

  beforeEach(() => {
    capturedCallback = null
    ;(useMotionValueEvent as jest.Mock).mockImplementation((_mv, _event, cb) => {
      capturedCallback = cb
    })
  })

  it('initialise avec direction="down"', () => {
    const { result } = renderHook(() => useScrollDirection())
    expect(result.current).toBe('down')
  })

  it('indique "down" quand le Y de scroll augmente', () => {
    const { result } = renderHook(() => useScrollDirection())

    act(() => { capturedCallback?.(100) })
    act(() => { capturedCallback?.(150) })

    expect(result.current).toBe('down')
  })

  it('indique "up" quand le Y de scroll diminue', () => {
    const { result } = renderHook(() => useScrollDirection())

    act(() => { capturedCallback?.(100) })
    act(() => { capturedCallback?.(50) })

    expect(result.current).toBe('up')
  })

  it('appelle useScroll() au montage', () => {
    renderHook(() => useScrollDirection())
    expect(useScroll).toHaveBeenCalled()
  })

  it('appelle useMotionValueEvent sur le scrollY motion value', () => {
    renderHook(() => useScrollDirection())
    expect(useMotionValueEvent).toHaveBeenCalledWith(
      expect.anything(),
      'change',
      expect.any(Function)
    )
  })
})
