'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { OnboardingData } from '@/types/onboarding'

export async function updatePreferences(data: OnboardingData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Vous devez être connecté.')
  }

  const profileId = user.id

  const { error: prefsError } = await supabase
    .from('brand_preferences')
    .update({
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
      updated_at:          new Date().toISOString(),
    })
    .eq('profile_id', profileId)

  if (prefsError) {
    console.error('Erreur lors de la mise à jour des préférences:', prefsError)
    throw new Error('Impossible de mettre à jour vos préférences.')
  }

  redirect('/dashboard/profil')
}
