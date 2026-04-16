# Lenus Pharmacy — E-Commerce Platform

A compliant, mobile-first e-commerce platform for **Lenus Pharma Ltd** (Lakeside, Botwe 3rd Gate, Madina). Built for Ghana: guest checkout, GhanaPostGPS, NEPP seal, and prescription orders via WhatsApp.

**Spec:** Internal specs stay in local `docs/` (untracked except [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)). **Deploy / CI / Vercel:** see that deployment guide.

## Stack

- **Monorepo:** Turborepo
- **Web:** Next.js 14 (App Router), Tailwind CSS, TypeScript
- **API:** Fastify, TypeScript, Prisma
- **Database:** PostgreSQL (required). Local: `docker compose up -d` then set `DATABASE_URL` in `apps/api/.env`.
- **Shared:** `@lenus/shared` (types, Zod schemas, constants)

## Prerequisites

- Node.js 18+
- npm 9+ or pnpm 9+
- PostgreSQL (local or Docker)

## Setup

1. **Clone and install**

   ```bash
   cd LenusPharmacy
   npm install
   ```
   Or with pnpm: `pnpm install` (use `workspace:*` in apps' package.json for `@lenus/shared`).

2. **Environment**

   Copy `.env.example` to `.env` in the repo root (or in `apps/api` for DB and API). Set at least:

   - `DATABASE_URL` — PostgreSQL connection string
   - `NEXT_PUBLIC_API_URL` — e.g. `http://localhost:4000/api` for local dev

3. **Build shared package** (required before API or seed)

   ```bash
   npm run build --workspace=@lenus/shared
   ```
   Or run `npm run build` from root (builds all).

4. **Database (PostgreSQL)**

   Start Postgres locally:
   ```bash
   docker compose up -d
   ```
   In `apps/api/.env` set `DATABASE_URL` (see [`.env.example`](.env.example) or [`apps/api/.env.example`](apps/api/.env.example)).

   From repo root:
   ```bash
   npm run db:generate --workspace=api
   cd apps/api && npx prisma migrate deploy && cd ../..
   npm run db:seed --workspace=api
   ```

   **Existing DB (branch renames):** From `apps/api` run `npm run db:ensure` to normalize branch slugs without wiping catalog.

   Optional: set `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` (and pharmacist vars) before `db:seed` to create staff accounts.

   The seed creates three branches (Lakeside Estates, Botwe 3rd Gate, Madina), typical Ghanaian pharmacy OTC/POM products, and sample orders for testing.

   **Production deploy:** see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) and `apps/api/.env.example`.

5. **Run**

   - **Start the API first:** `npm run dev --workspace=api` (http://localhost:4000). Visiting http://localhost:4000 shows a short message and links to `/api/products`, `/api/branches`.
   - **Then start the web app:** `npm run dev --workspace=web` (http://localhost:3000). Open http://localhost:3000/products to browse products.
   - Or from root: `npm run dev` (runs both via Turbo).

   **Products not loading?** The web app calls the API at `http://127.0.0.1:4000/api` by default. Ensure (1) the API is running, (2) the DB is seeded (`npm run db:seed` in `apps/api`), (3) restart the web dev server after any env change. Optional: copy `apps/web/.env.local.example` to `apps/web/.env.local` and set `NEXT_PUBLIC_API_URL=http://127.0.0.1:4000/api` if you use a different API URL.

6. **Verify products (optional)**

   With the API running, from the repo root:
   ```bash
   npm run verify:products
   ```
   This checks that `GET /api/products` returns data. If it fails, start the API (`npm run dev --workspace=api`) and run `npm run db:seed` in `apps/api`, then run `npm run verify:products` again.

## Build

```bash
npm run build
```
(Builds `@lenus/shared`, then `api`, then `web`. Run from root.)

## Project structure

```
apps/
  web/          # Next.js — customer site (Home, Products, Cart, Checkout)
  api/          # Fastify — products, orders, branches; Prisma + PostgreSQL
packages/
  shared/       # Types, Zod schemas, constants (branches, WhatsApp, NEPP)
```

## Key flows

- **Browse & buy:** No login. Add OTC products to cart, checkout with name, phone, GhanaPostGPS, address, and consent.
- **Prescription (POM):** “Order via WhatsApp” opens WhatsApp with prefilled text; staff enter order in backend.
- **Footer:** NEPP seal links to [gnepplatform.com/providers?type=e-pharmacy](https://gnepplatform.com/providers?type=e-pharmacy).

## License

Private — Lenus Pharma Ltd.
