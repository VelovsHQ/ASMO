from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    # GEMINI_API_KEY: str
    GROQ_API_KEY: str

    model_config = SettingsConfigDict(
        extra="ignore",
    )


settings = Settings()