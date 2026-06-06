import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SEVERITY_STYLES = {
  low: {
    badge: 'border-emerald-300/30 bg-emerald-400/15 text-emerald-200',
    glow: 'shadow-[0_24px_80px_-24px_rgba(16,185,129,0.65)]',
    accent: 'from-emerald-400 via-cyan-400 to-blue-500',
  },
  medium: {
    badge: 'border-amber-300/30 bg-amber-400/15 text-amber-100',
    glow: 'shadow-[0_24px_80px_-24px_rgba(245,158,11,0.7)]',
    accent: 'from-amber-300 via-orange-400 to-red-500',
  },
  high: {
    badge: 'border-red-300/30 bg-red-400/15 text-red-100',
    glow: 'shadow-[0_24px_80px_-20px_rgba(239,68,68,0.78)]',
    accent: 'from-fuchsia-500 via-red-500 to-orange-400',
  },
}

export default function SavageRoastPopup({ roast }) {
  const [isOpen, setIsOpen] = useState(true)
  const severity = roast?.severity in SEVERITY_STYLES ? roast.severity : 'medium'
  const styles = SEVERITY_STYLES[severity]

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <AnimatePresence>
      {roast && isOpen && (
        <motion.aside
          role="status"
          aria-live="assertive"
          initial={{ opacity: 0, y: 48, scale: 0.9, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 28, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 330, damping: 25 }}
          className={`fixed inset-x-4 bottom-4 z-60 overflow-hidden rounded-2xl border border-white/15 bg-slate-950 text-white ${styles.glow} sm:left-auto sm:right-6 sm:w-[440px]`}
        >
          <motion.div
            aria-hidden="true"
            className={`h-1 bg-linear-to-r ${styles.accent}`}
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />

          <div className="relative p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-red-500/15 blur-3xl" />

            <div className="flex items-start gap-4">
              <motion.div
                aria-hidden="true"
                animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.12, 1.05, 1] }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-2xl"
              >
                {roast.emoji || '🔥'}
              </motion.div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-300">
                    Savage Web Auditor
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    aria-label="Close website roast"
                  >
                    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>

                <h2 className="mt-2 text-xl font-black leading-tight text-white">
                  {roast.title}
                </h2>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm font-medium leading-6 text-slate-200">
              {roast.message}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${styles.badge}`}>
                {severity} severity
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Website roast only
              </span>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
