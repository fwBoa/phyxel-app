import { redirect }    from 'next/navigation'
import Link             from 'next/link'
import Image            from 'next/image'
import Navbar           from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'

const FOOTER_LINKS = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgu',              label: 'CGU' },
  { href: '/contact',          label: 'Contact' },
  { href: '/blog',             label: 'Blog' },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  return (
    <>
      <Navbar user={user} />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8">
          {children}
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Image src="/Vector2.svg" alt="" width={26} height={24} aria-hidden />
            <nav className="flex flex-wrap justify-center gap-6">
              {FOOTER_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Phyxel</p>
          </div>
        </div>
      </footer>
    </>
  )
}
