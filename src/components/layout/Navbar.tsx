'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/explorer',             label: 'Explorer' },
  { href: '/#comment-ca-marche',  label: 'Comment ça marche' },
  { href: '/#pourquoi-phyxel',    label: 'Tarifs' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

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
              className="text-sm font-medium text-[#6B6B6B] transition-colors hover:text-[#0A0A0A]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-3">
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
        </div>

        {/* Burger mobile */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-[#0A0A0A]"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E5E5E5] bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium text-[#6B6B6B] hover:text-[#0A0A0A]"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
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
          </div>
        </div>
      )}
    </header>
  )
}
