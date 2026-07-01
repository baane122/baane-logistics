# Baane Logistics — Full Technical Documentation

## 📋 Overview

Baane Logistics is a production‑ready, serverless logistics platform connecting Chinese suppliers with Somaliland buyers. The entire backend runs on **Convex Cloud** — no Express server, no traditional database, no Docker. The frontend is a React SPA deployed via **Vercel**.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│  Browser (SPA)                                         │
│  http://localhost:3000  /  https://baane-logistics.vercel.app │
│                                                        │
│  / (public)    → App.tsx (sections + GSAP animations)   │
│  /admin        → AdminApp.tsx (12-tab admin panel)      │
│  /api/*        → Proxied to Convex HTTP actions         │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│  Vite Dev Server (dev)  /  Vercel Edge (prod)          │
│  - SPA appType (historyApiFallback)                     │
│  - Proxy /api/* → Convex HTTP Actions URL              │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│  Convex Cloud (Backend)                                 │
│  https://tangible-husky-835.eu-west-1.convex.cloud      │
│                                                        │
│  10 tables, 40+ functions, HTTP actions                 │
│  - Auth (SHA-256 + sessions)                            │
│  - CRUD for all entities                                │
│  - Gemini AI fallback                                   │
│  - Seed/migration mutations                             │
└────────────────────────────────────────────────────────┘
```

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
| Surface Card | `#0A2540` | `--color-surface-card` | Card backgrounds |

### Typography

| Family | Weight | Usage |
|--------|--------|-------|
| **Inter** | 300–900 | Body text, UI labels |
| **Montserrat** | 500–900 | Headings, display text |
| **JetBrains Mono** | 400–700 | Code, metrics, timestamps |

### Animation Tokens

- `glow-pulse` — Pulsing glow effect (2s cycle)
- `radar` — Radar sweep rotation (4s)
- `float` — Floating motion (6s)
- `shimmer` — Background shimmer (3s)
- `border-glow` — Border glow pulse (3s)

### GSAP Animations

- **Page entrance** — Staggered fade‑in for navbar + hero
- **Stats counter** — Scroll‑triggered number animation (`power2.out`)
- **Corridor cards** — Scroll‑reveal with stagger (`x: -40 → 0`)
- **Cleanup** — `ScrollTrigger.getAll().forEach(st => st.kill())` on unmount

---

## 🔌 API Reference

### Convex HTTP Actions

All `/api/*` routes are handled by `convex/http.ts` and proxied through Vite in development.

#### `GET /api/health`
Returns `{ status: "ok", timestamp: "..." }`

#### `GET /api/tracking/:id`
Container tracking lookup. Returns container data or a dynamic fallback.

#### `POST /api/sourcing`
Submit a sourcing request. Body: `{ name, phone, productType, quantity, budget?, targetMarket, description? }`

#### `POST /api/inspection`
Book an inspection. Body: `{ name, phone, factoryName, factoryAddress, city, inspectionDate, scope, productType }`

#### `POST /api/quotes`
Request a cargo quote. Body: `{ name, phone, serviceType, cargoType, origin, destination, weight, volume }`

#### `POST /api/chat`
AI assistant chat. Body: `{ message, history? }`. Returns `{ text, _fallback? }`.

### Convex Queries/Mutations (used by admin panel)

| Query/Mutation | Module | Description |
|---------------|--------|-------------|
| `containers.list` | containers.ts | List with optional status/type filter |
| `containers.create` | containers.ts | Create container with full route |
| `containers.update` | containers.ts | Update status, progress, location |
| `containers.remove` | containers.ts | Delete container |
| `containers.getStats` | containers.ts | Aggregate statistics |
| `containers.seedContainers` | containers.ts | Seed 3 demo containers |
| `sourcing.list` | sourcing.ts | List with optional status filter |
| `sourcing.create` | sourcing.ts | New sourcing request |
| `sourcing.update` | sourcing.ts | Update status, notes |
| `sourcing.remove` | sourcing.ts | Delete request |
| `sourcing.getStats` | sourcing.ts | Aggregate statistics |
| `inspections.list` / `create` / `update` / `remove` / `getStats` | inspections.ts | Full CRUD for inspections |
| `quotes.list` / `create` / `update` / `remove` / `getStats` | quotes.ts | Full CRUD with auto‑pricing |
| `auth.login` / `createAdmin` / `listUsers` / `updateUser` / `deleteUser` | auth.ts | Auth & user management |
| `settings.get` / `set` / `getAll` / `remove` / `seedDefaults` | settings.ts | Key‑value settings |
| `aiModels.list` / `create` / `update` / `remove` / `toggleActive` | aiModels.ts | AI model config |
| `apiKeys.list` / `create` / `update` / `remove` / `toggleActive` | apiKeys.ts | API key management |
| `prompts.list` / `create` / `update` / `remove` / `seedDefaults` | prompts.ts | System prompts |
| `emailTemplates.list` / `create` / `update` / `remove` / `seedDefaults` | emailTemplates.ts | Email templates |
| `audit.log` / `list` / `getRecent` / `clearOld` | audit.ts | Audit logging |
| `chat.listBySession` / `sendMessage` | chat.ts | Chat history |

---

## 📁 File Structure

```
baane-logistics/
├── convex/                    # Convex backend
│   ├── _generated/           # Auto‑generated types
│   ├── schema.ts             # Database schema (12 tables)
│   ├── auth.ts               # Authentication functions
│   ├── containers.ts         # Container tracking CRUD
│   ├── sourcing.ts           # Sourcing requests CRUD
│   ├── inspections.ts        # Inspection bookings CRUD
│   ├── quotes.ts             # Cargo quotes with auto‑pricing
│   ├── chat.ts               # AI chat & fallback responses
│   ├── aiModels.ts           # AI model configuration
│   ├── apiKeys.ts            # API key management
│   ├── prompts.ts            # System prompt templates
│   ├── emailTemplates.ts     # Email template management
│   ├── settings.ts           # Key‑value settings store
│   ├── audit.ts              # Audit logging
│   └── http.ts               # HTTP action handlers
├── src/                       # Frontend
│   ├── main.tsx              # SPA entry + routing
│   ├── App.tsx               # Main public SPA
│   ├── index.css             # Tailwind + brand theme
│   ├── types.ts              # TypeScript interfaces
│   ├── translations.ts       # EN/SO translations
│   ├── convexClient.tsx      # Convex client provider
│   ├── vite-env.d.ts         # Vite env types
│   ├── admin/
│   │   ├── AdminApp.tsx      # Admin root (auth guard)
│   │   ├── AdminDashboard.tsx # 12‑tab dashboard layout
│   │   ├── AdminLogin.tsx    # Login form
│   │   └── tabs/
│   │       ├── OverviewTab.tsx
│   │       ├── ContainersTab.tsx
│   │       ├── SourcingTab.tsx
│   │       ├── InspectionsTab.tsx
│   │       ├── QuotesTab.tsx
│   │       ├── UsersTab.tsx
│   │       ├── AuditTab.tsx
│   │       ├── SettingsTab.tsx
│   │       ├── AiModelsTab.tsx
│   │       ├── PromptsTab.tsx
│   │       ├── ApiKeysTab.tsx
│   │       └── EmailTemplatesTab.tsx
│   ├── components/
│   │   ├── Logo.tsx          # SVG brand logo (icon + seal)
│   │   ├── ErrorBoundary.tsx # React error boundary
│   │   ├── TrackingSection.tsx # Live tracking UI
│   │   ├── SourcingSection.tsx # Sourcing request form
│   │   ├── InspectionSection.tsx # Inspection booking
│   │   ├── PaymentSection.tsx # Escrow payment UI
│   │   ├── InteractiveMap.tsx # Map visualization
│   │   └── ChatAssistant.tsx # AI chat interface
│   └── hooks/
│       ├── useGsapAnimations.ts # GSAP reusable hooks
│       └── usePageTracking.ts   # Performance metrics
├── index.html                 # HTML entry point
├── vite.config.ts            # Vite build + proxy config
├── vercel.json               # Vercel deployment config
├── tsconfig.json             # TypeScript config
├── .env.example              # Environment variables
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies & scripts
├── README.md                 # Quick start guide
└── DOC.md                    # This document
```

---

## 🔧 Setup & Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_CONVEX_URL` | No | *hardcoded* | Convex deployment URL |
| `VITE_CONVEX_SITE_URL` | No | *hardcoded* | Convex HTTP actions URL |

No `.env` file is required for development — URLs are hardcoded in `vite.config.ts`.

### Convex Setup

```bash
# Login to Convex
npx convex login

# Link to existing project
npx convex dev --configure=existing --team abdirahman-baane --project baane-logistics

# Deploy functions
npx convex deploy

# Seed initial data (run once)
# Visit http://localhost:3000 to trigger seeding via admin panel
```

### Admin First-Time Setup

1. Visit `http://localhost:3000/admin`
2. Login with `admin@baane.com` / `admin123`
3. Visit Settings tab → seed default settings
4. Visit AI Models tab → add Gemini API key
5. Visit Prompts tab → seed default prompts
6. Visit Emails tab → seed default templates

---

## 🚀 Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Vercel auto‑detects Vite config
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variables: Set `VITE_CONVEX_URL`

### Convex

```bash
npx convex deploy
```

---

## 🧪 Demo Data

The system seeds the following demo data:

- **3 Containers**: BAANE-SEA-8821 (in transit), BAANE-AIR-5042 (delivered), BAANE-SEA-9013 (origin customs)
- **18 Default Settings**: Company info, AI config, shipping rates
- **3 System Prompts**: AI Copilot, Sourcing AI, Inspection AI
- **2 Email Templates**: Sourcing confirmation, Inspection scheduled

---

## 🔐 Security

- **Password hashing**: SHA-256 (in production, use bcrypt/argon2)
- **Admin sessions**: localStorage token (in production, use httpOnly cookies)
- **API keys**: Masked in list view (first 8 + last 4 chars)
- **Audit logging**: All mutations logged with user, action, entity, timestamp
- **CORS**: Convex handles cross‑origin automatically

---

## 🧹 Performance Optimizations

- **Code splitting**: Vendor, Convex, GSAP, Motion, Icons split into separate chunks
- **Lazy loading**: AdminApp and sections loaded via `import()` on route match
- **GSAP cleanup**: All ScrollTrigger instances killed on component unmount
- **React.memo**: ChatAssistant, TrackingSection, Logo memoized
- **Minification**: esbuild (fast builds), terser option available
- **SPA routing**: Vite `appType: 'spa'` for client‑side routing

---

## 🌐 Translation System

The app supports English (`en`) and Somali (`so`) via `src/translations.ts`. The language toggle persists in `localStorage` under the `baane_lang` key.

---

## 📊 Admin Panel Tabs

| Tab | Data Source | Actions |
|-----|-------------|---------|
| **Overview** | All queries | Stats cards + recent items |
| **Containers** | containers | Search, create, edit, delete |
| **Sourcing** | sourcing | Filter by status, create, edit, delete |
| **Inspections** | inspections | Filter, create, edit, delete |
| **Quotes** | quotes | Filter, update status, delete |
| **Users** | auth | Create, edit role/status, delete |
| **Audit Log** | audit | View all system actions |
| **Settings** | settings | Edit key‑value pairs |
| **AI Models** | aiModels | Add/edit/toggle/delete models |
| **Prompts** | prompts | Add/edit/version/delete prompts |
| **API Keys** | apiKeys | View masked keys, toggle, delete |
| **Emails** | emailTemplates | Add/edit/delete email templates |

---

## 📝 Git Workflow

```bash
git add .
git commit -m "feat: description"
git push origin master
```

Branch rename: `git branch -m master main && git push -u origin main`
