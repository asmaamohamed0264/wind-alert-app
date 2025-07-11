import React, { useEffect } from 'react';
import { useWeatherData } from './hooks/useWeatherData';
import { useNotifications } from './hooks/useNotifications';
import alertService from './services/alertService';
import WindInfo from './components/WindInfo';
import AlertDisplay from './components/AlertDisplay';
import NotificationSettings from './components/NotificationSettings';
import TwilioSettings from './components/TwilioSettings';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { CONFIG } from './config/constants';

export default function App() {
  // Custom hooks pentru gestionarea stării
  const { 
    weatherData, 
    currentWeather, 
    loading, 
    error, 
    lastUpdated, 
    refreshData 
  } = useWeatherData();

  const {
    pushEnabled,
    phoneNumber,
    isSubscribed,
    backendConnected,
    togglePushNotifications,
    sendPushNotification,
    updatePhoneNumber,
    toggleSMSSubscription,
    sendSMSNotification
  } = useNotifications();

  // State local pentru setări
  const [notificationThreshold, setNotificationThreshold] = React.useState(CONFIG.DEFAULT_THRESHOLD);
  const [alertLevel, setAlertLevel] = React.useState({ 
    level: 'none', 
    message: '', 
    isForecast: false 
  });

  // Analizează prognoza și setează alertele
  useEffect(() => {
    if (!weatherData) return;

    const analysis = alertService.analyzeWeatherForecast(weatherData, notificationThreshold);
    setAlertLevel(analysis);

    // Trimite notificări dacă este necesar
    if (analysis.isForecast && analysis.stormData && alertService.shouldNotify(analysis.stormData)) {
      const notificationMessage = alertService.generateNotificationMessage(analysis);
      
      // Notificare push
      if (pushEnabled) {
        const title = analysis.level === 'red' ? 
          '🚨 ALERTĂ VÂNT PERICULOS' : 
          '⚠️ AVERTISMENT VÂNT PUTERNIC';
        
        sendPushNotification(title, notificationMessage);
      }

      // Notificare SMS
      if (isSubscribed && phoneNumber) {
        sendSMSNotification(notificationMessage);
      }
    }
  }, [weatherData, notificationThreshold, pushEnabled, isSubscribed, phoneNumber, sendPushNotification, sendSMSNotification]);

  // Handlers pentru evenimente
  const handleThresholdChange = (e) => {
    setNotificationThreshold(parseInt(e.target.value));
  };

  const handlePhoneChange = (e) => {
    updatePhoneNumber(e.target.value);
  };

  // Render loading state
  if (loading && !weatherData) {
    return (
      <div className="bg-gray-900 text-white min-h-screen font-sans">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                Monitor Vânt
              </span>
            </h1>
            <p className="text-gray-400 mt-2">Avertismente de furtună cu 8 ore în avans pentru București</p>
          </header>
          <LoadingSpinner size="large" message="Se încarcă datele meteorologice..." />
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !weatherData) {
    return (
      <div className="bg-gray-900 text-white min-h-screen font-sans">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                Monitor Vânt
              </span>
            </h1>
            <p className="text-gray-400 mt-2">Avertismente de furtună cu 8 ore în avans pentru București</p>
          </header>
          <ErrorDisplay error={error} onRetry={refreshData} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              Monitor Vânt
            </span>
          </h1>
          <p className="text-gray-400 mt-2">
            Avertismente de furtună cu 8 ore în avans pentru București
          </p>
          {lastUpdated && (
            <p className="text-gray-500 text-sm mt-1">
              Ultima actualizare: {lastUpdated.toLocaleTimeString('ro-RO')}
            </p>
          )}
        </header>

        <main className="space-y-6">
          {/* Informații despre vânt */}
          <WindInfo data={currentWeather} alertLevel={alertLevel} />

          {/* Afișare alertă */}
          <AlertDisplay alertLevel={alertLevel} />

          {/* Setări notificări push */}
          <NotificationSettings 
            onThresholdChange={handleThresholdChange}
            threshold={notificationThreshold}
            onPushToggle={togglePushNotifications}
            pushEnabled={pushEnabled}
          />

          {/* Setări notificări SMS */}
          <TwilioSettings
            phoneNumber={phoneNumber}
            onPhoneChange={handlePhoneChange}
            isSubscribed={isSubscribed}
            onSubscribeToggle={toggleSMSSubscription}
            backendConnected={backendConnected}
          />

          {/* Buton refresh manual */}
          <div className="text-center">
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Se actualizează...' : 'Actualizează datele'}
            </button>
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm space-y-2">
          <p>
            {CONFIG.MOCK_API ? 
              'Datele meteo sunt simulate pentru demonstrație.' : 
              'Datele meteo sunt furnizate de OpenWeatherMap.'
            }
          </p>
          <p>&copy; {new Date().getFullYear()} Aplicație Alertă Vânt. Toate drepturile rezervate.</p>
        </footer>
      </div>
    </div>
  );
}