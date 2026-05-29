import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutDashboard, User, CalendarDays, Heart, LogOut, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const NAV = [
  { href: '/dashboard',              icon: LayoutDashboard, label: 'Vue d\'ensemble' },
  { href: '/dashboard/profil',       icon: User,            label: 'Mon profil' },
  { href: '/dashboard/reservations', icon: CalendarDays,    label: 'Réservations' },
  { href: '/dashboard/favoris',      icon: Heart,           label: 'Favoris' },
]

export default async function DashboardLayout({
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
    .select('is_admin')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-[#E5E5E5] bg-white md:flex md:flex-col">
        <div className="p-6">
          <Link href="/" className="text-lg font-bold text-[#0A0A0A]">Phyxel</Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#6B6B6B] transition-colors hover:bg-[#F9F9F9] hover:text-[#0A0A0A]"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}

          {profile?.is_admin && (
            <Link
              href="/admin/espaces"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#E91E8C] transition-colors hover:bg-[#FDE8F4]"
            >
              <Shield size={18} />
              Administration
            </Link>
          )}
        </nav>

        <div className="p-3">
          <form action={async () => {
            'use server'
            const sb = await createClient()
            await sb.auth.signOut()
            redirect('/')
          }}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#6B6B6B] transition-colors hover:bg-[#F9F9F9] hover:text-[#EF4444]"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 bg-[#F9F9F9]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
