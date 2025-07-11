const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    // Verifică dacă toate variabilele de mediu sunt setate
    if (!this.accountSid || !this.authToken || !this.phoneNumber) {
      throw new Error('Variabilele de mediu Twilio nu sunt complete');
    }

    this.client = twilio(this.accountSid, this.authToken);
  }

  // Trimite SMS
  async sendSMS(to, message) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: to
      });

      console.log(`SMS trimis cu succes. SID: ${result.sid}, Status: ${result.status}`);
      
      return {
        success: true,
        sid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Eroare Twilio:', error);
      
      // Returnează erori mai prietenoase pentru utilizator
      let userMessage = 'Eroare la trimiterea SMS-ului';
      
      if (error.code === 21211) {
        userMessage = 'Numărul de telefon este invalid';
      } else if (error.code === 21408) {
        userMessage = 'Nu aveți permisiunea să trimiteți SMS la acest număr';
      } else if (error.code === 21614) {
        userMessage = 'Numărul de telefon nu este valid pentru SMS';
      } else if (error.status === 400) {
        userMessage = 'Datele trimise sunt invalide';
      } else if (error.status === 401) {
        userMessage = 'Eroare de autentificare Twilio';
      }

      throw new Error(userMessage);
    }
  }

  // Verifică statusul unui mesaj
  async getMessageStatus(messageSid) {
    try {
      const message = await this.client.messages(messageSid).fetch();
      return {
        success: true,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage
      };
    } catch (error) {
      console.error('Eroare la verificarea statusului mesajului:', error);
      throw new Error('Nu s-a putut verifica statusul mesajului');
    }
  }

  // Verifică balanța contului
  async getAccountBalance() {
    try {
      const account = await this.client.api.accounts(this.accountSid).fetch();
      return {
        success: true,
        balance: account.balance,
        currency: account.currency
      };
    } catch (error) {
      console.error('Eroare la verificarea balanței:', error);
      throw new Error('Nu s-a putut verifica balanța contului');
    }
  }

  // Validează numărul de telefon
  async validatePhoneNumber(phoneNumber) {
    try {
      const lookup = await this.client.lookups.v1.phoneNumbers(phoneNumber).fetch();
      return {
        success: true,
        valid: true,
        formatted: lookup.phoneNumber,
        countryCode: lookup.countryCode,
        carrier: lookup.carrier
      };
    } catch (error) {
      if (error.status === 404) {
        return {
          success: true,
          valid: false,
          error: 'Numărul de telefon nu este valid'
        };
      }
      
      console.error('Eroare la validarea numărului:', error);
      throw new Error('Nu s-a putut valida numărul de telefon');
    }
  }
}

module.exports = TwilioService;