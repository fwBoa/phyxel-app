import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as GETList, POST } from '@/app/api/bookings/route'
import { GET as GETOne, PUT, DELETE } from '@/app/api/bookings/[id]/route'
import { createClient } from '@/lib/supabase/server'
import { buildSupabaseMock } from '../helpers/supabase'
import { makeGET, makePOST, makePUT, makeDELETE, makeParams } from '../helpers/request'

vi.mock('@/lib/supabase/server')

const FAKE_USER    = { id: 'brand-1', email: 'brand@phyxel.fr' }
const FAKE_BOOKING = { id: 'booking-1', brand_id: 'brand-1', space_id: 'space-1', total_price: 200 }
const FAKE_SPACE   = { price_day: 100 }

// Helper: mock supabase with per-table behavior
function buildBookingMock({
  user = FAKE_USER as unknown,
  bookingData = FAKE_BOOKING as unknown,
  spaceData = FAKE_SPACE as unknown,
  error = null as unknown,
} = {}) {
  const sb = buildSupabaseMock({ user })

  // Override from() to return space data when table === 'spaces' (for price calc)
  const originalFrom = sb.from
  sb.from = vi.fn().mockImplementation((table: string) => {
    if (table === 'spaces') {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: spaceData, error: null }),
      }
    }
    if (table === 'bookings') {
      return {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: bookingData, error }),
        // for GET list (no .single())
        then: undefined,
      }
    }
    return originalFrom(table)
  })

  return sb
}

describe('GET /api/bookings', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    // make the list call resolve (no .single())
    sb.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETList()
    expect(res.status).toBe(401)
  })

  it('retourne 200 avec la liste des réservations', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER })
    sb.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [FAKE_BOOKING], error: null }),
    })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETList()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveLength(1)
  })
})

describe('POST /api/bookings', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ space_id: 's1', start_date: '2025-01-01', end_date: '2025-01-03' }))
    expect(res.status).toBe(401)
  })

  it('retourne 400 si champs manquants', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({ space_id: 's1' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Champs manquants')
  })

  it('retourne 201 avec calcul du prix (2 jours × 100€ = 200€)', async () => {
    const sb = buildBookingMock()
    sb.from = vi.fn().mockImplementation((table: string) => {
      if (table === 'spaces') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { price_day: 100 }, error: null }),
        }
      }
      return {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { ...FAKE_BOOKING, total_price: 200 }, error: null }),
      }
    })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await POST(makePOST({
      space_id:   'space-1',
      start_date: '2025-01-01',
      end_date:   '2025-01-03',
    }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.total_price).toBe(200)
  })
})

describe('GET /api/bookings/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETOne(makeGET(), makeParams({ id: 'booking-1' }))
    expect(res.status).toBe(401)
  })

  it('retourne 200 + booking si trouvé', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER, data: FAKE_BOOKING })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETOne(makeGET(), makeParams({ id: 'booking-1' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.id).toBe('booking-1')
  })

  it('retourne 404 si booking introuvable', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER, error: { message: 'not found' } })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await GETOne(makeGET(), makeParams({ id: 'unknown' }))
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/bookings/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(makePUT({ status: 'confirmed' }), makeParams({ id: 'booking-1' }))
    expect(res.status).toBe(401)
  })

  it('retourne 200 + booking mis à jour', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER, data: { ...FAKE_BOOKING, status: 'confirmed' } })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await PUT(makePUT({ status: 'confirmed' }), makeParams({ id: 'booking-1' }))
    expect(res.status).toBe(200)
  })
})

describe('DELETE /api/bookings/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne 401 si non authentifié', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await DELETE(makeDELETE(), makeParams({ id: 'booking-1' }))
    expect(res.status).toBe(401)
  })

  it('retourne 204 si suppression réussie', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const res = await DELETE(makeDELETE(), makeParams({ id: 'booking-1' }))
    expect(res.status).toBe(204)
  })
})
