# Etapa 1: Construirea aplicației React
FROM node:18-alpine as build

WORKDIR /app

# Copiem package.json și package-lock.json
COPY package*.json ./

# Instalăm dependențele
RUN npm install --production && npm cache clean --force

# Copiem restul fișierelor
COPY . ./

# Setăm variabilele de mediu pentru build
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_OPENWEATHER_API_KEY
ARG REACT_APP_MOCK_API

ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_OPENWEATHER_API_KEY=$REACT_APP_OPENWEATHER_API_KEY
ENV REACT_APP_MOCK_API=$REACT_APP_MOCK_API

# Construim aplicația pentru producție
RUN npm run build

# Etapa 2: Servirea aplicației cu Nginx
FROM nginx:stable-alpine

# Copiem configurația Nginx personalizată
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiem fișierele construite din etapa anterioară
COPY --from=build /app/build /usr/share/nginx/html

# Adăugăm un script pentru înlocuirea variabilelor de mediu la runtime
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expunem portul 80
EXPOSE 80

# Folosim script-ul personalizat ca entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
