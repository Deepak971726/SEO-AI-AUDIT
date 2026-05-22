import MetricCard from './MetricCard.jsx'

const metrics = [
  { title: 'LCP', value: '1.7s', status: 'Good', trend: 'Stable', tone: 'bg-emerald-500/15 text-emerald-200' },
  { title: 'CLS', value: '0.08', status: 'On Target', trend: 'Needs monitoring', tone: 'bg-sky-500/15 text-sky-200' },
  { title: 'FCP', value: '1.2s', status: 'Excellent', trend: 'Fast load', tone: 'bg-fuchsia-500/15 text-fuchsia-200' },
  { title: 'Speed Index', value: '3.4s', status: 'Improving', trend: 'Trend up', tone: 'bg-violet-500/15 text-violet-200' },
  { title: 'TBT', value: '120ms', status: 'Healthy', trend: 'Low latency', tone: 'bg-cyan-500/15 text-cyan-200' },
]

const icons = {
  LCP: '⏱',
  CLS: '🧠',
  FCP: '🚀',
  'Speed Index': '⚡',
  TBT: '📊',
}

export default function MetricsDashboard() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Core Web Vitals</p>
          <h2 className="mt-2 text-3xl font-semibold text-(--text)">Performance metrics at a glance</h2>
        </div>
        <div className="rounded-full bg-(--panel) px-4 py-2 text-sm text-(--muted)">Updated just now</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {metrics.map(item => (
          <MetricCard
            key={item.title}
            icon={icons[item.title]}
            title={item.title}
            value={item.value}
            status={item.status}
            trend={item.trend}
            tone={item.tone}
          />
        ))}
      </div>
    </section>
  )
}
