import type { SupabaseClient } from '@supabase/supabase-js'
import { Link, useNavigate } from 'react-router-dom'
import SignupForm from '../components/auth/SignupForm'

export default function SignupPage({ supabase }: { supabase: SupabaseClient }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <SignupForm
        onSwitchToLogin={(message) =>
          navigate('/login', { state: { message }, replace: true })
        }
        supabase={supabase}
      />

      <p className="text-center text-sm text-slate-300">
        Already have an account?{' '}
        <Link className="text-indigo-300 hover:text-indigo-200" to="/login">
          Sign in
        </Link>
        .
      </p>
    </div>
  )
}
