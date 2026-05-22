import ThemeToggle from './ThemeToggle.jsx'

const navItems = ['Dashboard', 'Reports', 'Pricing']

export default function Navbar({ onAnalyze, darkMode, toggleTheme }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 bg-(--surface) border-b border-(--border) backdrop-blur-xl rounded-b-4xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 via-cyan-400 to-indigo-500 text-white shadow-[0_0_50px_rgba(124,58,237,0.28)]">
            <span className="text-lg font-semibold">AI</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/75">AI Core Web Vitals</p>
            <p className="text-base font-semibold text-(--text)">Analyzer Dashboard</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-slate-600 transition hover:text-(--text) dark:text-slate-300"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAnalyze}
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_-30px_rgba(124,58,237,0.8)] transition hover:scale-[1.01]"
          >
            Analyze
          </button>
          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
        </div>
      </div>
    </header>
  )
}
