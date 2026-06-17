'use client'

import Link from 'next/link'
import PhyxelLogo from '@/components/ui/PhyxelLogo'

export default function SimpleFooter() {
  return (
    <footer className="mt-auto border-t border-[#E5E5E5] bg-white text-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
          <PhyxelLogo height={24} className="text-[#9B9B9B]" />
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#6B6B6B]">
            <Link href="/mentions-legales" className="transition-colors hover:text-[#0A0A0A]">
              Mentions légales
            </Link>
            <Link href="/cgu" className="transition-colors hover:text-[#0A0A0A]">
              CGU
            </Link>
            <Link href="/contact" className="transition-colors hover:text-[#0A0A0A]">
              Contact
            </Link>
            <Link href="/blog" className="transition-colors hover:text-[#0A0A0A]">
              Blog
            </Link>
          </nav>
          <p className="text-sm text-[#6B6B6B]">© 2025 Phyxel</p>
        </div>
      </div>
    </footer>
  )
}
