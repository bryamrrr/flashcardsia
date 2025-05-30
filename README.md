# 🧠 Flashcards AI

**Transforma tus documentos en flashcards inteligentes potenciados por IA para un aprendizaje eficiente**

Flashcards AI genera automáticamente flashcards desde documentos usando inteligencia artificial, incorporando algoritmos de repetición espaciada para optimizar el aprendizaje y la retención.

## 🏗️ Arquitectura

Monorepo que contiene aplicaciones frontend y backend:

```
flashcards-ai/
├── frontend/          # React + TypeScript + Vite
├── backend/           # FastAPI + Python
└── README.md
```

## 🛠️ Stack Tecnológico

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Zustand  
**Backend**: FastAPI, Python 3.11+, PostgreSQL, SQLAlchemy, OpenAI API  
**Desarrollo**: ESLint, Prettier, Black, flake8, Poetry, npm

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js**: 20.19.2+ (usar `nvm use` en frontend/)
- **Python**: 3.11+
- **Poetry**: Para manejo de dependencias de Python
- **PostgreSQL**: Para la base de datos

### Configuración del Backend

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

### Configuración del Frontend

```bash
cd frontend
nvm use
npm install
npm run dev
```

**Disponible en**: http://localhost:5173

## 🔧 Comandos de Desarrollo

### Backend

```bash
poetry run black .           # Formatear código
poetry run flake8           # Analizar código
poetry run pytest           # Ejecutar pruebas
```

### Frontend

```bash
npm run format              # Formatear código
npm run lint                # Analizar código
npm run type-check          # Verificar tipos
npm run build               # Construir para producción
```

## 🔑 Variables de Entorno

### Backend (.env)

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
```

### Frontend (.env.local)

```bash
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Flashcards AI
```
