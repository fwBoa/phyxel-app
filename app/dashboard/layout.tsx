import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { LayoutDashboard, User, Calendar } from 'lucide-react'

const NAV = [
  { href: '/dashboard',              icon: LayoutDashboard, label: 'Vue d\'ensemble' },
  { href: '/dashboard/reservations', icon: Calendar,        label: 'Réservations' },
  { href: '/dashboard/profil',       icon: User,            label: 'Profil' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-56 shrink-0">
            <nav className="bg-white rounded-2xl border border-[#E5E5E5] p-3 space-y-1">
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9F9] hover:text-[#0A0A0A] transition-colors"
                >
                  <item.icon size={17} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
