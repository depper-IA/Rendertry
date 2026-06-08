# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MANDATORY: Read before any action

**At the start of every session, read `maestro.md`, `REGLAS_IMPORTANTES.md`, and `docs/design.md` before creating or modifying any section, component, or style.** No exceptions.

---

## Stack

- **Next.js 14** (App Router, `output: standalone`) + **TypeScript 5.9**
- **Package manager**: `pnpm` — never use `npm` or `yarn`
- **CSS**: Plain CSS variables in `src/app/globals.css` — no Tailwind, no CSS-in-JS
- **GSAP 3** — used in `HeroCanvasScroll`/`GSAPHeroClient` for the canvas scroll-sequence animation
- **Motion (Framer Motion v12)** — used for all other scroll-triggered animations via `useScrollAnimations`
- **Lucide React** — icons (never use emojis)
- **Supabase** — PostgreSQL hosted, two clients with different privileges
- **Jose** — JWT auth (Edge-compatible; jsonwebtoken does NOT work in Edge runtime)
- **Zod** — API validation
- **Fonts**: Audiowide (`--font-display`) + Roboto (`--font-main`) via Google Fonts `<link>` in `layout.tsx`

---

## Commands

```bash
pnpm dev          # dev server at localhost:3000
pnpm build        # production build (Next.js standalone)
pnpm start        # serve the production build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit (run before finishing any task)
```

No test suite is configured.

---

## Architecture

### Route groups

```
src/app/
├── layout.tsx                     # Root layout — fonts, metadata
├── page.tsx                       # Landing page (public)
├── (public)/
│   ├── contacto/                  # Contact page
│   ├── nosotros/                  # About page
│   └── components/
│       └── GSAPHeroClient.tsx     # Canvas scroll hero (192 WebP frames)
├── (protected)/
│   ├── layout.tsx                 # Wraps /login /register /demo /dashboard
│   ├── login/ register/           # Auth pages
│   ├── demo/                      # Widget demo (uses demo-brand slug, no DB needed)
│   └── dashboard/                 # products/ payments/ subscription/ settings/
└── api/
    ├── auth/                      # login, logout, register, me
    ├── products/                  # CRUD with plan limits (BASIC=5, PRO=15, ENTERPRISE=∞)
    ├── pruebalo/[brandSlug]/      # generate + polling for IA generations
    ├── payments/                  # payment history
    └── subscriptions/             # plan status and changes
```

### Middleware

`src/middleware.ts` runs at Edge Runtime. Protects `/dashboard/*` and `/demo` — redirects to `/login` without a valid JWT. Also redirects authenticated users away from `/login` and `/register`.

### Two Supabase clients — critical distinction

| File | Exports | Key used | Used by |
|------|---------|----------|---------|
| `src/config/supabase.ts` | `supabase` + `supabaseAdmin` | anon / service role | All services and API routes |
| `src/lib/supabase.ts` | `supabase` | anon | Only `api/auth/login` and `api/auth/me` |

`supabaseAdmin` uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). Never use it in browser-side code.

Both clients guard against missing env vars and return `null` when unconfigured — this is intentional so `pnpm build` works without a live Supabase connection.

### Auth flow

JWT signed with `jose` (not `jsonwebtoken`). Payload: `{ brandId, email, name }`. Cookie: `auth_token`, httpOnly, Secure in prod, SameSite=lax, 7-day maxAge.

### Demo mode (no DB required)

Any request to `/api/pruebalo/demo-brand/*` returns mock data without touching the DB. The `/demo` page uses `brandSlug="demo-brand"`. Asset `/public/assets/car-result.jpg` must exist.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in values:

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — never prefix with `NEXT_PUBLIC_` |
| `JWT_SECRET` | **Server only** — minimum 32 chars |
| `NEXT_PUBLIC_APP_URL` | Base URL (e.g. https://rendertry.com) |
| `NEXT_PUBLIC_N8N_DESCRIPTOR_URL` | n8n webhook for IA generations |

---

## CSS / Design system

`src/app/globals.css` is the single source of truth for all styles — never create loose CSS files per page.

Key tokens: `--primary: #e63946` (Racing Red), `--bg-dark: #0a0c10`, `--font-display: Audiowide`, `--font-main: Roboto`.

CSS Modules (`.module.css`) are allowed only for self-contained reusable components (e.g. `BeforeAfterSlider.module.css`).

---

## Deployment

Docker standalone build. See `ARCHITECTURE.md` for full deploy steps to VPS (Hostinger, IP `31.220.18.39`).

```bash
pnpm build                    # generates .next/standalone/
docker build -t rendertry .
docker compose -f infra/docker-compose.yml up -d  # (infra/ is in the original monorepo)
```

---

## External APIs available to Claude (read keys from `.env.local`)

Claude has direct API access to these services during any session. Read the keys from `.env.local` — never hardcode them.

| Service | Key variable(s) | Usage |
|---------|-----------------|-------|
| **n8n** | `N8N_API_KEY` | REST API: `GET/PATCH https://n8n.wilkiedevs.com/api/v1/...` — inspect executions, update workflows, trigger webhooks |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Direct DB queries via admin client (`supabaseAdmin` in `src/config/supabase.ts`) |
| **MinIO / S3** | `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`, `MINIO_PUBLIC_URL` | Object storage at `https://minio.wilkiedevs.com` — upload, list, delete assets |
| **Hostinger VPS** | SSH key or credentials in `.env.local` if present | VPS at `31.220.18.39` — deploy, restart containers, check logs |
| **n8n Webhook** | `N8N_WEBHOOK_URL`, `N8N_BEARER_TOKEN` | Trigger the Rendertry generation workflow directly |

When debugging integrations, use these APIs via `curl` or the SDK **before** touching application code.

---

## Session behavior

- **Caveman mode ALWAYS ON** at session start (full intensity). Invoke the `caveman` skill immediately. Off only when user says "stop caveman" or "normal mode".
- Read `REGLAS_IMPORTANTES.md` before any code change — no exceptions.
