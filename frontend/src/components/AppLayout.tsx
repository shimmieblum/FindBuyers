import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function AppLayout({
  session,
  supabase,
}: {
  session: Session | null
  supabase: SupabaseClient | null
}) {
  return (
    <div className="min-h-screen">
      <Header session={session} supabase={supabase} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
