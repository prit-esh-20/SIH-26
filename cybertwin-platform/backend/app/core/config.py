from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENV: str = "development"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = "sqlite:///./cybertwin.db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
