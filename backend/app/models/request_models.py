from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional


class AnalyzeRequest(BaseModel):
    url: str

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


class CoreWebVitalsReport(BaseModel):
    lcp: str
    cls: str
    fcp: str
    speed_index: str
    tbt: str
    performance_score: int
    performance_grade: str


class AISuggestions(BaseModel):
    performance_issues: list[str]
    seo_impact: list[str]
    optimization_suggestions: list[str]
    react_optimization_tips: list[str]
    caching_recommendations: list[str]
    image_optimization: list[str]


class AnalyzeResponse(BaseModel):
    success: bool
    url: str
    report: CoreWebVitalsReport
    ai_suggestions: AISuggestions


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
