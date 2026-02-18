import type { SupabaseClient } from '@supabase/supabase-js'
import { type FormEvent, useState } from 'react'
import StatusBanner from '../StatusBanner'

export default function SignupForm({
  supabase,
  onSwitchToLogin,
}: {
  supabase: SupabaseClient
  onSwitchToLogin: (message?: string) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

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
      return
    }

    onSwitchToLogin(
      'Account created. Check your email to verify your address, then sign in.',
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">Create account</h1>
        <p className="text-sm text-slate-300">
          Sign up to create an account (email verification required).
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
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

          {status ? <StatusBanner message={status} variant="error" /> : null}

          <button
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>

          <button
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700"
            onClick={() => onSwitchToLogin()}
            type="button"
          >
            Have an account? Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
