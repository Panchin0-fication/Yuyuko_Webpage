from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    supported_locales: List[str] = ["en", "es"]
    default_locale: str = "en"

    class Config:
        env_prefix = "APP_"  # Prefix for environment variables

# Create a settings instance
settings_internalization = Settings()