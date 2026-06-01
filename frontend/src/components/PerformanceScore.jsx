import { motion } from 'framer-motion'

const GRADE_COLOR = {
  Excellent: 'text-emerald-700 dark:text-emerald-300',
  Good: 'text-(--accent-text)',
  'Needs Improvement': 'text-amber-700 dark:text-amber-300',
  Poor: 'text-(--danger)',
}

const GRADE_FOCUS = {
  Excellent: 'Maintain LCP under 2.5s and CLS below 0.1.',
  Good: 'Keep LCP under 2.5s and reduce TBT for a better score.',
  'Needs Improvement': 'Focus on reducing LCP, TBT, and layout shifts.',
  Poor: 'Prioritize LCP, CLS, and TBT fixes.',
}

export default function PerformanceScore({ score, grade }) {
  const circumference = 220
  const displayScore = score ?? 0
  const dashOffset = ((100 - displayScore) / 100) * circumference
  const gradeColor = GRADE_COLOR[grade] ?? 'text-(--text)'
  const focusText = GRADE_FOCUS[grade] ?? 'Run an analysis to see your performance score.'

  return (
    <div className="panel-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Performance Score</p>
          <h3 className="mt-2 text-2xl font-semibold text-(--text)">Lighthouse-style audit</h3>
        </div>
        {grade && (
          <div className={`rounded-lg border border-(--border) bg-(--panel) px-4 py-2 text-sm font-semibold ${gradeColor}`}>
            {grade}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
        <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-(--panel) p-5">
          <svg viewBox="0 0 200 200" className="absolute h-full w-full -rotate-90">
            <circle cx="100" cy="100" r="35" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="20" />
            <motion.circle
              cx="100"
              cy="100"
              r="35"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-(--surface) text-center">
            <div>
              <p className="text-5xl font-semibold text-(--text)">{score ?? '-'}</p>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Score</p>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 sm:max-w-md">
          <div className="panel-soft p-5">
            <p className="eyebrow">Focus</p>
            <p className="mt-3 text-lg font-semibold text-(--text)">{focusText}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['Responsive images', 'Cache TTL', 'JS bundling', 'Third-party scripts'].map(feature => (
              <div key={feature} className="rounded-lg border border-(--border) bg-(--panel) px-4 py-4 text-sm font-medium text-(--text)">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
