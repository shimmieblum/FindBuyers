import type { SupabaseClient } from '@supabase/supabase-js'
import { type FormEvent, useState } from 'react'
import StatusBanner from '../StatusBanner'

export default function LoginForm({
  supabase,
  onSwitchToSignup,
}: {
  supabase: SupabaseClient
  onSwitchToSignup: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setStatus(null)
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)

    if (error) {
      setStatus(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">Login</h1>
        <p className="text-sm text-slate-300">Sign in to continue.</p>
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
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </label>

          {status ? <StatusBanner message={status} variant="error" /> : null}

          <button
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <button
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700"
            onClick={onSwitchToSignup}
            type="button"
          >
            Need an account? Sign up
          </button>
        </form>
      </div>
    </div>
  )
}
