#!/bin/sh

# Script pentru înlocuirea variabilelor de mediu în fișierele JavaScript construite
# Acest lucru permite configurarea aplicației la runtime în loc de build time

echo "🚀 Configurare aplicație pentru producție..."

# Înlocuiește variabilele de mediu în fișierele JavaScript
if [ ! -z "$REACT_APP_BACKEND_URL" ]; then
    echo "📡 Configurare BACKEND_URL: $REACT_APP_BACKEND_URL"
    find /usr/share/nginx/html -name "*.js" -exec sed -i "s|REACT_APP_BACKEND_URL_PLACEHOLDER|$REACT_APP_BACKEND_URL|g" {} \;
fi

if [ ! -z "$REACT_APP_OPENWEATHER_API_KEY" ]; then
    echo "🌤️ Configurare OpenWeather API Key"
    find /usr/share/nginx/html -name "*.js" -exec sed -i "s|REACT_APP_OPENWEATHER_API_KEY_PLACEHOLDER|$REACT_APP_OPENWEATHER_API_KEY|g" {} \;
fi

if [ ! -z "$REACT_APP_MOCK_API" ]; then
    echo "🧪 Configurare Mock API: $REACT_APP_MOCK_API"
    find /usr/share/nginx/html -name "*.js" -exec sed -i "s|REACT_APP_MOCK_API_PLACEHOLDER|$REACT_APP_MOCK_API|g" {} \;
fi

echo "✅ Configurare completă. Pornire Nginx..."

# Execută comanda originală (Nginx)
exec "$@"