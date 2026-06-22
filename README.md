# PiecesMaroc

A car-parts marketplace for Morocco — built with **Next.js 16**, **React 19**, **Tailwind v4**,
**shadcn/ui** and **Supabase**. Find parts by make / model / engine, browse by category, add to a
cart, and check out over WhatsApp. Sign in with Google.

## Features

- 🔎 **Vehicle selector** — cascading Make → Model → Engine/Year filter
- 🛒 **Shopping cart** — persistent (localStorage), slide-over + full cart page
- 💬 **WhatsApp checkout** — orders are sent as a formatted message to your business number
- 🔐 **Google sign-in** — Supabase Auth with cookie-based sessions
- 🗂️ **Catalog** — 65 makes, 4.4k models, 32k vehicles, 297 categories, 9k parts (from `cartec-export.json`)
- 🎛️ **Filters & sort** — category, brand, price range, in-stock; price / newest sort; pagination

## Setup

### 1. Environment

Copy `.env.example` to `.env.local` and fill in your Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # migration script only
NEXT_PUBLIC_WHATSAPP_NUMBER=212660639304          # orders are sent here
```

### 2. Database

In the Supabase **SQL editor**, run [`supabase/schema.sql`](supabase/schema.sql). This creates the
`makes`, `models`, `vehicles`, `categories`, `products` and `profiles` tables, RLS policies, and the
profile-on-signup trigger.

### 3. Google OAuth

In Supabase → **Authentication → Providers → Google**: enable it and add your Google OAuth client
ID/secret. Then under **Authentication → URL Configuration**, add the redirect URL:

```
http://localhost:3000/auth/callback
```

(and your production URL when you deploy).

### 4. Load the catalog

```bash
npm install
npm run migrate     # loads cartec-export.json into Supabase (idempotent)
```

Expected counts: ~65 makes, ~4.4k models, ~32k vehicles, 297 categories, ~9k products.

> Prices: parts without a real price get a deterministic, realistic MAD price (flagged
> `is_synthetic_price = true`) so every item is buyable. Swap them for real data anytime.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

| Path | Purpose |
| --- | --- |
| `supabase/schema.sql` | Database schema + RLS + auth trigger |
| `scripts/migrate-cartec.ts` | One-shot importer (`npm run migrate`) |
| `lib/supabase/` | SSR + browser Supabase clients, middleware session refresh |
| `lib/db/` | Server data layer (`catalog.ts`, `products.ts`) |
| `lib/cart/` | Cart context + WhatsApp message builder |
| `components/` | UI — `Header`, `Footer`, `Hero`, `ProductCard`, `VehicleSelector`, `cart/`, `catalog/` |
| `app/` | Routes — home, `/products`, `/products/[id]`, `/categories`, `/vehicles/[id]`, `/cart`, `/checkout`, `/login`, `/account` |

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run migrate` — import catalog into Supabase
- `npm run lint` — eslint
