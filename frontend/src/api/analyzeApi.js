import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 600000, // PageSpeed + OpenAI can take up to ~30s
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Sends a URL to the backend for Core Web Vitals + AI analysis.
 * @param {string} url - The website URL to analyze
 * @param {string} device - PageSpeed strategy, mobile or desktop
 * @returns {Promise<{ report, ai_suggestions, url }>}
 */
export async function analyzeUrl(url, device = 'mobile') {
  const { data } = await api.post('/analyze', { url, device: device.toLowerCase() })
  return data
}
