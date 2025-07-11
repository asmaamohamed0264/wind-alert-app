const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting pentru API-ul de SMS
const smsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 10, // maxim 10 cereri per IP în 15 minute
  message: {
    success: false,
    error: 'Prea multe cereri. Încercați din nou în 15 minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100, // maxim 100 cereri per IP în 15 minute
  message: {
    success: false,
    error: 'Prea multe cereri. Încercați din nou mai târziu.'
  }
});

// Middleware pentru validarea datelor de intrare
const validateSMSInput = (req, res, next) => {
  const { to, message } = req.body;

  // Verifică dacă câmpurile obligatorii sunt prezente
  if (!to || !message) {
    return res.status(400).json({
      success: false,
      error: 'Câmpurile "to" și "message" sunt obligatorii.'
    });
  }

  // Validează formatul numărului de telefon
  const phoneRegex = /^\+[1-9]\d{6,14}$/;
  if (!phoneRegex.test(to)) {
    return res.status(400).json({
      success: false,
      error: 'Formatul numărului de telefon este invalid. Folosiți formatul internațional (ex: +40712345678).'
    });
  }

  // Validează lungimea mesajului
  if (message.length > 1600) {
    return res.status(400).json({
      success: false,
      error: 'Mesajul este prea lung. Lungimea maximă este de 1600 de caractere.'
    });
  }

  // Sanitizează mesajul (elimină caractere potențial periculoase)
  req.body.message = message.replace(/[<>]/g, '');

  next();
};

// Middleware pentru logging
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip} - User-Agent: ${userAgent}`);
  
  next();
};

// Middleware pentru gestionarea erorilor
const errorHandler = (err, req, res, next) => {
  console.error('Eroare server:', err);

  // Nu expune detaliile erorilor în producție
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    success: false,
    error: isDevelopment ? err.message : 'Eroare internă de server'
  });
};

module.exports = {
  helmet,
  smsLimiter,
  generalLimiter,
  validateSMSInput,
  requestLogger,
  errorHandler
};