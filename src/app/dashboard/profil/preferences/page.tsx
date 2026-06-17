import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingWizard from '@/components/features/OnboardingWizard'
import type { OnboardingData } from '@/types/onboarding'
import { updatePreferences } from './actions'

function filterStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string')
}

export default async function PreferencesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Récupère les préférences existantes
  const { data: prefs } = await supabase
    .from('brand_preferences')
    .select('*')
    .eq('profile_id', user.id)
    .maybeSingle()

  const initialData: OnboardingData | undefined = prefs
    ? {
        sector: prefs.sector ?? '',
        productTypes: filterStrings(prefs.product_types),
        mainCity: prefs.main_city ?? '',
        companySize: prefs.company_size ?? '',
        approxBudget: prefs.approx_budget ?? '',
        physicalObjectives: filterStrings(prefs.physical_objectives),
        targetCity: prefs.target_city ?? '',
        desiredDuration: prefs.desired_duration ?? '',
        spaceTypes: filterStrings(prefs.space_types),
        desiredArea: prefs.desired_area ?? '',
        neededServices: filterStrings(prefs.needed_services),
        maxBudget: prefs.max_budget ?? '',
        preferredDistricts: filterStrings(prefs.preferred_districts),
        desiredAmbiance: filterStrings(prefs.desired_ambiance),
        idealDates: prefs.ideal_dates ?? '',
      }
    : undefined

  return (
    <main className="min-h-screen bg-background">
      <OnboardingWizard
        mode="edit"
        initialData={initialData}
        onSave={updatePreferences}
      />
    </main>
  )
}
