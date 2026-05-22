const chartData = [
  { label: 'LCP', value: 78 },
  { label: 'CLS', value: 92 },
  { label: 'FCP', value: 88 },
  { label: 'Speed', value: 71 },
  { label: 'TBT', value: 84 },
]

export default function PerformanceChart() {
  return (
    <div className="rounded-4xl panel-card p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Visual chart</p>
          <h3 className="mt-2 text-2xl font-semibold text-(--text)">Performance breakdown</h3>
        </div>
        <span className="rounded-full bg-(--surface) px-3 py-2 text-sm text-(--text)">Score range</span>
      </div>

      <div className="mt-8 space-y-4">
        {chartData.map(item => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>{item.label}</span>
              <span className="font-semibold text-(--text)">{item.value}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-(--panel)">
              <div className="h-full rounded-full bg-linear-to-r from-violet-500 via-cyan-400 to-sky-500" style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
