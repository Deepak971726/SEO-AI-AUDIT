import { motion } from 'framer-motion'

const GRADE_COLOR = {
  Excellent: 'text-emerald-300',
  Good: 'text-cyan-300',
  'Needs Improvement': 'text-amber-300',
  Poor: 'text-red-400',
}

const GRADE_FOCUS = {
  Excellent: 'Great job! Maintain LCP under 2.5s and CLS below 0.1.',
  Good: 'Keep LCP under 2.5s and reduce TBT for a better score.',
  'Needs Improvement': 'Focus on reducing LCP, TBT, and layout shifts.',
  Poor: 'Critical issues detected. Prioritize LCP, CLS, and TBT fixes.',
}

export default function PerformanceScore({ score, grade }) {
  const circumference = 220
  const displayScore = score ?? 0
  const dashOffset = ((100 - displayScore) / 100) * circumference
  const gradeColor = GRADE_COLOR[grade] ?? 'text-(--text)'
  const focusText = GRADE_FOCUS[grade] ?? 'Run an analysis to see your performance score.'

  return (
    <div className="rounded-4xl panel-card p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Performance Score</p>
          <h3 className="mt-2 text-2xl font-semibold text-(--text)">Lighthouse-style audit</h3>
        </div>
        {grade && (
          <div className={`rounded-3xl bg-(--surface) px-4 py-2 text-sm font-semibold ${gradeColor}`}>
            {grade}
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
        <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-(--panel) p-6">
          <svg viewBox="0 0 200 200" className="absolute h-full w-full -rotate-90">
            <circle cx="100" cy="100" r="35" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="20" />
            <motion.circle
              cx="100"
              cy="100"
              r="35"
              fill="none"
              stroke="url(#performanceGradient)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-(--surface) text-center">
            <div>
              <p className="text-5xl font-semibold text-(--text)">{score ?? '—'}</p>
              <p className="text-sm uppercase tracking-[0.3em] text-muted">Score</p>
            </div>
          </div>
        </div>

        <div className="w-full space-y-5 sm:max-w-md">
          <div className="rounded-3xl panel-soft p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Focus</p>
            <p className="mt-3 text-lg font-semibold text-(--text)">{focusText}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['Responsive images', 'Cache TTL', 'JS bundling', 'Third-party scripts'].map(feature => (
              <div key={feature} className="rounded-3xl border border-(--border) bg-(--surface) px-4 py-4 text-sm text-(--text)">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
