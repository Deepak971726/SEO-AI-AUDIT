const features = [
  'AI Performance Analysis',
  'SEO Suggestions',
  'Core Web Vitals Monitoring',
  'React Optimization Tips',
  'Image Optimization',
  'Cache Recommendations',
]

export default function FeaturesSection() {
  return (
    <section id="pricing" className="panel-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Feature Set</p>
          <h2 className="mt-3 text-2xl font-semibold text-(--text) sm:text-3xl">Built for developer-first performance teams</h2>
        </div>
        <div className="rounded-full border border-(--border) bg-(--panel) px-4 py-2 text-sm font-medium text-muted">Trusted by teams</div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(feature => (
          <div key={feature} className="rounded-lg border border-(--border) bg-(--panel) px-5 py-5 text-sm transition hover:border-(--border-strong) hover:bg-(--surface-strong)">
            <p className="font-semibold text-(--text)">{feature}</p>
            <p className="mt-2 text-sm leading-6 text-muted">Reduce load time, improve SEO, and simplify performance planning.</p>
          </div>
        ))}
      </div>
    </section>
  )
}
