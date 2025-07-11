const express = require('express');
const router = express.Router();
const TwilioService = require('../services/twilioService');
const axios = require('axios');
const { smsLimiter, validateSMSInput, requestLogger } = require('../middleware/security');

// Middleware pentru logging
router.use(requestLogger);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend funcționează corect',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Endpoint pentru trimiterea SMS-urilor cu rate limiting și validare
router.post('/send-sms', smsLimiter, validateSMSInput, async (req, res) => {
  try {
    const { to, message } = req.body;
    
    // Verifică dacă serviciul Twilio este configurat
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      return res.status(500).json({
        success: false,
        error: 'Serviciul SMS nu este configurat corect'
      });
    }

    const twilioService = new TwilioService();
    const result = await twilioService.sendSMS(to, message);

    res.status(200).json({
      success: true,
      message: 'SMS trimis cu succes',
      sid: result.sid,
      status: result.status
    });

  } catch (error) {
    console.error('Eroare la trimiterea SMS-ului:', error);
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint pentru prognoza meteo (proxy către OpenWeatherMap)
router.get('/forecast', async (req, res) => {
  try {
    const { lat = 44.4268, lon = 26.1025 } = req.query; // București default
    
    // Verifică dacă trebuie să folosim API-ul simulat
    if (process.env.MOCK_API === 'true' || !process.env.OPENWEATHER_API_KEY) {
      return res.json(getMockForecastData());
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ro`;

    const response = await axios.get(url, {
      timeout: 10000, // 10 secunde timeout
      headers: {
        'User-Agent': 'Wind-Alert-App/1.0'
      }
    });

    if (response.status !== 200) {
      throw new Error(`API OpenWeatherMap a returnat status ${response.status}`);
    }

    res.json(response.data);

  } catch (error) {
    console.error('Eroare la preluarea prognozei meteo:', error);
    
    // În caz de eroare, returnează date simulate
    res.json(getMockForecastData());
  }
});

// Endpoint pentru vremea curentă (proxy către OpenWeatherMap)
router.get('/weather', async (req, res) => {
  try {
    const { lat = 44.4268, lon = 26.1025 } = req.query; // București default
    
    // Verifică dacă trebuie să folosim API-ul simulat
    if (process.env.MOCK_API === 'true' || !process.env.OPENWEATHER_API_KEY) {
      return res.json(getMockCurrentWeather());
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ro`;

    const response = await axios.get(url, {
      timeout: 10000, // 10 secunde timeout
      headers: {
        'User-Agent': 'Wind-Alert-App/1.0'
      }
    });

    if (response.status !== 200) {
      throw new Error(`API OpenWeatherMap a returnat status ${response.status}`);
    }

    res.json(response.data);

  } catch (error) {
    console.error('Eroare la preluarea vremii curente:', error);
    
    // În caz de eroare, returnează date simulate
    res.json(getMockCurrentWeather());
  }
});

// Funcții pentru date simulate (fallback)
function getMockForecastData() {
  const now = new Date();
  const list = [];
  
  for (let i = 0; i < 40; i++) {
    const time = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    const windSpeed = Math.random() * 20 + 5; // 5-25 m/s
    const gustSpeed = windSpeed + Math.random() * 10; // +0-10 m/s
    
    list.push({
      dt: Math.floor(time.getTime() / 1000),
      dt_txt: time.toISOString().replace('T', ' ').substring(0, 19),
      main: {
        temp: Math.random() * 20 + 5,
        feels_like: Math.random() * 20 + 5,
        pressure: 1013 + Math.random() * 20 - 10,
        humidity: Math.random() * 40 + 40
      },
      weather: [{
        main: 'Clear',
        description: 'cer senin',
        icon: '01d'
      }],
      wind: {
        speed: windSpeed,
        deg: Math.random() * 360,
        gust: gustSpeed
      }
    });
  }

  return {
    cod: '200',
    message: 0,
    cnt: 40,
    list: list,
    city: {
      id: 683506,
      name: 'București',
      coord: { lat: 44.4268, lon: 26.1025 },
      country: 'RO'
    }
  };
}

function getMockCurrentWeather() {
  const windSpeed = Math.random() * 15 + 3; // 3-18 m/s
  const gustSpeed = windSpeed + Math.random() * 8; // +0-8 m/s
  
  return {
    coord: { lon: 26.1025, lat: 44.4268 },
    weather: [{
      id: 800,
      main: 'Clear',
      description: 'cer senin',
      icon: '01d'
    }],
    main: {
      temp: Math.random() * 20 + 5,
      feels_like: Math.random() * 20 + 5,
      pressure: 1013 + Math.random() * 20 - 10,
      humidity: Math.random() * 40 + 40
    },
    wind: {
      speed: windSpeed,
      deg: Math.random() * 360,
      gust: gustSpeed
    },
    name: 'București',
    cod: 200
  };
}

module.exports = router;