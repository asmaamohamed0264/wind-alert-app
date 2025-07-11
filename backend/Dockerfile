# Folosim o imagine oficială Node.js ca bază
FROM node:18-alpine

# Instalăm curl pentru health checks
RUN apk add --no-cache curl

# Setăm directorul de lucru în container
WORKDIR /usr/src/app

# Copiem fișierele package.json și package-lock.json
COPY package*.json ./

# Instalăm dependențele proiectului (folosim npm install în loc de npm ci)
RUN npm install --production && npm cache clean --force

# Creăm un utilizator non-root pentru securitate
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiem restul codului sursă al aplicației
COPY . .

# Schimbăm ownership-ul fișierelor către utilizatorul nodejs
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Expunem portul pe care rulează aplicația
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# Comanda care va fi executată la pornirea containerului
CMD [ "npm", "start" ]