import type { Session } from '@supabase/supabase-js'
import { useMemo } from 'react'

export default function LandingPage({ session }: { session: Session }) {
  const name = useMemo(() => {
    const raw = session.user.user_metadata?.name
    return typeof raw === 'string' ? raw : null
  }, [session.user.user_metadata])

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-50">
          Welcome{name ? `, ${name}` : ''}
        </h1>
        <p className="text-sm text-slate-300">
          You’re signed in as <span className="font-mono">{session.user.email}</span>
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="text-sm text-slate-200">Landing page</div>
        <p className="mt-1 text-sm text-slate-300">
          This is the post-login area. Hook your app content in here.
        </p>
      </div>
    </div>
  )
}
