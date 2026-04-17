# syntax=docker/dockerfile:1
# Builds the Fastify API (apps/api). The Next.js web frontend is deployed separately on Vercel.

# ── Base ──────────────────────────────────────────────────────────────────────
FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ── 1. Install workspace dependencies ─────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
# --ignore-scripts skips husky prepare; postinstall (shared build) runs in builder
RUN npm ci --ignore-scripts

# ── 2. Build @lenus/shared and apps/api ───────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/
RUN npm run build --workspace=@lenus/shared
# `npm run build --workspace=api` runs: prisma generate && tsc
RUN npm run build --workspace=api

# ── 3. Production image ───────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

# Re-install all deps (--ignore-scripts) to get workspace symlinks for this arch.
# This keeps prisma CLI available for `prisma migrate deploy` at startup.
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
RUN npm ci --ignore-scripts

# Copy built artifacts
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Prisma schema + migrations are needed at runtime for `migrate deploy`
COPY apps/api/prisma ./apps/api/prisma

# Re-generate Prisma client for linux/openssl-slim (builder may differ on arm mac)
RUN cd apps/api && npx prisma generate

WORKDIR /app/apps/api
EXPOSE ${PORT:-4000}

# Run pending migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
