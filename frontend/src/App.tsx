import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold tracking-wide text-slate-200">
            FindBuyers
          </div>

          {session ? (
            <button
              className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-700"
              onClick={() => supabase.auth.signOut()}
              type="button"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {!session ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-slate-50">Login</h1>
              <p className="text-sm text-slate-300">
                Sign in (or create an account) to continue.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
              />
            </div>

            <p className="text-xs text-slate-400">
              Configure Supabase by setting <code>VITE_SUPABASE_URL</code> and{' '}
              <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-slate-50">You’re in</h1>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="text-sm text-slate-300">Signed in as</div>
              <div className="mt-1 font-mono text-sm text-slate-100">
                {session.user.email}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
