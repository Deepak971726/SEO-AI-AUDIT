export default function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-(--border) bg-(--panel) text-(--text) transition hover:border-(--border-strong) hover:bg-(--surface-strong)"
      aria-label="Toggle theme"
      title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {darkMode ? (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v2.2M12 18.8V21M4.4 4.4l1.6 1.6M18 18l1.6 1.6M3 12h2.2M18.8 12H21M4.4 19.6 6 18M18 6l1.6-1.6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ) : (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M20.1 14.4A7.4 7.4 0 0 1 9.6 3.9 8.2 8.2 0 1 0 20.1 14.4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      )}
    </button>
  )
}
