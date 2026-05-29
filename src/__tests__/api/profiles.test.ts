import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT } from '@/app/api/profiles/[id]/route'
import { createClient } from '@/lib/supabase/server'
import * as usersQueries from '@/lib/queries/users'
import { buildSupabaseMock } from '../helpers/supabase'
import { makeGET, makePUT, makeParams } from '../helpers/request'

vi.mock('@/lib/supabase/server')
vi.mock('@/lib/queries/users')

const FAKE_USER    = { id: 'user-1', email: 'user@phyxel.fr' }
const FAKE_PROFILE = { id: 'user-1', full_name: 'Sophie', role: 'brand' }

describe('GET /api/profiles/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 200 + profil si trouvé', async () => {
    vi.mocked(usersQueries.getProfile).mockResolvedValue(FAKE_PROFILE as never)

    const res = await GET(makeGET(), makeParams({ id: 'user-1' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.id).toBe('user-1')
  })

  it('retourne 404 si profil introuvable', async () => {
    vi.mocked(usersQueries.getProfile).mockResolvedValue(null)

    const res = await GET(makeGET(), makeParams({ id: 'unknown' }))
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/profiles/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 403 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(makePUT({ full_name: 'New Name' }), makeParams({ id: 'user-1' }))
    expect(res.status).toBe(403)
  })

  it('retourne 403 si l\'utilisateur modifie un autre profil', async () => {
    const sb = buildSupabaseMock({ user: { ...FAKE_USER, id: 'other-user' } })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(makePUT({ full_name: 'Hack' }), makeParams({ id: 'user-1' }))
    expect(res.status).toBe(403)
  })

  it('retourne 200 + profil mis à jour si propriétaire', async () => {
    const sb = buildSupabaseMock({
      user: FAKE_USER,
      profileData: { ...FAKE_PROFILE, full_name: 'Sophie Updated' },
    })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(makePUT({ full_name: 'Sophie Updated' }), makeParams({ id: 'user-1' }))
    expect(res.status).toBe(200)
  })
})
