import React, { useState } from 'react';

const TwilioSettings = ({ 
  onPhoneChange, 
  phoneNumber, 
  onSubscribeToggle, 
  isSubscribed,
  backendConnected 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribeClick = async () => {
    setIsLoading(true);
    try {
      await onSubscribeToggle();
    } finally {
      setIsLoading(false);
    }
  };

  const isValidPhone = phoneNumber.match(/^\+[1-9]\d{6,14}$/);
  
  const getPhoneValidationMessage = () => {
    if (!phoneNumber) return '';
    if (!isValidPhone) {
      return 'Format invalid. Folosiți formatul internațional (ex: +40712345678)';
    }
    return 'Format valid ✓';
  };

  const validationMessage = getPhoneValidationMessage();

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="mr-2">📱</span>
        Notificări prin SMS / WhatsApp
      </h3>
      
      {!backendConnected && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center text-red-400 text-sm">
            <span className="mr-2">⚠️</span>
            Backend-ul nu este disponibil. Notificările SMS nu funcționează momentan.
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-gray-300 font-medium mb-2">
            Număr de telefon
          </label>
          <p className="text-gray-400 mb-3 text-sm">
            Introduceți numărul în format internațional pentru a primi alerte SMS sau WhatsApp.
          </p>
          
          <div className="relative">
            <input
              id="phone"
              type="tel"
              placeholder="Ex: +40712345678"
              value={phoneNumber}
              onChange={onPhoneChange}
              disabled={isLoading}
              className={`w-full bg-gray-700 border text-white rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-colors ${
                validationMessage.includes('valid') 
                  ? 'border-green-500 focus:ring-green-500' 
                  : validationMessage && phoneNumber 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-blue-500'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            
            {phoneNumber && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidPhone ? (
                  <span className="text-green-400">✓</span>
                ) : (
                  <span className="text-red-400">✗</span>
                )}
              </div>
            )}
          </div>
          
          {validationMessage && (
            <p className={`mt-2 text-sm ${
              validationMessage.includes('valid') ? 'text-green-400' : 'text-red-400'
            }`}>
              {validationMessage}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div>
            <div className="text-white font-medium">
              {isSubscribed ? 'Abonat pentru alerte' : 'Abonare alerte SMS'}
            </div>
            <div className="text-gray-400 text-sm">
              {isSubscribed 
                ? `Primiți alerte la numărul ${phoneNumber}`
                : 'Primiți notificări prin SMS când se prognozează vânt puternic'
              }
            </div>
          </div>
          
          <button
            onClick={handleSubscribeClick}
            disabled={!isValidPhone || isLoading || !backendConnected}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubscribed 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Se procesează...
              </span>
            ) : isSubscribed ? (
              <span className="flex items-center">
                <span className="mr-2">📱</span>
                Dezabonare
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">📱</span>
                Abonare SMS
              </span>
            )}
          </button>
        </div>

        {isSubscribed && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center text-blue-400 text-sm">
              <span className="mr-2">✅</span>
              Sunteți abonat pentru alerte SMS la numărul {phoneNumber}.
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Serviciul folosește Twilio pentru trimiterea mesajelor</p>
          <p>• Pot fi aplicate tarife standard pentru SMS</p>
          <p>• Pentru WhatsApp, numărul trebuie să fie verificat în Twilio</p>
        </div>
      </div>
    </div>
  );
};

export default TwilioSettings;