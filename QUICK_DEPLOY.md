# ⚡ Szybkie Wdrożenie - Krok po Kroku

## 🔑 Twoje Wygenerowane Klucze

**ZAPISZ TE WARTOŚCI - będą potrzebne!**

```
SESSION_SECRET=6445bcc62c1702def24b95759c9d629d6c85305014a5077d21ef271fa8a9c4d8
ENCRYPTION_KEY=4765e7fbbeadfdd2b6833e75431cc3cc
```

## 📋 Krok 1: Railway - Backend

1. **Zaloguj się:**
   ```bash
   railway login
   ```

2. **Utwórz projekt:**
   ```bash
   railway init
   ```
   - Wybierz: "Create new project"
   - Nazwa: `rp-manager`

3. **Dodaj PostgreSQL:**
   ```bash
   railway add
   ```
   - Wybierz: **PostgreSQL**

4. **Wdróż backend:**
   ```bash
   cd packages/backend
   railway up
   ```

5. **Otwórz dashboard Railway:**
   - Idź do: https://railway.app/dashboard
   - Znajdź swój projekt `rp-manager`
   - Kliknij na service backend

6. **Dodaj zmienne środowiskowe** (Settings → Variables):
   ```
   NODE_ENV=production
   PORT=3003
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_BOT_TOKEN=your_discord_bot_token
   SESSION_SECRET=6445bcc62c1702def24b95759c9d629d6c85305014a5077d21ef271fa8a9c4d8
   ENCRYPTION_KEY=4765e7fbbeadfdd2b6833e75431cc3cc
   ```

7. **Wygeneruj publiczny URL:**
   - W Settings → Networking
   - Kliknij "Generate Domain"
   - Skopiuj URL (np. `https://rp-manager-production.up.railway.app`)

8. **Dodaj pozostałe zmienne:**
   ```
   DISCORD_CALLBACK_URL=https://TWOJ-BACKEND-URL.railway.app/api/auth/callback
   FRONTEND_URL=https://TWOJ-FRONTEND.vercel.app
   ```
   (FRONTEND_URL zaktualizujemy później)

## 📋 Krok 2: Railway - Bot

1. **W tym samym projekcie Railway:**
   - Kliknij "+ New"
   - Wybierz "GitHub Repo"
   - Wybierz: `roger2115/rp-manager-discord-bot`
   - Root Directory: `packages/bot`

2. **Dodaj zmienne środowiskowe:**
   ```
   NODE_ENV=production
   DISCORD_BOT_TOKEN=your_discord_bot_token
   API_URL=https://TWOJ-BACKEND-URL.railway.app
   ```

## 📋 Krok 3: Vercel - Frontend

1. **Zaloguj się:**
   ```bash
   vercel login
   ```

2. **Wdróż:**
   ```bash
   cd packages/frontend
   vercel
   ```
   
   Odpowiedzi:
   - Set up and deploy? **Y**
   - Which scope? (wybierz swoje konto)
   - Link to existing project? **N**
   - Project name? **rp-manager-frontend**
   - Directory? **./** (Enter)
   - Override settings? **N**

3. **Dodaj zmienną środowiskową:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   ```
   Wpisz: `https://TWOJ-BACKEND-URL.railway.app`

4. **Wdróż na produkcję:**
   ```bash
   vercel --prod
   ```

5. **Skopiuj URL frontendu** (np. `https://rp-manager-frontend.vercel.app`)

## 📋 Krok 4: Zaktualizuj Discord OAuth

1. Idź do: https://discord.com/developers/applications/YOUR_CLIENT_ID/oauth2
2. W "Redirects" dodaj:
   ```
   https://TWOJ-BACKEND-URL.railway.app/api/auth/callback
   ```
3. Kliknij **Save Changes**

## 📋 Krok 5: Zaktualizuj Railway

1. Wróć do Railway dashboard
2. Otwórz backend service
3. Settings → Variables
4. Zaktualizuj `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://TWOJ-FRONTEND-URL.vercel.app
   ```

## 🎉 Krok 6: Testuj!

1. Otwórz: `https://TWOJ-FRONTEND-URL.vercel.app`
2. Kliknij "Zaloguj się przez Discord"
3. Gotowe! 🚀

## 🆘 Problemy?

**Backend nie działa:**
- Sprawdź logi w Railway dashboard
- Upewnij się, że wszystkie zmienne są ustawione
- Sprawdź czy DATABASE_URL jest automatycznie dodany przez Railway

**Frontend nie łączy się:**
- Sprawdź czy NEXT_PUBLIC_API_URL jest poprawny
- Sprawdź CORS - czy FRONTEND_URL w backendzie jest poprawny

**Bot nie odpowiada:**
- Sprawdź logi bota w Railway
- Upewnij się, że API_URL wskazuje na backend
- Sprawdź czy MESSAGE CONTENT INTENT jest włączony

## 💰 Koszty

- **Vercel**: Darmowy
- **Railway**: $5/miesiąc (trial: $5 kredytu gratis)

## 📞 Pomoc

Jeśli coś nie działa, sprawdź:
1. Logi w Railway (każdy service ma zakładkę "Logs")
2. Logi w Vercel (zakładka "Logs")
3. Console w przeglądarce (F12)

---

**Powodzenia! 🚀**
