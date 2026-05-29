import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, status, start_date, end_date, spaces(title)')
    .eq('brand_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const stats = [
    { label: 'Réservations', value: bookings?.length || 0 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Bonjour, {profile?.full_name || profile?.brand_name || 'utilisateur'} 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Voici un aperçu de votre activité sur Phyxel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {bookings && bookings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Dernières réservations</h2>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card">
                <div>
                  <p className="font-medium text-foreground">{(booking.spaces as any)?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.start_date).toLocaleDateString('fr-FR')} → {new Date(booking.end_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  booking.status === 'confirmed' ? 'bg-success/10 text-success' :
                  booking.status === 'pending' ? 'bg-warning/10 text-warning' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {booking.status === 'confirmed' ? 'Confirmée' :
                   booking.status === 'pending' ? 'En attente' :
                   'Annulée'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
