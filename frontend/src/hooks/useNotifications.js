import { useState, useCallback } from 'react';
import notificationService from '../services/notificationService';

export const useNotifications = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);

  // Activează/dezactivează notificările push
  const togglePushNotifications = useCallback(async () => {
    try {
      if (!pushEnabled) {
        await notificationService.requestPushPermission();
        setPushEnabled(true);
        
        notificationService.sendPushNotification(
          'Notificări Activate!', 
          { body: 'Veți primi avertismente de vânt prognozate.' }
        );
      } else {
        setPushEnabled(false);
      }
    } catch (error) {
      console.error('Eroare la activarea notificărilor push:', error);
      alert('Nu s-au putut activa notificările push: ' + error.message);
    }
  }, [pushEnabled]);

  // Trimite notificare push
  const sendPushNotification = useCallback((title, message) => {
    if (pushEnabled) {
      notificationService.sendPushNotification(title, { body: message });
    }
  }, [pushEnabled]);

  // Actualizează numărul de telefon
  const updatePhoneNumber = useCallback((phone) => {
    setPhoneNumber(phone);
    // Dezabonează automat dacă numărul se schimbă
    if (isSubscribed && phone !== phoneNumber) {
      setIsSubscribed(false);
    }
  }, [phoneNumber, isSubscribed]);

  // Abonează/dezabonează pentru SMS
  const toggleSMSSubscription = useCallback(async () => {
    try {
      if (!phoneNumber) {
        throw new Error('Introduceți un număr de telefon valid');
      }

      if (!notificationService.validatePhoneNumber(phoneNumber)) {
        throw new Error('Formatul numărului de telefon este invalid');
      }

      if (!isSubscribed) {
        // Testează conectivitatea cu backend-ul
        const isConnected = await notificationService.testBackendConnection();
        setBackendConnected(isConnected);

        if (!isConnected) {
          throw new Error('Backend-ul nu este disponibil. Încercați mai târziu.');
        }

        await notificationService.sendSMSNotification(
          phoneNumber,
          '🌪️ Ați fost abonat cu succes la alertele de vânt pentru București. Veți primi notificări când se prognozează vânt puternic.'
        );
        
        setIsSubscribed(true);
      } else {
        // Pentru dezabonare, doar actualizăm starea local
        setIsSubscribed(false);
        console.log(`Utilizatorul ${phoneNumber} s-a dezabonat de la alerte.`);
      }
    } catch (error) {
      console.error('Eroare la gestionarea abonamentului SMS:', error);
      alert('Eroare: ' + error.message);
    }
  }, [phoneNumber, isSubscribed]);

  // Trimite notificare SMS
  const sendSMSNotification = useCallback(async (message) => {
    if (isSubscribed && phoneNumber) {
      try {
        await notificationService.sendSMSNotification(phoneNumber, message);
      } catch (error) {
        console.error('Eroare la trimiterea SMS-ului:', error);
        // Nu afișăm eroarea utilizatorului pentru a nu-l deranja
      }
    }
  }, [isSubscribed, phoneNumber]);

  return {
    // State
    pushEnabled,
    phoneNumber,
    isSubscribed,
    backendConnected,
    
    // Actions
    togglePushNotifications,
    sendPushNotification,
    updatePhoneNumber,
    toggleSMSSubscription,
    sendSMSNotification
  };
};