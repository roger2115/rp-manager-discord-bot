# 🎉 RP Manager System - Status i Instrukcje

## ✅ CO DZIAŁA:
- **Backend API**: http://localhost:3003 ✅
- **Frontend Dashboard**: http://localhost:3002 ✅  
- **Baza danych**: SQLite (rpmanager.db) ✅
- **OAuth2**: Skonfigurowane ✅

## ⚠️ CO WYMAGA UWAGI:
- **Discord Bot**: Wymaga włączenia uprawnień

## 🔧 OSTATNI KROK - Włącz uprawnienia bota:

### 1. Idź do Discord Developer Portal
- https://discord.com/developers/applications
- Wybierz swoją aplikację "RP Manager"

### 2. Włącz Privileged Gateway Intents
W zakładce **"Bot"** włącz:
- ✅ **MESSAGE CONTENT INTENT**
- ✅ **SERVER MEMBERS INTENT**
- ✅ **PRESENCE INTENT**

### 3. Zapisz zmiany
- Kliknij "Save Changes"

### 4. Bot automatycznie się uruchomi
- Sprawdź logi - powinno być: "✅ Bot is ready!"

## 🚀 JAK UŻYWAĆ:

### 1. Otwórz Dashboard
- Idź do: http://localhost:3002
- Kliknij "Login with Discord"
- Zaloguj się przez Discord

### 2. Utwórz postać
- Wybierz serwer Discord
- Kliknij "New Character"
- Wypełnij formularz:
  - **Nazwa**: np. "Commander Shepard"
  - **Avatar URL**: https://cdn.discordapp.com/avatars/...
  - **Tag**: np. "cmdr"
  - **Brackets**: np. "[]"

### 3. Użyj na Discordzie
- Na swoim serwerze napisz: `[Hello, this is Commander Shepard]`
- Bot usunie Twoją wiadomość i wyśle ją jako postać!

## 📊 KONFIGURACJA:
- **Client ID**: 1492693587614371971 ✅
- **Client Secret**: eA4BMt0BH9iQW3_adbrdAj2Xs8azh5yY ✅
- **Bot Token**: MTQ5MjY5MzU4NzYxNDM3MTk3MQ.G-FILO.*** ✅
- **Redirect URL**: http://localhost:3003/api/auth/callback ✅

## 🎮 FUNKCJE:
- ✅ Tworzenie postaci RP
- ✅ Server-scoped characters  
- ✅ Webhook message proxying
- ✅ Automatyczne awanse
- ✅ Permission system
- ✅ Futurystyczny design

## 🐛 TROUBLESHOOTING:

**Problem: "Used disallowed intents"**
- Włącz MESSAGE CONTENT INTENT w Discord Developer Portal

**Problem: OAuth2 nie działa**
- Sprawdź czy Redirect URL to: http://localhost:3003/api/auth/callback

**Problem: Bot nie odpowiada**
- Sprawdź czy bot ma uprawnienia na serwerze
- Sprawdź czy MESSAGE CONTENT INTENT jest włączony

## 🎭 PRZYKŁAD UŻYCIA:
1. Utwórz postać "Shepard" z brackets "[]"
2. Na Discordzie napisz: `[I should go]`
3. Bot wyśle: **Shepard**: I should go

## 📝 AUTOR:
- **ten_røger**
- Profilowe: C:\Users\Roger\Documents\PanelDiscordRP\Zerotwo-dwa.jpg

System jest gotowy! Wystarczy włączyć uprawnienia bota w Discord Developer Portal.