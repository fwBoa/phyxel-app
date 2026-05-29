import { getMyProfile } from '@/lib/queries/profile'
import { updateProfile } from './actions'
import ProfileForm from './ProfileForm'

export const revalidate = 0

export default async function ProfilPage() {
  const profile = await getMyProfile()

  if (!profile) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card"
      >
        <p className="text-muted-foreground">Impossible de charger votre profil.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl space-y-6"
    >
      <div
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground"
        >Mon profil
        </h1>
        <p className="mt-2 text-muted-foreground"
        >
          Mettez à jour vos informations pour améliorer vos recommandations.
        </p>
      </div>

      <ProfileForm profile={profile} updateProfile={updateProfile} />
    </div>
  )
}
