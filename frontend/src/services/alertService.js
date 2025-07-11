import { CONFIG, ALERT_LEVELS } from '../config/constants';
import weatherService from './weatherService';

class AlertService {
  constructor() {
    this.lastNotifiedStormTime = null;
  }

  // Analizează prognoza și determină nivelul de alertă
  analyzeWeatherForecast(forecastData, threshold) {
    if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
      return {
        level: ALERT_LEVELS.NONE,
        message: '',
        isForecast: false,
        stormData: null
      };
    }

    const now = new Date().getTime();
    const forecastWindow = CONFIG.FORECAST_HOURS_AHEAD * 60 * 60 * 1000;
    let stormWarning = null;

    // Caută prima prognoză cu vânt puternic în următoarele 8 ore
    for (const forecast of forecastData.list) {
      const forecastTime = new Date(forecast.dt_txt).getTime();
      
      if (forecastTime > now && forecastTime <= now + forecastWindow) {
        const windSpeedKmh = weatherService.constructor.convertWindSpeed(forecast.wind.speed);
        const gustSpeedKmh = forecast.wind.gust ? 
          weatherService.constructor.convertWindSpeed(forecast.wind.gust) : windSpeedKmh;
        
        // Verifică dacă viteza vântului sau rafalele depășesc pragul
        if (windSpeedKmh >= threshold || gustSpeedKmh >= threshold) {
          stormWarning = {
            time: forecast.dt_txt,
            windSpeed: windSpeedKmh,
            gustSpeed: gustSpeedKmh,
            direction: forecast.wind.deg,
            weather: forecast.weather[0]
          };
          break;
        }
      }
    }

    if (!stormWarning) {
      return {
        level: ALERT_LEVELS.GREEN,
        message: 'Nu se prognozează vânt puternic în următoarele 8 ore.',
        isForecast: false,
        stormData: null
      };
    }

    // Determină nivelul de alertă bazat pe viteza vântului
    const maxSpeed = Math.max(stormWarning.windSpeed, stormWarning.gustSpeed);
    const alertLevel = maxSpeed >= CONFIG.ALERT_THRESHOLDS.RED ? 
      ALERT_LEVELS.RED : ALERT_LEVELS.YELLOW;

    const stormDate = new Date(stormWarning.time);
    const timeString = stormDate.toLocaleTimeString('ro-RO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const dateString = stormDate.toLocaleDateString('ro-RO');

    let message = `AVERTISMENT: Se prognozează vânt cu viteza de ${stormWarning.windSpeed} km/h`;
    
    if (stormWarning.gustSpeed > stormWarning.windSpeed) {
      message += ` (rafale până la ${stormWarning.gustSpeed} km/h)`;
    }
    
    message += ` pe data de ${dateString} în jurul orei ${timeString}.`;

    return {
      level: alertLevel,
      message,
      isForecast: true,
      stormData: stormWarning
    };
  }

  // Verifică dacă trebuie trimisă o nouă notificare
  shouldNotify(stormData) {
    if (!stormData) return false;
    
    // Evită notificările duplicate pentru aceeași furtună
    if (this.lastNotifiedStormTime === stormData.time) {
      return false;
    }

    this.lastNotifiedStormTime = stormData.time;
    return true;
  }

  // Generează mesajul pentru notificare
  generateNotificationMessage(alertData) {
    if (!alertData.stormData) return alertData.message;

    const { stormData } = alertData;
    const stormDate = new Date(stormData.time);
    const timeString = stormDate.toLocaleTimeString('ro-RO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    let message = `🌪️ ALERTĂ VÂNT PUTERNIC\n\n`;
    message += `Viteză: ${stormData.windSpeed} km/h\n`;
    
    if (stormData.gustSpeed > stormData.windSpeed) {
      message += `Rafale: ${stormData.gustSpeed} km/h\n`;
    }
    
    message += `Ora: ${timeString}\n`;
    message += `Direcție: ${weatherService.constructor.getWindDirection(stormData.direction)}\n\n`;
    
    if (alertData.level === ALERT_LEVELS.RED) {
      message += `⚠️ PERICOL MAJOR - Rămâneți în interior!`;
    } else {
      message += `⚠️ ATENȚIE SPORITĂ - Luați măsuri de precauție!`;
    }

    return message;
  }

  // Resetează starea notificărilor
  resetNotificationState() {
    this.lastNotifiedStormTime = null;
  }
}

export default new AlertService();