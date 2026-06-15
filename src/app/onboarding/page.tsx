import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingWizard from '@/components/features/OnboardingWizard'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Si déjà onboardé, redirige vers l'explorateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_completed_onboarding')
    .eq('id', user.id)
    .single()

  if (profile?.has_completed_onboarding) {
    redirect('/explorer')
  }

  return (
    <main>
      <OnboardingWizard />
    </main>
  )
}
