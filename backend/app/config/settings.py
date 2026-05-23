from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # API Keys
    google_pagespeed_api_key: str

    # Ollama Local AI
    ollama_model: str = "qwen3:4b"
    ollama_host: str = "http://localhost:11434"

    # App Config
    debug: bool = False
    log_level: str = "INFO"
    environment: str = "development"
    api_version: str = "v1"
    api_timeout: int = 60
    pagespeed_timeout: int = 90

    # CORS
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
