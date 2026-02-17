import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase, supabaseConfigError } from './lib/supabaseClient'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [status, setStatus] = useState<string | null>(null)

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
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return

    setStatus(null)

    const fn = mode === 'signIn' ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const { error } = await fn({ email, password })

    if (error) {
      setStatus(error.message)
      return
    }

    if (mode === 'signUp') {
      setStatus('Check your email to confirm your account, then sign in.')
    }
  }

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
              onClick={() => supabase?.auth.signOut()}
              type="button"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {supabaseConfigError ? (
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-slate-50">
              Supabase not configured
            </h1>
            <p className="text-sm text-slate-300">{supabaseConfigError}</p>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 font-mono text-xs text-slate-200">
              VITE_SUPABASE_URL=...
              <br />
              VITE_SUPABASE_PUBLISHABLE_KEY=...
            </div>
          </div>
        ) : !session ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-slate-50">
                {mode === 'signIn' ? 'Login' : 'Create account'}
              </h1>
              <p className="text-sm text-slate-300">
                Use email + password to continue.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block space-y-1">
                  <div className="text-sm text-slate-200">Email</div>
                  <input
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </label>

                <label className="block space-y-1">
                  <div className="text-sm text-slate-200">Password</div>
                  <input
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                    autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                  />
                </label>

                {status ? (
                  <div className="rounded-md border border-amber-700/40 bg-amber-950/40 px-3 py-2 text-sm text-amber-200">
                    {status}
                  </div>
                ) : null}

                <button
                  className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                  type="submit"
                >
                  {mode === 'signIn' ? 'Sign in' : 'Sign up'}
                </button>

                <button
                  className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700"
                  onClick={() => {
                    setStatus(null)
                    setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'))
                  }}
                  type="button"
                >
                  {mode === 'signIn'
                    ? 'Need an account? Sign up'
                    : 'Have an account? Sign in'}
                </button>
              </form>
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
