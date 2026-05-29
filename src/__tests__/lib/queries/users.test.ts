import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCurrentUser, getProfile, getBookingsByUser } from '@/lib/queries/users'
import { createClient } from '@/lib/supabase/server'
import { buildSupabaseMock } from '../../helpers/supabase'

vi.mock('@/lib/supabase/server')

const FAKE_USER    = { id: 'user-1', email: 'user@phyxel.fr' }
const FAKE_PROFILE = { id: 'user-1', full_name: 'Sophie', role: 'brand' }
const FAKE_BOOKING = { id: 'booking-1', brand_id: 'user-1', space_id: 'space-1' }

describe('getCurrentUser()', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne l\'utilisateur connecté', async () => {
    const sb = buildSupabaseMock({ user: FAKE_USER })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const user = await getCurrentUser()
    expect(user?.id).toBe('user-1')
  })

  it('retourne null si non connecté', async () => {
    const sb = buildSupabaseMock({ user: null })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const user = await getCurrentUser()
    expect(user).toBeNull()
  })
})

describe('getProfile(id)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne le profil si trouvé', async () => {
    const sb = buildSupabaseMock({ profileData: FAKE_PROFILE })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const profile = await getProfile('user-1')
    expect(profile?.id).toBe('user-1')
    expect(profile?.full_name).toBe('Sophie')
  })

  it('retourne null si erreur Supabase', async () => {
    const sb = buildSupabaseMock({ error: { message: 'not found' } })
    // getProfile utilise from('profiles') → single() qui retourne error
    sb.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
    })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const profile = await getProfile('unknown')
    expect(profile).toBeNull()
  })
})

describe('getBookingsByUser(userId)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retourne la liste des réservations de l\'utilisateur', async () => {
    const sb = buildSupabaseMock()
    sb.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [FAKE_BOOKING], error: null }),
    })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    const bookings = await getBookingsByUser('user-1')
    expect(bookings).toHaveLength(1)
    expect(bookings[0].id).toBe('booking-1')
  })

  it('lance une erreur si Supabase échoue', async () => {
    const sb = buildSupabaseMock()
    sb.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    })
    vi.mocked(createClient).mockResolvedValue(sb as never)

    await expect(getBookingsByUser('user-1')).rejects.toMatchObject({ message: 'DB error' })
  })
})
