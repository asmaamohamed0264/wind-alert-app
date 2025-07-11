import React from 'react';

const NotificationSettings = ({ 
  onThresholdChange, 
  threshold, 
  onPushToggle, 
  pushEnabled 
}) => {
  const getThresholdColor = (value) => {
    if (value >= 70) return 'text-red-400';
    if (value >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getThresholdDescription = (value) => {
    if (value >= 70) return 'Pericol major - vânt foarte puternic';
    if (value >= 50) return 'Atenție sporită - vânt puternic';
    return 'Avertisment preventiv - vânt moderat';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="mr-2">🔔</span>
        Setări Notificări Push
      </h3>
      
      <div className="space-y-6">
        {/* Setare prag */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="threshold" className="text-gray-300 font-medium">
              Prag alertă vânt
            </label>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getThresholdColor(threshold)}`}>
                {threshold} km/h
              </div>
              <div className={`text-xs ${getThresholdColor(threshold)}`}>
                {getThresholdDescription(threshold)}
              </div>
            </div>
          </div>
          
          <input
            id="threshold"
            type="range"
            min="20"
            max="100"
            step="5"
            value={threshold}
            onChange={onThresholdChange}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                #10b981 0%, 
                #10b981 ${((threshold - 20) / 80) * 40}%, 
                #f59e0b ${((threshold - 20) / 80) * 40}%, 
                #f59e0b ${((threshold - 20) / 80) * 70}%, 
                #ef4444 ${((threshold - 20) / 80) * 70}%, 
                #ef4444 100%)`
            }}
          />
          
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>20 km/h</span>
            <span>60 km/h</span>
            <span>100 km/h</span>
          </div>
        </div>

        {/* Buton activare notificări */}
        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div>
            <div className="text-white font-medium">Notificări în browser</div>
            <div className="text-gray-400 text-sm">
              Primiți alerte direct în browser când se prognozează vânt puternic
            </div>
          </div>
          
          <button
            onClick={onPushToggle}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              pushEnabled 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25' 
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
            }`}
          >
            {pushEnabled ? (
              <span className="flex items-center">
                <span className="mr-2">🔕</span>
                Oprește
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">🔔</span>
                Activează
              </span>
            )}
          </button>
        </div>

        {pushEnabled && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center text-green-400 text-sm">
              <span className="mr-2">✅</span>
              Notificările push sunt active. Veți fi alertat când viteza vântului depășește {threshold} km/h.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;