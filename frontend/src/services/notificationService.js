import { CONFIG } from '../config/constants';

class NotificationService {
  constructor() {
    this.pushPermission = null;
    this.checkPushPermission();
  }

  // Verifică permisiunea pentru notificări push
  checkPushPermission() {
    if ('Notification' in window) {
      this.pushPermission = Notification.permission;
    }
  }

  // Solicită permisiunea pentru notificări push
  async requestPushPermission() {
    if (!('Notification' in window)) {
      throw new Error('Browserul nu suportă notificări push');
    }

    const permission = await Notification.requestPermission();
    this.pushPermission = permission;
    
    if (permission !== 'granted') {
      throw new Error('Permisiunea pentru notificări a fost refuzată');
    }

    return permission;
  }

  // Trimite notificare push
  sendPushNotification(title, options = {}) {
    if (this.pushPermission !== 'granted') {
      console.warn('Nu există permisiune pentru notificări push');
      return;
    }

    const defaultOptions = {
      icon: '/wind-icon.png',
      badge: '/wind-badge.png',
      tag: 'wind-alert',
      requireInteraction: true,
      ...options
    };

    try {
      return new Notification(title, defaultOptions);
    } catch (error) {
      console.error('Eroare la trimiterea notificării push:', error);
    }
  }

  // Trimite notificare SMS prin backend
  async sendSMSNotification(phoneNumber, message) {
    if (!phoneNumber || !message) {
      throw new Error('Numărul de telefon și mesajul sunt obligatorii');
    }

    // Validează formatul numărului de telefon
    if (!this.validatePhoneNumber(phoneNumber)) {
      throw new Error('Formatul numărului de telefon este invalid');
    }

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Eroare necunoscută la trimiterea SMS-ului');
      }

      return result;
    } catch (error) {
      console.error('Eroare la trimiterea SMS-ului:', error);
      throw error;
    }
  }

  // Validează formatul numărului de telefon internațional
  validatePhoneNumber(phoneNumber) {
    // Format internațional: +[cod țară][număr] (minim 7, maxim 15 cifre după +)
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  // Testează conectivitatea cu backend-ul
  async testBackendConnection() {
    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend-ul nu este disponibil:', error);
      return false;
    }
  }
}

export default new NotificationService();