// Configurări aplicație
export const CONFIG = {
  API_KEY: process.env.REACT_APP_OPENWEATHER_API_KEY || '',
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'https://wind-alert-app-backend.coolify.qub3.uk',
  MOCK_API: process.env.REACT_APP_MOCK_API === 'true' || !process.env.REACT_APP_OPENWEATHER_API_KEY,
  CITY: 'Bucharest',
  UPDATE_INTERVAL: 30 * 60 * 1000, // 30 minute
  FORECAST_HOURS_AHEAD: 8,
  DEFAULT_THRESHOLD: 50,
  ALERT_THRESHOLDS: {
    YELLOW: 50,
    RED: 70
  }
};

export const ALERT_LEVELS = {
  NONE: 'none',
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red'
};

export const NOTIFICATION_TYPES = {
  PUSH: 'push',
  SMS: 'sms',
  WHATSAPP: 'whatsapp'
};