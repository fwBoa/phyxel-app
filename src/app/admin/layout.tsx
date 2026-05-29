import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutDashboard, ArrowLeft, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const ADMIN_NAV = [
  { href: '/admin/espaces', icon: LayoutDashboard, label: 'Espaces' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
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
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-foreground"
          >
            <ArrowLeft size={18} />
            Retour au dashboard
          </Link>

          <form
            action={async () => {
              'use server'
              const sb = await createClient()
              await sb.auth.signOut()
              redirect('/')
            }}
          >
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

      {/* Contenu */}
      <main className="flex-1 bg-bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
