# Configurazione Vercel per Sessioni Mobile

## Variabili d'Ambiente Richieste su Vercel

Vai su Vercel Dashboard > Il tuo progetto > Settings > Environment Variables e aggiungi:

```bash
NEXTAUTH_URL=https://tuo-dominio.vercel.app
NEXTAUTH_SECRET=genera-una-chiave-segreta-molto-lunga-e-casuale
DATABASE_URL=la-tua-connection-string-postgresql
```

## Generare NEXTAUTH_SECRET

Esegui questo comando per generare una chiave sicura:

```bash
openssl rand -base64 32
```

## Test della Configurazione

1. Deploy su Vercel con le variabili d'ambiente
2. Testa il login da mobile
3. Chiudi l'app completamente
4. Riapri dopo qualche minuto - dovresti rimanere loggato

## Configurazioni Implementate per Mobile

- ✅ Sessione JWT estesa a 30 giorni
- ✅ Refresh automatico della sessione ogni 5 minuti
- ✅ Service Worker per mantenere sessione in background
- ✅ Gestione eventi di visibilità per mobile
- ✅ Manifest PWA per installazione come app
- ✅ Meta tags ottimizzati per mobile
- ✅ Middleware più permissivo per API auth

## Troubleshooting

Se hai ancora problemi:

1. Verifica che NEXTAUTH_URL corrisponda esattamente al dominio Vercel
2. Controlla che NEXTAUTH_SECRET sia impostato su Vercel
3. Testa in modalità incognito per escludere cache del browser
4. Controlla i log di Vercel per errori di autenticazione
