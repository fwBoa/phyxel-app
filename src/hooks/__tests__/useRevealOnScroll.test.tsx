import React from 'react'
import { render, act } from '@testing-library/react'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'

// Composant test qui expose ref et visible via data-attributes
function TestComponent({ threshold, once }: { threshold?: number; once?: boolean }) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>({ threshold, once })
  return <div ref={ref} data-testid="target" data-visible={String(visible)} />
}

function getLastObserverCallback() {
  const MockIO = window.IntersectionObserver as jest.Mock
  if (!MockIO.mock.calls.length) return null
  return MockIO.mock.calls[MockIO.mock.calls.length - 1][0] as
    (entries: Partial<IntersectionObserverEntry>[]) => void
}

function getLastObserverOptions() {
  const MockIO = window.IntersectionObserver as jest.Mock
  if (!MockIO.mock.calls.length) return null
  return MockIO.mock.calls[MockIO.mock.calls.length - 1][1] as { threshold: number }
}

function makeEntry(isIntersecting: boolean): Partial<IntersectionObserverEntry> {
  return { isIntersecting }
}

describe('useRevealOnScroll()', () => {
  it('demarre avec visible=false', () => {
    const { getByTestId } = render(<TestComponent />)
    expect(getByTestId('target')).toHaveAttribute('data-visible', 'false')
  })

  it('appelle IntersectionObserver avec le threshold par defaut (0.2)', () => {
    render(<TestComponent />)
    const options = getLastObserverOptions()
    expect(options?.threshold).toBe(0.2)
  })

  it('appelle IntersectionObserver avec un threshold personnalise', () => {
    render(<TestComponent threshold={0.5} />)
    const options = getLastObserverOptions()
    expect(options?.threshold).toBe(0.5)
  })

  it('definit visible=true quand element intersecte', () => {
    const { getByTestId } = render(<TestComponent />)
    const callback = getLastObserverCallback()!

    act(() => callback([makeEntry(true)]))

    expect(getByTestId('target')).toHaveAttribute('data-visible', 'true')
  })

  it('remet visible=false quand element quitte le viewport (once=false)', () => {
    const { getByTestId } = render(<TestComponent once={false} />)
    const callback = getLastObserverCallback()!

    act(() => callback([makeEntry(true)]))
    expect(getByTestId('target')).toHaveAttribute('data-visible', 'true')

    act(() => callback([makeEntry(false)]))
    expect(getByTestId('target')).toHaveAttribute('data-visible', 'false')
  })

  it('garde visible=true apres sortie du viewport si once=true', () => {
    const { getByTestId } = render(<TestComponent once={true} />)
    const callback = getLastObserverCallback()!

    act(() => callback([makeEntry(true)]))
    expect(getByTestId('target')).toHaveAttribute('data-visible', 'true')

    act(() => callback([makeEntry(false)]))
    expect(getByTestId('target')).toHaveAttribute('data-visible', 'true')
  })

  it('appelle observer.disconnect() au demontage', () => {
    const mockDisconnect = jest.fn()
    ;(window.IntersectionObserver as jest.Mock).mockImplementationOnce((cb) => ({
      observe:    jest.fn(),
      unobserve:  jest.fn(),
      disconnect: mockDisconnect,
    }))

    const { unmount } = render(<TestComponent />)
    unmount()
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
