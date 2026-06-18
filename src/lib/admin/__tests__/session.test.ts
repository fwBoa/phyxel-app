jest.mock('server-only')

import { setAdminCookie, clearAdminCookie, ADMIN_COOKIE } from '@/lib/admin/session'
import { cookies } from 'next/headers'

describe('setAdminCookie()', () => {
  it('appelle cookieStore.set avec le bon nom de cookie', async () => {
    const mockSet = jest.fn()
    ;(cookies as jest.Mock).mockResolvedValue({ set: mockSet })

    await setAdminCookie('test-jwt-token')

    expect(mockSet).toHaveBeenCalledWith(
      ADMIN_COOKIE,
      'test-jwt-token',
      expect.any(Object)
    )
  })

  it('passe httpOnly: true', async () => {
    const mockSet = jest.fn()
    ;(cookies as jest.Mock).mockResolvedValue({ set: mockSet })

    await setAdminCookie('test-jwt-token')

    const options = mockSet.mock.calls[0][2]
    expect(options.httpOnly).toBe(true)
  })

  it('passe maxAge depuis ADMIN_SESSION_TTL_SECONDS (28800)', async () => {
    const mockSet = jest.fn()
    ;(cookies as jest.Mock).mockResolvedValue({ set: mockSet })

    await setAdminCookie('test-jwt-token')

    const options = mockSet.mock.calls[0][2]
    expect(options.maxAge).toBe(28800)
  })

  it('utilise le TTL par défaut (8h = 28800s) si env var absente', async () => {
    const mockSet = jest.fn()
    ;(cookies as jest.Mock).mockResolvedValue({ set: mockSet })
    const original = process.env.ADMIN_SESSION_TTL_SECONDS
    delete process.env.ADMIN_SESSION_TTL_SECONDS

    await setAdminCookie('test-jwt-token')

    const options = mockSet.mock.calls[0][2]
    expect(options.maxAge).toBe(8 * 60 * 60)
    process.env.ADMIN_SESSION_TTL_SECONDS = original
  })

  it('secure: false en environnement test', async () => {
    const mockSet = jest.fn()
    ;(cookies as jest.Mock).mockResolvedValue({ set: mockSet })

    await setAdminCookie('test-jwt-token')

    const options = mockSet.mock.calls[0][2]
    expect(options.secure).toBe(false)
  })
})

describe('clearAdminCookie()', () => {
  it('appelle cookieStore.set avec une valeur vide', async () => {
    const mockSet = jest.fn()
    ;(cookies as jest.Mock).mockResolvedValue({ set: mockSet })

    await clearAdminCookie()

    expect(mockSet).toHaveBeenCalledWith(ADMIN_COOKIE, '', expect.any(Object))
  })

  it('passe maxAge: 0 pour expirer le cookie', async () => {
    const mockSet = jest.fn()
    ;(cookies as jest.Mock).mockResolvedValue({ set: mockSet })

    await clearAdminCookie()

    const options = mockSet.mock.calls[0][2]
    expect(options.maxAge).toBe(0)
  })
})
