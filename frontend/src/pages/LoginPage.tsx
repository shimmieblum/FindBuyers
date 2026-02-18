import type { SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import StatusBanner from '../components/StatusBanner'
import LoginForm from '../components/auth/LoginForm'

type LocationState = {
  message?: string
}

export default function LoginPage({ supabase }: { supabase: SupabaseClient }) {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const next = state?.message
    setMessage(typeof next === 'string' ? next : null)
  }, [state?.message])

  return (
    <div className="space-y-4">
      {message ? (
        <StatusBanner
          message={message}
          onDismiss={() => setMessage(null)}
          variant="info"
        />
      ) : null}

      <LoginForm
        onSwitchToSignup={() => navigate('/signup')}
        supabase={supabase}
      />

      <p className="text-center text-sm text-slate-300">
        No account?{' '}
        <Link className="text-indigo-300 hover:text-indigo-200" to="/signup">
          Create one
        </Link>
        .
      </p>
    </div>
  )
}
