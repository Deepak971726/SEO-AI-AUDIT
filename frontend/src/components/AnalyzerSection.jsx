import { motion } from 'framer-motion'

const STEPS = ['Audit engine', 'SEO scan', 'Core Vitals']

export default function AnalyzerSection({ device, setDevice, isAnalyzing, progress, error }) {
  const stepStatus = (i) => {
    if (error) return 'Failed'
    if (!isAnalyzing && progress === 0) return 'Idle'
    if (progress === 100) return 'Complete'
    if (progress > i * 30) return 'Inspecting'
    return 'Queued'
  }

  return (
    <section id="reports" className="panel-card p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <p className="eyebrow">Analyzer Panel</p>
          <h2 className="mt-2 section-title">Performance audit workflow</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Compare mobile and desktop performance, monitor progress, and get optimization suggestions.
          </p>
        </div>

        <div className="grid gap-1 rounded-lg border border-(--border) bg-(--panel) p-1 sm:grid-cols-2">
          {['Mobile', 'Desktop'].map(option => (
            <button
              key={option}
              type="button"
              disabled={isAnalyzing}
              onClick={() => setDevice(option)}
              className={`h-10 rounded-md px-4 text-sm font-bold transition ${
                device === option
                  ? 'bg-(--surface) text-(--accent-text) shadow-[0_8px_20px_-18px_rgba(15,23,42,0.5)]'
                  : 'text-muted hover:bg-(--surface-strong) hover:text-(--text)'
              } disabled:opacity-60`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-(--border) pt-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="eyebrow">Analysis Progress</p>
            <p className="mt-2 text-base font-bold text-(--text)">
              {error
                ? 'Analysis failed - check the URL and try again'
                : isAnalyzing
                ? `Running ${device.toLowerCase()} checks`
                : progress === 100
                ? `${device} analysis complete`
                : 'Ready for the next report'}
            </p>
          </div>
          <div className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${
            error ? 'bg-red-50 text-(--danger) dark:bg-red-500/10' : 'status-pill'
          }`}>
            {error ? 'Error' : isAnalyzing ? `${progress}%` : progress === 100 ? '100%' : 'Idle'}
          </div>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-(--panel-strong)">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: error ? '0%' : `${progress}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`h-full rounded-full ${error ? 'bg-red-600' : 'bg-(--accent)'}`}
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {STEPS.map((label, i) => (
            <div key={label} className="rounded-lg border border-(--border) bg-(--panel) p-4 text-sm">
              <p className="font-bold text-(--text)">{label}</p>
              <p className={`mt-2 text-xs font-semibold ${error ? 'text-(--danger)' : 'text-muted'}`}>{stepStatus(i)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
