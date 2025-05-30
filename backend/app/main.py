"""
Aplicación principal FastAPI para Flashcards AI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Crear instancia de FastAPI
app = FastAPI(
    title="Flashcards AI API",
    description="API para generar y gestionar flashcards potenciados por IA",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Configurar CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Endpoint raíz"""
    return {"message": "Bienvenido a Flashcards AI API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Endpoint de verificación de salud"""
    return {"status": "healthy", "environment": os.getenv("ENVIRONMENT", "development")}


# TODO: Agregar routers para:
# - Autenticación
# - Subida y procesamiento de documentos
# - Generación de flashcards
# - Sesiones de estudio
# - Gestión de usuarios 