function InsightList({ items }) {
  if (!items?.length) return <p className="text-sm text-muted">No data yet.</p>
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-6 text-muted">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function SkeletonList() {
  return (
    <ul className="space-y-3">
      {[1, 2, 3].map(i => (
        <li key={i} className="flex gap-3 animate-pulse">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-(--panel)" />
          <div className="h-4 w-full rounded-full bg-(--panel)" />
        </li>
      ))}
    </ul>
  )
}

export default function AIInsightsPanel({ aiSuggestions }) {
  const s = aiSuggestions

  return (
    <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
      <div className="rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">AI Suggestions</p>
            <h2 className="mt-4 text-3xl font-semibold text-(--text)">Deep analysis from the AI core engine</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              The analyzer generates prioritized recommendations for performance, SEO, and Core Web Vitals issues.
              Insights are designed to be immediately actionable for React and modern web apps.
            </p>
          </div>
          <div className="rounded-3xl bg-(--surface) p-5 text-sm text-(--text) shadow-[0_20px_60px_-30px_rgba(15,23,42,0.6)]">
            <p className="uppercase tracking-[0.28em] text-cyan-300/80">AI status</p>
            <p className="mt-3 text-3xl font-semibold text-(--text)">{s ? 'Ready' : '—'}</p>
            <p className="mt-2 text-muted">{s ? 'Analysis complete.' : 'Run an analysis to see AI insights.'}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl panel-soft p-6">
            <div className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
              Problems
            </div>
            <div className="mt-5">{s ? <InsightList items={s.performance_issues} /> : <SkeletonList />}</div>
          </div>
          <div className="rounded-3xl panel-soft p-6">
            <div className="inline-flex items-center rounded-full bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-violet-200">
              SEO impact
            </div>
            <div className="mt-5">{s ? <InsightList items={s.seo_impact} /> : <SkeletonList />}</div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Optimization suggestions</p>
          <div className="mt-6">{s ? <InsightList items={s.optimization_suggestions} /> : <SkeletonList />}</div>
        </div>
        <div className="rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">React optimization tips</p>
          <div className="mt-6">{s ? <InsightList items={s.react_optimization_tips} /> : <SkeletonList />}</div>
        </div>
        <div className="rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Caching recommendations</p>
          <div className="mt-6">{s ? <InsightList items={s.caching_recommendations} /> : <SkeletonList />}</div>
        </div>
        <div className="rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Image optimization</p>
          <div className="mt-6">{s ? <InsightList items={s.image_optimization} /> : <SkeletonList />}</div>
        </div>
      </div>
    </section>
  )
}
