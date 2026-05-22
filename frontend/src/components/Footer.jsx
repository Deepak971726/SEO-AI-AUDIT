export default function Footer() {
  return (
    <footer className="mt-16 rounded-4xl panel-card p-8 text-(--text) shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Developer tool brand</p>
          <p className="mt-3 text-sm text-muted">AI Core Web Vitals Analyzer · Designed for modern SaaS teams.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <a href="#" className="transition hover:text-(--text)">GitHub</a>
          <a href="#" className="transition hover:text-(--text)">Docs</a>
          <a href="#" className="transition hover:text-(--text)">Support</a>
        </div>
      </div>
    </footer>
  )
}
