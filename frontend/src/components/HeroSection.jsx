import { motion } from 'framer-motion'

export default function HeroSection({ url, setUrl, onAnalyze }) {
  return (
    <section id="dashboard" className="relative overflow-hidden rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl sm:p-12">
      <div className="hero-blur absolute inset-0 opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10"
      >
        <div className="mb-6 max-w-3xl text-primary sm:mb-8">
          <p className="mb-4 inline-flex rounded-full bg-(--panel) px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-300/80 shadow-[0_0_50px_rgba(56,189,248,0.12)]">
            Premium AI SaaS Dashboard
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-(--text) sm:text-6xl">
            AI Core Web Vitals Analyzer
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
            Analyze website performance, SEO, and Core Web Vitals using AI.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[1.75rem] panel-card p-5 shadow-[0_0_80px_rgba(15,23,42,0.28)] backdrop-blur-xl">
            <label className="text-sm font-medium uppercase tracking-[0.2em] text-muted">Website URL</label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-3xl border border-(--border) bg-(--surface) px-5 py-4 text-sm text-(--text) outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                onClick={onAnalyze}
                className="inline-flex shrink-0 items-center justify-center rounded-3xl bg-linear-to-r from-violet-500 to-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Analyze now
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] panel-soft p-6 text-primary shadow-[0_0_60px_rgba(15,23,42,0.22)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Live Glance</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-3xl bg-(--panel) px-5 py-4">
                <span className="text-sm text-(--text)">Active requests</span>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">24%</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-(--panel) px-5 py-4">
                <span className="text-sm text-primary">AI suggestions</span>
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">Instant</span>
              </div>
              <div className="rounded-3xl panel-card p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-muted">Status</p>
                <p className="mt-3 text-2xl font-semibold text-(--text)">Ready to analyze</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
