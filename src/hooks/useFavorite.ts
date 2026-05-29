'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useFavorite(spaceId: string, initialFavorited = false) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [userId,      setUserId]      = useState<string | null>(null)
  const [ready,       setReady]       = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setReady(true); return }
      setUserId(user.id)

      // Fetch state réel seulement si pas d'état initial passé en prop
      if (!initialFavorited) {
        supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('space_id', spaceId)
          .maybeSingle()
          .then(({ data }) => {
            setIsFavorited(!!data)
            setReady(true)
          })
      } else {
        setReady(true)
      }
    })
  }, [spaceId, initialFavorited])

  async function toggle() {
    if (!userId) return

    const supabase = createClient()
    const next = !isFavorited
    setIsFavorited(next) // optimiste

    if (!next) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('space_id', spaceId)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: userId, space_id: spaceId })
    }
  }

  return { isFavorited, userId, ready, toggle }
}
