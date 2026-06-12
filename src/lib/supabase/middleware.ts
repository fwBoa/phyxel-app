import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
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

  // ===========================================================
  // Zone admin — auth custom (JWT signé dans cookie admin_session)
  // Court-circuit : la logique Supabase ne s'applique pas ici.
  // ===========================================================
  if (pathname.startsWith('/admin')) {
    // /admin/login est accessible sans session
    if (pathname === '/admin/login') {
      return supabaseResponse
    }

    const token = request.cookies.get('admin_session')?.value
    let valid = false
    if (token && process.env.ADMIN_JWT_SECRET) {
      try {
        await jwtVerify(token, new TextEncoder().encode(process.env.ADMIN_JWT_SECRET), {
          issuer:   'phyxel-admin',
          audience: 'phyxel-admin',
          algorithms: ['HS256'],
        })
        valid = true
      } catch {
        valid = false
      }
    }

    if (!valid) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = ''
      url.searchParams.set('redirect', pathname + request.nextUrl.search)
      return NextResponse.redirect(url)
    }

    // Admin authentifié : on ne touche pas aux cookies Supabase,
    // on ne lit pas `user` (les admins n'ont pas de session Supabase).
    return supabaseResponse
  }

  // ===========================================================
  // Zone brand — Supabase Auth (inchangé)
  // ===========================================================

  // Construit une URL /login avec ?redirect= pour ramener l'utilisateur
  // là où il voulait aller après connexion.
  function loginUrl(returnTo: string) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('redirect', returnTo)
    return url
  }

  // Protège les routes dashboard — redirige vers /login?redirect=...
  if (!user && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(loginUrl(pathname + request.nextUrl.search))
  }

  // Protège les pages d'espace — un non-connecté doit se connecter avant
  // de consulter le détail (et donc de réserver).
  if (!user && /^\/espaces\/[^/]+$/.test(pathname)) {
    return NextResponse.redirect(loginUrl(pathname))
  }

  // Récupère le profil si l'utilisateur est connecté
  let profile: { has_completed_onboarding?: boolean | null } | null = null
  if (user) {
    const { data: p } = await supabase
      .from('profiles')
      .select('has_completed_onboarding')
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

  return supabaseResponse
}
