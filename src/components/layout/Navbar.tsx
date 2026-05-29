'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/explorer',            label: 'Explorer' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche' },
  { href: '/#pourquoi-phyxel',   label: 'Pourquoi Phyxel' },
]

type NavbarProps = {
  user: SupabaseUser | null
}

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [dropdownOpen,  setDropdownOpen]  = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  function isActive(href: string) {
    if (href.startsWith('/#')) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'Mon compte'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-[#0A0A0A]">
          Phyxel
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`text-sm font-medium transition-colors hover:text-[#0A0A0A] ${
                isActive(href) ? 'text-[#E91E8C] font-semibold' : 'text-[#6B6B6B]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-[#E5E5E5] px-4 py-2 text-sm font-medium text-[#0A0A0A] transition-colors hover:border-[#0A0A0A]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FDE8F4] text-[#E91E8C]">
                  <User size={13} strokeWidth={2} />
                </span>
                {firstName}
                <ChevronDown
                  size={14}
                  className={`text-[#6B6B6B] transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <>
                  {/* Overlay pour fermer au clic extérieur */}
                  <div
                    className="fixed inset-0 z-40"
                    aria-hidden
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-lg"
                  >
                    <Link
                      href="/dashboard/profil"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#0A0A0A] hover:bg-[#F9F9F9] transition-colors"
                    >
                      <User size={15} className="text-[#6B6B6B]" />
                      Profil
                    </Link>
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#0A0A0A] hover:bg-[#F9F9F9] transition-colors"
                    >
                      <LayoutDashboard size={15} className="text-[#6B6B6B]" />
                      Tableau de bord
                    </Link>
                    <div className="mx-4 border-t border-[#E5E5E5]" />
                    <button
                      role="menuitem"
                      onClick={() => { setDropdownOpen(false); handleSignOut() }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#EF4444] hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#0A0A0A] hover:text-[#E91E8C] transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#E91E8C] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#B0156A]"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="md:hidden p-2 text-[#0A0A0A]"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-[#E5E5E5] bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`py-2 text-sm font-medium hover:text-[#0A0A0A] ${
                  isActive(href) ? 'text-[#E91E8C] font-semibold' : 'text-[#6B6B6B]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard/profil"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-[#0A0A0A] hover:text-[#E91E8C] transition-colors"
                >
                  <User size={15} className="text-[#6B6B6B]" /> Profil
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-[#0A0A0A] hover:text-[#E91E8C] transition-colors"
                >
                  <LayoutDashboard size={15} className="text-[#6B6B6B]" /> Tableau de bord
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut() }}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-[#EF4444] transition-colors"
                >
                  <LogOut size={15} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-center text-sm font-medium text-[#0A0A0A] border border-[#E5E5E5] rounded-full hover:border-[#0A0A0A]"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-center text-sm font-semibold text-white bg-[#E91E8C] rounded-full hover:bg-[#B0156A]"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
