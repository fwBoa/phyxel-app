'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié.' }
  }

  // Verify ownership
  const { data: booking } = await supabase
    .from('bookings')
    .select('brand_id')
    .eq('id', bookingId)
    .single()

  if (!booking || booking.brand_id !== user.id) {
    return { error: 'Vous ne pouvez pas annuler cette réservation.' }
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/reservations')
  return { success: 'Réservation annulée.' }
}

export async function confirmBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié.' }
  }

  // Verify host ownership of the space
  const { data: booking } = await supabase
    .from('bookings')
    .select('space_id')
    .eq('id', bookingId)
    .single()

  if (!booking) {
    return { error: 'Réservation introuvable.' }
  }

  const { data: space } = await supabase
    .from('spaces')
    .select('host_id')
    .eq('id', booking.space_id)
    .single()

  if (!space || space.host_id !== user.id) {
    return { error: 'Vous ne pouvez pas confirmer cette réservation.' }
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/reservations')
  return { success: 'Réservation confirmée.' }
}
