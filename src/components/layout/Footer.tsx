'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, Send, MessageCircle } from 'lucide-react'
import PhyxelLogo from '@/components/ui/PhyxelLogo'

const NAV_LINKS = {
  left: [
    { href: '/explorer', label: 'Explorer' },
    { href: '/#comment-ca-marche', label: 'Comment sa marche' },
    { href: '/contact', label: 'Accompagnement personnalisé' },
    { href: '/#pourquoi-phyxel', label: 'Pourquoi Phyxel' },
    { href: '/register', label: 'Créer mon compte' },
    { href: '/login', label: 'Connexion' },
  ],
  right: [
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Nous contacter' },
  ],
}

const SOCIAL_LINKS = [
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: LinkedinIcon },
  { href: 'https://instagram.com', label: 'Instagram', icon: InstagramIcon },
  { href: 'https://youtube.com', label: 'YouTube', icon: YoutubeIcon },
]

const CHAT_LINKS = [
  { href: 'https://wa.me/330187568267', label: 'WhatsApp', icon: MessageCircle },
  { href: 'https://t.me/phyxel', label: 'Telegram', icon: Send },
  { href: 'https://wa.me/330187568267', label: 'WhatsApp', icon: Phone },
]

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function SocialButton({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }> | ((props: React.SVGProps<SVGSVGElement>) => React.ReactNode)
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0052CC] text-[#0052CC] transition-colors hover:bg-[#0052CC] hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-white text-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Logo décoratif mobile */}
        <div className="mb-10 lg:hidden">
          <Image
            src="/Vector2.svg"
            alt=""
            width={80}
            height={77}
            className="opacity-100"
            aria-hidden
          />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

          {/* Navigation */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-medium text-[#9B9B9B]">Navigation</h3>
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3">
              <nav className="flex flex-col gap-3">
                {NAV_LINKS.left.map(({ href, label }) => (
                  <Link
                    key={href + label}
                    href={href}
                    className="text-sm text-[#0A0A0A] transition-colors hover:text-[#0052CC]"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <nav className="flex flex-col gap-3">
                {NAV_LINKS.right.map(({ href, label }) => (
                  <Link
                    key={href + label}
                    href={href}
                    className="text-sm text-[#0A0A0A] transition-colors hover:text-[#0052CC]"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-medium text-[#9B9B9B]">Contact us</h3>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3">
              <a
                href="tel:+330187568267"
                className="flex items-center gap-2 text-sm text-[#0A0A0A] transition-colors hover:text-[#0052CC]"
              >
                <Phone className="h-4 w-4 text-[#0052CC]" />
                +33 01 87 56 82 67
              </a>
              <a
                href="mailto:agencephyxel@gmail.com"
                className="flex items-center gap-2 text-sm text-[#0A0A0A] transition-colors hover:text-[#0052CC]"
              >
                <Mail className="h-4 w-4 text-[#0052CC]" />
                agencephyxel@gmail.com
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium text-[#9B9B9B]">Nous suivre</h4>
                <div className="mt-4 flex items-center gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <SocialButton key={link.label} {...link} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-[#9B9B9B]">Let&apos;s chat</h4>
                <div className="mt-4 flex items-center gap-3">
                  {CHAT_LINKS.map((link, i) => (
                    <SocialButton key={`${link.label}-${i}`} {...link} />
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-10 rounded-3xl bg-[#F5F5F5] p-6">
              <h4 className="text-lg font-semibold text-[#0A0A0A]">S&apos;abonner à la newsletter !</h4>
              <form
                className="mt-4"
                onSubmit={(e) => {
                  e.preventDefault()
                }}
              >
                <input
                  type="email"
                  placeholder="Entrez votre e-mail"
                  className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#0A0A0A] outline-none transition-colors placeholder:text-[#9B9B9B] focus:border-[#0052CC]"
                />
              </form>
            </div>
          </div>

          {/* Logo décoratif desktop */}
          <div className="hidden lg:col-span-4 lg:flex lg:justify-end lg:items-start">
            <Image
              src="/Vector2.svg"
              alt=""
              width={103}
              height={99}
              className="opacity-100"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E5E5E5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
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
      </div>
    </footer>
  )
}
