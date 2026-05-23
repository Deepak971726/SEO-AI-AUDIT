import json
import asyncio
import ollama
import re
from functools import partial
from app.config.settings import get_settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)
settings = get_settings()

# Compact prompt — fewer tokens out = less chance of truncation
PROMPT_TEMPLATE = """You are a web performance expert. Analyze these Core Web Vitals and return ONLY a JSON object.

Website: {url}
Performance Score: {performance_score}/100 ({performance_grade})
LCP: {lcp} | CLS: {cls} | FCP: {fcp} | Speed Index: {speed_index} | TBT: {tbt}

Return ONLY this JSON with NO extra text, NO markdown, NO explanation:
{{
  "performance_issues": ["issue1", "issue2", "issue3"],
  "seo_impact": ["impact1", "impact2", "impact3"],
  "optimization_suggestions": ["fix1", "fix2", "fix3"],
  "react_optimization_tips": ["tip1", "tip2", "tip3"],
  "caching_recommendations": ["cache1", "cache2", "cache3"],
  "image_optimization": ["img1", "img2", "img3"]
}}

RULES: 3 items per array, max 80 chars per item, output raw JSON only starting with {{ ending with }}"""


def _repair_truncated_json(text: str) -> str:
    """
    Attempt to repair JSON that was cut off mid-response by llama3 hitting token limit.
    Closes any open arrays and the root object so json.loads can parse it.
    """
    text = text.strip()

    # Count open vs closed braces/brackets
    open_braces = text.count("{") - text.count("}")
    open_brackets = text.count("[") - text.count("]")

    # Remove trailing incomplete string/value (e.g. ends with `"Compress im`)
    # Find the last complete value — last `"` that closes a string before truncation
    # Safe approach: trim back to last complete array item boundary
    last_complete = max(
        text.rfind('",'),   # end of a string followed by comma
        text.rfind('"]'),   # end of an array
        text.rfind('"}'),   # end of an object value
    )
    if last_complete != -1 and last_complete < len(text) - 1:
        text = text[:last_complete + 1]
        # Recount after trim
        open_braces = text.count("{") - text.count("}")
        open_brackets = text.count("[") - text.count("]")

    # Close open arrays first, then open object
    text = text + ("]" * open_brackets) + ("}" * open_braces)
    return text


def _extract_json(raw: str) -> dict:
    """
    Extract and parse JSON from llama3 response using 4 strategies + truncation repair.
    """
    text = raw.strip()

    # Strategy 1 — full text is already valid JSON
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Strategy 2 — strip markdown code fences
    if text.startswith("```"):
        inner = text.split("```")[1]
        if inner.startswith("json"):
            inner = inner[4:]
        try:
            return json.loads(inner.strip())
        except json.JSONDecodeError:
            pass

    # Strategy 3 — bracket-matched extraction
    start = text.find("{")
    if start != -1:
        depth = 0
        for i in range(start, len(text)):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[start:i + 1])
                    except json.JSONDecodeError:
                        break

    # Strategy 4 — repair truncated JSON then parse
    logger.warning("[JSON] Response appears truncated — attempting repair...")
    if start != -1:
        truncated = text[start:]
        repaired = _repair_truncated_json(truncated)
        logger.debug("[JSON] Repaired text: %s", repaired[:300])
        try:
            result = json.loads(repaired)
            logger.info("[JSON] ✅ Truncation repair succeeded")
            return result
        except json.JSONDecodeError as e:
            logger.error("[JSON] Repair failed: %s", e)
            logger.error("[JSON] Repaired text was: %s", repaired[:500])

    raise ValueError(
        f"Could not parse Ollama response as JSON after all strategies. "
        f"Raw response (first 400 chars): {raw[:400]}"
    )


def _call_ollama(url: str, metrics: dict) -> dict:
    """Synchronous Ollama call — runs in thread executor to avoid blocking FastAPI."""
    logger.info("[OLLAMA] Sending request to model '%s' for: %s", settings.ollama_model, url)

    prompt = PROMPT_TEMPLATE.format(
        url=url,
        lcp=metrics["lcp"],
        cls=metrics["cls"],
        fcp=metrics["fcp"],
        speed_index=metrics["speed_index"],
        tbt=metrics["tbt"],
        performance_score=metrics["performance_score"],
        performance_grade=metrics["performance_grade"],
    )

    try:
        response = ollama.chat(
            model=settings.ollama_model,
            messages=[{"role": "user", "content": prompt}],
            options={
                "temperature": 0.3,
                "num_predict": 1024,   # enough for 6 arrays × 3 items
                "num_ctx": 4096,       # context window
                "stop": ["\n\n\n"],    # stop on triple newline (post-JSON chatter)
            },
        )
    except Exception as e:
        error_msg = str(e).lower()
        if "connection" in error_msg or "refused" in error_msg:
            raise ConnectionError(
                "Cannot connect to Ollama. Make sure Ollama is running: 'ollama serve'"
            )
        if "model" in error_msg and ("not found" in error_msg or "pull" in error_msg):
            raise RuntimeError(
                f"Model '{settings.ollama_model}' not found. Run: 'ollama pull {settings.ollama_model}'"
            )
        raise

    raw = response["message"]["content"].strip()
    logger.info("[OLLAMA] Response received (%d chars)", len(raw))
    logger.debug("[OLLAMA] Raw response:\n%s", raw[:600])

    return _extract_json(raw)


async def get_ai_analysis(url: str, metrics: dict) -> dict:
    """Send performance metrics to local Ollama and return structured suggestions."""
    logger.info("=" * 60)
    logger.info("[OLLAMA ANALYSIS] Starting analysis for: %s", url)
    logger.info("[OLLAMA ANALYSIS] Score=%s | LCP=%s | CLS=%s",
                metrics.get("performance_score"), metrics.get("lcp"), metrics.get("cls"))
    logger.info("=" * 60)

    try:
        loop = asyncio.get_event_loop()
        suggestions = await loop.run_in_executor(None, partial(_call_ollama, url, metrics))
        normalized = _normalize_suggestions(suggestions)

        for key, val in normalized.items():
            logger.info("[OLLAMA ANALYSIS] ✅ %s: %d items", key, len(val))

        logger.info("[OLLAMA ANALYSIS] 🎉 Analysis complete")
        logger.info("=" * 60)
        return normalized

    except ConnectionError as e:
        logger.error("[OLLAMA ANALYSIS] ❌ Ollama not running: %s", e)
        logger.info("=" * 60)
        raise
    except RuntimeError as e:
        logger.error("[OLLAMA ANALYSIS] ❌ Model error: %s", e)
        logger.info("=" * 60)
        raise
    except ValueError as e:
        logger.error("[OLLAMA ANALYSIS] ❌ JSON parse error: %s", e)
        logger.info("=" * 60)
        raise
    except Exception as e:
        logger.error("[OLLAMA ANALYSIS] ❌ Unexpected error: %s: %s", type(e).__name__, e)
        logger.info("=" * 60)
        raise


def _normalize_suggestions(data: dict) -> dict:
    """Ensure all six expected keys exist with list values."""
    keys = [
        "performance_issues",
        "seo_impact",
        "optimization_suggestions",
        "react_optimization_tips",
        "caching_recommendations",
        "image_optimization",
    ]
    return {key: data.get(key, []) for key in keys}
