import { CONFIG } from '../config/constants';

class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Generează date mock pentru testare
  generateMockForecast() {
    const list = [];
    const now = new Date();
    
    for (let i = 0; i < 40; i++) { // 5 zile * 8 prognoze pe zi
      const forecastTime = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
      const isStormHour = i === 2 || i === 3; // Simulează furtună în următoarele 6-9 ore
      
      list.push({
        dt: Math.floor(forecastTime.getTime() / 1000),
        dt_txt: forecastTime.toISOString().replace('T', ' ').substring(0, 19),
        main: {
          temp: 15 + Math.random() * 10,
          humidity: 60 + Math.random() * 30
        },
        weather: [{
          main: isStormHour ? 'Rain' : 'Clear',
          description: isStormHour ? 'heavy rain' : 'clear sky',
          icon: isStormHour ? '10d' : '01d'
        }],
        wind: {
          speed: isStormHour ? 18 + Math.random() * 7 : 2 + Math.random() * 8, // m/s
          gust: isStormHour ? 22 + Math.random() * 8 : 3 + Math.random() * 10,
          deg: Math.floor(Math.random() * 360)
        }
      });
    }
    
    return {
      cod: '200',
      message: 0,
      cnt: list.length,
      list,
      city: {
        id: 683506,
        name: 'Bucharest',
        coord: { lat: 44.4268, lon: 26.1025 },
        country: 'RO'
      }
    };
  }

  // Preia prognoza meteo
  async getForecast() {
    if (CONFIG.MOCK_API) {
      // Simulează delay de rețea
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.generateMockForecast();
    }

    if (!CONFIG.API_KEY) {
      throw new Error('API key OpenWeatherMap lipsește. Setați REACT_APP_OPENWEATHER_API_KEY în .env');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?q=${CONFIG.CITY}&appid=${CONFIG.API_KEY}&units=metric&lang=ro`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Eroare la preluarea datelor meteo:', error);
      throw error;
    }
  }

  // Preia vremea curentă
  async getCurrentWeather() {
    if (CONFIG.MOCK_API) {
      const forecast = await this.getForecast();
      return {
        ...forecast.list[0],
        name: forecast.city.name
      };
    }

    if (!CONFIG.API_KEY) {
      throw new Error('API key OpenWeatherMap lipsește');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${CONFIG.CITY}&appid=${CONFIG.API_KEY}&units=metric&lang=ro`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Eroare la preluarea vremii curente:', error);
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