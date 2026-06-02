import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/admin/auth'
import AdminLoginForm from './AdminLoginForm'

type PageProps = {
  searchParams: Promise<{ redirect?: string }>
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { redirect: raw } = await searchParams
  const redirectTo =
    raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/admin/login')
      ? raw
      : '/admin/espaces'

  const admin = await getCurrentAdmin()
  if (admin) redirect(redirectTo)

  return (
    <div
      className="grid min-h-screen md:grid-cols-2"
      style={{ background: 'linear-gradient(180deg, #f5f3ff, #fafafa)' }}
    >
      <aside
        className="hidden flex-col justify-between p-10 md:flex"
        style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}
      >
        <PhyxelLogo dark />
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Console d&apos;administration
          </h2>
          <p className="mt-3 text-white/80">
            Gérez les espaces, validez les hosts et faites vivre la marketplace.
          </p>
        </div>
        <p className="text-xs text-white/70">© 2025 Phyxel</p>
      </aside>

      <main className="flex items-center justify-center p-6">
        <AdminLoginForm redirectTo={redirectTo} />
      </main>
    </div>
  )
}

function PhyxelLogo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span
        className="grid h-7 w-7 place-items-center rounded-lg text-sm font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
      >
        P
      </span>
      <span className={dark ? 'text-white' : 'text-gray-900'}>Phyxel</span>
    </Link>
  )
}
