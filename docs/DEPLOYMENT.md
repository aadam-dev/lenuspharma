# Lenus Pharmacy — deployment and operations

This file is the **only** document under `docs/` tracked in git. Other internal or client materials stay **local** (see root `.gitignore`).

## Architecture

| Layer | Stack | Typical host |
|--------|--------|----------------|
| Web | Next.js 14 (`apps/web`) | [Vercel](https://vercel.com) |
| API | Fastify + Prisma (`apps/api`) | Fly.io, Railway, Render, or any Node host |
| DB | PostgreSQL | Neon, Supabase, RDS, etc. |

The API is **not** deployed as a default Vercel serverless app; run it as a **long-lived Node process** (or container) with `npm run start` after `npm run build` in `apps/api`.

---

## 1. GitHub: CI, branch protection, history

### CI (`.github/workflows/ci.yml`)

- **Gitleaks** — the workflow installs the **open-source Gitleaks CLI** (not `gitleaks-action`), so it does not require a commercial org license. It scans the full git history on each push/PR.
- **Build** — `npm ci`, build `shared`, `api`, `web`, then lint. **`HUSKY=0`** and skipping `prepare` when `CI=true` avoid Husky breaking installs on GitHub.

If **Gitleaks** fails, check the Actions log for the file/rule. Adjust [`.gitleaks.toml`](../.gitleaks.toml) allowlists only for **non-secret** templates (e.g. `.env.example`), not for real keys.

If **API lint** fails, it runs `tsc --noEmit` (`apps/api`).

### Branch protection (`main`)

In GitHub: **Settings → Branches → Add rule** for `main`:

1. Require a pull request before merging (optional: 1 approval).
2. **Require status checks** — select jobs *Gitleaks* and *Build and lint* (they appear after at least one successful run).
3. Require branches up to date before merging.
4. Block force-pushes if the team agrees (note: a one-time force-push may be needed after a history rewrite).

### Rewriting history (remove leaked paths)

If sensitive files were ever committed, **rotate any exposed secrets**, then rewrite history and force-push:

```bash
# Install: pip3 install git-filter-repo
git stash push -u -m "local-docs"   # save untracked docs/ if needed
python3 -m git_filter_repo --force --invert-paths \
  --path docs/MEDIA_GUIDANCE.md \
  --path docs/PRODUCTION_READINESS_AND_CLIENT_PROCESS.md \
  --path docs/DEPLOYMENT.md \
  --path LENUS_PROPOSAL.md \
  --path lenusdraft.md
git remote add origin https://github.com/aadam-dev/lenuspharma.git
git stash pop   # restore local-only files
# Re-add and commit docs/DEPLOYMENT.md if you want it on GitHub
git push --force origin main
```

---

## 2. Database

1. Create a PostgreSQL database and set `DATABASE_URL` on the API host (see [`apps/api/.env.example`](../apps/api/.env.example)).
2. Run migrations:

   ```bash
   cd apps/api && npx prisma migrate deploy
   ```

3. Seed (optional; production: use bootstrap env vars for staff only):

   ```bash
   npm run db:seed --workspace=api
   ```

Local Docker option: `docker compose up -d` from repo root, then point `DATABASE_URL` at the compose Postgres service.

---

## 3. API deployment

**Build:**

```bash
npm ci
npm run build --workspace=@lenus/shared
npm run build --workspace=api
```

**Runtime env (minimum):**

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | PostgreSQL |
| `JWT_SECRET` | Strong random string; **required in production** |
| `CORS_ORIGIN` | Web origin, e.g. `https://your-app.vercel.app` |
| `APP_PUBLIC_URL` | Same as public site URL (Paystack `callback_url`) |
| `PAYSTACK_SECRET_KEY` | Live or test secret from Paystack |

**Start:**

```bash
cd apps/api && node dist/server.js
```

Set Paystack **webhook** to:

`https://YOUR_API_HOST/api/payments/paystack/webhook`

---

## 4. Vercel (web)

### From the dashboard

1. **New Project** → import [aadam-dev/lenuspharma](https://github.com/aadam-dev/lenuspharma).
2. **Root Directory:** `apps/web`.
3. **Build command** (if not auto-detected):  
   `cd ../.. && npm ci && npm run build --workspace=@lenus/shared && npm run build --workspace=web`  
   Or rely on [`apps/web/vercel.json`](../apps/web/vercel.json) `installCommand` / `buildCommand`.
4. **Environment variables:**
   - **Preview:** `NEXT_PUBLIC_API_URL=https://your-staging-api.example.com/api`
   - **Production:** `NEXT_PUBLIC_API_URL=https://your-prod-api.example.com/api`
5. Enable **Deployment Protection** on Preview (e.g. Vercel Authentication) for client UAT.

### From the CLI (your machine)

Requires a Vercel account and login (`vercel login`):

```bash
npm i -g vercel@latest
cd apps/web
vercel link
vercel        # preview
vercel --prod # production
```

Set `NEXT_PUBLIC_API_URL` in the Vercel project **Settings → Environment Variables**. Automated agents cannot complete OAuth login for you; run `vercel login` locally once.

---

## 5. Paystack checklist

- [ ] Test mode verified end-to-end (checkout → redirect → `/checkout/complete` → order paid in admin).
- [ ] Live keys in production API env only.
- [ ] Webhook URL points to **production** API; signature verification enabled (already implemented).
- [ ] `APP_PUBLIC_URL` matches the live storefront (callback).

---

## 6. Production readiness smoke test

1. Browse products and branches (API data, no mocks).
2. Guest checkout → Paystack → return URL → verify order **paid** in admin.
3. Admin login → orders → status changes → POM approval path if order contains POM.
4. Low-stock list and stock update.
5. Reports summary for a date range.

---

## 7. Repository

- **GitHub:** [github.com/aadam-dev/lenuspharma](https://github.com/aadam-dev/lenuspharma)
- **Local-only docs:** other files in `docs/` remain untracked per `.gitignore`.
