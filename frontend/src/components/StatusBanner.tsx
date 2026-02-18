type Variant = 'info' | 'error' | 'success'

const VARIANT_STYLES: Record<Variant, string> = {
  info: 'border-slate-700/60 bg-slate-900/40 text-slate-200',
  error: 'border-rose-700/40 bg-rose-950/40 text-rose-200',
  success: 'border-emerald-700/40 bg-emerald-950/40 text-emerald-200',
}

export default function StatusBanner({
  message,
  variant = 'info',
  onDismiss,
}: {
  message: string
  variant?: Variant
  onDismiss?: () => void
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-md border px-3 py-2 text-sm ${VARIANT_STYLES[variant]}`}
    >
      <div>{message}</div>
      {onDismiss ? (
        <button
          className="rounded px-2 py-1 text-xs text-slate-200 hover:bg-white/5"
          onClick={onDismiss}
          type="button"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  )
}
