FROM node:14 as build-stage

WORKDIR /app

# copiar configuración
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# dependencias
RUN npm install

# código fuente y correr aplicacion
COPY ./src ./src
RUN npm run start

# Etapa de producción
# FROM nginx:1.21.1-alpine as production-stage

# Copiar los archivos de la etapa de compilación
# COPY --from=build-stage /app/dist/ /usr/share/nginx/html

# Configurar Nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
