import { redirect }   from 'next/navigation'
import Navbar         from '@/components/layout/Navbar'
import Footer         from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

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
      <Footer />
    </>
  )
}
