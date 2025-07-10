import React, { useState, useEffect, useCallback } from 'react';

// --- Componente UI ---

// Componenta pentru afișarea datelor despre vânt (condiții curente)
const WindInfo = ({ data, alertLevel }) => {
    if (!data) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
                <p className="text-gray-400">Se încarcă datele meteo...</p>
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

    return (
        <div className={`bg-gray-800 p-6 rounded-lg border-4 ${currentAlertColor}`}>
            <h2 className="text-2xl font-bold text-white mb-4">Condiții Curente în București</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-gray-400 text-sm">Viteză</p>
                    <p className="text-white text-3xl font-semibold">{Math.round(data.wind.speed * 3.6)} <span className="text-lg">km/h</span></p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Rafale</p>
                    <p className="text-white text-3xl font-semibold">{data.wind.gust ? `${Math.round(data.wind.gust * 3.6)} km/h` : 'N/A'}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Direcție</p>
                    <p className="text-white text-3xl font-semibold">{data.wind.deg}°</p>
                </div>
            </div>
        </div>
    );
};

// Componenta pentru afișarea alertelor (bazate pe prognoză)
const AlertDisplay = ({ alertLevel }) => {
    if (!alertLevel.isForecast) return null;

    const alertDetails = {
        yellow: {
            title: 'AVERTISMENT PROGNOZĂ: Atenție Sporită',
            recommendations: [
                'Asigurați obiectele exterioare (mobilier de grădină, ghivece).',
                'Planificați-vă rutele cu prudență, în special pentru vehiculele înalte.',
                'Luați în considerare amânarea activităților în aer liber.',
            ],
            color: 'bg-yellow-500/10 text-yellow-300',
        },
        red: {
            title: 'AVERTISMENT PROGNOZĂ: Pericol Major',
            recommendations: [
                'Rămâneți în interior pe cât posibil în timpul prognozat.',
                'Evitați parcurile și zonele cu copaci bătrâni.',
                'Nu parcați mașinile sub copaci sau panouri publicitare.',
                'Pregătiți-vă pentru posibile întreruperi de curent.',
            ],
            color: 'bg-red-500/10 text-red-300',
        },
    };

    const details = alertDetails[alertLevel.level];
    if (!details) return null;

    return (
        <div className={`p-6 rounded-lg mt-6 ${details.color}`}>
            <h3 className="text-xl font-bold mb-3">{details.title}</h3>
            <p className="mb-4">{alertLevel.message}</p>
            <ul className="list-disc list-inside space-y-1">
                {details.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
        </div>
    );
};

// Componenta pentru configurarea notificărilor
const NotificationSettings = ({ onThresholdChange, threshold, onPushToggle, pushEnabled }) => (
    <div className="bg-gray-800 p-6 rounded-lg mt-6">
        <h3 className="text-xl font-bold text-white mb-4">Setări Notificări</h3>
        <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="w-full sm:w-auto mb-4 sm:mb-0">
                <label htmlFor="threshold" className="block text-gray-400 mb-2">Prag alertă (km/h): <span className="font-bold text-white">{threshold}</span></label>
                <input
                    id="threshold"
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={threshold}
                    onChange={onThresholdChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <button
                onClick={onPushToggle}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${pushEnabled ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
                {pushEnabled ? 'Oprește Notificări Push' : 'Activează Notificări Push'}
            </button>
        </div>
    </div>
);

// Componenta pentru configurarea notificărilor prin telefon
const TwilioSettings = ({ onPhoneChange, phoneNumber, onSubscribeToggle, isSubscribed }) => (
    <div className="bg-gray-800 p-6 rounded-lg mt-6">
        <h3 className="text-xl font-bold text-white mb-4">Notificări prin SMS / WhatsApp (Twilio)</h3>
        <p className="text-gray-400 mb-4 text-sm">Introduceți numărul de telefon în format internațional (ex: +40712345678) pentru a primi alerte.</p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <input
                type="tel"
                placeholder="Ex: +40712345678"
                value={phoneNumber}
                onChange={onPhoneChange}
                className="w-full sm:w-1/2 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
                onClick={onSubscribeToggle}
                disabled={!phoneNumber.match(/^\+[1-9]\d{1,14}$/)}
                className={`w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed ${isSubscribed ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
                {isSubscribed ? 'Dezabonare SMS' : 'Abonare SMS'}
            </button>
        </div>
         {isSubscribed && (
            <p className="text-green-400 mt-3 text-sm">Abonat pentru alerte la numărul {phoneNumber}.</p>
        )}
    </div>
);


// --- Aplicația Principală ---

export default function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [alertLevel, setAlertLevel] = useState({ level: 'none', message: '', isForecast: false });
    const [notificationThreshold, setNotificationThreshold] = useState(50);
    const [pushEnabled, setPushEnabled] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [lastNotifiedStormTime, setLastNotifiedStormTime] = useState(null);

    // Funcție pentru a trimite notificări prin backend
    const sendTwilioNotification = useCallback(async (phone, message) => {
        // Preluăm URL-ul backend-ului din variabilele de mediu
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

        try {
            const response = await fetch(`${backendUrl}/api/send-sms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to: phone, message: message }),
            });

            const result = await response.json();

            if (result.success) {
                console.log('Notificare Twilio trimisă cu succes prin backend.');
            } else {
                console.error('Eroare la trimiterea notificării Twilio:', result.error);
            }
        } catch (error) {
            console.error('Eroare de rețea la comunicarea cu backend-ul:', error);
        }
    }, []);

    // Funcție pentru a prelua datele de prognoză
    const fetchWeatherData = useCallback(async () => {
        const API_KEY = 'your_api_key_here'; // <-- ÎNLOCUIȚI CU CHEIA DVS.
        const MOCK_API = true; 

        if (MOCK_API || API_KEY === 'your_api_key_here') {
            const generateMockForecast = () => {
                const list = [];
                const now = new Date();
                for (let i = 0; i < 10; i++) {
                    const forecastTime = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
                    const isStormHour = i === 2 || i === 3;
                    list.push({
                        dt_txt: forecastTime.toISOString(),
                        wind: {
                            speed: isStormHour ? 20 : (Math.random() * 10),
                            gust: isStormHour ? 25 : (Math.random() * 12),
                            deg: Math.floor(Math.random() * 360),
                        },
                    });
                }
                return { list };
            };
            setWeatherData(generateMockForecast());
            return;
        }

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Bucharest&appid=${API_KEY}&units=metric`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    }, []);

    // Hook pentru a prelua datele la intervale regulate
    useEffect(() => {
        fetchWeatherData();
        const interval = setInterval(fetchWeatherData, 1800000); // Actualizează la 30 minute
        return () => clearInterval(interval);
    }, [fetchWeatherData]);

    // Hook pentru a verifica prognoza și a seta alerte
    useEffect(() => {
        if (!weatherData || !weatherData.list || weatherData.list.length === 0) return;

        const now = new Date().getTime();
        const eightHoursInMillis = 8 * 60 * 60 * 1000;
        let stormWarning = null;

        for (const forecast of weatherData.list) {
            const forecastTime = new Date(forecast.dt_txt).getTime();
            
            if (forecastTime > now && forecastTime <= now + eightHoursInMillis) {
                const windSpeedKmh = Math.round(forecast.wind.speed * 3.6);
                
                if (windSpeedKmh >= notificationThreshold) {
                    stormWarning = {
                        time: forecast.dt_txt,
                        speed: windSpeedKmh,
                    };
                    break; 
                }
            }
        }

        if (stormWarning) {
            const stormDate = new Date(stormWarning.time);
            const alertMessage = `AVERTISMENT: Se prognozează vânt cu viteza de ${stormWarning.speed} km/h pe data de ${stormDate.toLocaleDateString('ro-RO')} în jurul orei ${stormDate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}.`;
            
            const alertType = stormWarning.speed >= 70 ? 'red' : 'yellow';
            
            setAlertLevel({ level: alertType, message: alertMessage, isForecast: true });

            if (lastNotifiedStormTime !== stormWarning.time) {
                if (pushEnabled) {
                    new Notification('Avertisment Furtună Prognozată', { body: alertMessage, icon: '/wind-icon.png' });
                }
                if (isSubscribed && phoneNumber) {
                    sendTwilioNotification(phoneNumber, alertMessage);
                }
                setLastNotifiedStormTime(stormWarning.time);
            }
        } else {
            setAlertLevel({ level: 'green', message: '', isForecast: false });
            setLastNotifiedStormTime(null);
        }
    }, [weatherData, notificationThreshold, pushEnabled, isSubscribed, phoneNumber, sendTwilioNotification, lastNotifiedStormTime]);

    const handleThresholdChange = (e) => {
        setNotificationThreshold(e.target.value);
    };
    
    const handlePhoneChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleSubscribeToggle = () => {
        setIsSubscribed(!isSubscribed);
        if (!isSubscribed) {
            sendTwilioNotification(phoneNumber, "Ați fost abonat cu succes la alertele de vânt.");
        } else {
            console.log(`Utilizatorul ${phoneNumber} s-a dezabonat.`);
        }
    };

    const handlePushToggle = () => {
        if (!pushEnabled) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    setPushEnabled(true);
                    new Notification('Notificări Activat!', { body: 'Vei primi avertismente de vânt prognozate.' });
                }
            });
        } else {
            setPushEnabled(false);
        }
    };
    
    const currentConditions = weatherData?.list?.[0];

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                            Monitor Vânt
                        </span>
                    </h1>
                    <p className="text-gray-400 mt-2">Avertismente de furtună cu 8 ore în avans pentru București</p>
                </header>

                <main>
                    <WindInfo data={currentConditions} alertLevel={alertLevel} />
                    <AlertDisplay alertLevel={alertLevel} />
                    <NotificationSettings 
                        onThresholdChange={handleThresholdChange}
                        threshold={notificationThreshold}
                        onPushToggle={handlePushToggle}
                        pushEnabled={pushEnabled}
                    />
                    <TwilioSettings
                        phoneNumber={phoneNumber}
                        onPhoneChange={handlePhoneChange}
                        isSubscribed={isSubscribed}
                        onSubscribeToggle={handleSubscribeToggle}
                    />
                </main>

                <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Datele meteo sunt simulate. Pentru date reale, adăugați o cheie API OpenWeatherMap.</p>
                    <p>&copy; {new Date().getFullYear()} Aplicație Alertă Vânt. Toate drepturile rezervate.</p>
                </footer>
            </div>
        </div>
    );
}

