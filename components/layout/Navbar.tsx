'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const handleSignOut = () => {
    const supabase = createClient()
    supabase.auth.signOut()
  }

  const links = [
    { href: '/explorer',          label: 'Explorer' },
    { href: '/comment-ca-marche', label: 'Comment ça marche' },
    { href: '/tarifs',            label: 'Tarifs' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
          <span className="font-semibold text-[#0A0A0A]">Phyxel</span>
        </Link>

        {/* Nav centre */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname === l.href
                  ? 'text-[#7C3AED] font-medium'
                  : 'text-[#6B7280] hover:text-[#0A0A0A]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions droite */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#0A0A0A]">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-[#6B7280] hover:text-[#0A0A0A]"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-[#6B7280] hover:text-[#0A0A0A]">
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-[#0A0A0A] text-white text-sm font-medium rounded-full hover:bg-[#333] transition-colors"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm text-[#0A0A0A]" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link href="/dashboard" className="text-sm text-[#7C3AED]" onClick={() => setOpen(false)}>Dashboard</Link>
          ) : (
            <Link href="/register" className="w-full text-center px-4 py-2 bg-[#0A0A0A] text-white text-sm font-medium rounded-full">
              Créer un compte
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
