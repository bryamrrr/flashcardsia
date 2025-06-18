"""
Configuración centralizada para la aplicación
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuración de la aplicación usando Pydantic Settings"""
    
    # Configuración de la aplicación
    APP_NAME: str = "Flashcards AI API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Configuración de OpenAI
    OPENAI_API_KEY: Optional[str] = None
    DEFAULT_MODEL: str = "gpt-3.5-turbo"
    MAX_TOKENS: int = 1000
    TEMPERATURE: float = 0.7
    
    # Configuración de base de datos
    DATABASE_URL: Optional[str] = None
    
    # Configuración de CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    
    # Configuración del servidor
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Configuración de archivos
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIRECTORY: str = "uploads"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def get_database_url(self) -> str:
        """Obtiene la URL de la base de datos según el entorno"""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        if self.ENVIRONMENT == "production":
            # En producción, usar PostgreSQL desde variables de entorno
            db_host = os.getenv("DB_HOST", "localhost")
            db_port = os.getenv("DB_PORT", "5432")
            db_name = os.getenv("DB_NAME", "flashcards_db")
            db_user = os.getenv("DB_USER", "postgres")
            db_password = os.getenv("DB_PASSWORD", "")
            
            return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        else:
            # En desarrollo, usar SQLite
            return "sqlite:///./flashcards_dev.db"
    
    def get_cors_origins(self) -> list[str]:
        """Obtiene la lista de orígenes permitidos para CORS"""
        origins = self.ALLOWED_ORIGINS.split(",")
        return [origin.strip() for origin in origins if origin.strip()]


# Instancia global de configuración
settings = Settings() 