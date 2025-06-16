# Etapa de build
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

# Etapa de producción
FROM nginx:alpine

# Copia archivos Angular a nginx html
COPY --from=build /app/dist/audioheaven/browser /usr/share/nginx/html

# Reemplaza configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
