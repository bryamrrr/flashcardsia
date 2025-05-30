# Flashcards AI - Backend

Backend FastAPI para generación de flashcards potenciados por IA desde documentos.

## 🏗️ Arquitectura

API REST que procesa documentos y genera flashcards usando IA, con algoritmos de repetición espaciada y gestión de usuarios.

## 🛠️ Stack Tecnológico

- **Framework**: FastAPI
- **Base de datos**: PostgreSQL con SQLAlchemy
- **IA/ML**: OpenAI API, LangChain
- **Autenticación**: JWT con python-jose
- **Pruebas**: pytest, pytest-asyncio
- **Calidad de código**: Black, flake8, isort, mypy
- **Gestión de paquetes**: Poetry

## 🚀 Inicio Rápido

### Prerrequisitos

- Python 3.11+
- Poetry
- PostgreSQL

### Configuración

```bash
cd backend
poetry install
poetry shell
cp env.example .env
# Editar .env con tu configuración
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Disponible en**: http://localhost:8000  
**Documentación API**: http://localhost:8000/api/docs

## 🔧 Comandos de Desarrollo

```bash
# Calidad de código
poetry run black .           # Formatear código
poetry run isort .           # Ordenar imports
poetry run flake8           # Analizar código
poetry run mypy .           # Verificar tipos

# Pruebas
poetry run pytest           # Ejecutar pruebas
poetry run pytest --cov=app # Ejecutar pruebas con cobertura

# Base de datos
poetry run alembic revision --autogenerate -m "Descripcion"  # Crear migración
poetry run alembic upgrade head                              # Aplicar migraciones
```

## 🔑 Variables de Entorno

Copiar `env.example` a `.env` y configurar:

```bash
# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/flashcards_ai

# Claves API
OPENAI_API_KEY=tu_clave_api_openai_aqui
SECRET_KEY=tu_clave_secreta_aqui

# Entorno
ENVIRONMENT=development
DEBUG=True

# CORS
ALLOWED_ORIGINS=http://localhost:5173

# Subida de archivos
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=.txt,.pdf,.docx,.md
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app instance
│   ├── api/                 # API routes
│   ├── core/                # Core functionality
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   └── utils/               # Utilities
├── tests/                   # Test files
├── alembic/                 # Database migrations
├── pyproject.toml           # Poetry configuration
└── README.md
```

## API Endpoints (Planned)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/documents/upload` - Upload document for processing
- `POST /api/flashcards/generate` - Generate flashcards from document
- `GET /api/flashcards/` - Get user's flashcards
- `POST /api/study/session` - Start study session
- `PUT /api/study/review` - Review flashcard (spaced repetition)

## Contributing

1. Follow PEP 8 style guide
2. Use type hints
3. Write tests for new features
4. Run code quality checks before committing
