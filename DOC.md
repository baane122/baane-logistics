# Baane Logistics — Full Technical Documentation

## 📋 Overview

Baane Logistics is a production‑ready, serverless logistics platform connecting Chinese suppliers with Somaliland buyers. The entire backend runs on **Convex Cloud** — no Express server, no traditional database, no Docker. The frontend is a React SPA deployed via **Vercel**.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Browser (SPA)                                          │
│  http://localhost:3000 / https://baane-logistics.vercel.app │
│                                                         │
│  / (public)    → App.tsx (sections + GSAP animations)    │
│  /admin        → AdminApp.tsx (12-tab admin panel)       │
│  Convex queries  → Direct WebSocket via convex/react     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Vite Dev Server (dev) / Vercel Edge (prod)             │
│  - SPA appType (historyApiFallback)                     │
│  - Convex react client for all data                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Convex Cloud (Backend - WebSocket + HTTP actions)      │
│  https://tangible-husky-835.eu-west-1.convex.cloud       │
│                                                         │
│  12 tables, 40+ functions                               │
│  - Auth (SHA-256 + sessions)                            │
│  - CRUD for all entities                                │
│  - Gemini AI fallback responses                         │
│  - Seed/migration mutations                             │
└─────────────────────────────────────────────────────────┘
```

**Key change:** All frontend components now use the Convex WebSocket client (`convex/react`) directly instead of REST `/api/` fetch calls. The Vite proxy to `convex.site` has been removed since DNS for that domain doesn't resolve in all environments.

---

## 🗄️ Database Schema (Convex)

### 1. `users`
| Field | Type | Index |
|-------|------|-------|
| `name` | string | — |
| `email` | string | `by_email` |
| `passwordHash` | string | — |
| `role` | "admin" \| "staff" \| "viewer" | `by_role` |
| `isActive` | boolean | — |
| `lastLogin` | optional string | — |

### 2. `settings`
Key‑value store for app configuration. Indexed by `by_key` and `by_category`.

### 3. `aiModels`
AI model configurations (provider, modelId, apiKey, capabilities). Indexed by `by_provider` and `by_active`.

### 4. `systemPrompts`
System prompt templates for AI. Versioned, indexed by `by_slug` and `by_category`.

### 5. `apiKeys`
API key storage with masked display. Indexed by `by_provider` and `by_active`.

### 6. `emailTemplates`
Email templates with variables. Indexed by `by_slug`.

### 7. `containers`
Container tracking with route checkpoints and IoT metrics. Indexed by `by_trackingId`, `by_status`, `by_type`.

### 8. `sourcingRequests`
Sourcing requests with status workflow. Indexed by `by_status`, `by_createdAt`.

### 9. `inspectionRequests`
Inspection bookings with city and scope. Indexed by `by_status`, `by_city`, `by_createdAt`.

### 10. `cargoQuotes`
Cargo quotes with auto‑calculated pricing. Indexed by `by_status`, `by_createdAt`.

### 11. `chatMessages`
Conversation history. Indexed by `by_session` (sessionId + timestamp).

### 12. `auditLog`
System audit trail. Indexed by `by_timestamp`, `by_entity`.

---

## 🎨 Brand & Design System

### Colors

| Token | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| Brand Navy | `#0A2540` | `--color-brand-navy` | Cards, sidebar, headers |
| Brand Teal | `#00D4AA` | `--color-brand-teal` | CTAs, accents, active states |
| Brand Gold | `#D4AF37` | `--color-brand-gold` | Highlights, security badges |
| Brand Deep | `#020914` | `--color-brand-deep` | Page background |
| Surface Dark | `#030d1a` | `--color-surface-dark` | Elevated cards |
| Surface Mid | `#061a2c` | `--color-surface-mid` | Section backgrounds |

### Typography

| Family | Weight | Usage |
|--------|--------|-------|
| **Inter** | 300–900 | Body text, UI labels |
| **Montserrat** | 500–900 | Headings, display text |
| **JetBrains Mono** | 400–700 | Code, metrics, timestamps |

### GSAP Animations

- **Page entrance** — Staggered fade‑in for navbar + hero
- **Stats counter** — Scroll‑triggered number animation (`power2.out`)
- **Corridor cards** — Scroll‑reveal with stagger (`x: -40 → 0`)
- **Cleanup** — `ScrollTrigger.getAll().forEach(st => st.kill())` on unmount

---

## 🖥️ Frontend Components

### Public Pages (`src/`)

| Component | Description | Data Source |
|-----------|-------------|-------------|
| `App.tsx` | Main SPA with hero, stats, corridors, footer | Convex client |
| `TrackingSection.tsx` | Live container tracking with IoT telemetry | `api.containers.list` query |
| `SourcingSection.tsx` | Sourcing request form | `api.sourcing.create` mutation |
| `InspectionSection.tsx` | Inspection booking form | `api.inspections.create` mutation |
| `PaymentSection.tsx` | Escrow payment interface | Static content |
| `ChatAssistant.tsx` | AI chat (sends to Convex HTTP action) | `convex.site` fetch |
| `InteractiveMap.tsx` | Map visualization | Static Geo data |
| `ErrorBoundary.tsx` | React error boundary | Class component |

### Admin Panel (`src/admin/`)

12 tabs: Overview, Containers, Sourcing, Inspections, Quotes, Users, Audit Log, Settings, AI Models, Prompts, API Keys, Email Templates.

---

## 🔗 API Reference

### Convex Queries & Mutations (used by admin + public components)

All data operations go through the Convex WebSocket client (`convex/react` hooks).

| Module | Functions | Description |
|--------|-----------|-------------|
| `containers.ts` | `list`, `create`, `update`, `remove`, `getStats`, `seedContainers` | Container tracking CRUD |
| `sourcing.ts` | `list`, `create`, `update`, `remove`, `getStats` | Sourcing requests |
| `inspections.ts` | `list`, `create`, `update`, `remove`, `getStats` | Inspection bookings |
| `quotes.ts` | `list`, `create`, `update`, `remove`, `getStats` | Cargo quotes with auto‑pricing |
| `auth.ts` | `login`, `createAdmin`, `listUsers`, `updateUser`, `deleteUser` | User management |
| `settings.ts` | `get`, `set`, `getAll`, `remove`, `seedDefaults` | Key‑value config |
| `aiModels.ts` | `list`, `create`, `update`, `remove`, `toggleActive` | AI model config |
| `apiKeys.ts` | `list`, `create`, `update`, `remove`, `toggleActive` | API key management |
| `prompts.ts` | `list`, `create`, `update`, `remove`, `seedDefaults` | System prompts |
| `emailTemplates.ts` | `list`, `create`, `update`, `remove`, `seedDefaults` | Email templates |
| `audit.ts` | `log`, `list`, `getRecent`, `clearOld` | Audit trail |
| `chat.ts` | `listBySession`, `sendMessage`, `getFallbackResponse` | Chat history |

### Legacy HTTP Actions (for backward compatibility)

Defined in `convex/http.ts`, these are callable at `https://tangible-husky-835.eu-west-1.convex.site/api/*`:

- `GET /api/health` — Health check
- `GET /api/tracking/:id` — Container lookup (returns dynamic fallback)
- `POST /api/sourcing` — Submit sourcing request
- `POST /api/inspection` — Book inspection
- `POST /api/quotes` — Request cargo quote
- `POST /api/chat` — AI assistant (fallback responses)

---

## 📁 File Structure

```
baane-logistics/
├── convex/                    # Convex backend (12 modules)
│   ├── _generated/           # Auto‑generated types
│   ├── schema.ts             # Database schema (12 tables)
│   ├── auth.ts               # Auth (SHA-256)
│   ├── containers.ts         # Container tracking CRUD
│   ├── sourcing.ts           # Sourcing requests
│   ├── inspections.ts        # Inspection bookings
│   ├── quotes.ts             # Cargo quotes (auto‑pricing)
│   ├── chat.ts               # AI chat
│   ├── aiModels.ts           # AI model config
│   ├── apiKeys.ts            # API keys
│   ├── prompts.ts            # System prompts
│   ├── emailTemplates.ts     # Email templates
│   ├── settings.ts           # Key‑value settings
│   ├── audit.ts              # Audit logging
│   └── http.ts               # HTTP actions
├── src/                       # Frontend
│   ├── main.tsx              # SPA entry
│   ├── App.tsx               # Public SPA
│   ├── index.css             # Tailwind + brand theme
│   ├── types.ts              # TS interfaces
│   ├── translations.ts       # EN/SO translations
│   ├── convexClient.tsx      # Convex provider
│   ├── admin/                # Admin panel (12 tabs)
│   └── components/           # React components
│       ├── TrackingSection.tsx
│       ├── SourcingSection.tsx
│       ├── InspectionSection.tsx
│       ├── PaymentSection.tsx
│       ├── ChatAssistant.tsx
│       ├── InteractiveMap.tsx
│       ├── Logo.tsx
│       └── ErrorBoundary.tsx
├── vite.config.ts            # Vite config (no proxy)
├── vercel.json               # Vercel deployment
├── README.md                 # Quick start
└── DOC.md                    # This doc
```

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
# → Admin at http://localhost:3000/admin
```

Admin login: `admin@baane.com` / `admin123`

### Production

```bash
npm run build
npx vercel --prod
```

### Deploy Convex changes

```bash
npx convex deploy
```

---

## 🧪 Demo Data

Seeded via Convex mutations:
- **3 containers**: BAANE-SEA-8821, BAANE-AIR-5042, BAANE-SEA-9013
- **18 default settings**: company info, AI config, shipping rates
- **3 system prompts**: AI Copilot, Sourcing AI, Inspection AI
- **2 email templates**: Sourcing confirmation, Inspection scheduled

---

## 🔐 Security

- **Passwords**: SHA-256 hashed (upgrade to bcrypt for production)
- **Admin sessions**: localStorage (use httpOnly cookies for production)
- **API keys**: Masked in list view
- **Audit**: All mutations logged with user, action, timestamp

---

## 📊 Performance Optimizations

- **Code splitting**: Vendor, Convex, GSAP, Motion, Icons in separate chunks
- **Lazy loading**: `AdminApp.tsx` loaded via dynamic `import()`
- **GSAP cleanup**: All ScrollTrigger instances killed on unmount
- **React.memo**: ChatAssistant, TrackingSection, Logo memoized
- **No Express**: Pure Vite SPA, zero server runtime

---

## 🌐 Deployment

| Platform | URL | Method |
|----------|-----|--------|
| **Frontend** | https://baane-logistics.vercel.app | `npx vercel --prod` |
| **Backend** | Convex Cloud | `npx convex deploy` |
| **GitHub** | https://github.com/baane122/baane-logistics | `git push` |

### Vercel env variables

```
VITE_CONVEX_URL=https://tangible-husky-835.eu-west-1.convex.cloud
```
