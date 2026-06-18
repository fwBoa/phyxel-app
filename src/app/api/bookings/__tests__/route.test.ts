jest.mock('@/lib/supabase/server')

import { GET, POST } from '@/app/api/bookings/route'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function makePostRequest(body: object): NextRequest {
  return new NextRequest(new URL('http://localhost/api/bookings'), {
    method:  'POST',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function makeGetSupabase(user: unknown = null, bookings: unknown = []) {
  const queryChain = {
    select:  jest.fn().mockReturnThis(),
    eq:      jest.fn().mockReturnThis(),
    order:   jest.fn().mockResolvedValue({ data: bookings, error: null }),
  }
  return {
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user } }) },
    from: jest.fn(() => queryChain),
  }
}

function makePostSupabase(
  user: unknown = null,
  spaceData: { price_day: number | null } | null = null,
  bookingResult: unknown = null
) {
  const spaceChain = {
    select:  jest.fn().mockReturnThis(),
    eq:      jest.fn().mockReturnThis(),
    single:  jest.fn().mockResolvedValue({ data: spaceData, error: null }),
  }
  const bookingInsertSingle = jest.fn().mockResolvedValue(
    bookingResult !== null
      ? { data: bookingResult, error: null }
      : { data: null, error: { message: 'insert error' } }
  )
  const bookingChain = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: bookingInsertSingle,
  }

  return {
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user } }) },
    from: jest.fn((table: string) => {
      if (table === 'spaces')   return spaceChain
      if (table === 'bookings') return bookingChain
      return {}
    }),
    _bookingChain: bookingChain,
    _spaceChain:   spaceChain,
  }
}

describe('GET /api/bookings', () => {
  it('retourne 401 si aucun utilisateur connecte', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(makeGetSupabase(null))
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it("retourne 200 avec les bookings de l'utilisateur", async () => {
    const fakeBookings = [{ id: 'b1', space_id: 's1' }]
    ;(createClient as jest.Mock).mockResolvedValue(
      makeGetSupabase({ id: 'user-1' }, fakeBookings)
    )

    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual(fakeBookings)
  })
})

describe('POST /api/bookings', () => {
  it('retourne 401 si aucun utilisateur connecte', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(makePostSupabase(null))
    const res = await POST(makePostRequest({ space_id: 's1', start_date: '2025-01-01', end_date: '2025-01-04' }))
    expect(res.status).toBe(401)
  })

  it('retourne 400 si space_id manquant', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(makePostSupabase({ id: 'user-1' }))
    const res = await POST(makePostRequest({ start_date: '2025-01-01', end_date: '2025-01-04' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('manquants')
  })

  it('retourne 400 si start_date ou end_date manquant', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(makePostSupabase({ id: 'user-1' }))
    const res = await POST(makePostRequest({ space_id: 's1' }))
    expect(res.status).toBe(400)
  })

  it('calcule total_price = jours x price_day', async () => {
    const fakeBooking = { id: 'b1', total_price: 600 }
    const mock = makePostSupabase({ id: 'user-1' }, { price_day: 200 }, fakeBooking)
    ;(createClient as jest.Mock).mockResolvedValue(mock)

    // start=2025-01-01, end=2025-01-04 = 3 jours
    const res = await POST(makePostRequest({
      space_id:   's1',
      start_date: '2025-01-01',
      end_date:   '2025-01-04',
    }))

    expect(res.status).toBe(201)
    expect(mock._bookingChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ total_price: 600 })
    )
  })

  it("definit total_price=null si l'espace n'a pas de price_day", async () => {
    const fakeBooking = { id: 'b1', total_price: null }
    const mock = makePostSupabase({ id: 'user-1' }, { price_day: null }, fakeBooking)
    ;(createClient as jest.Mock).mockResolvedValue(mock)

    await POST(makePostRequest({ space_id: 's1', start_date: '2025-01-01', end_date: '2025-01-04' }))

    expect(mock._bookingChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ total_price: null })
    )
  })

  it('retourne 201 avec le booking cree', async () => {
    const fakeBooking = { id: 'b1', space_id: 's1', brand_id: 'user-1', total_price: 400 }
    const mock = makePostSupabase({ id: 'user-1' }, { price_day: 200 }, fakeBooking)
    ;(createClient as jest.Mock).mockResolvedValue(mock)

    const res = await POST(makePostRequest({ space_id: 's1', start_date: '2025-01-01', end_date: '2025-01-03' }))

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toEqual(fakeBooking)
  })
})
