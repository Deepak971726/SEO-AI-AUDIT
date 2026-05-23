import logging
import sys


def get_performance_grade(score: int) -> str:
    """Convert numeric score to human-readable grade."""
    if score >= 90:
        return "Excellent"
    elif score >= 70:
        return "Good"
    elif score >= 50:
        return "Needs Improvement"
    return "Poor"


def format_metric(value_ms: float | None, unit: str = "ms") -> str:
    """Format raw millisecond values into readable strings."""
    if value_ms is None:
        return "N/A"
    if unit == "s":
        return f"{value_ms / 1000:.1f} s"
    return f"{value_ms:.0f} ms"


def format_cls(value: float | None) -> str:
    """Format Cumulative Layout Shift score."""
    if value is None:
        return "N/A"
    return f"{value:.3f}"


def setup_logger(name: str) -> logging.Logger:
    """Configure and return a named logger."""
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(
            logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s")
        )
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger
