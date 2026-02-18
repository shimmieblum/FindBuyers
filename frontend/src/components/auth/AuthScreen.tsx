import type { SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'
import StatusBanner from '../StatusBanner'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export default function AuthScreen({ supabase }: { supabase: SupabaseClient }) {
  const [page, setPage] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {message ? (
        <StatusBanner
          message={message}
          onDismiss={() => setMessage(null)}
          variant="info"
        />
      ) : null}

      {page === 'login' ? (
        <LoginForm
          onSwitchToSignup={() => {
            setMessage(null)
            setPage('signup')
          }}
          supabase={supabase}
        />
      ) : (
        <SignupForm
          onSwitchToLogin={(nextMessage) => {
            setMessage(nextMessage ?? null)
            setPage('login')
          }}
          supabase={supabase}
        />
      )}

      <p className="text-xs text-slate-400">
        Configure Supabase by setting <code>VITE_SUPABASE_URL</code> and{' '}
        <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
      </p>
    </div>
  )
}
