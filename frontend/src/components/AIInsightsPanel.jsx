const insights = {
  problems: [
    'Cumulative Layout Shift is slightly high due to dynamic hero banners.',
    'TBT spikes when loading third-party analytics scripts.',
    'Slow server response on initial content fetch for mobile users.',
  ],
  seoImpact: [
    'Good Core Web Vitals improve search rankings and reduce bounce rates.',
    'Fast FCP leads to better indexing and user engagement.',
    'Stable visual layout improves accessibility and trust signals.',
  ],
  suggestions: [
    'Use responsive images with modern formats like AVIF or WebP.',
    'Lazy-load offscreen content and critical scripts only.',
    'Preconnect to key APIs and CDN endpoints for faster TTFB.',
  ],
  fixes: [
    'Move non-critical JS to deferred loading and split bundles.',
    'Set static width/height on ad slots and hero images to prevent layout shifts.',
    'Enable HTTP caching for fonts, scripts, and static assets.',
  ],
}

function renderList(items) {
  return (
    <ul className="space-y-3">
      {items.map(item => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function AIInsightsPanel() {
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
            <p className="uppercase tracking-[0.28em] text-cyan-300/80">AI confidence</p>
            <p className="mt-3 text-3xl font-semibold text-(--text)">92%</p>
            <p className="mt-2 text-muted">High confidence based on Lighthouse and SEO analysis.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl panel-soft p-6">
            <div className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
              Problems
            </div>
            <div className="mt-5 space-y-3">{renderList(insights.problems)}</div>
          </div>
          <div className="rounded-3xl panel-soft p-6">
            <div className="inline-flex items-center rounded-full bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-violet-200">
              SEO impact
            </div>
            <div className="mt-5 space-y-3">{renderList(insights.seoImpact)}</div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Optimization suggestions</p>
          <div className="mt-6 space-y-4">{renderList(insights.suggestions)}</div>
        </div>
        <div className="rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Performance fixes</p>
          <div className="mt-6 space-y-4">{renderList(insights.fixes)}</div>
        </div>
      </div>
    </section>
  )
}
