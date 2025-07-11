// Importuri necesare
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importuri locale
const TwilioService = require('./services/twilioService');
const { 
  helmet, 
  smsLimiter, 
  generalLimiter, 
  validateSMSInput, 
  requestLogger, 
  errorHandler 
} = require('./middleware/security');

// --- Configurare Aplicație ---
const app = express();
const port = process.env.PORT || 3001;

// Inițializează serviciul Twilio
let twilioService;
try {
  twilioService = new TwilioService();
  console.log('✅ Serviciul Twilio a fost inițializat cu succes');
} catch (error) {
  console.error('❌ Eroare la inițializarea serviciului Twilio:', error.message);
  process.exit(1);
}

// --- Middleware Global ---
// Securitate
app.use(helmet());

// Rate limiting general
app.use(generalLimiter);

// CORS - configurare mai restrictivă pentru producție
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || false
    : true, // În dezvoltare permite orice origine
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(requestLogger);

// --- Rute API ---

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Wind Alert Backend'
  });
});

// Endpoint pentru informații despre serviciu
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    service: 'Wind Alert Backend',
    version: '1.0.0',
    features: ['SMS Notifications', 'Rate Limiting', 'Input Validation'],
    endpoints: ['/api/health', '/api/info', '/api/send-sms']
  });
});

// Endpoint pentru trimiterea SMS-urilor (cu rate limiting și validare)
app.post('/api/send-sms', smsLimiter, validateSMSInput, async (req, res) => {
  const { to, message } = req.body;

  try {
    console.log(`📱 Încercare trimitere SMS către ${to}`);
    
    const result = await twilioService.sendSMS(to, message);
    
    console.log(`✅ SMS trimis cu succes către ${to}. SID: ${result.sid}`);
    
    res.json({
      success: true,
      sid: result.sid,
      status: result.status,
      message: 'SMS trimis cu succes'
    });
    
  } catch (error) {
    console.error(`❌ Eroare la trimiterea SMS către ${to}:`, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint pentru verificarea statusului unui mesaj
app.get('/api/message-status/:sid', async (req, res) => {
  const { sid } = req.params;

  try {
    const status = await twilioService.getMessageStatus(sid);
    res.json(status);
  } catch (error) {
    console.error('Eroare la verificarea statusului:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint pentru validarea numărului de telefon
app.post('/api/validate-phone', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      error: 'Numărul de telefon este obligatoriu'
    });
  }

  try {
    const validation = await twilioService.validatePhoneNumber(phoneNumber);
    res.json(validation);
  } catch (error) {
    console.error('Eroare la validarea numărului:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rută de test pentru a verifica dacă serverul funcționează
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Serverul pentru alerte de vânt funcționează!',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      info: '/api/info',
      sendSMS: 'POST /api/send-sms',
      messageStatus: 'GET /api/message-status/:sid',
      validatePhone: 'POST /api/validate-phone'
    }
  });
});

// Gestionarea rutelor inexistente
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint-ul nu a fost găsit',
    availableEndpoints: ['/api/health', '/api/info', '/api/send-sms']
  });
});

// Middleware pentru gestionarea erorilor
app.use(errorHandler);

// --- Pornirea Serverului ---
const server = app.listen(port, () => {
  console.log(`🚀 Serverul rulează pe portul ${port}`);
  console.log(`🌐 Health check: http://localhost:${port}/api/health`);
  console.log(`📱 SMS endpoint: http://localhost:${port}/api/send-sms`);
  console.log(`🔒 Rate limiting activ: 10 SMS-uri per 15 minute per IP`);
});

// Gestionarea închiderii gracioase
process.on('SIGTERM', () => {
  console.log('🛑 Primind SIGTERM, închid serverul...');
  server.close(() => {
    console.log('✅ Server închis cu succes');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Primind SIGINT, închid serverul...');
  server.close(() => {
    console.log('✅ Server închis cu succes');
    process.exit(0);
  });
});

module.exports = app;