# Baane Logistics — Technical Documentation

> **Version:** 2.0.0
> **Last Updated:** July 2026
> **Stack:** React 19 + Express + Convex (PostgreSQL/Document DB) + Tailwind v4

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Browser (SPA)                      │
│  ┌────────────────────────────────────────────────┐  │
│  │           Vite Dev Server (port 3000)           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │  │
│  │  │ Public    │  │ Admin    │  │ Components   │ │  │
│  │  │ App.tsx   │  │ AdminApp │  │ (7 modules)  │ │  │
│  │  └──────────┘  └──────────┘  └──────────────┘ │  │
│  └────────────────────────────────────────────────┘  │
│                        │                              │
│                        ▼                              │
│              ┌─────────────────┐                      │
│              │  Convex Client   │                      │
│              │  (Real-time SDK) │                      │
│              └────────┬────────┘                      │
└───────────────────────┼──────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              Convex Cloud Backend                     │
│  ┌────────────────────────────────────────────────┐  │
│  │           HTTP Router (http.ts)                 │  │
│  │  /api/tracking /api/sourcing /api/chat ...      │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │
│  │auth.ts │ │cont-   │ │sourc-  │ │inspections.ts│  │
│  │        │ │ainers  │ │ing.ts  │ │              │  │
│  └────────┘ └────────┘ └────────┘ └──────────────┘  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │
│  │quotes  │ │chat.ts │ │sett-   │ │aiModels.ts   │  │
│  │.ts     │ │        │ │ings.ts │ │              │  │
│  └────────┘ └────────┘ └────────┘ └──────────────┘  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │
│  │prompts │ │apiKeys │ │email-  │ │audit.ts      │  │
│  │.ts     │ │.ts     │ │Tmpl.ts │ │              │  │
│  └────────┘ └────────┘ └────────┘ └──────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │              Schema (10 Tables)                  │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 2. Stack Overview

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.0.1 | UI Library (Server Components ready) |
| TypeScript | ~5.8.2 | Type-safe development |
| Vite | ^6.2.3 | Build tool & dev server |
| Tailwind CSS | ^4.1.14 | Utility-first CSS |
| Framer Motion (motion) | ^12.23.24 | Page transitions & layout animations |
| GSAP (GreenSock) | ^3.12 | Scroll-triggered entrances, counters, parallax |
| GSAP (GreenSock) | ^3.12 | Scroll-triggered entrances, counters, parallax |
| Lucide React | ^0.546.0 | Icon library |
| Convex React | ^1.42 | Real-time data fetching |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express | ^4.21.2 | HTTP server (dev mode Vite middleware) |
| Convex | ^1.42 | Backend platform (DB + Serverless functions) |
| esbuild | ^0.25.0 | Production bundler |
| tsx | ^4.21.0 | TypeScript execution for dev server |
| dotenv | ^17.2.3 | Environment variables |
| @google/genai | ^2.4.0 | Gemini AI API |

### Infrastructure
| Component | URL |
|-----------|-----|
| Convex Cloud DB | `https://tangible-husky-835.eu-west-1.convex.cloud` |
| Convex HTTP Actions | `https://tangible-husky-835.eu-west-1.convex.site` |
| Convex Dashboard | [Link](https://dashboard.convex.dev/t/abdirahman-baane/baane-logistics/tangible-husky-835) |
| Local Dev Server | `http://localhost:3000` |

---

## 3. Directory Structure

```
baane-logistics/
├── convex/                    # Convex backend (serverless functions)
│   ├── schema.ts              # Database schema (10 tables)
│   ├── auth.ts                # Authentication queries & mutations
│   ├── containers.ts          # Container CRUD + stats
│   ├── sourcing.ts            # Sourcing requests CRUD
│   ├── inspections.ts         # Inspection bookings CRUD
│   ├── quotes.ts              # Cargo quotes CRUD with auto-pricing
│   ├── chat.ts                # Chat messages + fallback AI
│   ├── settings.ts            # Key-value settings store
│   ├── aiModels.ts            # AI model configuration
│   ├── prompts.ts             # System prompt management
│   ├── apiKeys.ts             # External API key management
│   ├── emailTemplates.ts      # Email template CRUD
│   ├── audit.ts               # Audit logging
│   ├── http.ts                # Legacy REST API compatibility
│   └── _generated/            # Auto-generated Convex types
├── src/
│   ├── main.tsx               # Entry point with routing
│   ├── App.tsx                # Main public SPA
│   ├── convexClient.tsx       # Convex provider wrapper
│   ├── index.css              # Enhanced design system (glass, gradients, grid)
│   ├── translations.ts        # EN + Somali bilingual dictionary
│   ├── types.ts               # Shared TypeScript interfaces
│   ├── vite-env.d.ts          # Vite env type declarations
│   ├── components/            # Reusable React components
│   │   ├── ErrorBoundary.tsx  # Error boundary wrapper
│   │   ├── ChatAssistant.tsx  # AI chat interface
│   │   ├── InspectionSection.tsx
│   │   ├── InteractiveMap.tsx # SVG route map with hover
│   │   ├── Logo.tsx            # SVG brand logo (icon + seal)
│   │   ├── PaymentSection.tsx  # Currency + freight calculator
│   │   ├── SourcingSection.tsx # Sourcing request form
│   │   └── TrackingSection.tsx # Container tracking search
│   ├── admin/                 # Admin panel
│   │   ├── AdminApp.tsx       # Admin SPA wrapper
│   │   ├── AdminLogin.tsx     # Login page
│   │   ├── AdminDashboard.tsx # Main dashboard layout
│   │   └── tabs/              # 12 tab modules
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
│   ├── hooks/useGsapAnimations.ts # GSAP animation library (8 hooks)
│   ├── hooks/useGsapAnimations.ts # GSAP animation library (8 hooks)
│   └── hooks/
│       └── usePageTracking.ts # Performance monitoring
├── server.ts                  # Express server (dev + prod)
├── index.html                 # Vite entry HTML
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies & scripts
├── DOC.md                     # This file
├── README.md                  # Quick start guide
└── .env.example               # Environment variables template
```

---

## 4. Database Schema (10 Tables)

### `users`
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Full name |
| `email` | string (unique) | Login email |
| `passwordHash` | string | SHA-256 hash |
| `role` | "admin" / "staff" / "viewer" | Access level |
| `isActive` | boolean | Account status |
| `lastLogin` | string (optional) | ISO timestamp |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string | ISO timestamp |

### `containers`
| Field | Type | Description |
|-------|------|-------------|
| `trackingId` | string | e.g. BAANE-SEA-8821 |
| `type` | "Sea Cargo" / "Air Cargo" | Transport mode |
| `carrier` | string | Shipping line |
| `vessel` | string | Vessel/flight name |
| `origin` / `destination` | string | Port names |
| `status` | string | Current status |
| `progress` | number (0-100) | Transit percentage |
| `metrics` | `{temperature, humidity, status}` | IoT sensor data |
| `departureDate` / `arrivalDate` | string | Dates |
| `shipper` / `consignee` | string | Parties |
| `cargoDetails` | string | Cargo description |
| `weight` | string | Cargo weight |
| `currentLocation` | string | Real-time position |
| `route` | RouteCheckpoint[] | Array of checkpoints |
| Indexes: `by_trackingId`, `by_status`, `by_type` |

### `sourcingRequests`
| Field | Type | Description |
|-------|------|-------------|
| `name`, `phone` | string | Contact info |
| `productType` | string | Product description |
| `quantity` | string | Target volume |
| `budget` | string (optional) | Budget in USD |
| `targetMarket` | string | City/market in China |
| `description` | string (optional) | Specifications |
| `status` | enum | Workflow status |
| `notes` | string (optional) | Admin notes |
| `assignedTo` | string (optional) | Staff assignment |
| `quotationAmount` | string (optional) | Quote in USD |
| `supplierFound` | string (optional) | Supplier name |

### `inspectionRequests`
Adds: `inspectorName`, `reportUrl`, `reportData`, `photos`

### `cargoQuotes`
Adds: `estimatedCost`, `estimatedDuration`, `breakdown` (freight, insurance, customs, handling, total)

### `settings` (Key-Value Store)
| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Setting identifier |
| `value` | any | Setting value |
| `category` | string | Grouping (general, contact, ai, currency, shipping) |
| `description` | string (optional) | Human-readable description |

### `aiModels`
| Field | Type | Description |
|-------|------|-------------|
| `provider` | enum | google / openai / anthropic / custom |
| `modelId` | string | e.g. gemini-2.0-flash |
| `apiKey` | string | Encrypted API key |
| `baseUrl` | string (optional) | Custom endpoint |
| `isActive` | boolean | Toggle on/off |
| `capabilities` | string[] | Feature tags |
| `maxTokens` / `temperature` | number | Model parameters |

### Other Tables
- **`systemPrompts`** — Versioned AI system prompts with categories
- **`apiKeys`** — External integration keys with scopes & expiry
- **`emailTemplates`** — Transactional email templates with `{{variable}}` support
- **`chatMessages`** — Conversation history with session grouping
- **`auditLog`** — Immutable audit trail for all entity actions

---

## 5. API Endpoints

### Convex HTTP Actions (Legacy REST compatibility)
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Health check |
| GET | `/api/tracking/:id` | Container lookup with dynamic fallback |
| POST | `/api/sourcing` | Create sourcing request |
| POST | `/api/inspection` | Book inspection |
| POST | `/api/quotes` | Request cargo quote |
| POST | `/api/chat` | AI chat (fallback mode) |

### Convex Queries (React hooks)
```tsx
// All queries are real-time via Convex SDK
useQuery(api.containers.getByTrackingId, { trackingId })
useQuery(api.containers.list, { status, type })
useQuery(api.containers.getStats)
useQuery(api.sourcing.list, { status })
useQuery(api.inspections.list, { status })
useQuery(api.quotes.list, { status })
useQuery(api.settings.getAll)
useQuery(api.settings.getByCategory, { category })
useQuery(api.aiModels.list)
useQuery(api.aiModels.getActive)
useQuery(api.prompts.list, { category })
useQuery(api.auth.listUsers)
useQuery(api.audit.getRecent, { limit })
```

---

## 6. Brand & Design System

### Colors
```
Brand Navy     #0A2540  — Primary backgrounds, navbars
Brand Teal     #00D4AA  — Primary accent, active states, buttons
Brand Gold     #D4AF37  — Secondary accent, highlights, premium badges
Brand White    #FFFFFF  — Text, icons
Brand Charcoal #2D2D2D  — Secondary text
```
- Background: `#020914` (deep space navy)
- Card backgrounds: `#0A2540` (brand-navy)
- Input backgrounds: `#030d1a`

### Typography
```
Font Sans:      Inter (body text)
Font Display:   Montserrat (headings, labels)
Font Mono:      JetBrains Mono (code, metrics, data)
```

### Animation Tokens

| Token | Duration | Easing | Description |
|-------|----------|--------|-------------|
| `glowPulse` | 2s | cubic-bezier | Pulsing glow on active elements |
| `radarSweep` | 4s | linear | Radar rotation for tracking |
| `float` | 6s | ease-in-out | Floating hover motion |
| `shimmer` | 3s | ease-in-out | Shimmer loading effect |
| `borderGlow` | 3s | ease-in-out | Animated border pulse |
| `scanline` | 8s | linear | Scanline overlay for tech feel |

### GSAP Animation Hooks (src/hooks/useGsapAnimations.ts)

| Hook | Purpose |
|------|---------|
| `useFadeInUp` | Fade + slide entrance on mount |
| `useStaggerChildren` | Staggered child element reveals |
| `useScrollReveal` | Scroll-triggered entrance with scale |
| `useParallax` | Parallax scroll effect |
| `useCounter` | Animated number counter for stats |
| `usePageEntrance` | Master GSAP timeline for page load |
| `useGsapCleanup` | Kills all tweens/ScrollTriggers on unmount |

### CSS Utility Classes

| Class | Purpose |
|-------|---------|
| `.text-gradient` | Teal-to-gold gradient text fill |
| `.text-gradient-teal` | Teal-to-cyan gradient text fill |
| `.text-gradient-gold` | Gold-to-light-gold gradient text fill |
| `.glass-panel` | Blurred glass background with teal border |
| `.glass-card` | Deeper glass card for containers |
| `.glow-border` | Animated gradient border via pseudo-element |
| `.grid-pattern` | Subtle grid overlay for hero backgrounds |
| `.radial-glow` | Radial gradient glow overlay |
| `.scanline` | Animated horizontal scanline (tech aesthetic) |

### Page Section Animations

| Section | Animation Technique |
|---------|-------------------|
| Navbar | GSAP timeline fade-in from top (-30px), Framer Motion `layoutId` pill spring |
| Hero | GSAP staggered 3-layer reveal (badge → heading → CTA), floating orbs |
| Stats Bar | ScrollTrigger `textContent` counter animation via GSAP |
| Command Station | Framer Motion `layoutId` tab pill spring, `whileInView` entrance |
| Corridors | GSAP `fromTo` staggered cards from left with ScrollTrigger |
| Footer | Framer Motion `whileInView` fade-in |
| Floating WhatsApp | Spring scale entrance from 0 with 2s delay

### Component States
- Loading: Three bouncing dots in brand-teal
- Error: Red border + icon with message
- Success: Green with CheckCircle icon
- Empty: Gray centered text with helpful message

---

## 7. Admin Panel

**URL:** `/admin`
**Default Login:** `admin@baane.com` / `admin123`

### 12 Tabs
1. **Overview** — Dashboard with 6 stat cards, recent containers, activity feed, sourcing & quote snippets
2. **Containers** — Table with inline edit, progress bars, create/delete
3. **Sourcing** — Kanban board (Received → Searching → Verifying → Quoted → Completed)
4. **Inspections** — Sortable data table with city/scope filters
5. **Quotes** — Searchable table with auto-calculated cost breakdown
6. **Users** — User management with roles & active status
7. **Audit Log** — Full activity history with timestamps
8. **Settings** — 17 configurable settings across 5 categories
9. **AI Models** — Full CRUD for Gemini/OpenAI/Anthropic/Custom
10. **Prompts** — Versioned system prompts with copy/edit/delete
11. **API Keys** — Masked key management with active toggle
12. **Email Templates** — Templates with `{{variable}}` injection

---

## 8. Performance Optimizations

- **Code Splitting**: Lazy-loaded components via `React.lazy()` + `Suspense`
- **Route-based chunking**: `/admin` loads separately from public app
- **React.memo**: All 7 components wrapped to prevent unnecessary re-renders
- **useCallback**: Event handlers stable across renders
- **requestAnimationFrame**: Replaces setTimeout for scroll operations
- **GSAP ScrollTrigger**: Animations only fire when elements enter viewport
- **useGsapCleanup**: All tweens killed on component unmount (no memory leaks)
- **CSS will-change**: GPU-accelerated properties (transform, opacity) only
- **Glassmorphism**: `backdrop-filter: blur()` for performant frosted glass effects
- **Tailwind JIT**: Only generates used CSS classes
- **Convex Real-time**: Optimistic updates + WebSocket push
- **Static file caching**: `maxAge: "1y"` for production assets
- **Error Boundaries**: Graceful fallbacks for component crashes

---

## 9. Scripts

```bash
npm run dev          # Start development server (tsx server.ts)
npm run build        # Build for production (vite + esbuild)
npm run start        # Start production server (node dist/server.js)
npm run lint         # TypeScript type check (tsc --noEmit)
npm run clean        # Remove dist and build artifacts
```

---

## 10. Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | HTTP server port |
| `GEMINI_API_KEY` | No | — | Google Gemini API key |
| `VITE_CONVEX_URL` | No | Convex cloud URL | Convex backend URL |
| `NODE_ENV` | No | `development` | Environment mode |

---

## 11. Convex Cloud

- **URL**: `https://tangible-husky-835.eu-west-1.convex.cloud`
- **HTTP Actions**: `https://tangible-husky-835.eu-west-1.convex.site`
- **Dashboard**: [Convex Console](https://dashboard.convex.dev/t/abdirahman-baane/baane-logistics/tangible-husky-835)
- **Functions**: 40+ queries & mutations across 12 modules
- **Auth**: SHA-256 hashed passwords, role-based access (admin/staff/viewer)

---

## 12. Tracking Seed Data

| ID | Mode | Route | Status |
|----|------|-------|--------|
| BAANE-SEA-8821 | Sea | Shenzhen → Berbera | In Transit (72%) |
| BAANE-AIR-5042 | Air | Guangzhou → Hargeisa | Delivered |
| BAANE-SEA-9013 | Sea | Ningbo → Berbera | Origin Customs (18%) |

---

*Documentation generated for Baane Logistics v2.0.0 — Convex Cloud Backend*
