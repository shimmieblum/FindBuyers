import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LandingPage from './components/LandingPage'
import SupabaseNotConfigured from './components/SupabaseNotConfigured'
import { useSupabaseSession } from './hooks/useSupabaseSession'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import RedirectIfAuthed from './routes/RedirectIfAuthed'
import RequireAuth from './routes/RequireAuth'
import { supabase, supabaseConfigError } from './lib/supabaseClient'

function App() {
  const session = useSupabaseSession(supabase)

  if (supabaseConfigError) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-3xl px-6 py-10">
          <SupabaseNotConfigured message={supabaseConfigError} />
        </main>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout session={session} supabase={supabase} />}>
          <Route
            element={
              <RequireAuth session={session}>
                <LandingPage session={session!} />
              </RequireAuth>
            }
            index
          />

          <Route
            element={
              <RedirectIfAuthed session={session}>
                <LoginPage supabase={supabase!} />
              </RedirectIfAuthed>
            }
            path="login"
          />

          <Route
            element={
              <RedirectIfAuthed session={session}>
                <SignupPage supabase={supabase!} />
              </RedirectIfAuthed>
            }
            path="signup"
          />

          <Route element={<NotFoundPage session={session} />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
