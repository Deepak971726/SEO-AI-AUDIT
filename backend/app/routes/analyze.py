import requests
from fastapi import APIRouter, HTTPException

from app.models.request_models import AnalyzeRequest, AnalyzeResponse
from app.services.pagespeed_service import fetch_pagespeed_metrics
from app.services.ai_service import get_ai_analysis
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)
router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse, summary="Analyze Core Web Vitals")
async def analyze_url(request: AnalyzeRequest):
    """
    Accepts a URL, fetches Core Web Vitals via Google PageSpeed Insights,
    then uses local Ollama to generate performance optimization suggestions.
    """
    logger.info("=" * 80)
    logger.info(f"[API] 🔵 NEW ANALYSIS REQUEST")
    logger.info(f"[API] URL: {request.url}")
    logger.info(f"[API] Device: {request.device}")
    logger.info("=" * 80)

    # Step 1: Fetch PageSpeed metrics
    logger.info("[API] Step 1/2: Fetching PageSpeed metrics...")
    try:
        metrics = await fetch_pagespeed_metrics(request.url, request.device)
        logger.info("[API] PageSpeed metrics fetched successfully")
        logger.debug(f"[API] Metrics: Score={metrics.get('performance_score')}, LCP={metrics.get('lcp')}, CLS={metrics.get('cls')}")
    except requests.exceptions.HTTPError as e:
        logger.error(f"[API] PageSpeed API HTTP error: {e.response.status_code}")
        raise HTTPException(
            status_code=502,
            detail=f"Google PageSpeed API returned {e.response.status_code}. Check your API key or URL.",
        )
    except requests.exceptions.RequestException as e:
        logger.error(f"[API] PageSpeed request failed: {e}")
        raise HTTPException(status_code=504, detail="Could not reach Google PageSpeed API.")

    # Step 2: Get Ollama AI analysis
    logger.info("[API] Step 2/2: Requesting AI analysis from Ollama...")
    try:
        ai_analysis = await get_ai_analysis(request.url, metrics)
        savage_roast = ai_analysis.pop("savage_roast")
        ai_suggestions = ai_analysis
        logger.info("[API] AI analysis completed successfully")
        logger.debug(f"[API] Suggestions keys: {list(ai_suggestions.keys())}")
    except ConnectionError as e:
        logger.error(f"[API] Ollama Connection Error: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except RuntimeError as e:
        logger.error(f"[API] Ollama Runtime Error: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"[API] Ollama analysis failed: {type(e).__name__}: {e}")
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")

    logger.info("[API] ANALYSIS COMPLETE")
    logger.info("=" * 80)
    
    return AnalyzeResponse(
        success=True,
        url=request.url,
        report=metrics,
        ai_suggestions=ai_suggestions,
        savage_roast=savage_roast,
    )
