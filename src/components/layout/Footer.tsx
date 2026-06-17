import Link from 'next/link'
import PhyxelLogo from '@/components/ui/PhyxelLogo'

const FOOTER_LINKS = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgu',              label: 'CGU' },
  { href: '/contact',          label: 'Contact' },
  { href: '/blog',             label: 'Blog' },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border-custom bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" aria-label="Phyxel — accueil">
            <PhyxelLogo height={22} />
          </Link>

          {/* Liens */}
          <nav className="flex flex-wrap justify-center gap-6">
            {FOOTER_LINKS.map(({ label }) => (
              <span
                key={label}
                className="text-sm text-text-muted"
              >
                {label}
              </span>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Phyxel
          </p>
        </div>
      </div>
    </footer>
  )
}
