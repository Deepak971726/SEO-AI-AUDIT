import { motion } from 'framer-motion'

const STEPS = ['Audit engine', 'SEO scan', 'Core Vitals']

export default function AnalyzerSection({ device, setDevice, isAnalyzing, progress, error }) {
  const stepStatus = (i) => {
    if (error) return 'Failed'
    if (!isAnalyzing && progress === 0) return 'Idle state'
    if (progress === 100) return 'Complete'
    if (progress > i * 30) return 'Inspecting'
    return 'Queued'
  }

  return (
    <motion.section
      id="reports"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="rounded-4xl panel-card p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Analyzer panel</p>
          <h2 className="mt-3 text-3xl font-semibold text-(--text)">Performance audit workflow</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Use the AI analyzer to compare mobile and desktop performance, monitor progress, and get instant optimization suggestions.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:w-130">
          {['Mobile', 'Desktop'].map(option => (
            <button
              key={option}
              onClick={() => setDevice(option)}
              className={`rounded-3xl border px-4 py-3 text-sm font-medium transition ${device === option ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-100 shadow-[0_10px_30px_-18px_rgba(56,189,248,0.85)]' : 'border-(--border) bg-(--surface) text-(--text) hover:border-cyan-400/30 hover:bg-(--panel)'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[1.75rem] panel-soft p-6 shadow-inner shadow-slate-950/10 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Analysis progress</p>
            <p className="mt-2 text-lg font-semibold text-(--text)">
              {error
                ? 'Analysis failed — check the URL and try again'
                : isAnalyzing
                ? 'Running AI checks...'
                : progress === 100
                ? 'Analysis complete'
                : 'Ready for the next report'}
            </p>
          </div>
          <div className={`rounded-full px-4 py-2 text-sm ${error ? 'bg-red-500/10 text-red-400' : 'bg-(--surface) text-(--text)'}`}>
            {error ? 'Error' : isAnalyzing ? `${progress}%` : progress === 100 ? '100%' : 'Idle'}
          </div>
        </div>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-(--panel)">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: error ? '0%' : `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${error ? 'bg-red-500' : 'bg-linear-to-r from-violet-500 via-cyan-400 to-sky-500'}`}
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((label, i) => (
            <div key={label} className="rounded-3xl bg-(--surface) p-4 text-sm text-(--text)">
              <p className="font-medium text-(--text)">{label}</p>
              <p className={`mt-2 text-xs ${error ? 'text-red-400' : 'text-muted'}`}>{stepStatus(i)}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
