import { useState, useEffect, useCallback } from 'react';
import weatherService from '../services/weatherService';
import { CONFIG } from '../config/constants';

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Preia prognoza și vremea curentă în paralel
      const [forecastData, currentData] = await Promise.all([
        weatherService.getForecast(),
        weatherService.getCurrentWeather()
      ]);

      setWeatherData(forecastData);
      setCurrentWeather(currentData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Eroare la preluarea datelor meteo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Preia datele la prima încărcare
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Actualizează datele la interval regulat
  useEffect(() => {
    const interval = setInterval(fetchWeatherData, CONFIG.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchWeatherData]);

  // Funcție pentru actualizare manuală
  const refreshData = useCallback(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return {
    weatherData,
    currentWeather,
    loading,
    error,
    lastUpdated,
    refreshData
  };
};