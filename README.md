# Baane Logistics

> **China → Somaliland | Sourcing, Inspection, Cargo Tracking & Secure Escrow**
> **Zero Express server needed. Fully serverless on Convex Cloud.**

A full-stack logistics platform connecting Chinese industrial markets to Somaliland. Features real-time container tracking, product sourcing, factory inspection booking, freight quoting, secure escrow payments, and an AI-powered logistics copilot.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (Vite only — no Express needed)
npm run dev

# 3. Open in browser
open http://localhost:3000
open http://localhost:3000/admin   # Admin panel
```

**Admin Login:** `admin@baane.com` / `admin123`

---

## Production Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub, then import repo to Vercel
# Vercel auto-detects Vite config — zero configuration needed

# Or deploy from CLI
npx vercel --prod
```

**Vercel automatically:**
- Builds with `npm run build`
- Serves from `dist/` folder
- Rewrites all routes to `index.html` for SPA routing
- Sets `VITE_CONVEX_URL` environment variable

### Deploy Convex Functions

```bash
# Only needed when you change backend logic
npx convex deploy
```

Convex functions are already deployed and running at:
`https://tangible-husky-835.eu-west-1.convex.cloud`

---

## Architecture — No Express Needed

```
┌──────────────────────────────────────────┐
│          Vercel (Static Hosting)          │
│  ┌────────────────────────────────────┐  │
│  │       React SPA (Vite Build)       │  │
│  │  ┌──────────┐  ┌──────────────┐   │  │
│  │  │ Public   │  │ Admin Panel  │   │  │
│  │  │ App.tsx  │  │ (12 tabs)    │   │  │
│  │  └──────────┘  └──────────────┘   │  │
│  └────────────────────────────────────┘  │
│              │  Convex SDK               │
│              ▼                            │
│    https://tangible-husky-835...          │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│       Convex Cloud (Serverless)          │
│  ┌────────┐ ┌────────┐ ┌────────────┐  │
│  │ HTTP   │ │ Queries │ │ Mutations  │  │
│  │ Actions│ │ (read)  │ │ (write)    │  │
│  └────────┘ └────────┘ └────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  10 Database Tables (PostgreSQL)   │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

| Layer | Tech | Runs on |
|-------|------|---------|
| **Frontend** | React 19, TypeScript, Tailwind v4 | Vercel (static) |
| **Backend** | Convex Queries + Mutations | Convex Cloud |
| **HTTP API** | Convex HTTP Actions | Convex Cloud |
| **Database** | Convex (PostgreSQL-backed) | Convex Cloud |
| **Auth** | SHA-256 hashed passwords | Convex DB |
| **AI** | Gemini 2.0 Flash (OpenAI/Anthropic optional) | Admin-configured |

---

## Stack

| Technology | Purpose |
|------------|---------|
| React 19 + TypeScript | UI |
| Vite 6 | Build tool |
| Tailwind CSS v4 | Styling |
| Framer Motion + GSAP 3.12 | Animations |
| Convex | Backend + Database |
| Lucide React | Icons |
| Google Gemini | AI Copilot |

---

## Features

- **Container Tracking** — Real-time GPS/IoT monitoring with animated route maps & GSAP counters
- **Product Sourcing** — Connect with Chinese manufacturers in Yiwu, Shenzhen, Guangzhou, Foshan, Ningbo
- **Quality Inspection** — Book on-site factory audits (PSI, DUPRO, loading supervision)
- **Freight Quotes** — Auto-calculated sea/air cargo pricing with breakdown
- **Secure Escrow** — USD deposit → QC inspection → CNY release workflow
- **AI Copilot** — Logistics assistant (works offline with fallback too)
- **Admin Panel** — 12-tab control center with full CRUD, AI config, audit log
- **Bilingual** — English + Somali (Somali)
- **GSAP Animations** — Scroll-triggered reveals, animated counters, glassmorphism UI
- **Performance** — Code-split chunks, lazy-loaded components, error boundaries

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking |
| `npx convex deploy` | Deploy Convex functions to cloud |

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_CONVEX_URL` | No | Convex cloud URL | Convex backend endpoint |

No `.env` file needed unless you want to override the Convex URL.

---

## Demo Tracking IDs

| ID | Mode | Route | Status |
|----|------|-------|--------|
| `BAANE-SEA-8821` | Sea | Shenzhen → Berbera | 72% in transit |
| `BAANE-AIR-5042` | Air | Guangzhou → Hargeisa | Delivered |
| `BAANE-SEA-9013` | Sea | Ningbo → Berbera | 18% customs |

---

## Project Structure

```
src/
├── components/       # 8 React components (tracking, sourcing, map, chat...)
├── admin/            # Admin panel (login + 12 management tabs)
├── hooks/            # Custom React hooks + GSAP animation library
├── convexClient.tsx  # Convex provider
├── App.tsx           # Main public SPA with GSAP entrance animations
├── main.tsx          # Entry point with /admin routing
├── index.css         # Design system (glass, gradients, grid patterns)
├── translations.ts   # EN + SO bilingual dictionary
└── types.ts          # TypeScript interfaces

convex/               # Convex backend (14 modules, 40+ functions) — deploy separately
```

---

## Convex Cloud

- **API URL**: `https://tangible-husky-835.eu-west-1.convex.cloud`
- **HTTP Actions**: `https://tangible-husky-835.eu-west-1.convex.site`
- **Dashboard**: [Convex Console](https://dashboard.convex.dev/t/abdirahman-baane/baane-logistics/tangible-husky-835)

---

## Full Documentation

See **[DOC.md](./DOC.md)** for complete technical documentation including architecture diagrams, all 10 database tables, API reference, design system, and animation specifications.

---

## License

© 2026 Baane Logistics Ltd. All rights reserved.
