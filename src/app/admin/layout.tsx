import Link from 'next/link'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { getCurrentAdmin, logoutAdmin } from '@/lib/admin/auth'
import { redirect } from 'next/navigation'

const ADMIN_NAV = [
  { href: '/admin/espaces', icon: LayoutDashboard, label: 'Espaces' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Si on est sur /admin/login, on rend juste les children (pas de sidebar,
  // pas de garde). La garde est faite dans chaque page protégée via
  // requireAdmin() (cf. src/lib/admin/auth.ts).
  const admin = await getCurrentAdmin()

  if (!admin) {
    // Probablement sur /admin/login — on rend juste children sans chrome.
    return <>{children}</>
  }

  async function handleSignOut() {
    'use server'
    await logoutAdmin()
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-border-custom bg-white md:flex md:flex-col">
        <div className="p-6">
          <Link href="/" className="text-lg font-bold text-foreground">Phyxel</Link>
          <p className="mt-1 text-xs text-text-muted">Administration</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {ADMIN_NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-foreground"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border-custom p-3 space-y-1">
          <div className="px-3 py-2 text-xs text-text-muted">
            {admin.full_name ?? admin.email}
          </div>

          <form action={handleSignOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-match-low"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 bg-bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
