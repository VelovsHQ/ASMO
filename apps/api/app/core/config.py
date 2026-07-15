from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    GROQ_API_KEY: str
    GEMINI_API_KEY: str
    REDIS_URL: str

    model_config = SettingsConfigDict(
        extra="ignore",
    )


settings = Settings()