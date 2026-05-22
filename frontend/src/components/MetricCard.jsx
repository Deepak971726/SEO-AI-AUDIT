export default function MetricCard({ icon, title, value, status, trend, tone }) {
  return (
    <div className="group rounded-[1.75rem] border border-(--border) bg-(--surface) p-6 transition duration-300 hover:-translate-y-1 hover:bg-(--surface-strong) hover:shadow-[0_30px_80px_-40px_rgba(59,130,246,0.18)]">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-(--panel) text-2xl text-(--text) shadow-inner shadow-slate-950/20">
        {icon}
      </div>
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-(--text)">{title}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{status}</span>
        </div>
        <p className="text-4xl font-semibold text-(--text)">{value}</p>
        <p className="text-sm text-(--muted)">{trend}</p>
      </div>
    </div>
  )
}
