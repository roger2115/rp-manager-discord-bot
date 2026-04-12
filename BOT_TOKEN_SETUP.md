# 🤖 Jak uzyskać prawidłowy token Discord Bot

## Problem:
Token `IJvohc03hVwaC3IIDc1fiPfOBpGkj6ev` jest za krótki i nieprawidłowy.

## ✅ Jak uzyskać prawidłowy token:

### 1. Idź do Discord Developer Portal
- Otwórz: https://discord.com/developers/applications
- Zaloguj się na swoje konto Discord

### 2. Utwórz nową aplikację (jeśli nie masz)
- Kliknij "New Application"
- Nazwij ją "RP Manager"
- Kliknij "Create"

### 3. Przejdź do zakładki "Bot"
- W lewym menu kliknij "Bot"
- Jeśli nie ma bota, kliknij "Add Bot"

### 4. Skopiuj token
- W sekcji "Token" kliknij "Reset Token"
- **WAŻNE**: Skopiuj CAŁY token (powinien mieć ~70 znaków)
- Format: `MTQ5MjY5MzU4NzYxNDM3MTk3MQ.GxxxXx.xxxxxxxxxxxxxxxxxxxxxxxxxx`

### 5. Włącz uprawnienia
W zakładce "Bot" włącz:
- ✅ **MESSAGE CONTENT INTENT**
- ✅ **SERVER MEMBERS INTENT** 
- ✅ **PRESENCE INTENT**

### 6. Wklej token do pliku
Edytuj plik `packages/bot/.env`:
```
DISCORD_BOT_TOKEN=TWÓJ_PEŁNY_TOKEN_TUTAJ
```

### 7. Dodaj bota na serwer
- Zakładka "OAuth2" → "URL Generator"
- Zaznacz scope: `bot`
- Zaznacz uprawnienia:
  - ✅ Manage Webhooks
  - ✅ Send Messages  
  - ✅ Manage Messages
  - ✅ Read Message History
- Skopiuj URL i dodaj bota na swój serwer

## 🔧 Aktualne ustawienia OAuth2:
- **Client ID**: 1492693587614371971 ✅
- **Client Secret**: eA4BMt0BH9iQW3_adbrdAj2Xs8azh5yY ✅
- **Redirect URL**: http://localhost:3003/api/auth/callback

## 📍 Status serwisów:
- ✅ Backend: http://localhost:3003 (działa)
- ✅ Frontend: http://localhost:3002 (działa)  
- ❌ Bot: Czeka na prawidłowy token

## 🚀 Po dodaniu tokena:
```bash
# Bot automatycznie się zrestartuje
# Sprawdź logi: powinno być "✅ Bot is ready!"
```

Następnie otwórz: http://localhost:3002