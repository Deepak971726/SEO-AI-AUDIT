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
    <section id="pricing" className="rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Feature set</p>
          <h2 className="mt-3 text-3xl font-semibold text-(--text)">Built for developer-first performance teams</h2>
        </div>
        <div className="rounded-full bg-(--surface) px-4 py-2 text-sm text-(--text)">Trusted by teams</div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(feature => (
          <div key={feature} className="rounded-[1.75rem] border border-(--border) bg-(--surface) px-5 py-6 text-sm text-(--text) transition hover:border-cyan-400/30 hover:bg-(--surface-strong)">
            <p className="mb-4 text-3xl">✨</p>
            <p className="font-semibold text-(--text)">{feature}</p>
            <p className="mt-3 text-sm text-muted">Designed to reduce load time, boost SEO, and simplify performance planning.</p>
          </div>
        ))}
      </div>
    </section>
  )
}
