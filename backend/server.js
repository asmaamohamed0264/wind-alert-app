const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { generalLimiter, errorHandler } = require('./middleware/security');
const apiRoutes = require('./routes/api');

// Încarcă variabilele de mediu din .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Verifică variabilele de mediu critice
const requiredEnvVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ EROARE: Variabile de mediu lipsă:', missingVars.join(', '));
  console.error('Aplicația va funcționa în modul limitat.');
}

// Configurare CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  console.warn('⚠️ ATENȚIE: FRONTEND_URL nu este setat în producție. CORS va permite toate originile.');
}

app.use(cors(corsOptions));

// Middleware de securitate
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting general
app.use('/api/', generalLimiter);

// Trust proxy pentru rate limiting corect în producție
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Rutele pentru API
app.use('/api', apiRoutes);

// Endpoint de bază pentru a verifica dacă serverul funcționează
app.get('/', (req, res) => {
  res.json({
    message: 'Wind Alert App Backend rulează!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Middleware pentru gestionarea erorilor (trebuie să fie ultimul)
app.use(errorHandler);

// Pornirea serverului
const server = app.listen(PORT, () => {
  console.log(`🚀 Serverul ascultă pe portul ${PORT}`);
  console.log(`🌐 Frontend permis (CORS): ${process.env.FRONTEND_URL || 'toate originile'}`);
  console.log(`🔧 Mediu: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Twilio configurat: ${missingVars.length === 0 ? '✅' : '❌'}`);
  console.log(`🌤️ OpenWeather API: ${process.env.OPENWEATHER_API_KEY ? '✅' : '❌ (folosind date simulate)'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM primit. Închidere graceful...');
  server.close(() => {
    console.log('✅ Server închis.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT primit. Închidere graceful...');
  server.close(() => {
    console.log('✅ Server închis.');
    process.exit(0);
  });
});