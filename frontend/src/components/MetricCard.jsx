export default function MetricCard({ icon, title, value, status, trend, tone }) {
  return (
    <div className="flex min-h-[10.5rem] flex-col justify-between rounded-lg border border-(--border) bg-(--surface) p-4 transition duration-200 hover:border-(--border-strong) hover:bg-(--surface-strong) hover:shadow-[0_16px_34px_-28px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex h-9 min-w-11 items-center justify-center rounded-lg bg-(--panel) px-2 text-[11px] font-bold text-(--accent-text)">
          {icon}
        </div>
        <span className={`metric-status metric-status-${tone}`}>{status}</span>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-bold text-(--text)">{title}</h3>
        <p className="mt-2 text-3xl font-bold leading-none text-(--text)">{value}</p>
        <p className="mt-3 min-h-10 text-xs leading-5 text-muted">{trend}</p>
      </div>
    </div>
  )
}
