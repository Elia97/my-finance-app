# My Finance App

Un'applicazione web moderna per la gestione delle finanze personali sviluppata con Next.js, TypeScript e Prisma.

## 📋 Panoramica

My Finance App è un'applicazione completa per il tracciamento e la gestione delle finanze personali che include:

- 💰 Gestione conti e transazioni
- 📈 Investimenti e portfolio tracking
- 📊 Analisi e statistiche dettagliate
- 🎯 Obiettivi di risparmio
- 📱 Design responsive e PWA-ready
- 🔐 Autenticazione sicura con NextAuth.js

## 🏗️ Architettura Entry Point

L'applicazione è strutturata attorno a tre file principali che gestiscono l'inizializzazione e la configurazione base:

### 🚀 `src/app/layout.tsx`

**Root Layout Component** - Il layout principale dell'applicazione

**Responsabilità:**

- **Configurazione HTML base**: Imposta la struttura HTML con lingua italiana e font Inter
- **Metadata SEO**: Definisce titoli, descrizioni e meta tag per l'ottimizzazione sui motori di ricerca
- **PWA Configuration**: Configura l'app come Progressive Web App con:
  - Apple Web App capabilities
  - Theme color dinamico (light/dark)
  - Viewport ottimizzato per mobile
  - Icone e manifest
- **Provider Wrapping**: Incapsula l'intera app nei provider necessari
- **Session Management**: Integra il componente per mantenere attiva la sessione utente

**Caratteristiche chiave:**

- Supporto multilingua (italiano)
- Design responsive ottimizzato
- Configurazione PWA completa
- SEO-friendly metadata

### 🔧 `src/components/providers.tsx`

**Application Providers** - Centralizza tutti i provider dell'applicazione

**Responsabilità:**

- **Session Management**: Configura NextAuth SessionProvider con:
  - Refresh automatico ogni 5 minuti
  - Riattivazione al focus della finestra
  - Gestione stato autenticazione globale
- **Theme System**: Integra il ThemeProvider per:
  - Tema sistema/light/dark
  - Transizioni fluide
  - Persistenza preferenze utente
- **Provider Composition**: Organizza la gerarchia dei provider in modo pulito e scalabile

**Configurazioni:**

- Intervallo refresh sessione: 5 minuti
- Focus-based session refresh: Abilitato
- Theme detection: Sistema + manuale
- Transizioni: Disabilitate per performance

### ⏰ `src/components/session-keep-alive.tsx`

**Session Persistence** - Mantiene attiva la sessione utente

**Responsabilità:**

- **Background Session Refresh**: Richiama l'endpoint di sessione ogni 10 minuti
- **Service Worker Integration**: Registra SW per gestione background
- **Authentication State Aware**: Attivo solo per utenti autenticati
- **Error Resilience**: Gestisce gracefully i fallimenti di rete

**Funzionalità:**

- Ping automatico ogni 10 minuti quando autenticato
- Service Worker per persistenza in background
- Cleanup automatico dei timer al dismount
- Gestione errori silenziosa

## 🛠️ Stack Tecnologico

### Frontend

- **Next.js 15.3.2** - Framework React con App Router
- **TypeScript** - Type safety e developer experience
- **Tailwind CSS 4** - Styling utility-first
- **Radix UI** - Componenti accessibili
- **Lucide React** - Iconografia

### Backend & Database

- **Prisma** - ORM e database toolkit
- **NextAuth.js** - Autenticazione e sessioni
- **bcryptjs** - Hash password sicuro

### Utilities & Tools

- **React Hook Form + Zod** - Form validation
- **date-fns** - Manipolazione date
- **Recharts** - Grafici e visualizzazioni
- **Decimal.js** - Calcoli finanziari precisi

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+
- npm/yarn/pnpm
- Database (PostgreSQL raccomandato)

### Installazione

```bash
# Clona il repository
git clone https://github.com/Elia97/my-finance-app.git
cd my-finance-app

# Installa le dipendenze
npm install

# Configura le variabili d'ambiente
cp .env.example .env.local
# Modifica .env.local con le tue configurazioni

# Setup database
npx prisma migrate dev
npx prisma db seed

# Avvia il server di sviluppo
npm run dev
```

### Script Disponibili

```bash
npm run dev          # Avvia development server
npm run build        # Build per produzione
npm run start        # Avvia server produzione
npm run lint         # Linting del codice
npm run test         # Esegue i test
npm run studio:test  # Prisma Studio per test DB
```

## 📱 Progressive Web App

L'applicazione è configurata come PWA con:

- **Offline support** tramite Service Worker
- **App-like experience** su mobile
- **Installazione** su dispositivi
- **Theme-aware** con supporto dark/light mode
- **Session persistence** anche in background

## 🔐 Sicurezza

- **NextAuth.js** per autenticazione sicura
- **bcryptjs** per hashing password
- **Session management** con refresh automatico
- **CSRF protection** integrata
- **Environment variables** per secrets

## 📖 Documentazione Aggiuntiva

- [Guida Sviluppo](docs/development.md) _(coming soon)_
- [API Reference](docs/api.md) _(coming soon)_
- [Deployment Guide](docs/deployment.md) _(coming soon)_

---

**Versione:** 0.1.0  
**Licenza:** Private  
**Sviluppatore:** Elia97
