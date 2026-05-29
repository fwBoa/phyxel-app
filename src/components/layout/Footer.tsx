import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgu',              label: 'CGU' },
  { href: '/contact',          label: 'Contact' },
  { href: '/blog',             label: 'Blog' },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E5E5] bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Phyxel
          </Link>

          {/* Liens */}
          <nav className="flex flex-wrap justify-center gap-6">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-[#9B9B9B] transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-[#9B9B9B]">
            © {new Date().getFullYear()} Phyxel
          </p>
        </div>
      </div>
    </footer>
  )
}
