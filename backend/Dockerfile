# Folosim o imagine oficială Node.js ca bază
FROM node:18-alpine

# Setăm directorul de lucru în container
WORKDIR /usr/src/app

# Copiem fișierele package.json și package-lock.json
COPY package*.json ./

# Instalăm dependențele proiectului
RUN npm install

# Copiem restul codului sursă al aplicației
COPY . .

# Expunem portul pe care rulează aplicația
EXPOSE 3001

# Comanda care va fi executată la pornirea containerului
CMD [ "npm", "start" ]
