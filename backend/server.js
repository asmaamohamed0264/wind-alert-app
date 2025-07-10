// Importuri necesare
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config(); // Pentru a încărca variabilele de mediu din .env

// --- Configurare Variabile de Mediu ---
// Ia datele din variabilele de mediu. Acestea vor fi setate în Coolify.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const port = process.env.PORT || 3001; // Portul pe care va rula serverul

// Verifică dacă toate cheile necesare sunt prezente
if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error("Eroare: Variabilele de mediu Twilio nu sunt setate!");
    process.exit(1); // Oprește aplicația dacă nu sunt setate cheile
}

// Inițializează clientul Twilio
const client = twilio(accountSid, authToken);

// Inițializează aplicația Express
const app = express();

// --- Middleware ---
// Permite cereri de la orice origine (CORS). Pentru producție, poți restricționa la domeniul tău.
app.use(cors()); 
// Permite parsarea body-ului cererilor ca JSON
app.use(express.json());

// --- Rute API ---

// Endpoint pentru a trimite SMS
app.post('/api/send-sms', (req, res) => {
    const { to, message } = req.body;

    // Validare simplă a datelor primite
    if (!to || !message) {
        return res.status(400).json({ success: false, error: 'Numărul de telefon (to) și mesajul (message) sunt obligatorii.' });
    }

    // Trimiterea mesajului folosind Twilio
    client.messages
        .create({
            body: message,
            from: twilioPhoneNumber,
            to: to // Numărul de telefon al destinatarului
        })
        .then(message => {
            console.log(`Mesaj trimis cu succes. SID: ${message.sid}`);
            res.json({ success: true, sid: message.sid });
        })
        .catch(error => {
            console.error('Eroare la trimiterea SMS-ului:', error);
            res.status(500).json({ success: false, error: error.message });
        });
});

// O rută de test pentru a verifica dacă serverul funcționează
app.get('/', (req, res) => {
    res.send('Serverul pentru alerte de vânt funcționează!');
});


// --- Pornirea Serverului ---
app.listen(port, () => {
    console.log(`Serverul ascultă pe portul ${port}`);
});
