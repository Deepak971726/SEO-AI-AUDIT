import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 180000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Sends a URL to the backend for Core Web Vitals + AI analysis.
 * @param {string} url - The website URL to analyze
 * @param {string} device - PageSpeed strategy, mobile or desktop
 * @returns {Promise<{ report, ai_suggestions, savage_roast, url }>}
 */
export async function analyzeUrl(url, device = 'mobile') {
  try {
    const { data } = await api.post('/analyze', { url, device: device.toLowerCase() })
    return data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Audit API not found. Start this project with start-dev.ps1.', {
        cause: error,
      })
    }
    if (!error.response) {
      throw new Error('Audit backend is unavailable. Start this project with start-dev.ps1.', {
        cause: error,
      })
    }
    throw error
  }
}
