# Etapa 1: build de Angular
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

# Etapa 2: nginx para producción
FROM nginx:alpine

# Copia la build Angular
COPY --from=build /app/dist/audioheaven/browser /usr/share/nginx/html

# Copia configuración de nginx que permite rutas Angular (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
