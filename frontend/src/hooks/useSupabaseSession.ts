import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export function useSupabaseSession(supabase: SupabaseClient | null) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return session
}
