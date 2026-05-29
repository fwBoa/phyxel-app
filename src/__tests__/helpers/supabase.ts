import { vi } from 'vitest'

/** Construit un mock Supabase complet et chaînable */
export function buildSupabaseMock({
  user = null as unknown,
  data = null as unknown,
  error = null as unknown,
  profileData = null as unknown,
} = {}) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    select:      vi.fn().mockReturnThis(),
    insert:      vi.fn().mockReturnThis(),
    update:      vi.fn().mockReturnThis(),
    delete:      vi.fn().mockReturnThis(),
    eq:          vi.fn().mockReturnThis(),
    order:       vi.fn().mockReturnThis(),
    limit:       vi.fn().mockReturnThis(),
    gte:         vi.fn().mockReturnThis(),
    lte:         vi.fn().mockReturnThis(),
    single:      vi.fn().mockResolvedValue({ data, error }),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
  }

  // mock from() — gère profiles séparément
  const fromMock = vi.fn().mockImplementation((table: string) => {
    if (table === 'profiles' && profileData !== null) {
      return {
        ...chain,
        single: vi.fn().mockResolvedValue({ data: profileData, error: null }),
        select: vi.fn().mockReturnThis(),
        eq:     vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
      }
    }
    return chain
  })

  const storageMock = {
    from: vi.fn().mockReturnValue({
      upload:       vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/photo.jpg' } }),
    }),
  }

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user }, error }),
      signUp:   vi.fn().mockResolvedValue({ data: { user }, error }),
      signOut:  vi.fn().mockResolvedValue({}),
    },
    from:    fromMock,
    storage: storageMock,
    _chain:  chain,
  }
}
