# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Recibir variable como build arg
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copiar archivos de dependencias primero (para mejor cache de Docker)
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copiar build al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"] 