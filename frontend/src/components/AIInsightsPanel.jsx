function InsightList({ items }) {
  if (!items?.length) return <p className="text-sm text-muted">No data yet.</p>
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-6 text-muted">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--accent)" />
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
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-(--panel-strong)" />
          <div className="h-4 w-full rounded-full bg-(--panel-strong)" />
        </li>
      ))}
    </ul>
  )
}

function InsightBlock({ label, children }) {
  return (
    <div className="rounded-lg border border-(--border) bg-(--panel) p-5">
      <div className="status-pill inline-flex px-3 py-1 text-xs uppercase tracking-[0.14em]">
        {label}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

export default function AIInsightsPanel({ aiSuggestions }) {
  const s = aiSuggestions

  return (
    <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
      <div className="panel-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">AI Suggestions</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--text) sm:text-3xl">Deep analysis from the AI core engine</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Prioritized recommendations for performance, SEO, and Core Web Vitals issues.
            </p>
          </div>
          <div className="rounded-lg border border-(--border) bg-(--panel) p-4 text-sm text-(--text)">
            <p className="eyebrow">AI Status</p>
            <p className="mt-3 text-2xl font-semibold text-(--text)">{s ? 'Ready' : '-'}</p>
            <p className="mt-2 text-muted">{s ? 'Analysis complete.' : 'Run an analysis to see AI insights.'}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <InsightBlock label="Problems">
            {s ? <InsightList items={s.performance_issues} /> : <SkeletonList />}
          </InsightBlock>
          <InsightBlock label="SEO Impact">
            {s ? <InsightList items={s.seo_impact} /> : <SkeletonList />}
          </InsightBlock>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="panel-card p-6">
          <p className="eyebrow">Optimization Suggestions</p>
          <div className="mt-5">{s ? <InsightList items={s.optimization_suggestions} /> : <SkeletonList />}</div>
        </div>
        <div className="panel-card p-6">
          <p className="eyebrow">React Optimization Tips</p>
          <div className="mt-5">{s ? <InsightList items={s.react_optimization_tips} /> : <SkeletonList />}</div>
        </div>
        <div className="panel-card p-6">
          <p className="eyebrow">Caching Recommendations</p>
          <div className="mt-5">{s ? <InsightList items={s.caching_recommendations} /> : <SkeletonList />}</div>
        </div>
        <div className="panel-card p-6">
          <p className="eyebrow">Image Optimization</p>
          <div className="mt-5">{s ? <InsightList items={s.image_optimization} /> : <SkeletonList />}</div>
        </div>
      </div>
    </section>
  )
}
