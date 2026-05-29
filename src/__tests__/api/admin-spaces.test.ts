import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as GETList, POST } from '@/app/api/admin/spaces/route'
import { GET as GETOne, PUT, DELETE } from '@/app/api/admin/spaces/[id]/route'
import { createClient } from '@/lib/supabase/server'
import { buildSupabaseMock } from '../helpers/supabase'
import { makeGET, makePOST, makePUT, makeDELETE, makeParams } from '../helpers/request'

vi.mock('@/lib/supabase/server')

const FAKE_ADMIN  = { id: 'admin-1', email: 'admin@phyxel.fr' }
const FAKE_SPACE  = { id: 'space-1', title: 'Studio Admin', city: 'Paris', type: 'studio' }

/** Mock supabase avec un utilisateur admin (is_admin: true) */
function buildAdminMock(spaceData: unknown = FAKE_SPACE) {
  const sb = buildSupabaseMock({
    user:        FAKE_ADMIN,
    data:        spaceData,
    profileData: { is_admin: true },
  })
  return sb
}

/** Mock supabase avec un utilisateur non-admin */
function buildNonAdminMock() {
  return buildSupabaseMock({
    user:        { id: 'user-1' },
    profileData: { is_admin: false },
  })
}

describe('GET /api/admin/spaces', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETList()
    expect(res.status).toBe(401)
  })

  it('retourne 403 si non admin', async () => {
    const sb = buildNonAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETList()
    expect(res.status).toBe(403)
  })

  it('retourne 200 + liste pour un admin', async () => {
    const sb = buildAdminMock()
    // Override la chaîne pour retourner une liste (pas de .single())
    sb._chain.order = vi.fn().mockResolvedValue({ data: [FAKE_SPACE], error: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETList()
    expect(res.status).toBe(200)
  })
})

describe('POST /api/admin/spaces', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 403 si non admin', async () => {
    const sb = buildNonAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ title: 'Test', type: 'studio', city: 'Paris' }))
    expect(res.status).toBe(403)
  })

  it('retourne 400 si champs requis manquants', async () => {
    const sb = buildAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ title: 'Titre seulement' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/requis/)
  })

  it('retourne 201 + espace créé pour un admin', async () => {
    const sb = buildAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ title: 'Studio', type: 'studio', city: 'Paris' }))
    expect(res.status).toBe(201)
  })
})

describe('GET /api/admin/spaces/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 403 si non admin', async () => {
    const sb = buildNonAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETOne(makeGET(), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(403)
  })

  it('retourne 200 + espace pour un admin', async () => {
    const sb = buildAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETOne(makeGET(), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(200)
  })
})

describe('PUT /api/admin/spaces/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 403 si non admin', async () => {
    const sb = buildNonAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(makePUT({ title: 'Update', type: 'studio', city: 'Paris' }), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(403)
  })

  it('retourne 400 si champs requis manquants', async () => {
    const sb = buildAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(makePUT({ title: 'Only title' }), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(400)
  })

  it('retourne 200 + espace mis à jour pour un admin', async () => {
    const sb = buildAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(
      makePUT({ title: 'Updated', type: 'studio', city: 'Paris' }),
      makeParams({ id: 'space-1' }),
    )
    expect(res.status).toBe(200)
  })
})

describe('DELETE /api/admin/spaces/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 403 si non admin', async () => {
    const sb = buildNonAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await DELETE(makeDELETE(), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(403)
  })

  it('retourne 200 avec success:true pour un admin', async () => {
    const sb = buildAdminMock()
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await DELETE(makeDELETE(), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
