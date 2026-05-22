export default function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text) shadow-glow transition hover:bg-(--surface-strong)"
      aria-label="Toggle theme"
    >
      <span className="text-lg">{darkMode ? '☾' : '☀'}</span>
    </button>
  )
}
