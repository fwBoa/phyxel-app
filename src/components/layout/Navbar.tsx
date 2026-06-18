'use client'

import Link from 'next/link'
import Image from 'next/image'
import PhyxelLogo from '@/components/ui/PhyxelLogo'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { Menu, X, User, LayoutDashboard, LogOut, ChevronDown, CalendarDays, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/useProfile'
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
  const { profile } = useProfile(user?.id)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef    = useRef<HTMLDivElement>(null)

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setDropdownOpen(true)
      setTimeout(() => menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(), 0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setDropdownOpen(true)
      setTimeout(() => {
        const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')
        items?.[items.length - 1]?.focus()
      }, 0)
    } else if (e.key === 'Escape') {
      setDropdownOpen(false)
    }
  }

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    const index = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'Escape') {
      e.preventDefault()
      setDropdownOpen(false)
      triggerRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(index + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(index - 1 + items.length) % items.length]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1]?.focus()
    } else if (e.key === 'Tab') {
      setDropdownOpen(false)
    }
  }

  function isActive(href: string) {
    if (href.startsWith('/#')) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Supprime le brouillon onboarding pour éviter qu'un nouvel utilisateur hérite des données
    try {
      localStorage.removeItem('phyxel_onboarding_draft')
    } catch {
      // ignore
    }
    router.push('/')
    router.refresh()
  }

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'Mon compte'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-custom bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 sm:h-[124px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" aria-label="Phyxel — accueil">
          <PhyxelLogo height={24} />
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive(href) ? 'text-primary font-semibold' : 'text-text-secondary'
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
                ref={triggerRef}
                onClick={() => setDropdownOpen((v) => !v)}
                onKeyDown={handleTriggerKeyDown}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                aria-controls="user-menu"
                className="flex items-center gap-2 rounded-full border border-border-custom px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-[#0A0A0A]"
              >
                <span className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-muted text-primary">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" unoptimized />
                  ) : (
                    <User size={13} strokeWidth={2} />
                  )}
                </span>
                {firstName}
                <ChevronDown
                  size={14}
                  className={`text-text-secondary transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`}
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
                    id="user-menu"
                    ref={menuRef}
                    role="menu"
                    onKeyDown={handleMenuKeyDown}
                    className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-border-custom bg-white shadow-lg"
                  >
                    <Link
                      href="/dashboard/profil"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-bg-secondary transition-colors"
                    >
                      <User size={15} className="text-text-secondary" />
                      Profil
                    </Link>
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-bg-secondary transition-colors"
                    >
                      <LayoutDashboard size={15} className="text-text-secondary" />
                      Tableau de bord
                    </Link>
                    <Link
                      href="/dashboard/reservations"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-bg-secondary transition-colors"
                    >
                      <CalendarDays size={15} className="text-text-secondary" />
                      Mes réservations
                    </Link>
                    <Link
                      href="/dashboard/favoris"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-bg-secondary transition-colors"
                    >
                      <Heart size={15} className="text-text-secondary" />
                      Favoris
                    </Link>
                    <div className="mx-4 border-t border-border-custom" />
                    <button
                      role="menuitem"
                      onClick={() => { setDropdownOpen(false); handleSignOut() }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-match-low hover:bg-red-50 transition-colors"
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
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
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
          className="md:hidden p-2 text-foreground"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border-custom bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`py-2 text-sm font-medium hover:text-foreground ${
                  isActive(href) ? 'text-primary font-semibold' : 'text-text-secondary'
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
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <User size={15} className="text-text-secondary" /> Profil
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <LayoutDashboard size={15} className="text-text-secondary" /> Tableau de bord
                </Link>
                <Link
                  href="/dashboard/reservations"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <CalendarDays size={15} className="text-text-secondary" /> Mes réservations
                </Link>
                <Link
                  href="/dashboard/favoris"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Heart size={15} className="text-text-secondary" /> Favoris
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut() }}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-match-low transition-colors"
                >
                  <LogOut size={15} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-center text-sm font-medium text-foreground border border-border-custom rounded-full hover:border-[#0A0A0A]"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-center text-sm font-semibold text-white bg-primary rounded-full hover:bg-brand-dark"
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
