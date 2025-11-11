# 🚀 Guía de Deployment - Flashcards AI

Esta guía te ayudará a desplegar la aplicación Flashcards AI en diferentes plataformas cloud.

## 📋 Requisitos Previos

1. **OpenAI API Key** - Obtén tu clave en [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Cuenta en plataforma cloud** (elegir una):
   - Railway
   - Render
   - Vercel + PlanetScale
   - DigitalOcean
   - AWS/Google Cloud/Azure

## 🎯 Opción 1: Railway (Recomendado - Más Fácil)

### Backend en Railway

1. **Crear cuenta en [Railway](https://railway.app/)**

2. **Crear nuevo proyecto**:

   ```bash
   # Conectar tu repositorio de GitHub
   # O subir código directamente
   ```

3. **Configurar variables de entorno**:

   ```env
   ENVIRONMENT=production
   OPENAI_API_KEY=tu_clave_openai_aqui
   ALLOWED_ORIGINS=https://tu-frontend-url.railway.app
   ```

4. **Railway detectará automáticamente**:

   - `requirements.txt` para Python
   - Instalará dependencias
   - Expondrá puerto 8000

5. **Agregar PostgreSQL**:
   - En Railway dashboard: "Add Service" → "Database" → "PostgreSQL"
   - Railway automáticamente configurará `DATABASE_URL`

### Frontend en Railway

1. **Crear otro servicio en Railway**
2. **Configurar variables de entorno**:
   ```env
   VITE_API_BASE_URL=https://tu-backend-url.railway.app
   ```
3. **Railway detectará automáticamente**:
   - `package.json` para Node.js
   - Ejecutará `npm run build`
   - Servirá archivos estáticos

## 🎯 Opción 2: Render

### Backend en Render

1. **Crear cuenta en [Render](https://render.com/)**

2. **Crear Web Service**:

   - Conectar repositorio
   - Configurar:
     ```
     Build Command: pip install -r requirements.txt
     Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

3. **Agregar PostgreSQL**:

   - Crear "PostgreSQL Database"
   - Copiar `DATABASE_URL`

4. **Variables de entorno**:
   ```env
   ENVIRONMENT=production
   OPENAI_API_KEY=tu_clave_aqui
   DATABASE_URL=postgresql://...
   ALLOWED_ORIGINS=https://tu-frontend.onrender.com
   ```

### Frontend en Render

1. **Crear Static Site**:

   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **Variables de entorno**:
   ```env
   VITE_API_BASE_URL=https://tu-backend.onrender.com
   ```

## 🎯 Opción 3: Vercel + PlanetScale

### Base de datos en PlanetScale

1. **Crear cuenta en [PlanetScale](https://planetscale.com/)**
2. **Crear database**: `flashcards-db`
3. **Obtener connection string**

### Backend en Vercel

1. **Crear `vercel.json`** en backend/:

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "app/main.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "app/main.py"
       }
     ]
   }
   ```

2. **Deploy**:

   ```bash
   cd backend
   vercel --prod
   ```

3. **Variables de entorno en Vercel**:
   ```env
   ENVIRONMENT=production
   OPENAI_API_KEY=tu_clave
   DATABASE_URL=mysql://...planetscale...
   ```

### Frontend en Vercel

1. **Deploy frontend**:

   ```bash
   cd frontend
   vercel --prod
   ```

2. **Variables de entorno**:
   ```env
   VITE_API_BASE_URL=https://tu-backend.vercel.app
   ```

## 🎯 Opción 4: Docker + DigitalOcean

### 1. Preparar archivos

```bash
# Crear .env en la raíz
echo "OPENAI_API_KEY=tu_clave_aqui" > .env
```

### 2. Deploy con Docker Compose

```bash
# En tu servidor DigitalOcean
git clone tu-repositorio
cd flashcardsia
docker-compose up -d
```

### 3. Configurar dominio y SSL

```bash
# Instalar Caddy para SSL automático
# Configurar reverse proxy
```

## 🔧 Configuración Post-Deployment

### 1. Verificar Backend

```bash
curl https://tu-backend-url.com/health
```

Respuesta esperada:

```json
{
  "status": "healthy",
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Verificar Frontend

- Visita tu URL del frontend
- Prueba subir un documento PDF
- Verifica que se generen flashcards

### 3. Configurar CORS

Asegúrate de que `ALLOWED_ORIGINS` incluya tu dominio del frontend:

```env
ALLOWED_ORIGINS=https://tu-frontend.com,https://www.tu-frontend.com
```

## 🚨 Troubleshooting

### Errores Comunes

1. **CORS Error**:

   ```env
   # Agregar tu dominio a ALLOWED_ORIGINS
   ALLOWED_ORIGINS=https://tu-dominio.com
   ```

2. **Database Connection Error**:

   ```bash
   # Verificar DATABASE_URL
   echo $DATABASE_URL
   ```

3. **OpenAI API Error**:
   ```bash
   # Verificar API key
   echo $OPENAI_API_KEY
   ```

### Logs

```bash
# Railway
railway logs

# Render
# Ver logs en dashboard

# Vercel
vercel logs

# Docker
docker-compose logs -f
```

## 📊 Monitoreo

### Health Checks

- Backend: `https://tu-backend.com/health`
- Frontend: Verificar que carga correctamente

### Métricas

- Tiempo de respuesta API
- Uso de tokens OpenAI
- Errores 4xx/5xx

## 🔒 Seguridad

1. **Variables de entorno**: Nunca commitear claves API
2. **HTTPS**: Usar siempre SSL en producción
3. **CORS**: Configurar dominios específicos
4. **Rate limiting**: Considerar implementar en producción

## 💰 Costos Estimados

### Railway/Render (Tier gratuito)

- Backend: $0-5/mes
- Database: $0-7/mes
- Frontend: $0/mes

### Vercel + PlanetScale

- Backend: $0/mes (hobby)
- Database: $0-10/mes
- Frontend: $0/mes

### DigitalOcean

- Droplet: $5-10/mes
- Database: $15/mes

---

## 🎉 ¡Listo!

Tu aplicación Flashcards AI está ahora disponible en la web. Los usuarios pueden:

1. Visitar tu URL
2. Subir documentos PDF/TXT
3. Generar flashcards con IA
4. Estudiar de forma interactiva

¿Problemas? Revisa los logs y la sección de troubleshooting.
