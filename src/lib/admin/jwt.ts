// JWT signé HS256 pour la session admin
// Indépendant de Supabase Auth.

import 'server-only'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import type { Admin } from './auth'

const ALG = 'HS256'
const ISSUER = 'phyxel-admin'
const AUDIENCE = 'phyxel-admin'

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_JWT_SECRET manquant ou trop court (>= 16 caractères requis).')
  }
  return new TextEncoder().encode(secret)
}

function getTtlSeconds(): number {
  const raw = process.env.ADMIN_SESSION_TTL_SECONDS
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 8 * 60 * 60 // 8h
}

export async function signAdminJwt(admin: Admin): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return await new SignJWT({
    email:     admin.email,
    full_name: admin.full_name,
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(admin.id)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime(now + getTtlSeconds())
    .sign(getSecret())
}

export async function verifyAdminJwt(token: string): Promise<{ sub: string; email: string; full_name: string | null } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer:   ISSUER,
      audience: AUDIENCE,
      algorithms: [ALG],
    })

    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      return null
    }

    return {
      sub:       payload.sub,
      email:     payload.email,
      full_name: typeof payload.full_name === 'string' ? payload.full_name : null,
    }
  } catch {
    return null
  }
}

// Helper pour typer le payload JWT (utilisé en interne par jose)
export type AdminJwtPayload = JWTPayload
