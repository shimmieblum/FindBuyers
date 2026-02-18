import type { Session } from '@supabase/supabase-js'
import { Link, useLocation } from 'react-router-dom'

export default function NotFoundPage({ session }: { session: Session | null }) {
  const location = useLocation()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">Page not found</h1>
        <p className="text-sm text-slate-300">
          No route matches <span className="font-mono">{location.pathname}</span>.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700"
          to={session ? '/' : '/login'}
        >
          {session ? 'Go to home' : 'Go to login'}
        </Link>

        <Link
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          to="/signup"
        >
          Create account
        </Link>
      </div>
    </div>
  )
}
