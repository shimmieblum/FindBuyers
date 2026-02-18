import type { Session } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth({
  session,
  children,
}: {
  session: Session | null
  children: ReactNode
}) {
  const location = useLocation()

  if (!session) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return children
}
