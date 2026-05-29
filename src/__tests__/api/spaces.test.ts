import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as GETList, POST } from '@/app/api/spaces/route'
import { GET as GETOne, PUT, DELETE } from '@/app/api/spaces/[id]/route'
import { createClient } from '@/lib/supabase/server'
import * as spacesQueries from '@/lib/queries/spaces'
import { buildSupabaseMock } from '../helpers/supabase'
import { makeGET, makePOST, makePUT, makeDELETE, makeParams } from '../helpers/request'

vi.mock('@/lib/supabase/server')
vi.mock('@/lib/queries/spaces')

const FAKE_USER  = { id: 'host-1', email: 'host@phyxel.fr' }
const FAKE_SPACE = { id: 'space-1', title: 'Studio Paris', city: 'Paris', host_id: 'host-1', space_photos: [] }

describe('GET /api/spaces', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 200 avec la liste des espaces', async () => {
    vi.mocked(spacesQueries.getSpaces).mockResolvedValue([FAKE_SPACE] as never)

    const res = await GETList(makeGET())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveLength(1)
    expect(json[0].id).toBe('space-1')
  })

  it('filtre par city et type via query params', async () => {
    vi.mocked(spacesQueries.getSpaces).mockResolvedValue([] as never)

    const req = makeGET('http://localhost/api/spaces', { city: 'Lyon', type: 'studio' })
    await GETList(req)

    expect(spacesQueries.getSpaces).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'Lyon', type: 'studio' })
    )
  })

  it('retourne 500 si getSpaces lance une erreur', async () => {
    vi.mocked(spacesQueries.getSpaces).mockRejectedValue(new Error('DB error'))

    const res = await GETList(makeGET())
    expect(res.status).toBe(500)
  })
})

describe('POST /api/spaces', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ title: 'Test' }))
    expect(res.status).toBe(401)
  })

  it('retourne 201 + espace créé si authentifié', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER, data: FAKE_SPACE })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ title: 'Studio Paris', city: 'Paris', type: 'studio' }))
    expect(res.status).toBe(201)
  })
})

describe('GET /api/spaces/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 200 + espace si trouvé', async () => {
    vi.mocked(spacesQueries.getSpaceById).mockResolvedValue(FAKE_SPACE as never)

    const res = await GETOne(makeGET(), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.id).toBe('space-1')
  })

  it('retourne 404 si espace introuvable', async () => {
    vi.mocked(spacesQueries.getSpaceById).mockResolvedValue(null)

    const res = await GETOne(makeGET(), makeParams({ id: 'unknown' }))
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/spaces/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(makePUT({ title: 'Updated' }), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(401)
  })

  it('retourne 200 + espace mis à jour', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER, data: { ...FAKE_SPACE, title: 'Updated' } })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(makePUT({ title: 'Updated' }), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(200)
  })
})

describe('DELETE /api/spaces/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await DELETE(makeDELETE(), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(401)
  })

  it('retourne 204 si suppression réussie', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await DELETE(makeDELETE(), makeParams({ id: 'space-1' }))
    expect(res.status).toBe(204)
  })
})
