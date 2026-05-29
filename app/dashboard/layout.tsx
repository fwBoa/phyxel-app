import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/layout/LogoutButton'

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
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-hero text-primary-foreground text-sm font-bold shadow-card">P</span>
            <span className="text-foreground">Phyxel</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline">
              {profile?.full_name || profile?.brand_name || 'Utilisateur'}
            </span>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Retour au site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-8 flex gap-4 border-b border-border pb-4">
          <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Vue d'ensemble
          </Link>
          <Link href="/dashboard/profil" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Profil
          </Link>
          <Link href="/dashboard/reservations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Réservations
          </Link>
        </nav>
        {children}
      </div>
    </div>
  )
}
