# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**Lenus Pharmacy** is a Ghanaian online pharmacy platform. Turborepo monorepo with:
- `apps/api` — Fastify 4 REST API (Node.js / TypeScript)
- `apps/web` — Next.js 14 App Router storefront + staff admin
- `packages/shared` — `@lenus/shared`: Zod schemas, TypeScript types, and constants shared between both apps

## Common Commands

```bash
# Development (run both apps concurrently)
npm run dev

# Build all workspaces
npm run build

# Lint all workspaces
npm run lint

# Run in a single workspace
npm run dev --workspace=api
npm run dev --workspace=web
npm run lint --workspace=api       # tsc --noEmit
npm run lint --workspace=web       # next lint

# Database
npm run db:migrate --workspace=api   # prisma migrate dev
npm run db:seed --workspace=api      # populate seed data
npm run db:generate --workspace=api  # regenerate Prisma client after schema changes

# Secret scanning (local)
npm run secret-scan
```

There is currently no test suite. The only verification script is `npm run verify:products`, which hits `GET /api/products` to confirm the API responds.

## Local Setup

```bash
docker compose up -d                           # Start PostgreSQL 16
cp apps/api/.env.example apps/api/.env         # Fill in values
cp apps/web/.env.local.example apps/web/.env.local
npm install                                    # Also auto-builds @lenus/shared
npm run db:migrate --workspace=api
npm run db:seed --workspace=api
npm run dev
```

## Architecture

### Data Flow

Web (Next.js) calls API (Fastify) over HTTP using `NEXT_PUBLIC_API_URL`. The `@lenus/shared` package ships Zod schemas and TS types used for validation on both sides. No GraphQL, no tRPC — plain fetch.

### API (`apps/api/src/`)

Fastify plugin architecture. Each domain is a separate plugin registered via `fastify.register()`:

| Route prefix | Auth | Purpose |
|---|---|---|
| `/health` | none | health check |
| `/api/products` | none | product catalogue |
| `/api/branches` | none | branch info |
| `/api/orders` | none | guest order creation |
| `/api/payments` | Paystack HMAC | webhook reconciliation |
| `/api/admin/*` | JWT | staff login, orders, stock, POM approvals |

Services live in `src/services/`: `orderService`, `paymentApplyService`, `paystackService`, `notificationService`.

Prisma client is a global singleton (`src/db.ts`). After any schema change in `prisma/schema.prisma`, run `db:generate` then rebuild.

### Web (`apps/web/app/`)

Next.js App Router. Pages are a mix of server components (product lists, order confirmation) and client components (cart, checkout form, admin dashboard).

Customer flow: `products/` → `cart/` → `checkout/` → Paystack redirect → `checkout/complete/`

Staff flow: `admin/login/` → `admin/orders/` or `admin/products/`

Prescription (POM) orders bypass the checkout flow — users are sent to WhatsApp (`wa.me/233548325792`) where staff manually create the order in the admin panel. Pharmacists then approve/reject via `admin/orders/[id]/`.

### Shared Package (`packages/shared/`)

Built to CommonJS via `tsc`. Both apps import from `@lenus/shared`. Run `npm run build --workspace=@lenus/shared` before the other apps if types are out of date. The postinstall hook does this automatically after `npm install`.

Key exports: Zod schemas for orders/products/checkout, TypeScript types, branch slugs, delivery fee table by region.

## Key Environment Variables

| Variable | App | Purpose |
|---|---|---|
| `DATABASE_URL` | api | PostgreSQL connection string |
| `JWT_SECRET` | api | signs staff session tokens |
| `PAYSTACK_SECRET_KEY` | api | Paystack webhook HMAC + server calls |
| `CORS_ORIGIN` | api | allowed web origin |
| `APP_PUBLIC_URL` | api | Paystack callback base URL |
| `NEXT_PUBLIC_API_URL` | web | API base URL (e.g. `http://127.0.0.1:4000/api`) |

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`/`master`/`develop`:

1. **Gitleaks** secret scan against full git history using `.gitleaks.toml`
2. **Build & lint** — builds `@lenus/shared` → `api` → `web`, then `tsc --noEmit` + `next lint`

Husky git hooks are skipped in CI via `HUSKY=0`.

## Database Schema

Prisma with PostgreSQL. Core models: `StaffUser` (roles: `admin` / `staff` / `pharmacist`), `Branch`, `Product`, `Order`, `OrderItem`, `Payment`, `PaymentEvent` (idempotency), `PomApproval`, `NotificationLog`.

Migrations live in `apps/api/prisma/migrations/`. Production deploys should use `prisma migrate deploy`, not `migrate dev`.

## Conventions

- TypeScript strict mode across all packages.
- Zod schemas in `@lenus/shared` are the single source of truth for request/response shapes — validate there, not ad hoc.
- Paystack webhook handler uses `fastify-raw-body` + HMAC verification before any processing.
- Rate limiting is 100 req/min globally via `@fastify/rate-limit`.
- `.env` files for `api` and `web` are gitignored; only `.env.example` / `.env.local.example` are committed.
