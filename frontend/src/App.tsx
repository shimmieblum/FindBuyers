import type { Session } from '@supabase/supabase-js'
import { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigError } from './lib/supabaseClient'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [page, setPage] = useState<'login' | 'signup'>('login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const landingName = useMemo(() => {
    const raw = session?.user.user_metadata?.name
    return typeof raw === 'string' ? raw : null
  }, [session])

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

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return

    setStatus(null)
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)

    if (error) {
      setStatus(error.message)
    }
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return

    setStatus(null)
    setSubmitting(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    })

    setSubmitting(false)

    if (error) {
      setStatus(error.message)
      return
    }

    if (data.session) {
      setStatus(null)
      return
    }

    setStatus('Check your email to verify your address, then come back and sign in.')
    setPage('login')
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
        ) : session ? (
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-slate-50">
                Welcome{landingName ? `, ${landingName}` : ''}
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
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-slate-50">
                {page === 'login' ? 'Login' : 'Create account'}
              </h1>
              <p className="text-sm text-slate-300">
                {page === 'login'
                  ? 'Sign in to continue.'
                  : 'Sign up to create an account (email verification required).'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              {page === 'login' ? (
                <form className="space-y-4" onSubmit={handleLogin}>
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
                      autoComplete="current-password"
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
                    className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={submitting}
                    type="submit"
                  >
                    {submitting ? 'Signing in…' : 'Sign in'}
                  </button>

                  <button
                    className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700"
                    onClick={() => {
                      setStatus(null)
                      setPage('signup')
                    }}
                    type="button"
                  >
                    Need an account? Sign up
                  </button>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleSignup}>
                  <label className="block space-y-1">
                    <div className="text-sm text-slate-200">Name</div>
                    <input
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
                      autoComplete="name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      type="text"
                      value={name}
                    />
                  </label>

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
                      autoComplete="new-password"
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
                    className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={submitting}
                    type="submit"
                  >
                    {submitting ? 'Creating account…' : 'Sign up'}
                  </button>

                  <button
                    className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700"
                    onClick={() => {
                      setStatus(null)
                      setPage('login')
                    }}
                    type="button"
                  >
                    Have an account? Sign in
                  </button>
                </form>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Configure Supabase by setting <code>VITE_SUPABASE_URL</code> and{' '}
              <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
