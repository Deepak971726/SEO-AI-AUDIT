function toScore(key, value) {
  if (!value || value === 'N/A') return 0
  const num = parseFloat(value)
  if (Number.isNaN(num)) return 0
  switch (key) {
    case 'lcp':         return Math.max(0, Math.min(100, Math.round((1 - (num - 1) / 3) * 100)))
    case 'fcp':         return Math.max(0, Math.min(100, Math.round((1 - (num - 0.5) / 2.5) * 100)))
    case 'ttfb':        return Math.max(0, Math.min(100, Math.round((1 - num / 1800) * 100)))
    case 'speed_index': return Math.max(0, Math.min(100, Math.round((1 - (num - 1) / 5) * 100)))
    case 'tbt':         return Math.max(0, Math.min(100, Math.round((1 - num / 600) * 100)))
    case 'cls':         return Math.max(0, Math.min(100, Math.round((1 - num / 0.5) * 100)))
    default:            return 0
  }
}

const CHART_METRICS = [
  { key: 'lcp', label: 'LCP' },
  { key: 'cls', label: 'CLS' },
  { key: 'fcp', label: 'FCP' },
  { key: 'ttfb', label: 'TTFB' },
  { key: 'speed_index', label: 'Speed' },
  { key: 'tbt', label: 'TBT' },
]

function SkeletonChart() {
  return (
    <div className="panel-card p-6 animate-pulse">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded-full bg-(--panel)" />
          <div className="h-6 w-48 rounded-full bg-(--panel)" />
        </div>
      </div>
      <div className="space-y-5">
        {CHART_METRICS.map(m => (
          <div key={m.key} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-12 rounded-full bg-(--panel)" />
              <div className="h-3 w-16 rounded-full bg-(--panel)" />
            </div>
            <div className="h-3 w-full rounded-full bg-(--panel)" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PerformanceChart({ report, isAnalyzing }) {
  // hide completely when nothing has happened yet
  if (!report && !isAnalyzing) return null

  if (isAnalyzing && !report) return <SkeletonChart />

  const chartData = CHART_METRICS.map(m => ({
    label: m.label,
    value: toScore(m.key, report[m.key]),
    raw: report[m.key] ?? '-',
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
              <span className="font-semibold text-(--text)">{`${item.value}% / ${item.raw}`}</span>
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
