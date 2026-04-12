# 🚀 Wdrożenie do Sieci - Instrukcja Krok po Kroku

## Przygotowanie

Masz już zainstalowane:
- ✅ Railway CLI
- ✅ Vercel CLI

## KROK 1: Wdróż Backend na Railway

### 1.1 Zaloguj się do Railway

```bash
railway login
```

To otworzy przeglądarkę - zaloguj się przez GitHub.

### 1.2 Utwórz nowy projekt

```bash
railway init
```

Wybierz: "Create new project"
Nazwa: `rp-manager-backend`

### 1.3 Dodaj PostgreSQL

```bash
railway add
```

Wybierz: **PostgreSQL**

### 1.4 Wdróż Backend

```bash
cd packages/backend
railway up
```

### 1.5 Ustaw zmienne środowiskowe

Otwórz dashboard Railway: https://railway.app/dashboard

Znajdź swój projekt i dodaj zmienne:

```
NODE_ENV=production
PORT=3003
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token
SESSION_SECRET=wygeneruj_losowy_32_znakowy_ciag
ENCRYPTION_KEY=wygeneruj_dokladnie_32_znaki
```

**Wygeneruj klucze:**
```bash
# SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ENCRYPTION_KEY (dokładnie 32 znaki)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 1.6 Pobierz URL backendu

W Railway dashboard, kliknij na swój backend service i skopiuj URL (np. `https://rp-manager-backend.up.railway.app`)

### 1.7 Zaktualizuj zmienne w Railway

Dodaj jeszcze:
```
DISCORD_CALLBACK_URL=https://twoj-backend-url.railway.app/api/auth/callback
FRONTEND_URL=https://twoj-frontend.vercel.app
```

(Frontend URL dodamy za chwilę)

### 1.8 Uruchom migracje

W Railway dashboard, otwórz terminal i wykonaj:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## KROK 2: Wdróż Bota na Railway

### 2.1 Utwórz nowy service w tym samym projekcie

W Railway dashboard:
1. Kliknij "+ New"
2. Wybierz "Empty Service"
3. Nazwa: `rp-manager-bot`

### 2.2 Połącz z GitHub

1. W ustawieniach service, kliknij "Connect Repo"
2. Wybierz swoje repo: `roger2115/rp-manager-discord-bot`
3. Root Directory: `packages/bot`

### 2.3 Ustaw zmienne środowiskowe dla bota

```
NODE_ENV=production
DISCORD_BOT_TOKEN=your_discord_bot_token
API_URL=https://twoj-backend-url.railway.app
```

## KROK 3: Wdróż Frontend na Vercel

### 3.1 Zaloguj się do Vercel

```bash
vercel login
```

### 3.2 Wdróż frontend

```bash
cd packages/frontend
vercel
```

Odpowiedz na pytania:
- Set up and deploy? **Y**
- Which scope? (wybierz swoje konto)
- Link to existing project? **N**
- Project name? `rp-manager-frontend`
- Directory? `./` (naciśnij Enter)
- Override settings? **N**

### 3.3 Ustaw zmienne środowiskowe

```bash
vercel env add NEXT_PUBLIC_API_URL
```

Wpisz: `https://twoj-backend-url.railway.app`

Wybierz: Production, Preview, Development (wszystkie)

### 3.4 Wdróż na produkcję

```bash
vercel --prod
```

### 3.5 Pobierz URL frontendu

Po wdrożeniu zobaczysz URL (np. `https://rp-manager-frontend.vercel.app`)

## KROK 4: Zaktualizuj Discord OAuth

1. Idź do: https://discord.com/developers/applications/1492693587614371971
2. Zakładka **OAuth2**
3. Dodaj Redirect URL:
   ```
   https://twoj-backend-url.railway.app/api/auth/callback
   ```
4. Kliknij **Save Changes**

## KROK 5: Zaktualizuj FRONTEND_URL w Railway

1. Wróć do Railway dashboard
2. Otwórz backend service
3. Zaktualizuj zmienną:
   ```
   FRONTEND_URL=https://twoj-frontend-url.vercel.app
   ```
4. Service zrestartuje się automatycznie

## KROK 6: Testowanie

1. Otwórz w przeglądarce: `https://twoj-frontend-url.vercel.app`
2. Kliknij "Zaloguj się przez Discord"
3. Autoryzuj aplikację
4. Powinieneś zobaczyć dashboard!

## 🎉 Gotowe!

Twoja aplikacja jest teraz online i dostępna dla wszystkich!

**Twoje URLe:**
- Frontend: `https://twoj-frontend.vercel.app`
- Backend: `https://twoj-backend.railway.app`
- Bot: Działa w tle na Railway

## 📊 Koszty

- **Vercel**: Darmowy (hobby plan)
- **Railway**: ~$5/miesiąc (trial: $5 kredytu na start)

## 🔧 Jeśli coś nie działa

1. Sprawdź logi w Railway dashboard
2. Sprawdź logi w Vercel dashboard
3. Upewnij się, że wszystkie zmienne środowiskowe są ustawione
4. Sprawdź czy Discord OAuth callback URL jest poprawny

## 📝 Ważne Linki

- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Discord Developer Portal: https://discord.com/developers/applications

---

**Potrzebujesz pomocy?** Otwórz issue na GitHub!
