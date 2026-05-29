'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Profile } from '@/types/users'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const supabase = createClient()
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
      setProfile(data)
      setLoading(false)
    })
  }, [user?.id])

  return { profile, loading }
}
