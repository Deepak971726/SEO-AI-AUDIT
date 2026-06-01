function toScore(key, value) {
  if (!value || value === 'N/A') return 0
  const num = parseFloat(value)
  if (Number.isNaN(num)) return 0

  switch (key) {
    case 'lcp': return Math.max(0, Math.min(100, Math.round((1 - (num - 1) / 3) * 100)))
    case 'fcp': return Math.max(0, Math.min(100, Math.round((1 - (num - 0.5) / 2.5) * 100)))
    case 'speed_index': return Math.max(0, Math.min(100, Math.round((1 - (num - 1) / 5) * 100)))
    case 'tbt': return Math.max(0, Math.min(100, Math.round((1 - num / 600) * 100)))
    case 'cls': return Math.max(0, Math.min(100, Math.round((1 - num / 0.5) * 100)))
    default: return 0
  }
}

const CHART_METRICS = [
  { key: 'lcp', label: 'LCP' },
  { key: 'cls', label: 'CLS' },
  { key: 'fcp', label: 'FCP' },
  { key: 'speed_index', label: 'Speed' },
  { key: 'tbt', label: 'TBT' },
]

export default function PerformanceChart({ report }) {
  const chartData = CHART_METRICS.map(m => ({
    label: m.label,
    value: report ? toScore(m.key, report[m.key]) : 0,
    raw: report?.[m.key] ?? '-',
  }))

  return (
    <div className="panel-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Visual Chart</p>
          <h3 className="mt-2 text-2xl font-semibold text-(--text)">Performance breakdown</h3>
        </div>
        <span className="rounded-full border border-(--border) bg-(--panel) px-3 py-2 text-sm font-medium text-muted">Score range</span>
      </div>

      <div className="mt-8 space-y-4">
        {chartData.map(item => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>{item.label}</span>
              <span className="font-semibold text-(--text)">
                {report ? `${item.value}% / ${item.raw}` : '-'}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-(--panel-strong)">
              <div
                className="h-full rounded-full bg-(--accent) transition-all duration-700"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
