import json
import asyncio
import ollama
import re
import random
from functools import partial
from app.config.settings import get_settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)
settings = get_settings()

# Compact prompt - fewer tokens out means less chance of truncation.
PROMPT_TEMPLATE = """You are Savage Web Auditor, a senior web performance expert. Analyze the report and return ONLY a JSON object.

Website: {url}
Performance Score: {performance_score}/100 ({performance_grade})
SEO Score: {seo_score}/100
Accessibility Score: {accessibility_score}/100
Best Practices Score: {best_practices_score}/100
LCP: {lcp} | CLS: {cls} | FCP: {fcp} | TTFB: {ttfb} | Speed Index: {speed_index} | TBT: {tbt}

Return ONLY this JSON with NO extra text, NO markdown, NO explanation:
{{
  "performance_issues": ["issue1", "issue2", "issue3"],
  "seo_impact": ["impact1", "impact2", "impact3"],
  "optimization_suggestions": ["fix1", "fix2", "fix3"],
  "react_optimization_tips": ["tip1", "tip2", "tip3"],
  "caching_recommendations": ["cache1", "cache2", "cache3"],
  "image_optimization": ["img1", "img2", "img3"],
  "savage_roast": {{
    "title": "UNIQUE witty title, different from generic phrases like 'Production Is Typing'",
    "message": "2-3 lines that cite the SPECIFIC metrics above (e.g. exact LCP value, exact score). Must be original, funny, and site-specific. End with Rating: {rating}/10.",
    "emoji": "pick one relevant emoji",
    "severity": "low|medium|high"
  }}
}}

RULES:
- 3 items per suggestions array, max 80 chars per item.
- Roast MUST reference the exact URL domain and at least 2 specific metric values.
- Never insult or mention the owner, founder, developer, junior, team, or reader.
- Use fresh meme/startup/developer humor — never reuse cliches like 'shipped confidence before benchmarks'.
- Roast message max 50 words, 2-3 lines, ends exactly with "Rating: {rating}/10."
- Output raw JSON only, starting with {{ and ending with }}."""

SUGGESTION_KEYS = [
    "performance_issues",
    "seo_impact",
    "optimization_suggestions",
    "react_optimization_tips",
    "caching_recommendations",
    "image_optimization",
]


def _metric_number(value) -> float | None:
    if value is None:
        return None
    match = re.search(r"-?\d+(?:\.\d+)?", str(value))
    return float(match.group()) if match else None


def _rating_from_metrics(metrics: dict) -> float:
    scores = [
        metrics.get("performance_score"),
        metrics.get("seo_score"),
        metrics.get("accessibility_score"),
        metrics.get("best_practices_score"),
    ]
    valid_scores = [float(score) for score in scores if isinstance(score, (int, float))]
    return round((sum(valid_scores) / len(valid_scores)) / 10, 1) if valid_scores else 5.0


def _roast_severity(metrics: dict) -> str:
    scores = [
        metrics.get("performance_score", 100),
        metrics.get("seo_score", 100),
        metrics.get("accessibility_score", 100),
        metrics.get("best_practices_score", 100),
    ]
    lcp = _metric_number(metrics.get("lcp"))
    cls = _metric_number(metrics.get("cls"))
    ttfb = _metric_number(metrics.get("ttfb"))

    if min(scores) < 50 or (lcp is not None and lcp > 4) or (cls is not None and cls > 0.25):
        return "high"
    if min(scores) < 90 or (lcp is not None and lcp > 2.5) or (ttfb is not None and ttfb > 800):
        return "medium"
    return "low"


def _actual_issue_terms(metrics: dict) -> list[str]:
    issues = []
    category_checks = [
        ("performance", "performance_score"),
        ("seo", "seo_score"),
        ("accessibility", "accessibility_score"),
        ("best practices", "best_practices_score"),
    ]
    for label, key in category_checks:
        if metrics.get(key, 100) < 90:
            issues.append(label)

    metric_checks = [
        ("lcp", "lcp", 2.5),
        ("fcp", "fcp", 1.8),
        ("cls", "cls", 0.1),
        ("ttfb", "ttfb", 800),
        ("tbt", "tbt", 200),
        ("speed index", "speed_index", 3.4),
    ]
    for label, key, threshold in metric_checks:
        value = _metric_number(metrics.get(key))
        if value is not None and value > threshold:
            issues.append(label)

    return issues


# ── roast pools ────────────────────────────────────────────────────────────
# Each entry is (title, message_template). Templates use named placeholders:
# {worst}, {worst_score}, {second}, {second_score}, {metric_label},
# {metric_value}, {rating}

_HIGH_ROASTS = [
    (
        "Production Is Crying",
        "{worst} at {worst_score}/100 — shipped confidence before benchmarks.\n"
        "{metric_label} at {metric_value} is treating the loading budget like optional reading.\n"
        "Rating: {rating}/10.",
    ),
    (
        "404: Performance Not Found",
        "{metric_label} clocking {metric_value} — the browser filed a missing-asset report.\n"
        "{worst} score of {worst_score}/100 suggests the sprint backlog has trust issues.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Loading... Please Wait Forever",
        "With {worst} at {worst_score}/100, the page load is basically a suspense thriller.\n"
        "{metric_label} of {metric_value} means users could brew coffee during the wait.\n"
        "Rating: {rating}/10.",
    ),
    (
        "This Site Has Lore",
        "{worst} sitting at {worst_score}/100 — there is clearly a lot of character here.\n"
        "{metric_label} at {metric_value} ensures the loading experience is never rushed.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Speed? Never Heard of Her",
        "{metric_label} at {metric_value} is not slow — it is building anticipation.\n"
        "{worst} score of {worst_score}/100 confirms this site chose vibes over velocity.\n"
        "Rating: {rating}/10.",
    ),
    (
        "The Patience Test",
        "{worst} at {worst_score}/100 — Lighthouse ran out of polite suggestions.\n"
        "{metric_label} at {metric_value} turned a page visit into a meditation session.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Deploy It and Pray",
        "{metric_label} of {metric_value} shipped as-is — bold strategy.\n"
        "{worst} at {worst_score}/100 means performance review season arrived early.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Technically Still Loading",
        "{worst} at {worst_score}/100 — the audit found more red flags than a status page.\n"
        "{metric_label} hit {metric_value}, which Lighthouse described as 'a cry for help'.\n"
        "Rating: {rating}/10.",
    ),
]

_MEDIUM_ROASTS = [
    (
        "Deploy Now, Optimise Maybe",
        "{worst} at {worst_score}/100 — very MVP, heavy on minimum.\n"
        "{metric_label} at {metric_value} is not a crisis, just a strongly worded letter.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Close Enough, Ship It",
        "{metric_label} at {metric_value} — one optimisation sprint away from respectability.\n"
        "{worst} scoring {worst_score}/100 suggests the polish budget ran out before launch.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Promising, But Still",
        "{worst} at {worst_score}/100 is not embarrassing — just highly optimisable.\n"
        "{metric_label} of {metric_value} is the site's way of asking for more CI time.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Good Enough Is the Enemy of Good",
        "{metric_label} clocking {metric_value} — passing the bar while grazing it.\n"
        "{worst} at {worst_score}/100 means there is margin left on the table.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Technically Not Broken",
        "{worst} sitting at {worst_score}/100 — not a disaster, just a footnote.\n"
        "{metric_label} at {metric_value} is the site's polite way of saying 'do more'.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Room for Growth (A Lot of It)",
        "{metric_label} of {metric_value} is the gap between shipped and refined.\n"
        "{worst} at {worst_score}/100 says the optimisation sprint got deprioritised again.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Yellow Flag, Not Red",
        "{worst} at {worst_score}/100 and {second} at {second_score}/100 — two amber alerts.\n"
        "{metric_label} at {metric_value} is the universe nudging towards a performance budget.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Half-Baked But Served Hot",
        "{metric_label} clocking {metric_value} — tasty idea, needs more time in the oven.\n"
        "{worst} at {worst_score}/100 is this site's version of 'good enough for now'.\n"
        "Rating: {rating}/10.",
    ),
]

_LOW_ROASTS = [
    (
        "Annoyingly Competent",
        "{worst} at {worst_score}/100 barely qualifies as roast material.\n"
        "The metrics are clean enough to send the audit to the backlog instead of production.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Disgustingly Optimised",
        "{worst} is the only crack at {worst_score}/100 — the rest is genuinely solid.\n"
        "Lighthouse is running out of complaints and frankly it is unsettling.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Show-Off Energy",
        "{worst} at {worst_score}/100 is the site's only concession to being human.\n"
        "Every other metric passed — the Lighthouse report is basically a trophy.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Barely Roastable",
        "With {worst} at {worst_score}/100, the audit had to squint to find issues.\n"
        "This site is so well-optimised the roast writes itself — which is to say, barely.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Green All the Way Down",
        "{worst} at {worst_score}/100 is the lone rebel in an otherwise pristine scorecard.\n"
        "No notes. Seriously. Fix {worst} and the auditor retires.\n"
        "Rating: {rating}/10.",
    ),
    (
        "Peak Site, Mild Roast",
        "{worst} scoring {worst_score}/100 means the standards here are dangerously high.\n"
        "The only thing slower than {worst} is this roast finding something to criticise.\n"
        "Rating: {rating}/10.",
    ),
]


def _pick_roast(severity: str, metrics: dict) -> tuple[str, str]:
    """
    Pick a roast template from the matching pool.
    Uses a hash of the metric values so the same site always gets the same roast,
    but different sites (different metric fingerprints) get different ones.
    """
    pool = {"high": _HIGH_ROASTS, "medium": _MEDIUM_ROASTS, "low": _LOW_ROASTS}.get(
        severity, _MEDIUM_ROASTS
    )
    # Build a fingerprint from all numeric metric values so different URLs get different entries
    fingerprint = "|".join(
        str(metrics.get(k, ""))
        for k in [
            "performance_score", "seo_score", "accessibility_score",
            "best_practices_score", "lcp", "cls", "fcp", "tbt", "speed_index",
        ]
    )
    index = hash(fingerprint) % len(pool)
    return pool[index]


def _fallback_roast(metrics: dict) -> dict:
    category_scores = {
        "Performance": metrics.get("performance_score", 0),
        "SEO": metrics.get("seo_score", 0),
        "Accessibility": metrics.get("accessibility_score", 0),
        "Best Practices": metrics.get("best_practices_score", 0),
    }
    ranked = sorted(category_scores.items(), key=lambda x: x[1])
    worst_label, worst_score = ranked[0]
    second_label, second_score = ranked[1]
    rating = _rating_from_metrics(metrics)
    severity = _roast_severity(metrics)

    # Find the worst-performing individual metric
    metric_checks = [
        ("LCP", metrics.get("lcp"), 2.5),
        ("FCP", metrics.get("fcp"), 1.8),
        ("CLS", metrics.get("cls"), 0.1),
        ("TBT", metrics.get("tbt"), 200),
        ("Speed Index", metrics.get("speed_index"), 3.4),
    ]
    metric_issues = []
    for label, raw, threshold in metric_checks:
        num = _metric_number(raw)
        if num is not None and num > threshold:
            metric_issues.append((num / threshold, label, raw))

    if metric_issues:
        _, metric_label, metric_value = max(metric_issues, key=lambda x: x[0])
    else:
        metric_label, metric_value = worst_label, f"{worst_score}/100"

    title, template = _pick_roast(severity, metrics)
    message = template.format(
        worst=worst_label,
        worst_score=worst_score,
        second=second_label,
        second_score=second_score,
        metric_label=metric_label,
        metric_value=metric_value,
        rating=rating,
    )

    return {"title": title, "message": message, "emoji": "🔥", "severity": severity}


def get_fallback_analysis(metrics: dict) -> dict:
    """Return useful report-based output when local AI is unavailable or too slow."""
    performance = metrics.get("performance_score", 0)
    seo = metrics.get("seo_score", 0)
    lcp = metrics.get("lcp", "N/A")
    cls = metrics.get("cls", "N/A")
    tbt = metrics.get("tbt", "N/A")

    return {
        "performance_issues": [
            f"Performance score: {performance}/100.",
            f"LCP is {lcp}; CLS is {cls}.",
            f"Total Blocking Time is {tbt}.",
        ],
        "seo_impact": [
            f"SEO score: {seo}/100.",
            "Slow rendering can reduce crawl efficiency and search visibility.",
            "Layout instability can weaken mobile search experience.",
        ],
        "optimization_suggestions": [
            "Prioritize the LCP resource and remove render-blocking assets.",
            "Reduce JavaScript execution and defer non-critical scripts.",
            "Compress assets and remove unused CSS and JavaScript.",
        ],
        "react_optimization_tips": [
            "Lazy-load routes and non-critical components.",
            "Memoize expensive renders only after profiling.",
            "Keep initial bundles small with dynamic imports.",
        ],
        "caching_recommendations": [
            "Set long cache lifetimes for versioned static assets.",
            "Use a CDN for images, scripts, and stylesheets.",
            "Cache HTML carefully and revalidate changed content.",
        ],
        "image_optimization": [
            "Serve responsive AVIF or WebP images.",
            "Preload the LCP image and set explicit dimensions.",
            "Lazy-load images below the fold.",
        ],
        "savage_roast": _fallback_roast(metrics),
    }


def _normalize_roast(data: dict, metrics: dict) -> dict:
    fallback = _fallback_roast(metrics)
    roast = data.get("savage_roast")
    if not isinstance(roast, dict):
        return fallback

    title = str(roast.get("title", "")).strip()[:60]
    message = str(roast.get("message", "")).strip()
    forbidden_targets = re.compile(r"\b(owner|founder|developer|junior|team|you|your)\b", re.I)
    metric_terms = re.compile(
        r"\b(performance|seo|accessibility|best practices|lcp|fcp|cls|ttfb|tbt|speed index)\b",
        re.I,
    )
    if (
        not title
        or not message
        or forbidden_targets.search(title)
        or forbidden_targets.search(message)
        or not metric_terms.search(message)
    ):
        return fallback

    actual_issue_terms = _actual_issue_terms(metrics)
    if actual_issue_terms:
        actual_issue_pattern = re.compile(
            r"\b(" + "|".join(re.escape(term) for term in actual_issue_terms) + r")\b",
            re.I,
        )
        if not actual_issue_pattern.search(message):
            return fallback

    rating = _rating_from_metrics(metrics)
    message = re.sub(r"\s*Rating:\s*\d+(?:\.\d+)?/10\.?\s*$", "", message, flags=re.I)
    content_lines = [re.sub(r"\s+", " ", line).strip() for line in message.splitlines() if line.strip()]
    if not content_lines:
        return fallback

    if len(content_lines) == 1:
        sentence_lines = [
            part.strip()
            for part in re.split(r"(?<=[.!?])\s+", content_lines[0])
            if part.strip()
        ]
        content_lines = sentence_lines or content_lines

    content = " ".join(content_lines[:3])
    words = content.split()
    content = " ".join(words[:48])
    if not content:
        return fallback

    return {
        "title": title,
        "message": f"{content}\nRating: {rating}/10.",
        "emoji": str(roast.get("emoji", "")).strip()[:4] or "🔥",
        "severity": _roast_severity(metrics),
    }


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
        ttfb=metrics["ttfb"],
        speed_index=metrics["speed_index"],
        tbt=metrics["tbt"],
        performance_score=metrics["performance_score"],
        performance_grade=metrics["performance_grade"],
        seo_score=metrics["seo_score"],
        accessibility_score=metrics["accessibility_score"],
        best_practices_score=metrics["best_practices_score"],
        rating=_rating_from_metrics(metrics),
    )

    try:
        client = ollama.Client(
            host=settings.ollama_host,
            timeout=settings.ollama_timeout,
        )
        response = client.chat(
            model=settings.ollama_model,
            messages=[{"role": "user", "content": prompt}],
            format="json",
            options={
                "temperature": 0.3,
                "num_predict": 768,
                "num_ctx": 4096,
                "stop": ["\n\n\n"],
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
        suggestions = await asyncio.wait_for(
            loop.run_in_executor(None, partial(_call_ollama, url, metrics)),
            timeout=settings.ollama_timeout + 2,
        )
        normalized = _normalize_analysis(suggestions, metrics)

        for key in SUGGESTION_KEYS:
            val = normalized[key]
            logger.info("[OLLAMA ANALYSIS] %s: %d items", key, len(val))

        logger.info("[OLLAMA ANALYSIS] Analysis complete")
        logger.info("=" * 60)
        return normalized

    except asyncio.TimeoutError:
        logger.warning(
            "[OLLAMA ANALYSIS] Timed out after %ss; using deterministic fallback",
            settings.ollama_timeout,
        )
    except Exception as e:
        logger.warning(
            "[OLLAMA ANALYSIS] Local AI unavailable (%s: %s); using deterministic fallback",
            type(e).__name__,
            e,
        )

    logger.info("=" * 60)
    return get_fallback_analysis(metrics)


def _normalize_analysis(data: dict, metrics: dict) -> dict:
    """Ensure suggestions and the website roast always have a stable shape."""
    normalized = {
        key: data.get(key, []) if isinstance(data.get(key), list) else []
        for key in SUGGESTION_KEYS
    }
    normalized["savage_roast"] = _normalize_roast(data, metrics)
    return normalized
