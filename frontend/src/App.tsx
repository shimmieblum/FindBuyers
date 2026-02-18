import AuthScreen from './components/auth/AuthScreen'
import Header from './components/Header'
import LandingPage from './components/LandingPage'
import SupabaseNotConfigured from './components/SupabaseNotConfigured'
import { useSupabaseSession } from './hooks/useSupabaseSession'
import { supabase, supabaseConfigError } from './lib/supabaseClient'

function App() {
  const session = useSupabaseSession(supabase)

  return (
    <div className="min-h-screen">
      <Header session={session} supabase={supabase} />

      <main className="mx-auto max-w-3xl px-6 py-10">
        {supabaseConfigError ? (
          <SupabaseNotConfigured message={supabaseConfigError} />
        ) : session ? (
          <LandingPage session={session} />
        ) : (
          <AuthScreen supabase={supabase!} />
        )}
      </main>
    </div>
  )
}

export default App
