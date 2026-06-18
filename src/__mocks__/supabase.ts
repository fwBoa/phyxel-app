export const mockSubscription = { unsubscribe: jest.fn() }

export const mockSupabaseAuth = {
  getUser:           jest.fn().mockResolvedValue({ data: { user: null } }),
  onAuthStateChange: jest.fn().mockReturnValue({
    data: { subscription: mockSubscription },
  }),
  signOut: jest.fn().mockResolvedValue({}),
}

function makeQueryBuilder(
  resolvedValue: { data: unknown; error: unknown } = { data: [], error: null }
) {
  const builder: Record<string, unknown> = {}
  const chainMethods = [
    'select','insert','update','delete','upsert',
    'eq','neq','gte','lte','gt','lt',
    'order','limit','filter','in',
  ]
  chainMethods.forEach((m) => {
    builder[m] = jest.fn().mockReturnValue(builder)
  })
  const terminalMethods = ['single', 'maybeSingle']
  terminalMethods.forEach((m) => {
    builder[m] = jest.fn().mockResolvedValue(resolvedValue)
  })
  // make the builder itself awaitable (default terminal for non-single queries)
  ;(builder as unknown as Promise<unknown>).then = jest.fn((onFulfilled?: (value: unknown) => unknown) =>
    Promise.resolve(resolvedValue).then(onFulfilled)
  )
  return builder
}

export const mockFrom = jest.fn(() => makeQueryBuilder())

export const mockSupabaseClient = {
  auth: mockSupabaseAuth,
  from: mockFrom,
}

export const createClient       = jest.fn(() => mockSupabaseClient)
export const createBrowserClient = jest.fn(() => mockSupabaseClient)
export const createServerClient  = jest.fn(() => mockSupabaseClient)
export const createAdminClient   = jest.fn(() => mockSupabaseClient)
