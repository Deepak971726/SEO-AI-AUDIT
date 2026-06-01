export default function HeroSection({ url, setUrl, onAnalyze, isAnalyzing, hasResult, error }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isAnalyzing) onAnalyze()
  }

  const statusLabel = isAnalyzing
    ? 'Analyzing'
    : hasResult
    ? 'Analysis complete'
    : error
    ? 'Analysis failed'
    : 'Ready to analyze'

  const statusColor = isAnalyzing
    ? 'text-(--accent)'
    : hasResult
    ? 'text-(--success)'
    : error
    ? 'text-(--danger)'
    : 'text-(--text)'

  return (
    <section id="dashboard" className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
      <div className="panel-card flex flex-col justify-between p-6">
        <div>
          <p className="eyebrow">AI SaaS Dashboard</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-(--text) sm:text-4xl">
            AI Core Web Vitals Analyzer
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Analyze website performance, SEO, and Core Web Vitals using AI.
          </p>
        </div>

        <div className="mt-6">
          <label className="eyebrow" htmlFor="website-url">Website URL</label>
          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
            <input
              id="website-url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="google.com or https://example.com"
              disabled={isAnalyzing}
              className="control-input h-11 w-full px-4 text-sm disabled:opacity-60"
            />
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing || !url.trim()}
              className="btn-primary h-11 px-4 text-sm disabled:opacity-60"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8z" />
                  </svg>
                  Running
                </span>
              ) : 'Analyze'}
            </button>
          </div>
          {error && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-(--danger) dark:border-red-400/20 dark:bg-red-500/10">
              {error}
            </p>
          )}
        </div>
      </div>

      <aside className="panel-card p-5">
        <p className="eyebrow">Live Glance</p>
        <div className="mt-4 grid gap-3">
          <div className="rounded-lg border border-(--border) bg-(--panel) p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-(--text)">Active requests</span>
              <span className="status-pill px-3 py-1 text-xs">{isAnalyzing ? 'Running' : 'Idle'}</span>
            </div>
          </div>
          <div className="rounded-lg border border-(--border) bg-(--panel) p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-(--text)">AI suggestions</span>
              <span className="status-pill px-3 py-1 text-xs">{hasResult ? 'Ready' : 'Pending'}</span>
            </div>
          </div>
          <div className="rounded-lg border border-(--border) bg-(--panel) p-4">
            <p className="eyebrow">Status</p>
            <p className={`mt-2 text-lg font-bold ${statusColor}`}>{statusLabel}</p>
          </div>
        </div>
      </aside>
    </section>
  )
}
