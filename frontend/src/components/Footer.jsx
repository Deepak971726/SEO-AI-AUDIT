export default function Footer() {
  return (
    <footer className="mt-10 border-t border-(--border) py-6 text-(--text)">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Developer Tool Brand</p>
          <p className="mt-2 text-sm text-muted">AI Core Web Vitals Analyzer / Designed for modern SaaS teams.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted">
          <a href="#" className="transition hover:text-(--accent-text)">GitHub</a>
          <a href="#" className="transition hover:text-(--accent-text)">Docs</a>
          <a href="#" className="transition hover:text-(--accent-text)">Support</a>
        </div>
      </div>
    </footer>
  )
}
