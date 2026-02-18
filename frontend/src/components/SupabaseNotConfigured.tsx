export default function SupabaseNotConfigured({
  message,
}: {
  message: string
}) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-slate-50">
        Supabase not configured
      </h1>
      <p className="text-sm text-slate-300">{message}</p>
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 font-mono text-xs text-slate-200">
        VITE_SUPABASE_URL=...
        <br />
        VITE_SUPABASE_PUBLISHABLE_KEY=...
      </div>
    </div>
  )
}
