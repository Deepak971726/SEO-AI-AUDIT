import ThemeToggle from './ThemeToggle.jsx'

const navItems = ['Dashboard', 'Reports', 'Pricing']

export default function Navbar({ onAnalyze, darkMode, toggleTheme }) {
  return (
    <header className="sticky top-0 z-40 border-b border-(--border) bg-(--surface) backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--accent) text-white shadow-[0_10px_24px_-18px_var(--accent)]">
            <span className="text-sm font-bold">AI</span>
          </div>
          <div>
            <p className="eyebrow">AI Core Web Vitals</p>
            <p className="text-sm font-semibold text-(--text)">Analyzer Dashboard</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-muted transition hover:text-(--accent-text)"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAnalyze}
            className="btn-primary h-10 px-4 text-sm"
          >
            Analyze
          </button>
          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
        </div>
      </div>
    </header>
  )
}
