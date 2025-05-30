# Flashcards AI - Frontend

Frontend moderno React + TypeScript para generación de flashcards potenciados por IA.

## 🏗️ Arquitectura

Aplicación web responsiva que proporciona subida de documentos, interfaz de revisión de flashcards y seguimiento de progreso.

## 🛠️ Stack Tecnológico

- **Framework**: React 18 + TypeScript
- **Herramienta de construcción**: Vite
- **Estilos**: Tailwind CSS
- **Gestión de estado**: Zustand
- **Formularios**: React Hook Form + validación Zod
- **Cliente HTTP**: Axios
- **Iconos**: Lucide React

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20.19.2 (especificado en `.nvmrc`)
- npm

### Configuración

```bash
cd frontend
nvm use                      # Activar versión correcta de Node.js
npm install
npm run dev
```

**Disponible en**: http://localhost:5173

## 🔧 Comandos de Desarrollo

```bash
# Desarrollo
npm run dev                  # Iniciar servidor dev con hot reload
npm run dev:nvm             # Iniciar dev con versión correcta de Node.js
npm run build               # Construir para producción
npm run preview             # Vista previa construcción de producción

# Calidad de código
npm run lint                # Ejecutar ESLint
npm run lint:fix            # Corregir errores de ESLint automáticamente
npm run format              # Formatear código con Prettier
npm run format:check        # Verificar si el código está formateado
npm run type-check          # Ejecutar verificación de tipos TypeScript

# Pruebas
npm run test               # Ejecutar pruebas (por implementar)
```

## 🔑 Variables de Entorno

Crear un archivo `.env.local` en el directorio frontend:

```bash
# URL de la API del backend
VITE_API_URL=http://localhost:8000

# Configuración de la aplicación
VITE_APP_NAME=Flashcards AI
VITE_MAX_FILE_SIZE=10485760  # 10MB en bytes
```
