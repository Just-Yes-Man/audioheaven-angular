# Etapa de construcción
FROM node:20 AS build

WORKDIR /app

# Copiar los archivos package.json y package-lock.json para instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación Angular en modo de producción
RUN npm run build --prod

# Etapa de producción: Usar Apache (httpd) para servir la app
FROM httpd:alpine

# Copiar los archivos generados en la etapa anterior al contenedor de Apache
COPY --from=build /app/dist/audioheaven/browser /usr/local/apache2/htdocs/

# Exponer el puerto 80 (predeterminado de HTTPD)
EXPOSE 80

# Ejecutar Apache en primer plano
CMD ["httpd-foreground"]