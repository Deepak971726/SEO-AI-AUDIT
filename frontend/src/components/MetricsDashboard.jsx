import MetricCard from './MetricCard.jsx'

const METRIC_CONFIG = [
  {
    key: 'lcp',
    title: 'LCP',
    icon: '⏱',
    label: 'Largest Contentful Paint',
    getStatus: (v) => (parseFloat(v) <= 2.5 ? 'Good' : parseFloat(v) <= 4 ? 'Needs Work' : 'Poor'),
    getTone: (v) => (parseFloat(v) <= 2.5 ? 'bg-emerald-500/15 text-emerald-200' : parseFloat(v) <= 4 ? 'bg-amber-500/15 text-amber-200' : 'bg-red-500/15 text-red-200'),
  },
  {
    key: 'cls',
    title: 'CLS',
    icon: '🧠',
    label: 'Cumulative Layout Shift',
    getStatus: (v) => (parseFloat(v) <= 0.1 ? 'Good' : parseFloat(v) <= 0.25 ? 'Needs Work' : 'Poor'),
    getTone: (v) => (parseFloat(v) <= 0.1 ? 'bg-sky-500/15 text-sky-200' : parseFloat(v) <= 0.25 ? 'bg-amber-500/15 text-amber-200' : 'bg-red-500/15 text-red-200'),
  },
  {
    key: 'fcp',
    title: 'FCP',
    icon: '🚀',
    label: 'First Contentful Paint',
    getStatus: (v) => (parseFloat(v) <= 1.8 ? 'Excellent' : parseFloat(v) <= 3 ? 'Needs Work' : 'Poor'),
    getTone: (v) => (parseFloat(v) <= 1.8 ? 'bg-fuchsia-500/15 text-fuchsia-200' : parseFloat(v) <= 3 ? 'bg-amber-500/15 text-amber-200' : 'bg-red-500/15 text-red-200'),
  },
  {
    key: 'speed_index',
    title: 'Speed Index',
    icon: '⚡',
    label: 'Visual load speed',
    getStatus: (v) => (parseFloat(v) <= 3.4 ? 'Improving' : 'Slow'),
    getTone: () => 'bg-violet-500/15 text-violet-200',
  },
  {
    key: 'tbt',
    title: 'TBT',
    icon: '📊',
    label: 'Total Blocking Time',
    getStatus: (v) => (parseFloat(v) <= 200 ? 'Healthy' : 'High'),
    getTone: (v) => (parseFloat(v) <= 200 ? 'bg-cyan-500/15 text-cyan-200' : 'bg-red-500/15 text-red-200'),
  },
]

function SkeletonCard() {
  return (
    <div className="rounded-[1.75rem] border border-(--border) bg-(--surface) p-6 animate-pulse">
      <div className="h-14 w-14 rounded-3xl bg-(--panel)" />
      <div className="mt-6 space-y-3">
        <div className="h-4 w-24 rounded-full bg-(--panel)" />
        <div className="h-8 w-16 rounded-full bg-(--panel)" />
        <div className="h-3 w-32 rounded-full bg-(--panel)" />
      </div>
    </div>
  )
}

export default function MetricsDashboard({ report }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Core Web Vitals</p>
          <h2 className="mt-2 text-3xl font-semibold text-(--text)">Performance metrics at a glance</h2>
        </div>
        <div className="rounded-full bg-(--panel) px-4 py-2 text-sm text-(--muted)">
          {report ? 'Live data' : 'Awaiting analysis'}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
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
