const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <-- Am adăugat linia asta
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes/api');

// Încarcă variabilele de mediu din .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Configurare CORS ---
// Permite cereri doar de la adresa frontend-ului specificată în .env
const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl) {
  console.warn('ATENȚIE: Variabila de mediu FRONTEND_URL nu este setată.');
}
app.use(cors({
  origin: frontendUrl
}));
// ------------------------

// Middlewares de securitate
app.use(helmet());
app.use(express.json()); // Pentru a parsa body-ul cererilor JSON

// Rate Limiting pentru a preveni abuzul
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100, // Limitează fiecare IP la 100 de cereri pe "fereastra" de timp
  standardHeaders: true,
  legacyHeaders: false, 
  message: 'Prea multe cereri de la acest IP, vă rugăm încercați din nou după 15 minute'
});
app.use('/api/', limiter);


// Rutele pentru API
app.use('/api', apiRoutes);

// Endpoint de bază pentru a verifica dacă serverul funcționează
app.get('/', (req, res) => {
  res.send('Wind Alert App Backend rulează!');
});

// Pornirea serverului
app.listen(PORT, () => {
  console.log(`Serverul ascultă pe portul ${PORT}`);
  console.log(`Frontend-ul permis (CORS): ${frontendUrl}`);
});
