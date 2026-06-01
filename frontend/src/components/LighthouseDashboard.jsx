import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function scoreColor(score) {
  if (score === null) return { ring: '#94a3b8', text: '#64748b', bg: 'rgba(148,163,184,0.12)' }
  if (score >= 90) return { ring: '#22c55e', text: '#15803d', bg: 'rgba(34,197,94,0.12)' }
  if (score >= 50) return { ring: '#f97316', text: '#c2410c', bg: 'rgba(249,115,22,0.12)' }
  return { ring: '#ef4444', text: '#dc2626', bg: 'rgba(239,68,68,0.12)' }
}

function scoreLabel(score) {
  if (score === null) return '-'
  if (score >= 90) return 'Good'
  if (score >= 50) return 'Needs Improvement'
  return 'Poor'
}

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === null) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return value
}

function ScoreRing({ label, score, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const animated = useCountUp(inView ? score : 0)
  const colors = scoreColor(score)
  const radius = 31
  const circ = 2 * Math.PI * radius
  const offset = score === null ? circ : circ * (1 - score / 100)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay }}
      className="flex min-h-28 items-center gap-3 rounded-lg border border-(--border) bg-(--panel) p-3"
    >
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="7" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          />
        </svg>
        <span className="absolute text-xl font-bold" style={{ color: colors.text }}>
          {score === null ? '-' : animated}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-(--text)">{label}</p>
        <span
          className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ color: colors.text, background: colors.bg }}
        >
          {scoreLabel(score)}
        </span>
      </div>
    </motion.div>
  )
}

const METRIC_THRESHOLDS = {
  lcp: { good: 2.5, poor: 4, label: 'Largest Contentful Paint' },
  fcp: { good: 1.8, poor: 3, label: 'First Contentful Paint' },
  cls: { good: 0.1, poor: 0.25, label: 'Cumulative Layout Shift' },
  tbt: { good: 200, poor: 600, label: 'Total Blocking Time' },
  speed_index: { good: 3.4, poor: 5.8, label: 'Speed Index' },
}

function metricStatus(key, raw) {
  if (!raw || raw === 'N/A') return 'neutral'
  const num = parseFloat(raw)
  const t = METRIC_THRESHOLDS[key]
  if (!t || Number.isNaN(num)) return 'neutral'
  if (num <= t.good) return 'good'
  if (num <= t.poor) return 'average'
  return 'poor'
}

const STATUS_STYLES = {
  good: { dot: 'bg-green-500', bar: 'bg-green-500', text: 'text-green-700 dark:text-green-400', label: 'Good' },
  average: { dot: 'bg-orange-400', bar: 'bg-orange-400', text: 'text-orange-700 dark:text-orange-400', label: 'Needs Improvement' },
  poor: { dot: 'bg-red-500', bar: 'bg-red-500', text: 'text-red-700 dark:text-red-400', label: 'Poor' },
  neutral: { dot: 'bg-slate-500', bar: 'bg-slate-500', text: 'text-slate-600 dark:text-slate-400', label: '-' },
}

function MetricRow({ metricKey, value, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const status = metricStatus(metricKey, value)
  const styles = STATUS_STYLES[status]
  const threshold = METRIC_THRESHOLDS[metricKey]
  const num = parseFloat(value)
  const barWidth = Number.isNaN(num) ? 0 : Math.min(100, Math.round((num / (threshold?.poor * 1.5 || 1)) * 100))

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="grid grid-cols-[1.7fr_0.8fr_1.4fr_1fr] items-center gap-4 border-b border-(--border) py-3 last:border-0"
    >
      <div className="flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`} />
        <span className="text-sm text-(--text)">{threshold?.label ?? metricKey}</span>
      </div>
      <span className={`text-sm font-semibold tabular-nums ${styles.text}`}>{value ?? '-'}</span>
      <div className="h-2 overflow-hidden rounded-full bg-(--panel-strong)">
        <motion.div
          className={`h-full rounded-full ${styles.bar}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${barWidth}%` } : {}}
          transition={{ duration: 0.55, delay: index * 0.04 + 0.1, ease: 'easeOut' }}
        />
      </div>
      <span
        className={`justify-self-end rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.text}`}
        style={{ background: status === 'good' ? 'rgba(34,197,94,0.12)' : status === 'average' ? 'rgba(249,115,22,0.12)' : status === 'poor' ? 'rgba(239,68,68,0.12)' : 'rgba(148,163,184,0.12)' }}
      >
        {styles.label}
      </span>
    </motion.div>
  )
}

function RingSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-(--border) bg-(--panel) p-3 animate-pulse">
      <div className="h-20 w-20 rounded-full bg-(--panel-strong)" />
      <div className="space-y-3">
        <div className="h-3 w-24 rounded-full bg-(--panel-strong)" />
        <div className="h-4 w-16 rounded-full bg-(--panel-strong)" />
      </div>
    </div>
  )
}

function CompactScore({ score }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const animated = useCountUp(inView ? (score ?? 0) : 0)
  const colors = scoreColor(score)
  const radius = 43
  const circ = 2 * Math.PI * radius
  const offset = score === null ? circ : circ * (1 - score / 100)

  return (
    <div ref={ref} className="flex items-center gap-4">
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
        <svg width="96" height="96" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r={radius} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="10" />
          <motion.circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </svg>
        <span className="absolute text-2xl font-bold" style={{ color: colors.text }}>
          {score === null ? '-' : animated}
        </span>
      </div>
      <div>
        <p className="text-lg font-semibold text-(--text)">Performance</p>
        <p className="mt-1 text-sm text-muted">{scoreLabel(score)}</p>
      </div>
    </div>
  )
}

export default function LighthouseDashboard({ report, analyzedUrl }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const reportDevice = report?.device ? `${report.device[0].toUpperCase()}${report.device.slice(1)}` : null
  const scores = [
    { label: 'Performance', score: report?.performance_score ?? null, delay: 0 },
    { label: 'Accessibility', score: report?.accessibility_score ?? null, delay: 0.05 },
    { label: 'Best Practices', score: report?.best_practices_score ?? null, delay: 0.1 },
    { label: 'SEO', score: report?.seo_score ?? null, delay: 0.15 },
  ]

  const metricKeys = ['lcp', 'fcp', 'cls', 'tbt', 'speed_index']

  useEffect(() => {
    if (!isPreviewOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsPreviewOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPreviewOpen])

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Lighthouse Report</p>
          <h2 className="mt-1 section-title">
            {reportDevice ? `${reportDevice} performance report` : 'Diagnose performance issues'}
          </h2>
        </div>
        {analyzedUrl && (
          <a
            href={analyzedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-full truncate rounded-full border border-(--border) bg-(--panel) px-4 py-1.5 text-xs font-medium text-(--accent-text) transition hover:text-(--accent) sm:max-w-xs"
          >
            {analyzedUrl}
          </a>
        )}
      </div>

      <div className="panel-card p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Category scores</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" />0-49</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-400" />50-89</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />90-100</span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {report
            ? scores.map(s => <ScoreRing key={s.label} {...s} />)
            : [0, 1, 2, 3].map(i => <RingSkeleton key={i} />)}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="panel-card flex items-center p-5">
          <CompactScore score={report?.performance_score ?? null} />
        </div>

        <div className="panel-card flex min-h-0 flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Website preview</p>
            {analyzedUrl && <p className="max-w-sm truncate text-xs text-muted">{analyzedUrl}</p>}
          </div>
          {report?.screenshot ? (
            <motion.button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="group relative h-52 overflow-hidden rounded-lg border border-(--border) bg-white text-left transition hover:border-(--accent) sm:h-56 lg:h-60"
            >
              <img
                src={report.screenshot}
                alt="Website screenshot"
                className="h-full w-full object-contain object-top"
              />
              <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/40 bg-slate-950/70 text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </span>
            </motion.button>
          ) : (
            <div className="flex h-52 items-center justify-center rounded-lg border border-(--border) bg-(--panel) sm:h-56 lg:h-60">
              {report
                ? <p className="text-sm text-muted">Screenshot not available</p>
                : <div className="h-full w-full animate-pulse rounded-lg bg-(--panel-strong)" />}
            </div>
          )}
        </div>
      </div>

      {report?.screenshot && isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/88 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.currentTarget === event.target) setIsPreviewOpen(false)
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/15 bg-white shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4 border-b border-(--border) px-4 py-3">
              <p className="truncate text-sm font-semibold text-(--text)">{analyzedUrl ?? 'Website preview'}</p>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-(--border) bg-(--panel) text-(--text) transition hover:border-(--border-strong)"
                aria-label="Close preview"
              >
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <div className="max-h-[calc(92vh-58px)] overflow-auto bg-slate-100 p-4 dark:bg-slate-900">
              <img
                src={report.screenshot}
                alt="Full website screenshot"
                className="mx-auto h-auto max-w-full rounded border border-slate-200 bg-white dark:border-slate-700"
              />
            </div>
          </div>
        </div>
      )}

      <div className="panel-card overflow-x-auto p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Core Web Vitals</p>
          <span className="rounded-full border border-(--border) bg-(--panel) px-3 py-1 text-xs font-medium text-(--text)">
            {report ? `Score: ${report.performance_score}/100` : 'Awaiting analysis'}
          </span>
        </div>

        <div className="min-w-[720px]">
          <div className="grid grid-cols-[1.7fr_0.8fr_1.4fr_1fr] gap-4 border-b border-(--border) pb-2">
            {['Metric', 'Value', 'Range', 'Status'].map(h => (
              <span key={h} className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{h}</span>
            ))}
          </div>

          {report
            ? metricKeys.map((key, i) => <MetricRow key={key} metricKey={key} value={report[key]} index={i} />)
            : metricKeys.map((_, i) => (
                <div key={i} className="grid grid-cols-[1.7fr_0.8fr_1.4fr_1fr] gap-4 border-b border-(--border) py-3 last:border-0 animate-pulse">
                  <div className="h-3 w-40 rounded-full bg-(--panel-strong)" />
                  <div className="h-3 w-12 rounded-full bg-(--panel-strong)" />
                  <div className="h-2 w-full rounded-full bg-(--panel-strong)" />
                  <div className="h-3 w-16 justify-self-end rounded-full bg-(--panel-strong)" />
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
