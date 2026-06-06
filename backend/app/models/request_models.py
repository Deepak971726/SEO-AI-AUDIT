from pydantic import BaseModel, HttpUrl, field_validator
from typing import Literal, Optional


class AnalyzeRequest(BaseModel):
    url: str
    device: str = "mobile"

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("URL cannot be empty")
        # Auto-fix bare domains like google.com → https://google.com
        if not v.startswith(("http://", "https://")):
            v = f"https://{v}"
        return v.rstrip("/")

    @field_validator("device")
    @classmethod
    def validate_device(cls, v: str) -> str:
        device = (v or "mobile").strip().lower()
        if device not in {"mobile", "desktop"}:
            raise ValueError("Device must be mobile or desktop")
        return device


class CoreWebVitalsReport(BaseModel):
    device: str = "mobile"
    lcp: str
    cls: str
    fcp: str
    ttfb: str
    speed_index: str
    tbt: str
    performance_score: int
    performance_grade: str
    accessibility_score: int
    best_practices_score: int
    seo_score: int
    screenshot: Optional[str] = None  # base64 data URI


class AISuggestions(BaseModel):
    performance_issues: list[str]
    seo_impact: list[str]
    optimization_suggestions: list[str]
    react_optimization_tips: list[str]
    caching_recommendations: list[str]
    image_optimization: list[str]


class SavageRoast(BaseModel):
    title: str
    message: str
    emoji: str
    severity: Literal["low", "medium", "high"]


class AnalyzeResponse(BaseModel):
    success: bool
    url: str
    report: CoreWebVitalsReport
    ai_suggestions: AISuggestions
    savage_roast: SavageRoast


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
