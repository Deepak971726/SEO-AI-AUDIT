import MetricCard from './MetricCard.jsx'

const tone = {
  good: 'good',
  info: 'info',
  accent: 'accent',
  warning: 'warning',
  danger: 'danger',
}

const METRIC_CONFIG = [
  {
    key: 'lcp',
    title: 'LCP',
    icon: 'LCP',
    label: 'Largest Contentful Paint',
    getStatus: (v) => (parseFloat(v) <= 2.5 ? 'Good' : parseFloat(v) <= 4 ? 'Needs Work' : 'Poor'),
    getTone: (v) => (parseFloat(v) <= 2.5 ? tone.good : parseFloat(v) <= 4 ? tone.warning : tone.danger),
  },
  {
    key: 'cls',
    title: 'CLS',
    icon: 'CLS',
    label: 'Cumulative Layout Shift',
    getStatus: (v) => (parseFloat(v) <= 0.1 ? 'Good' : parseFloat(v) <= 0.25 ? 'Needs Work' : 'Poor'),
    getTone: (v) => (parseFloat(v) <= 0.1 ? tone.info : parseFloat(v) <= 0.25 ? tone.warning : tone.danger),
  },
  {
    key: 'fcp',
    title: 'FCP',
    icon: 'FCP',
    label: 'First Contentful Paint',
    getStatus: (v) => (parseFloat(v) <= 1.8 ? 'Excellent' : parseFloat(v) <= 3 ? 'Needs Work' : 'Poor'),
    getTone: (v) => (parseFloat(v) <= 1.8 ? tone.accent : parseFloat(v) <= 3 ? tone.warning : tone.danger),
  },
  {
    key: 'speed_index',
    title: 'Speed Index',
    icon: 'SI',
    label: 'Visual load speed',
    getStatus: (v) => (parseFloat(v) <= 3.4 ? 'Improving' : 'Slow'),
    getTone: () => tone.accent,
  },
  {
    key: 'tbt',
    title: 'TBT',
    icon: 'TBT',
    label: 'Total Blocking Time',
    getStatus: (v) => (parseFloat(v) <= 200 ? 'Healthy' : 'High'),
    getTone: (v) => (parseFloat(v) <= 200 ? tone.info : tone.danger),
  },
]

function SkeletonCard() {
  return (
    <div className="min-h-[10.5rem] rounded-lg border border-(--border) bg-(--surface) p-4 animate-pulse">
      <div className="h-9 w-12 rounded-lg bg-(--panel)" />
      <div className="mt-5 space-y-3">
        <div className="h-4 w-24 rounded-full bg-(--panel)" />
        <div className="h-8 w-16 rounded-full bg-(--panel)" />
        <div className="h-3 w-32 rounded-full bg-(--panel)" />
      </div>
    </div>
  )
}

export default function MetricsDashboard({ report }) {
  const reportDevice = report?.device ? `${report.device[0].toUpperCase()}${report.device.slice(1)}` : null

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Core Web Vitals</p>
          <h2 className="mt-2 section-title">Performance metrics at a glance</h2>
        </div>
        <div className="rounded-full border border-(--border) bg-(--panel) px-4 py-2 text-sm font-medium text-muted">
          {reportDevice ? `${reportDevice} data` : 'Awaiting analysis'}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {!report
          ? METRIC_CONFIG.map(m => <SkeletonCard key={m.key} />)
          : METRIC_CONFIG.map(m => {
              const value = report[m.key] ?? 'N/A'
              return (
                <MetricCard
                  key={m.key}
                  icon={m.icon}
                  title={m.title}
                  value={value}
                  status={m.getStatus(value)}
                  trend={m.label}
                  tone={m.getTone(value)}
                />
              )
            })}
      </div>
    </section>
  )
}
