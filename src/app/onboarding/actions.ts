'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { OnboardingData } from '@/types/onboarding'

export async function saveOnboarding(data: OnboardingData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Vous devez être connecté pour terminer l\'onboarding.')
  }

  const profileId = user.id

  // 1. Insère ou met à jour les préférences marque
  const { error: prefsError } = await supabase
    .from('brand_preferences')
    .upsert({
      profile_id:          profileId,
      sector:              data.sector || null,
      product_types:       data.productTypes.length ? data.productTypes : null,
      main_city:           data.mainCity || null,
      company_size:        data.companySize || null,
      approx_budget:       data.approxBudget || null,
      physical_objectives: data.physicalObjectives.length ? data.physicalObjectives : [],
      target_city:         data.targetCity || null,
      desired_duration:    data.desiredDuration || null,
      space_types:         data.spaceTypes.length ? data.spaceTypes : [],
      desired_area:        data.desiredArea || null,
      needed_services:     data.neededServices.length ? data.neededServices : [],
      max_budget:          data.maxBudget || null,
      preferred_districts: data.preferredDistricts.length ? data.preferredDistricts : [],
      desired_ambiance:    data.desiredAmbiance.length ? data.desiredAmbiance : [],
      ideal_dates:         data.idealDates || null,
    }, { onConflict: 'profile_id' })

  if (prefsError) {
    throw new Error('Impossible de sauvegarder vos préférences.')
  }

  // 2. Marque le profil comme ayant terminé l'onboarding
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ has_completed_onboarding: true })
    .eq('id', profileId)

  if (profileError) {
    throw new Error('Impossible de finaliser l\'onboarding.')
  }

  // 3. Redirection vers l'explorateur
  redirect('/explorer')
}
