import { CONFIG } from '../config/constants';

class WeatherService {
  constructor() {
    // Adresa URL a backend-ului va fi preluată din variabilele de mediu
    // sau dintr-un fișier de configurare local.
    this.backendUrl = process.env.REACT_APP_BACKEND_URL;
  }

  // Preia prognoza meteo de la backend
  async getForecast(lat, lon) {
    if (!this.backendUrl) {
      throw new Error('Adresa backend-ului nu este configurată. Setați REACT_APP_BACKEND_URL.');
    }

    try {
      const response = await fetch(
        `${this.backendUrl}/api/forecast?lat=${lat}&lon=${lon}`
      );

      if (!response.ok) {
        throw new Error(`Eroare de rețea! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Eroare la preluarea prognozei meteo de la backend:', error);
      throw error;
    }
  }

  // Preia vremea curentă de la backend
  async getCurrentWeather(lat, lon) {
    if (!this.backendUrl) {
      throw new Error('Adresa backend-ului nu este configurată. Setați REACT_APP_BACKEND_URL.');
    }
    
    try {
      const response = await fetch(
        `${this.backendUrl}/api/weather?lat=${lat}&lon=${lon}`
      );

      if (!response.ok) {
        throw new Error(`Eroare de rețea! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Eroare la preluarea vremii curente de la backend:', error);
      throw error;
    }
  }

  // Convertește viteza vântului din m/s în km/h
  static convertWindSpeed(speedMs) {
    return Math.round(speedMs * 3.6);
  }

  // Determină direcția vântului în text
  static getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }
}

export default new WeatherService();
