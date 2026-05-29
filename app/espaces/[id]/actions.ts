'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBooking(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Vous devez être connecté pour réserver un espace.' }
  }

  const space_id = formData.get('space_id') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string

  // Validate dates
  if (new Date(end_date) < new Date(start_date)) {
    return { error: 'La date de fin doit être après la date de début.' }
  }

  // Check if user has a profile with role 'brand'
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'brand') {
    return { error: 'Seules les marques peuvent réserver un espace.' }
  }

  // Check for overlapping bookings
  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('space_id', space_id)
    .eq('status', 'confirmed')
    .or(`start_date.lte.${end_date},end_date.gte.${start_date}`)

  if (existingBookings && existingBookings.length > 0) {
    return { error: 'Ces dates ne sont pas disponibles.' }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      space_id,
      brand_id: user.id,
      start_date,
      end_date,
      status: 'pending',
    })
    .select('id, total_price')
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/reservations')

  return {
    success: `Réservation demandée ! Total : ${data.total_price?.toLocaleString('fr-FR')} €. Vous serez notifié sous 48h.`,
  }
}
