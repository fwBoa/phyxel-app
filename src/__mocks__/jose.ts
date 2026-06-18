// Mock jose qui utilise Node.js crypto pour de vrais JWT HS256
// Permet les tests round-trip (sign → verify) avec de vraies vérifications de secret
import { createHmac } from 'crypto'

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function b64urlDecode(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

interface JWTOptions {
  issuer?: string
  audience?: string
  algorithms?: string[]
}

interface JWTPayload {
  [key: string]: unknown
  sub?: string
  iss?: string
  aud?: string | string[]
  iat?: number
  exp?: number
}

export class SignJWT {
  private payload: JWTPayload

  constructor(payload: JWTPayload) {
    this.payload = { ...payload }
  }
  setProtectedHeader(_h: { alg: string }): this { return this }
  setSubject(sub: string): this     { this.payload.sub = sub; return this }
  setIssuer(iss: string): this      { this.payload.iss = iss; return this }
  setAudience(aud: string): this    { this.payload.aud = aud; return this }
  setIssuedAt(iat: number): this    { this.payload.iat = iat; return this }
  setExpirationTime(exp: number): this { this.payload.exp = exp; return this }

  async sign(secret: Uint8Array): Promise<string> {
    const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body   = base64url(JSON.stringify(this.payload))
    const sig    = createHmac('sha256', Buffer.from(secret))
      .update(`${header}.${body}`)
      .digest()
    return `${header}.${body}.${base64url(sig)}`
  }
}

export async function jwtVerify(
  token: string,
  secret: Uint8Array,
  options?: JWTOptions
): Promise<{ payload: JWTPayload }> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT format')

  const [header, body, sig] = parts
  const expectedSig = createHmac('sha256', Buffer.from(secret))
    .update(`${header}.${body}`)
    .digest()

  if (base64url(expectedSig) !== sig) throw new Error('Signature verification failed')

  const payload = JSON.parse(b64urlDecode(body).toString()) as JWTPayload

  if (options?.issuer && payload.iss !== options.issuer)
    throw new Error('Unexpected issuer')
  if (options?.audience) {
    const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
    if (!aud.includes(options.audience)) throw new Error('Unexpected audience')
  }
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000))
    throw new Error('Token expired')

  return { payload }
}

export type JWTPayload = JWTPayload
