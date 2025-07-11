# 🚀 Ghid de Deploy în Coolify

## Pași pentru configurarea aplicației în Coolify

### 1. **Pregătirea Repository-ului**

1. Urcă întregul proiect pe GitHub/GitLab
2. Asigură-te că toate fișierele sunt în repository:
   - `docker-compose.yml`
   - `frontend/Dockerfile`
   - `backend/Dockerfile`
   - Toate fișierele sursă

### 2. **Crearea Resursei în Coolify**

1. **Login în Coolify** și accesează dashboard-ul
2. **Create New Resource** → **Docker Compose**
3. **Deploy from a Git repository**

### 3. **Configurarea Sursei**

- **Repository**: Selectează repository-ul tău
- **Branch**: `main` (sau branch-ul principal)
- **Docker Compose Location**: `/` (rădăcină)
- **Docker Compose Filename**: `docker-compose.yml`

### 4. **Configurarea Variabilelor de Mediu**

În secțiunea **Environment Variables**, adaugă următoarele variabile **ca secrets**:

#### 🔐 **Variabile Obligatorii (Twilio)**
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+15017122661
```

#### 🌤️ **Variabile Opționale**
```
OPENWEATHER_API_KEY=your_openweather_api_key_here
MOCK_API=false
```

#### 🌐 **Variabile de Configurare (Setate automat de Coolify)**
```
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://your-domain.com
```

### 5. **Configurarea Domeniului**

1. **Navighează la serviciul `frontend`**
2. **Settings** → **FQDN**
3. **Adaugă domeniul tău**: `alerta-vant.exemplu.com`
4. Coolify va genera automat certificat SSL

### 6. **Deploy**

1. **Apasă butonul Deploy**
2. **Monitorizează log-urile** pentru a vedea progresul
3. **Așteaptă finalizarea** (poate dura 5-10 minute)

### 7. **Verificarea Funcționării**

După deploy, verifică:

- ✅ **Frontend**: `https://your-domain.com`
- ✅ **Backend Health**: `https://your-domain.com/api/health`
- ✅ **Funcționalitatea SMS**: Testează abonarea

## 🔧 **Troubleshooting**

### Probleme comune și soluții:

#### **1. Backend nu pornește**
- Verifică că toate variabilele Twilio sunt setate corect
- Verifică log-urile serviciului backend în Coolify

#### **2. Frontend nu se conectează la backend**
- Verifică că `BACKEND_URL` este setat corect
- Verifică că ambele servicii rulează

#### **3. SMS-urile nu funcționează**
- Verifică credențialele Twilio
- Verifică că numărul Twilio este activ
- Verifică log-urile pentru erori Twilio

#### **4. Aplicația folosește date simulate**
- Setează `MOCK_API=false`
- Adaugă `OPENWEATHER_API_KEY`

## 📊 **Monitorizare**

Coolify oferă:
- **Log-uri în timp real** pentru ambele servicii
- **Metrici de performanță**
- **Health checks** automate
- **Restart automat** în caz de eroare

## 🔄 **Actualizări**

Pentru a actualiza aplicația:
1. **Push modificările** în repository
2. **Redeploy** din Coolify dashboard
3. **Monitorizează** log-urile pentru confirmare

## 🛡️ **Securitate**

Aplicația include:
- ✅ **Rate limiting** (10 SMS/15 min per IP)
- ✅ **Input validation** și sanitization
- ✅ **Security headers** (Helmet)
- ✅ **HTTPS** automat prin Coolify
- ✅ **Environment variables** ca secrets

---

**🎉 Aplicația ta de alertă vânt este acum gata pentru producție!**