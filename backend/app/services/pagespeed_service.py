import requests
import asyncio
import time
from functools import partial
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from app.config.settings import get_settings
from app.utils.helpers import format_metric, format_cls, get_performance_grade, setup_logger

logger = setup_logger(__name__)
settings = get_settings()


def _build_session() -> requests.Session:
    """Session with retry on connection errors and chunked-read failures."""
    session = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=2,
        status_forcelist=[500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    return session


def _call_pagespeed(url: str, strategy: str) -> dict:
    """Synchronous requests call — runs in a thread executor to avoid blocking FastAPI."""
    logger.info("[PAGESPEED] Stage 1: Building API request...")
    API_KEY = settings.google_pagespeed_api_key
    endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = {
        "url": url,
        "strategy": strategy,
        "key": API_KEY,
        "category": ["performance", "accessibility", "best-practices", "seo"],
    }
    logger.debug(f"[PAGESPEED] Endpoint: {endpoint}?url={url}&strategy={strategy}&key=***")

    logger.info(f"[PAGESPEED] Stage 2: Making {strategy} request to Google PageSpeed API for: {url}")
    session = _build_session()

    try:
        logger.debug(f"[PAGESPEED] Request timeout: connect=10s, read={settings.pagespeed_timeout}s")
        response = session.get(endpoint, params=params, timeout=(10, settings.pagespeed_timeout))
        logger.debug(f"[PAGESPEED] Response status code: {response.status_code}")
        response.raise_for_status()
        logger.info("[PAGESPEED] ✅ API request successful")
    except requests.exceptions.Timeout as e:
        logger.error(f"[PAGESPEED] ❌ Timeout error: {e}")
        raise
    except requests.exceptions.HTTPError as e:
        logger.error(f"[PAGESPEED] ❌ HTTP error: {e.response.status_code}")
        raise

    # Force full content read before closing to avoid premature-end errors
    logger.debug("[PAGESPEED] Stage 3: Reading full response content...")
    content_length = len(response.content)
    logger.debug(f"[PAGESPEED] Response size: {content_length} bytes")
    
    logger.debug("[PAGESPEED] Stage 4: Parsing JSON response...")
    result = response.json()
    logger.info("[PAGESPEED] ✅ JSON parsed successfully")
    
    return result


async def fetch_pagespeed_metrics(url: str, strategy: str = "mobile") -> dict:
    """Fetch Core Web Vitals from Google PageSpeed Insights API."""
    strategy = (strategy or "mobile").lower()
    if strategy not in {"mobile", "desktop"}:
        strategy = "mobile"

    logger.info("=" * 80)
    logger.info("[PAGESPEED API] 🔷 Starting PageSpeed Insights fetch")
    logger.info(f"[PAGESPEED API] URL: {url}")
    logger.info(f"[PAGESPEED API] Strategy: {strategy}")
    logger.info("=" * 80)

    try:
        loop = asyncio.get_event_loop()
        logger.debug("[PAGESPEED API] Executing API call in thread pool...")
        data = await loop.run_in_executor(None, partial(_call_pagespeed, url, strategy))
        logger.info("[PAGESPEED API] ✅ API call completed, parsing metrics...")
        
        metrics = _parse_metrics(data, strategy)
        logger.info("[PAGESPEED API] ✅ Metrics parsed successfully")
        logger.info("=" * 80)
        return metrics
    except Exception as e:
        logger.error(f"[PAGESPEED API] ❌ Error: {type(e).__name__}: {e}")
        logger.info("=" * 80)
        raise


def _parse_metrics(data: dict, strategy: str) -> dict:
    """Extract and format relevant metrics from the raw PageSpeed API response."""
    logger.debug("[PARSE METRICS] Extracting lighthouse data...")
    audits = data.get("lighthouseResult", {}).get("audits", {})
    categories = data.get("lighthouseResult", {}).get("categories", {})
    logger.debug(f"[PARSE METRICS] Found {len(audits)} audits and {len(categories)} categories")

    def get_numeric(key: str) -> float | None:
        item = audits.get(key, {})
        value = item.get("numericValue")
        if value is not None:
            logger.debug(f"[PARSE METRICS]   {key}: {value}")
        return value

    def get_category_score(key: str) -> int:
        score = categories.get(key, {}).get("score", 0)
        return int((score or 0) * 100)

    logger.debug("[PARSE METRICS] Extracting core metrics...")
    performance_score = get_category_score("performance")
    logger.debug(f"[PARSE METRICS] Raw performance score → {performance_score}")

    lcp = get_numeric("largest-contentful-paint")
    cls = get_numeric("cumulative-layout-shift")
    fcp = get_numeric("first-contentful-paint")
    speed_index = get_numeric("speed-index")
    tbt = get_numeric("total-blocking-time")

    # Screenshot — stored as base64 data URI inside the audit
    screenshot_data = audits.get("final-screenshot", {}).get("details", {}).get("data") or \
                      audits.get("screenshot-thumbnails", {}).get("details", {}).get("items", [{}])[-1].get("data")

    metrics = {
        "device": strategy,
        "lcp": format_metric(lcp, unit="s"),
        "cls": format_cls(cls),
        "fcp": format_metric(fcp, unit="s"),
        "speed_index": format_metric(speed_index, unit="s"),
        "tbt": format_metric(tbt),
        "performance_score": performance_score,
        "performance_grade": get_performance_grade(performance_score),
        "accessibility_score": get_category_score("accessibility"),
        "best_practices_score": get_category_score("best-practices"),
        "seo_score": get_category_score("seo"),
        "screenshot": screenshot_data,
    }

    logger.info(f"[PARSE METRICS] ✅ Metrics parsed successfully:")
    logger.info(f"[PARSE METRICS]   - Performance Score: {performance_score} ({metrics['performance_grade']})")
    logger.info(f"[PARSE METRICS]   - Accessibility: {metrics['accessibility_score']}")
    logger.info(f"[PARSE METRICS]   - Best Practices: {metrics['best_practices_score']}")
    logger.info(f"[PARSE METRICS]   - SEO: {metrics['seo_score']}")
    logger.info(f"[PARSE METRICS]   - LCP: {metrics['lcp']}")
    logger.info(f"[PARSE METRICS]   - CLS: {metrics['cls']}")
    logger.info(f"[PARSE METRICS]   - FCP: {metrics['fcp']}")
    logger.info(f"[PARSE METRICS]   - Speed Index: {metrics['speed_index']}")
    logger.info(f"[PARSE METRICS]   - TBT: {metrics['tbt']}")
    logger.info(f"[PARSE METRICS]   - Screenshot: {'✅ captured' if screenshot_data else '❌ not available'}")

    return metrics
