import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import AnalyzerSection from './components/AnalyzerSection.jsx'
import LighthouseDashboard from './components/LighthouseDashboard.jsx'
import MetricsDashboard from './components/MetricsDashboard.jsx'
import PerformanceScore from './components/PerformanceScore.jsx'
import PerformanceChart from './components/PerformanceChart.jsx'
import AIInsightsPanel from './components/AIInsightsPanel.jsx'
import FeaturesSection from './components/FeaturesSection.jsx'
import Footer from './components/Footer.jsx'
import { analyzeUrl } from './api/analyzeApi.js'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('theme') === 'dark'
  })
  const [url, setUrl] = useState('')
  const [device, setDevice] = useState('Mobile')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [report, setReport] = useState(null)
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    window.localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Fake progress bar that runs while waiting for the real API response
  useEffect(() => {
    let interval
    if (isAnalyzing) {
      setProgress(6)
      interval = setInterval(() => {
        setProgress(prev => {
          // Slow down near 90 so it never hits 100 before the API responds
          if (prev >= 88) return prev
          return Math.min(prev + Math.floor(Math.random() * 10 + 5), 88)
        })
      }, 400)
    }
    return () => clearInterval(interval)
  }, [isAnalyzing])

  // Auto-fix URL: add https:// if user typed bare domain like google.com
  const normalizeUrl = (raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return trimmed
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`
    return trimmed
  }

  const handleAnalyze = async (selectedDevice = device) => {
    const activeDevice = typeof selectedDevice === 'string' ? selectedDevice : device
    const normalized = normalizeUrl(url)
    if (!normalized) return

    // Update input to show the fixed URL
    setUrl(normalized)
    setIsAnalyzing(true)
    setProgress(0)
    setError(null)
    setReport(null)
    setAiSuggestions(null)

    try {
      const data = await analyzeUrl(normalized, activeDevice)
      setReport(data.report)
      setAiSuggestions(data.ai_suggestions)
      setProgress(100)
    } catch (err) {
      // Handle pydantic 422 validation errors
      const detail = err.response?.data?.detail
      let message
      if (Array.isArray(detail)) {
        // Pydantic returns array of {msg, loc} objects
        message = detail.map(d => d.msg).join(', ')
      } else {
        message =
          detail ||
          err.response?.data?.error ||
          err.message ||
          'Something went wrong. Please try again.'
      }
      setError(message)
      setProgress(0)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDeviceChange = (selectedDevice) => {
    setDevice(selectedDevice)
    if (isAnalyzing || !url.trim() || !report) return
    handleAnalyze(selectedDevice)
  }

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-(--page-bg) text-(--text)`}>
      <Navbar onAnalyze={handleAnalyze} darkMode={darkMode} toggleTheme={() => setDarkMode(prev => !prev)} />
      <main className="mx-auto w-full max-w-[1320px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="space-y-5">
          <HeroSection
            url={url}
            setUrl={setUrl}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            hasResult={!!report}
            error={error}
          />
          <AnalyzerSection
            url={url}
            device={device}
            setDevice={handleDeviceChange}
            isAnalyzing={isAnalyzing}
            progress={progress}
            error={error}
          />
          <LighthouseDashboard report={report} analyzedUrl={report ? url : null} />
          <MetricsDashboard report={report} />
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <AIInsightsPanel aiSuggestions={aiSuggestions} />
            <div className="space-y-6">
              <PerformanceScore
                score={report?.performance_score ?? null}
                grade={report?.performance_grade ?? null}
              />
              <PerformanceChart report={report} />
            </div>
          </div>
          <FeaturesSection />
          <Footer />
        </div>
      </main>
    </div>
  )
}

export default App
