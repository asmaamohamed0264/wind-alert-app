# Etapa 1: Construirea aplicației React
FROM node:18-alpine as build

WORKDIR /app

# Copiem package.json și instalăm dependențele
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copiem restul fișierelor
COPY . ./

# Setăm variabila de mediu pentru URL-ul backend-ului
# Aceasta va fi preluată din docker-compose.yml la build time
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Construim aplicația pentru producție
RUN npm run build

# Etapa 2: Servirea aplicației cu Nginx
FROM nginx:stable-alpine

# Copiem fișierele construite din etapa anterioară
COPY --from=build /app/build /usr/share/nginx/html

# Expunem portul 80
EXPOSE 80

# Comanda de pornire pentru Nginx
CMD ["nginx", "-g", "daemon off;"]
