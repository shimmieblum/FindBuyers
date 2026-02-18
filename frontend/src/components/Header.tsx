import type { Session, SupabaseClient } from '@supabase/supabase-js'

export default function Header({
  session,
  supabase,
}: {
  session: Session | null
  supabase: SupabaseClient | null
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <div className="text-sm font-semibold tracking-wide text-slate-200">
          FindBuyers
        </div>

        {session && supabase ? (
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
  )
}
