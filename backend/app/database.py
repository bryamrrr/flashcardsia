from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Obtener URL de base de datos según el entorno
DATABASE_URL = settings.get_database_url()

# Configurar argumentos del engine según el tipo de base de datos
if DATABASE_URL.startswith("sqlite"):
    # Para SQLite
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    # Para PostgreSQL
    engine = create_engine(DATABASE_URL)

session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()
