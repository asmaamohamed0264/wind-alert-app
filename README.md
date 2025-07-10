Aplicație de Alertă Vânt (Full-Stack)
Aceasta este o aplicație web completă (full-stack) pentru monitorizarea vitezei vântului și trimiterea de alerte de furtună. Aplicația folosește o prognoză meteo pentru a avertiza utilizatorii cu 8 ore înainte de evenimente de vânt puternic.

Caracteristici
Frontend React: O interfață modernă și reactivă construită cu React și stilizată cu Tailwind CSS.

Backend Node.js: Un server securizat construit cu Express pentru a gestiona trimiterea de notificări.

Alerte de Prognoză: Analizează prognoza meteo pe 3 ore de la OpenWeatherMap pentru a trimite alerte cu 8 ore în avans.

Praguri Configurabile: Utilizatorii pot seta pragul de viteză (în km/h) la care doresc să fie alertați.

Notificări Multi-Canal:

Notificări Push: Alerte direct în browser.

Notificări SMS/WhatsApp: Integrare cu Twilio pentru a trimite mesaje text.

Gata pentru Deploy: Configurată pentru o implementare ușoară pe platforme precum Coolify folosind Docker.

Structura Proiectului
Proiectul este organizat într-o arhitectură monorepo cu două servicii principale:

/wind-alert-app
|-- /backend         # Serverul Node.js & Express
|   |-- server.js
|   |-- Dockerfile
|   |-- package.json
|   |-- .env.example
|
|-- /frontend        # Aplicația React
|   |-- /src
|   |   |-- App.js   # Componenta principală
|   |-- Dockerfile
|   |-- package.json
|
|-- docker-compose.yml # Fișier de orchestrare pentru Coolify/Docker
|-- README.md          # Acest fișier

Cerințe
Înainte de a începe, asigură-te că ai următoarele:

Node.js (versiunea 18 sau mai recentă)

Docker și Docker Compose

Un cont pe Coolify (sau o altă platformă de hosting Docker)

Un cont Twilio cu:

Account SID

Auth Token

Un număr de telefon Twilio

O cheie API de la OpenWeatherMap (API-ul "5 Day / 3 Hour Forecast" este necesar).

Configurare și Rulare Locală
1. Backend
Navighează în directorul backend:

cd backend

Instalează dependențele:

npm install

Creează un fișier .env pornind de la .env.example și completează-l cu cheile tale Twilio:

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+15017122661
PORT=3001

Pornește serverul backend:

npm start

Serverul va rula la http://localhost:3001.

2. Frontend
Într-un terminal nou, navighează în directorul frontend:

cd frontend

Instalează dependențele:

npm install

În fișierul src/App.js, asigură-te că ai o cheie API OpenWeatherMap (sau lasă MOCK_API = true pentru a folosi date simulate).

Pornește aplicația React:

npm start

Aplicația va rula la http://localhost:3000 și va comunica cu backend-ul care rulează pe portul 3001.

Implementare (Deploy) pe Coolify
Repository Git: Urcă întregul proiect (directoarele frontend, backend și fișierul docker-compose.yml) pe un repository GitHub sau GitLab.

Creează Resursa în Coolify:

În dashboard-ul Coolify, alege Create New Resource.

Selectează Docker Compose din secțiunea Deploy from a Git repository.

Configurează Sursa:

Conectează contul tău Git și alege repository-ul creat.

Selectează branch-ul (de ex., main).

Lasă Docker Compose Location la / (rădăcină).

Setează Variabilele de Mediu:

După crearea resursei, navighează la tab-ul Environment Variables pentru serviciul backend.

Adaugă aici, ca secrets, cheile tale Twilio:

TWILIO_ACCOUNT_SID

TWILIO_AUTH_TOKEN

TWILIO_PHONE_NUMBER

Adaugă și cheia API pentru OpenWeatherMap în variabilele de mediu pentru frontend dacă dorești să o gestionezi centralizat (necesită modificări în cod pentru a o citi din process.env).

Deploy:

Apasă butonul Deploy. Coolify va construi și va rula ambele servicii.

Configurează Domeniul Public:

Navighează la setările serviciului frontend.

În secțiunea FQDN (Fully Qualified Domain Name), adaugă domeniul public pe care dorești să fie accesibilă aplicația (ex: alerta-vant.exemplu.com). Coolify va genera automat un certificat SSL.

Aplicația ta este acum live!
