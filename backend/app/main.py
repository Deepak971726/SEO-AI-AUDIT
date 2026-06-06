from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ollama

from app.config.settings import get_settings
from app.routes.analyze import router as analyze_router
from app.utils.helpers import setup_logger

settings = get_settings()
logger = setup_logger(__name__)


def _check_ollama() -> None:
    """
    Runs at startup — checks if Ollama server is reachable and the
    configured model is pulled. Logs clearly either way.
    """
    logger.info("=" * 60)
    logger.info("  OLLAMA STARTUP CHECK")
    logger.info("=" * 60)

    # Step 1 — ping Ollama server
    try:
        models_response = ollama.list()
        logger.info("Ollama server is running at %s", settings.ollama_host)
    except Exception as e:
        logger.error("Ollama server is not running at %s", settings.ollama_host)
        logger.error("   Error : %s", e)
        logger.error("   Fix   : Run  →  ollama serve")
        logger.info("=" * 60)
        return

    # Step 2 — check if the configured model is available locally
    try:
        available = [m["model"] for m in models_response.get("models", [])]
        # Normalise names: strip ":latest" suffix for comparison
        available_base = [m.split(":")[0] for m in available]
        target = settings.ollama_model.split(":")[0]

        if target in available_base or settings.ollama_model in available:
            logger.info("Model '%s' is available and ready", settings.ollama_model)
        else:
            logger.warning("Model '%s' is not pulled yet", settings.ollama_model)
            logger.warning("   Fix   : Run  →  ollama pull %s", settings.ollama_model)
            if available:
                logger.info("   Available models on this machine: %s", ", ".join(available))
            else:
                logger.info("   No models are pulled yet on this machine")
    except Exception as e:
        logger.warning("Could not verify model list: %s", e)

    logger.info("=" * 60)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── startup ──────────────────────────────────────────────
    _check_ollama()
    yield
    # ── shutdown ─────────────────────────────────────────────
    logger.info("Server shutting down.")


app = FastAPI(
    title="Core Web Vitals AI Analyzer",
    description="AI-powered performance analysis using Google PageSpeed Insights and Ollama.",
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS — allow React dev server and production frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
API_PREFIX = f"/api/{settings.api_version}"
app.include_router(analyze_router, prefix=API_PREFIX, tags=["Analysis"])


@app.get("/health", tags=["Health"])
async def health_check():
    """Liveness check — also reports Ollama status."""
    try:
        ollama.list()
        ollama_status = "running"
    except Exception:
        ollama_status = "not running"

    return {
        "status": "ok",
        "service": "seo-ai-audit",
        "environment": settings.environment,
        "version": "1.1.0",
        "ollama": ollama_status,
        "model": settings.ollama_model,
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "seo-ai-audit",
        "message": "Core Web Vitals AI Analyzer API",
        "docs": "/docs",
    }
