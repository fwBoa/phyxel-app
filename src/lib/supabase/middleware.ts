import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Protège les routes dashboard
  if (!user && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Récupère le profil si l'utilisateur est connecté
  let profile: { is_admin?: boolean | null; has_completed_onboarding?: boolean | null } | null = null
  if (user) {
    const { data: p } = await supabase
      .from('profiles')
      .select('is_admin, has_completed_onboarding')
      .eq('id', user.id)
      .single()
    profile = p ?? null
  }

  // Redirige vers l'onboarding si pas encore complété (sauf sur onboarding/login)
  if (user && profile?.has_completed_onboarding !== true) {
    if (!pathname.startsWith('/onboarding') && !pathname.startsWith('/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  // Redirige depuis l'onboarding si déjà complété
  if (user && profile?.has_completed_onboarding === true && pathname.startsWith('/onboarding')) {
    const url = request.nextUrl.clone()
    url.pathname = '/explorer'
    return NextResponse.redirect(url)
  }

  // Protège les routes admin
  if (user && pathname.startsWith('/admin')) {
    if (!profile?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
