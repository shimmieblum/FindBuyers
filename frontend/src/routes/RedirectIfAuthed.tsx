import type { Session } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type LocationState = {
  from?: {
    pathname?: string
    search?: string
    hash?: string
  }
}

export default function RedirectIfAuthed({
  session,
  children,
}: {
  session: Session | null
  children: ReactNode
}) {
  const location = useLocation()
  const state = location.state as LocationState | null

  if (session) {
    const pathname = state?.from?.pathname ?? '/'
    const search = state?.from?.search ?? ''
    const hash = state?.from?.hash ?? ''

    return <Navigate replace to={`${pathname}${search}${hash}`} />
  }

  return children
}
