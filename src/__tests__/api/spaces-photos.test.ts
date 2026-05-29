import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/spaces/[id]/photos/route'
import { createClient } from '@/lib/supabase/server'
import { buildSupabaseMock } from '../helpers/supabase'
import { makeParams } from '../helpers/request'
import { NextRequest } from 'next/server'

vi.mock('@/lib/supabase/server')

const FAKE_USER  = { id: 'host-1', email: 'host@phyxel.fr' }
const FAKE_PHOTO = { id: 'photo-1', space_id: 'space-1', url: 'https://cdn.example.com/photo.jpg', is_cover: true }

function makeFormDataRequest(file: File | null, url = 'http://localhost/api/spaces/space-1/photos') {
  const formData = new FormData()
  if (file) {
    formData.append('file', file)
    formData.append('is_cover', 'true')
  }
  return new NextRequest(url, { method: 'POST', body: formData })
}

describe('POST /api/spaces/[id]/photos', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const req = makeFormDataRequest(new File(['img'], 'photo.jpg', { type: 'image/jpeg' }))
    const res = await POST(req, makeParams({ id: 'space-1' }))
    expect(res.status).toBe(401)
  })

  it('retourne 400 si fichier manquant', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const req = makeFormDataRequest(null)
    const res = await POST(req, makeParams({ id: 'space-1' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Fichier manquant')
  })

  it('retourne 201 + photo si upload réussi', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER, data: FAKE_PHOTO })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const file = new File(['fake image content'], 'photo.jpg', { type: 'image/jpeg' })
    const req  = makeFormDataRequest(file)
    const res  = await POST(req, makeParams({ id: 'space-1' }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.url).toBeDefined()
  })
})
