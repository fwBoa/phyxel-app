'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/users'

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    createClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data }) => { setProfile(data); setLoading(false) })
  }, [userId])

  return { profile, loading }
}
