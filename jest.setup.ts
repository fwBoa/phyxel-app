import '@testing-library/jest-dom'

process.env.NEXT_PUBLIC_SUPABASE_URL             = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY        = 'test-anon-key'
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY            = 'test-service-role-key'
process.env.ADMIN_JWT_SECRET                     = 'test-secret-32chars-padded!!!!!'
process.env.ADMIN_SESSION_TTL_SECONDS            = '28800'
process.env.NODE_ENV                             = 'test'

const mockIntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe:    jest.fn(),
  unobserve:  jest.fn(),
  disconnect: jest.fn(),
  _trigger:   (entries: IntersectionObserverEntry[]) => callback(entries),
}))
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: mockIntersectionObserver,
})

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe:    jest.fn(),
    unobserve:  jest.fn(),
    disconnect: jest.fn(),
  })),
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches:             false,
    media:               query,
    onchange:            null,
    addListener:         jest.fn(),
    removeListener:      jest.fn(),
    addEventListener:    jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent:       jest.fn(),
  })),
})

global.fetch = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})
