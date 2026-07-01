# 🚢 Baane Logistics

**China → Somaliland sourcing, tracking & logistics platform**

Baane Logistics is a full‑stack logistics platform that connects Chinese industrial markets (Yiwu, Shenzhen, Guangzhou) directly to Somaliland. It combines factory sourcing, quality inspection, secure escrow payments, and satellite container tracking in a single dashboard.

## ✨ Features

- **🛰️ Live Container Tracking** — Search by Bill of Lading, container serial, or air waybill. Real‑time IoT telemetry (temp, humidity) and route timeline.
- **📦 Product Sourcing** — Submit sourcing requests for Chinese markets. Track supplier search, sample verification, and quotation status.
- **🛡️ Quality Inspection** — Book factory audits, DUPRO, PSI, or container loading supervision across 6 Chinese industrial cities.
- **💳 Secure Escrow** — USD→CNY escrow payment with inspection‑triggered release.
- **🤖 AI Copilot** — Gemini‑powered sourcing advisor with bilingual (EN/SO) support.
- **🔧 Admin Panel** (`/admin`) — Full CRUD for containers, sourcing, inspections, quotes, users, settings, AI models, prompts, API keys, email templates, and audit logs.

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4 |
| **Animations** | GSAP (ScrollTrigger) + Motion (Framer Motion) |
| **Backend** | Convex Cloud (serverless DB + functions + HTTP actions) |
| **Database** | Convex (schema: 10 tables with indexes) |
| **AI** | Google Gemini via Convex HTTP actions |
| **Deployment** | Vercel (SPA), Convex Cloud |
| **Icons** | Lucide React |

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:3000
# → Admin at http://localhost:3000/admin

# 3. (Optional) Deploy Convex functions
npx convex deploy
```

### Admin Demo Credentials

- **Email:** `admin@baane.com`
- **Password:** `admin123`

## 🏗️ Architecture

```
baane-logistics/
├── convex/              # Convex backend (serverless)
│   ├── schema.ts       # DB schema (10 tables)
│   ├── auth.ts         # User auth (SHA-256 hashing)
│   ├── containers.ts   # Container tracking CRUD
│   ├── sourcing.ts     # Sourcing requests CRUD
│   ├── inspections.ts  # Inspection bookings CRUD
│   ├── quotes.ts       # Cargo quotes with auto-pricing
│   ├── chat.ts         # AI fallback responses
│   ├── aiModels.ts     # AI model config management
│   ├── apiKeys.ts      # API key management
│   ├── prompts.ts      # System prompt templates
│   ├── emailTemplates.ts # Email template management
│   ├── settings.ts     # Key-value settings store
│   ├── audit.ts        # Audit logging
│   ├── http.ts         # HTTP actions (legacy API compat)
│   └── _generated/     # Auto-generated Convex types
├── src/
│   ├── main.tsx        # Entry point (SPA routing)
│   ├── App.tsx         # Main public SPA
│   ├── index.css       # Brand theme + Tailwind
│   ├── types.ts        # TypeScript interfaces
│   ├── translations.ts # EN/SO translations
│   ├── convexClient.tsx # Convex client provider
│   ├── admin/          # Admin panel (12 tabs)
│   │   ├── AdminApp.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   └── tabs/       # Individual admin tabs
│   ├── components/     # React components
│   │   ├── Logo.tsx, ErrorBoundary.tsx
│   │   ├── TrackingSection.tsx
│   │   ├── SourcingSection.tsx
│   │   ├── InspectionSection.tsx
│   │   ├── PaymentSection.tsx
│   │   ├── ChatAssistant.tsx
│   │   └── InteractiveMap.tsx
│   └── hooks/          # Custom hooks
│       ├── useGsapAnimations.ts
│       └── usePageTracking.ts
├── public/             # Static assets
├── vercel.json         # Vercel deployment config
├── vite.config.ts      # Vite + proxy config
└── DOC.md              # Full technical documentation
```

## 🎨 Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#0A2540` | Primary backgrounds, cards |
| Teal | `#00D4AA` | Accent, CTAs, active states |
| Gold | `#D4AF37` | Highlights, security badges |
| Deep | `#020914` | Page background |
| Surface Dark | `#030d1a` | Card elevated surfaces |
| Surface Mid | `#061a2c` | Section backgrounds |

## 🌐 API Endpoints (Convex HTTP Actions)

- `GET /api/health` — Health check
- `GET /api/tracking/:id` — Container tracking lookup
- `POST /api/sourcing` — Submit sourcing request
- `POST /api/inspection` — Book inspection
- `POST /api/quotes` — Request cargo quote
- `POST /api/chat` — AI assistant chat

## 📦 Deployment

### Vercel (Frontend)

1. Push to GitHub
2. Import repo in Vercel
3. Framework: Vite
4. Build: `npm run build`
5. Output: `dist`
6. Environment: `VITE_CONVEX_URL` = Convex deployment URL

### Convex (Backend)

```bash
npx convex deploy
```

## 📄 License

Private — Baane Logistics
