jest.mock('server-only')
jest.mock('@/lib/supabase/admin')
jest.mock('@/lib/admin/jwt')
jest.mock('@/lib/admin/session')
jest.mock('bcryptjs')

import { getCurrentAdmin, loginAdmin, requireAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminJwt, signAdminJwt } from '@/lib/admin/jwt'
import { setAdminCookie, ADMIN_COOKIE } from '@/lib/admin/session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

const fakeAdminRow = {
  id:            'admin-id-1',
  email:         'admin@test.com',
  full_name:     'Super Admin',
  password_hash: '$2b$10$hashedpassword',
  is_active:     true,
}

function makeMockSupabase(maybeSingleResult: { data: unknown; error: unknown }) {
  const chain = {
    select:      jest.fn().mockReturnThis(),
    eq:          jest.fn().mockReturnThis(),
    update:      jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue(maybeSingleResult),
  }
  return {
    from: jest.fn(() => chain),
    _chain: chain,
  }
}

describe('getCurrentAdmin()', () => {
  it('retourne null si pas de cookie admin_session', async () => {
    ;(cookies as jest.Mock).mockResolvedValue({ get: jest.fn(() => undefined) })
    const result = await getCurrentAdmin()
    expect(result).toBeNull()
  })

  it('retourne null si verifyAdminJwt retourne null', async () => {
    ;(cookies as jest.Mock).mockResolvedValue({ get: jest.fn(() => ({ value: 'bad-token' })) })
    ;(verifyAdminJwt as jest.Mock).mockResolvedValue(null)
    const result = await getCurrentAdmin()
    expect(result).toBeNull()
  })

  it("retourne null si la DB ne trouve pas l'admin (data null)", async () => {
    ;(cookies as jest.Mock).mockResolvedValue({ get: jest.fn(() => ({ value: 'valid-token' })) })
    ;(verifyAdminJwt as jest.Mock).mockResolvedValue({ sub: 'admin-id-1', email: 'admin@test.com', full_name: null })
    ;(createAdminClient as jest.Mock).mockReturnValue(
      makeMockSupabase({ data: null, error: null })
    )
    const result = await getCurrentAdmin()
    expect(result).toBeNull()
  })

  it("retourne l'objet Admin si token valide + admin actif en DB", async () => {
    ;(cookies as jest.Mock).mockResolvedValue({ get: jest.fn(() => ({ value: 'valid-token' })) })
    ;(verifyAdminJwt as jest.Mock).mockResolvedValue({ sub: 'admin-id-1', email: 'admin@test.com', full_name: 'Super Admin' })
    ;(createAdminClient as jest.Mock).mockReturnValue(
      makeMockSupabase({ data: fakeAdminRow, error: null })
    )

    const result = await getCurrentAdmin()
    expect(result).toEqual({
      id:        fakeAdminRow.id,
      email:     fakeAdminRow.email,
      full_name: fakeAdminRow.full_name,
    })
  })
})

describe('requireAdmin()', () => {
  it("retourne l'admin si authentifie", async () => {
    ;(cookies as jest.Mock).mockResolvedValue({ get: jest.fn(() => ({ value: 'valid-token' })) })
    ;(verifyAdminJwt as jest.Mock).mockResolvedValue({ sub: 'admin-id-1', email: 'admin@test.com', full_name: null })
    ;(createAdminClient as jest.Mock).mockReturnValue(
      makeMockSupabase({ data: fakeAdminRow, error: null })
    )

    const result = await requireAdmin()
    expect(result.id).toBe('admin-id-1')
  })

  it('appelle redirect("/admin/login?redirect=...") si non authentifié', async () => {
    ;(cookies as jest.Mock).mockResolvedValue({ get: jest.fn(() => undefined) })

    await requireAdmin('/admin/espaces').catch(() => {})
    expect(redirect).toHaveBeenCalledWith(
      expect.stringContaining('/admin/login?redirect=')
    )
  })
})

describe('loginAdmin()', () => {
  it('retourne null si email inconnu (data null)', async () => {
    ;(createAdminClient as jest.Mock).mockReturnValue(
      makeMockSupabase({ data: null, error: null })
    )
    const result = await loginAdmin('unknown@test.com', 'anypassword')
    expect(result).toBeNull()
  })

  it('retourne null si bcrypt.compare retourne false', async () => {
    ;(createAdminClient as jest.Mock).mockReturnValue(
      makeMockSupabase({ data: fakeAdminRow, error: null })
    )
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

    const result = await loginAdmin(fakeAdminRow.email, 'wrong-password')
    expect(result).toBeNull()
  })

  it("retourne l'Admin et pose le cookie si login reussi", async () => {
    ;(createAdminClient as jest.Mock).mockReturnValue(
      makeMockSupabase({ data: fakeAdminRow, error: null })
    )
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    ;(signAdminJwt as jest.Mock).mockResolvedValue('signed-jwt-token')

    const result = await loginAdmin(fakeAdminRow.email, 'correct-password')

    expect(result).toEqual({
      id:        fakeAdminRow.id,
      email:     fakeAdminRow.email,
      full_name: fakeAdminRow.full_name,
    })
    expect(setAdminCookie).toHaveBeenCalledWith('signed-jwt-token')
  })
})
