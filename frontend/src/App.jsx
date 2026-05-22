 

import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import AnalyzerSection from './components/AnalyzerSection.jsx'
import MetricsDashboard from './components/MetricsDashboard.jsx'
import PerformanceScore from './components/PerformanceScore.jsx'
import PerformanceChart from './components/PerformanceChart.jsx'
import AIInsightsPanel from './components/AIInsightsPanel.jsx'
import FeaturesSection from './components/FeaturesSection.jsx'
import Footer from './components/Footer.jsx'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [url, setUrl] = useState('https://example.com')
  const [device, setDevice] = useState('Mobile')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    let interval
    if (isAnalyzing) {
      setProgress(6)
      interval = setInterval(() => {
        setProgress(prev => {
          const next = Math.min(prev + Math.floor(Math.random() * 12 + 8), 100)
          if (next >= 100) {
            clearInterval(interval)
            setTimeout(() => setIsAnalyzing(false), 900)
          }
          return next
        })
      }, 360)
    } else {
      setProgress(prev => (prev >= 100 ? 100 : prev))
    }
    return () => clearInterval(interval)
  }, [isAnalyzing])

  const handleAnalyze = () => {
    if (!url) return
    setIsAnalyzing(true)
    setProgress(0)
  }

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-(--page-bg) text-(--text)`}>
      <Navbar onAnalyze={handleAnalyze} darkMode={darkMode} toggleTheme={() => setDarkMode(prev => !prev)} />
      <main className="mx-auto w-full max-w-[1800px] px-6 py-8 sm:px-8 lg:px-10 xl:px-14">
        <div className="space-y-8">
          <HeroSection url={url} setUrl={setUrl} onAnalyze={handleAnalyze} />
          <AnalyzerSection url={url} device={device} setDevice={setDevice} isAnalyzing={isAnalyzing} progress={progress} />
          <MetricsDashboard />
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <AIInsightsPanel />
            <div className="space-y-6">
              <PerformanceScore score={Math.max(72, 100 - Math.floor(progress / 2))} />
              <PerformanceChart />
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
