jest.mock('server-only')

import { signAdminJwt, verifyAdminJwt } from '@/lib/admin/jwt'
import type { Admin } from '@/lib/admin/auth'

const testAdmin: Admin = {
  id:        'uuid-test-123',
  email:     'admin@test.com',
  full_name: 'Test Admin',
}

describe('signAdminJwt()', () => {
  it('retourne une string non vide', async () => {
    const token = await signAdminJwt(testAdmin)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('produit un token vérifiable par verifyAdminJwt()', async () => {
    const token = await signAdminJwt(testAdmin)
    const payload = await verifyAdminJwt(token)
    expect(payload).not.toBeNull()
  })

  it('throw si ADMIN_JWT_SECRET est absent', async () => {
    const original = process.env.ADMIN_JWT_SECRET
    delete process.env.ADMIN_JWT_SECRET
    await expect(signAdminJwt(testAdmin)).rejects.toThrow()
    process.env.ADMIN_JWT_SECRET = original
  })

  it('throw si ADMIN_JWT_SECRET fait moins de 16 caractères', async () => {
    const original = process.env.ADMIN_JWT_SECRET
    process.env.ADMIN_JWT_SECRET = 'short'
    await expect(signAdminJwt(testAdmin)).rejects.toThrow()
    process.env.ADMIN_JWT_SECRET = original
  })
})

describe('verifyAdminJwt()', () => {
  it('retourne le payload correct pour un token valide', async () => {
    const token = await signAdminJwt(testAdmin)
    const payload = await verifyAdminJwt(token)
    expect(payload).toMatchObject({
      sub:       testAdmin.id,
      email:     testAdmin.email,
      full_name: testAdmin.full_name,
    })
  })

  it('retourne null pour une string malformée', async () => {
    const result = await verifyAdminJwt('not-a-valid-jwt')
    expect(result).toBeNull()
  })

  it('retourne null pour un token signé avec un autre secret', async () => {
    const original = process.env.ADMIN_JWT_SECRET
    const token = await signAdminJwt(testAdmin)
    process.env.ADMIN_JWT_SECRET = 'completely-different-secret!!'
    const result = await verifyAdminJwt(token)
    expect(result).toBeNull()
    process.env.ADMIN_JWT_SECRET = original
  })

  it('retourne null pour un token avec sub manquant', async () => {
    const { SignJWT } = await import('jose')
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET)
    const now = Math.floor(Date.now() / 1000)
    const token = await new SignJWT({ email: 'admin@test.com' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('phyxel-admin')
      .setAudience('phyxel-admin')
      .setIssuedAt(now)
      .setExpirationTime(now + 28800)
      .sign(secret)
    const result = await verifyAdminJwt(token)
    expect(result).toBeNull()
  })

  it("met full_name a null si la claim n'est pas une string", async () => {
    const { SignJWT } = await import('jose')
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET)
    const now = Math.floor(Date.now() / 1000)
    const token = await new SignJWT({ email: 'admin@test.com', full_name: 42 })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('some-id')
      .setIssuer('phyxel-admin')
      .setAudience('phyxel-admin')
      .setIssuedAt(now)
      .setExpirationTime(now + 28800)
      .sign(secret)
    const result = await verifyAdminJwt(token)
    expect(result?.full_name).toBeNull()
  })
})
