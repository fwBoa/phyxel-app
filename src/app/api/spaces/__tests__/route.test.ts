jest.mock('@/lib/supabase/server')
jest.mock('@/lib/queries/spaces')

import { GET, POST } from '@/app/api/spaces/route'
import { NextRequest } from 'next/server'
import { getSpaces } from '@/lib/queries/spaces'
import { createClient } from '@/lib/supabase/server'

function makeRequest(url: string, options?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'), options)
}

function makeMockSupabase(user: unknown = null, insertResult = { data: null, error: null }) {
  const singleSpy = jest.fn().mockResolvedValue(insertResult)
  const chain = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: singleSpy,
  }
  return {
    auth:  { getUser: jest.fn().mockResolvedValue({ data: { user } }) },
    from:  jest.fn(() => chain),
    _chain: chain,
  }
}

describe('GET /api/spaces', () => {
  it('retourne 200 avec le tableau d\'espaces', async () => {
    ;(getSpaces as jest.Mock).mockResolvedValue([{ id: 's1' }])

    const res = await GET(makeRequest('http://localhost/api/spaces'))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([{ id: 's1' }])
  })

  it('passe le filtre city à getSpaces', async () => {
    ;(getSpaces as jest.Mock).mockResolvedValue([])

    await GET(makeRequest('http://localhost/api/spaces?city=Paris'))

    expect(getSpaces).toHaveBeenCalledWith(expect.objectContaining({ city: 'Paris' }))
  })

  it('passe les filtres type, minPrice et maxPrice à getSpaces', async () => {
    ;(getSpaces as jest.Mock).mockResolvedValue([])

    await GET(makeRequest('http://localhost/api/spaces?type=popup&minPrice=100&maxPrice=500'))

    expect(getSpaces).toHaveBeenCalledWith(expect.objectContaining({
      type:     'popup',
      minPrice: 100,
      maxPrice: 500,
    }))
  })

  it('retourne 500 si getSpaces throw', async () => {
    ;(getSpaces as jest.Mock).mockRejectedValue(new Error('db error'))

    const res = await GET(makeRequest('http://localhost/api/spaces'))

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })
})

describe('POST /api/spaces', () => {
  it('retourne 401 si aucun utilisateur connecté', async () => {
    const mockSupabase = makeMockSupabase(null)
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

    const req = makeRequest('http://localhost/api/spaces', {
      method: 'POST',
      body:   JSON.stringify({ title: 'Test Space', type: 'popup', city: 'Paris', host_id: 'h1' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  it('retourne 201 avec l\'espace créé si user connecté', async () => {
    const fakeSpace = { id: 's1', title: 'Test Space' }
    const mockSupabase = makeMockSupabase(
      { id: 'user-1' },
      { data: fakeSpace, error: null }
    )
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

    const req = makeRequest('http://localhost/api/spaces', {
      method: 'POST',
      body:   JSON.stringify({ title: 'Test Space', type: 'popup', city: 'Paris' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toEqual(fakeSpace)
  })

  it('retourne 400 si l\'insert échoue', async () => {
    const mockSupabase = makeMockSupabase(
      { id: 'user-1' },
      { data: null, error: { message: 'violates constraint' } }
    )
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

    const req = makeRequest('http://localhost/api/spaces', {
      method: 'POST',
      body:   JSON.stringify({ title: 'Bad Space' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })
})
