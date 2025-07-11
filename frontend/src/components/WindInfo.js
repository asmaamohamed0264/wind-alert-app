import React from 'react';
import weatherService from '../services/weatherService';

const WindInfo = ({ data, alertLevel }) => {
  if (!data) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        </div>
        <p className="text-gray-400 mt-4">Se încarcă datele meteo...</p>
      </div>
    );
  }

  const alertColors = {
    none: 'border-gray-700',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    red: 'border-red-500',
  };

  const currentAlertColor = alertLevel.isForecast ? 'border-gray-700' : alertColors[alertLevel.level];
  const windSpeed = weatherService.constructor.convertWindSpeed(data.wind.speed);
  const gustSpeed = data.wind.gust ? weatherService.constructor.convertWindSpeed(data.wind.gust) : null;
  const windDirection = weatherService.constructor.getWindDirection(data.wind.deg);

  return (
    <div className={`bg-gray-800 p-6 rounded-lg border-4 ${currentAlertColor} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Condiții Curente în București</h2>
        {data.weather && data.weather[0] && (
          <div className="flex items-center text-gray-300">
            <span className="text-sm">{data.weather[0].description}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm mb-1">Viteză Vânt</p>
          <p className="text-white text-3xl font-semibold">
            {windSpeed} 
            <span className="text-lg ml-1">km/h</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {windDirection} ({data.wind.deg}°)
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm mb-1">Rafale</p>
          <p className="text-white text-3xl font-semibold">
            {gustSpeed ? `${gustSpeed} km/h` : 'N/A'}
          </p>
          {gustSpeed && (
            <p className="text-gray-400 text-xs mt-1">
              +{gustSpeed - windSpeed} km/h
            </p>
          )}
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm mb-1">Temperatură</p>
          <p className="text-white text-3xl font-semibold">
            {data.main ? `${Math.round(data.main.temp)}°C` : 'N/A'}
          </p>
          {data.main && (
            <p className="text-gray-400 text-xs mt-1">
              Simțită {Math.round(data.main.feels_like)}°C
            </p>
          )}
        </div>
      </div>

      {data.main && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-gray-400">Umiditate:</span> {data.main.humidity}%
            </div>
            <div>
              <span className="text-gray-400">Presiune:</span> {data.main.pressure} hPa
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WindInfo;