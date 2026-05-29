import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/route'
import { createClient } from '@/lib/supabase/server'
import { buildSupabaseMock } from '../helpers/supabase'
import { makePOST } from '../helpers/request'

vi.mock('@/lib/supabase/server')

const FAKE_USER = { id: 'user-1', email: 'test@phyxel.fr' }

describe('POST /api/auth', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── signIn ──────────────────────────────────────────────────
  it('signIn : retourne 200 + user si credentials valides', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ action: 'signIn', email: 'test@phyxel.fr', password: 'secret' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.user.id).toBe('user-1')
  })

  it('signIn : retourne 401 si credentials invalides', async () => {
    const sb = buildSupabaseMock({ error: { message: 'Invalid credentials' } })
    sb.auth.signInWithPassword = vi.fn().mockResolvedValue({ data: {}, error: { message: 'Invalid credentials' } })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ action: 'signIn', email: 'x@x.fr', password: 'wrong' }))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Invalid credentials')
  })

  // ── signUp ──────────────────────────────────────────────────
  it('signUp : retourne 201 + user créé', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ action: 'signUp', email: 'new@phyxel.fr', password: 'secret123', full_name: 'Sophie', role: 'brand' }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.user).toBeDefined()
  })

  it('signUp : retourne 400 si email déjà utilisé', async () => {
    const sb = buildSupabaseMock()
    sb.auth.signUp = vi.fn().mockResolvedValue({ data: {}, error: { message: 'Email already registered' } })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ action: 'signUp', email: 'existing@phyxel.fr', password: 'secret' }))
    expect(res.status).toBe(400)
  })

  // ── signOut ─────────────────────────────────────────────────
  it('signOut : retourne 200 avec success:true', async () => {
    const sb = buildSupabaseMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ action: 'signOut' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  // ── action inconnue ─────────────────────────────────────────
  it('retourne 400 pour une action inconnue', async () => {
    const sb = buildSupabaseMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ action: 'hackMe' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Action inconnue')
  })
})
