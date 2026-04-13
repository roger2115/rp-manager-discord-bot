# Discord Bot Backend

## Konfiguracja

1. **Zainstaluj zależności:**
```bash
cd packages/backend
npm install
```

2. **Skonfiguruj token bota:**
   - Idź do [Discord Developer Portal](https://discord.com/developers/applications)
   - Wybierz swoją aplikację (ID: 1492693587614371971)
   - Przejdź do sekcji "Bot"
   - Skopiuj token bota
   - Wklej token do pliku `.env`:
   ```
   DISCORD_TOKEN=twoj_token_bota_tutaj
   ```

3. **Uruchom bota:**
```bash
npm start
```

## Funkcje bota

- ✅ **Automatyczny status** - Wyświetla liczbę serwerów i użytkowników
- ✅ **API endpoint** - `/api/status` zwraca status bota
- ✅ **Health check** - `/health` do monitorowania
- ✅ **Graceful shutdown** - Bezpieczne zamykanie

## API Endpoints

- `GET /api/status` - Status bota i serwera
- `GET /api/guilds` - Lista serwerów bota
- `GET /health` - Health check

## Status bota

Bot automatycznie aktualizuje swój status co 30 sekund, pokazując:
- 🎭 Liczbę serwerów
- 👥 Liczbę użytkowników

Status jest widoczny w Discord i w panelu administracyjnym.