from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Distributed URL Shortener"
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/url_shortener"
    REDIS_URL: str = "redis://localhost:6379/0"
    BASE_URL: str = "http://localhost:8000"

    class Config:
        env_file = ".env"

settings = Settings()
