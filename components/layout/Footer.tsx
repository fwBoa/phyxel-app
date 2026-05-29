import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">P</div>
          <span className="font-semibold text-[#0A0A0A] text-sm">Phyxel</span>
        </Link>

        <div className="flex items-center gap-6 text-xs text-[#9CA3AF]">
          <Link href="#" className="hover:text-[#0A0A0A] transition-colors">Mentions légales</Link>
          <Link href="#" className="hover:text-[#0A0A0A] transition-colors">CGU</Link>
          <Link href="#" className="hover:text-[#0A0A0A] transition-colors">Contact</Link>
          <Link href="#" className="hover:text-[#0A0A0A] transition-colors">Blog</Link>
        </div>

        <p className="text-xs text-[#9CA3AF]">© 2025 Phyxel</p>
      </div>
    </footer>
  )
}
