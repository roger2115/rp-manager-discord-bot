# Setup Instructions - RP Manager System

## ✅ Co już jest zrobione:
- Wszystkie zależności zainstalowane
- Pliki .env utworzone z Twoim tokenem bota
- Struktura projektu gotowa

## 🔧 Co musisz zrobić:

### 1. Utwórz Discord Application (jeśli jeszcze nie masz)

1. Idź do https://discord.com/developers/applications
2. Kliknij "New Application"
3. Nazwij aplikację "RP Manager"
4. Przejdź do zakładki "Bot"
5. Skopiuj token bota (już masz: `IJvohc03hVwaC3IIDc1fiPfOBpGkj6ev`)

### 2. Skonfiguruj OAuth2

1. W Discord Developer Portal, przejdź do zakładki "OAuth2"
2. Dodaj Redirect URL: `http://localhost:3001/api/auth/callback`
3. Skopiuj **Client ID** i **Client Secret**
4. Wklej je do plików:
   - `.env` (główny)
   - `packages/backend/.env`
   - `packages/frontend/.env.local`
   
   Zamień:
   ```
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   ```
   
   Na swoje wartości.

### 3. Nadaj uprawnienia botowi

1. W Discord Developer Portal, zakładka "Bot"
2. Włącz następujące **Privileged Gateway Intents**:
   - ✅ MESSAGE CONTENT INTENT
   - ✅ SERVER MEMBERS INTENT
   - ✅ PRESENCE INTENT

3. W zakładce "OAuth2" -> "URL Generator":
   - Zaznacz scope: `bot`
   - Zaznacz uprawnienia:
     - ✅ Manage Webhooks
     - ✅ Send Messages
     - ✅ Manage Messages
     - ✅ Read Message History
   - Skopiuj wygenerowany URL i dodaj bota na swój serwer

### 4. Zainstaluj PostgreSQL i Redis

**Opcja A: Docker (Zalecane)**
```bash
docker-compose up -d postgres redis
```

**Opcja B: Lokalna instalacja**
- PostgreSQL 15+: https://www.postgresql.org/download/
- Redis 7+: https://redis.io/download/

### 5. Uruchom migracje bazy danych

```bash
cd packages/backend
npm run prisma:migrate
npm run prisma:generate
```

### 6. (Opcjonalnie) Dodaj przykładowe dane

```bash
cd packages/backend
npx tsx prisma/seed.ts
```

### 7. Uruchom aplikację

**Opcja A: Wszystko naraz**
```bash
npm run dev
```

**Opcja B: Osobno**
```bash
# Terminal 1 - Backend
cd packages/backend
npm run dev

# Terminal 2 - Frontend
cd packages/frontend
npm run dev

# Terminal 3 - Bot
cd packages/bot
npm run dev
```

### 8. Otwórz aplikację

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

## 🎮 Jak używać:

1. Otwórz http://localhost:3000
2. Kliknij "Login with Discord"
3. Zaloguj się przez Discord
4. Wybierz serwer
5. Utwórz postać (np. nazwa: "Commander Shepard", brackets: "[]")
6. Na Discordzie napisz: `[Hello, this is Commander Shepard]`
7. Bot usunie Twoją wiadomość i wyśle ją jako postać!

## 🐛 Troubleshooting:

**Problem: Bot nie odpowiada**
- Sprawdź czy bot ma uprawnienia MESSAGE CONTENT INTENT
- Sprawdź czy bot ma uprawnienia Manage Webhooks na kanale

**Problem: OAuth2 nie działa**
- Sprawdź czy Redirect URL jest poprawny w Discord Developer Portal
- Sprawdź czy CLIENT_ID i CLIENT_SECRET są poprawne

**Problem: Błąd bazy danych**
- Sprawdź czy PostgreSQL działa: `docker ps` lub `pg_isready`
- Sprawdź czy DATABASE_URL jest poprawny w `.env`

**Problem: Redis error**
- Sprawdź czy Redis działa: `docker ps` lub `redis-cli ping`

## 📝 Notatki:

- Token bota jest już skonfigurowany: `IJvohc03hVwaC3IIDc1fiPfOBpGkj6ev`
- Musisz tylko dodać CLIENT_ID i CLIENT_SECRET z Discord Developer Portal
- Autor: ten_røger
- Profilowe: C:\Users\Roger\Documents\PanelDiscordRP\Zerotwo-dwa.jpg

## 🚀 Następne kroki:

Po uruchomieniu możesz:
- Tworzyć postacie przez dashboard
- Używać ich na Discordzie z brackets
- Konfigurować rangi i awanse
- Zarządzać serwerami

Powodzenia! 🎭
