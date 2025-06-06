"""
Aplicación principal FastAPI para Flashcards AI
"""
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Annotated

import models
from database import engine, session_local
from documents_class import DocRequest
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from services.llm_service import llm_service
from sqlalchemy.orm import Session
from starlette import status

# Creamos directorio para archivos
UPLOAD_DIRECTORY = "uploads"
Path(UPLOAD_DIRECTORY).mkdir(exist_ok=True)

# Cargar variables de entorno
load_dotenv()


# Abrir y cerrar conexión
def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()


# Creamos dependecia de la sesión de bd
db_dependency = Annotated[Session, Depends(get_db)]


# Crear instancia de FastAPI
app = FastAPI(
    title="Flashcards AI API",
    description="API para generar y gestionar flashcards potenciados por IA",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)
# Conectamos a modelo
models.base.metadata.create_all(bind=engine)


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


@app.get("/api/documents", status_code=status.HTTP_200_OK)
async def read_docs(db: db_dependency):
    """Endpoint para obtener todos los documentos"""
    return db.query(models.Docs).all()


@app.post("/api/documents_only_text", status_code=status.HTTP_201_CREATED)
async def create_doc(db: db_dependency, doc_request: DocRequest):
    """Endpoint de creación de nuevo documento"""
    doc_model = models.Docs(**doc_request.model_dump())
    db.add(doc_model)
    db.commit()
    # Refesca base de datos y recupera último registro
    db.refresh(doc_model)
    return doc_model


@app.post("/api/documents_files", status_code=status.HTTP_201_CREATED)
async def create_doc_upload(db: db_dependency, file: UploadFile = File()):
    """Endpoint de creación de nuevo documento con subida de archivos"""
    # Leemos contenido
    content = await file.read()
    # Validamos extensión
    allowed_types = ["text/plain"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, detail=f"Tipo de archivo {file.content_type} no permitido"
        )
    # Generamos nuevo nombre para guardarlo Disco > 1MG (por defecto)
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"content_{file.filename}+{file_extension}"
    file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        db_doc = models.Docs(
            raw_text=content.decode("utf-8"), created_at=str(datetime.now().date())
        )

        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)

        return {"id": db_doc.id_, "status_code": 201}

    except Exception as e:
        # Limpiamos archivos en caso de excepción
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500, detail=f"Error procesando el documento: {str(e)}"
        )

    finally:
        file.file.close()


@app.post("/api/test-llm")
async def test_llm_integration():
    """Endpoint de prueba para la integración con LLM"""
    
    # Texto de ejemplo para probar
    sample_text = """
    La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar en energía química. 
    Este proceso ocurre principalmente en las hojas, específicamente en los cloroplastos, que contienen 
    clorofila, el pigmento verde responsable de capturar la luz solar.
    
    El proceso de fotosíntesis se divide en dos fases principales: las reacciones dependientes de la luz 
    (fase luminosa) y las reacciones independientes de la luz (ciclo de Calvin). Durante la fase luminosa, 
    la energía solar se convierte en ATP y NADPH, mientras que en el ciclo de Calvin, el CO2 se fija y 
    se convierte en glucosa.
    
    La ecuación general de la fotosíntesis es: 6CO2 + 6H2O + energía solar → C6H12O6 + 6O2. 
    Este proceso es fundamental para la vida en la Tierra, ya que produce el oxígeno que respiramos 
    y es la base de la mayoría de las cadenas alimentarias.
    """
    
    try:
        # Probar la extracción de flashcards
        result = await llm_service.extract_flashcards(
            text=sample_text,
            num_pairs=3
        )
        
        # Loguear la respuesta cruda
        llm_service.log_response(result, "TEST FLASHCARD EXTRACTION")
        
        return {
            "status": "success",
            "test_text_length": len(sample_text),
            "raw_response": result["content"],
            "parsed_flashcards": result.get("parsed_flashcards"),
            "usage": result["usage"],
            "model": result["model"]
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "test_text_length": len(sample_text)
        }


# TODO: Agregar routers para:
# - Autenticación
# - Subida y procesamiento de documentos
# - Generación de flashcards
# - Sesiones de estudio
# - Gestión de usuarios
