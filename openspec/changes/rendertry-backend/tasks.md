# Tasks: Rendertry Backend

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 3000-5000+ |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 |
| Delivery strategy | ask-on-risk |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Infrastructure (repo, Dockerfile, schema, configs) | PR 1 | main |
| 2 | Core APIs (auth, brands, products, generations) | PR 2 | PR 1 |
| 3 | Payments + Admin (wompi, subscriptions, admin routes) | PR 3 | PR 2 |
| 4 | WooCommerce plugin + n8n workflows | PR 4 | PR 3 |

## Phase 1: Infrastructure (PR 1)

- [ ] 1.1 Create `rendertry-backend/` repo with `package.json`, `tsconfig.json`
- [ ] 1.2 Create `.env.example` with `SUPABASE_URL`, `JWT_SECRET`, `WOMPI_*` vars
- [ ] 1.3 Create `supabase/schema.sql` with `custom_category` enum (RIN/WRAP/PAINT), brands/products/generations tables (no blog/paypal)
- [ ] 1.4 Create `src/types/index.ts` with `CustomCategory`, `User`, `Brand`, `Product`, `Generation` types
- [ ] 1.5 Create `src/config/supabase.ts` with Supabase client init
- [ ] 1.6 Create `src/app.ts` (Helmet, CORS, JSON parser, route wiring)
- [ ] 1.7 Create `src/index.ts` (entry point, port 3000, graceful shutdown)
- [ ] 1.8 Create `Dockerfile` and `docker-compose.yml` (Express + Redis)
- [ ] 1.9 Create `.gitignore`, `.eslintrc.json`, `.prettierrc`

## Phase 2: Core APIs (PR 2)

- [ ] 2.1 Create `src/middleware/auth.ts` (JWT Bearer/Cookie verification, 7-day TTL)
- [ ] 2.2 Create `src/middleware/rateLimiter.ts` (Redis-backed, 100 req/min)
- [ ] 2.3 Create `src/middleware/errorHandler.ts` (500/400/401/403/423 mapped)
- [ ] 2.4 Create `src/services/auth.service.ts` (bcryptjs hashing, Redis lockout)
- [ ] 2.5 Create `src/routes/auth.routes.ts` (register, login, logout endpoints)
- [ ] 2.6 Create `src/controllers/auth.controller.ts` (register/login/logout handlers)
- [ ] 2.7 Create `src/services/brands.service.ts` (multi-tenant brand CRUD)
- [ ] 2.8 Create `src/routes/brands.routes.ts` (GET/POST/PUT/DELETE /api/brands)
- [ ] 2.9 Create `src/services/products.service.ts` (RIN/WRAP/PAINT category filtering)
- [ ] 2.10 Create `src/routes/products.routes.ts` (GET/POST/PUT/DELETE /api/products?category=)
- [ ] 2.11 Create `src/services/generations.service.ts` (generation CRUD, status tracking)
- [ ] 2.12 Create `src/routes/generations.routes.ts` (POST /api/generations, GET /api/generations/:id)
- [ ] 2.13 Create `src/services/n8n.client.ts` (3x retry, backoff 1s/2s/4s, webhook caller)

## Phase 3: Payments + Admin (PR 3)

- [ ] 3.1 Create `src/services/wompi.service.ts` (signature validation, COP currency)
- [ ] 3.2 Create `src/routes/wompi.routes.ts` (POST /api/wompi/presign, webhook handler)
- [ ] 3.3 Create `src/controllers/payments.controller.ts` (presign, webhook callback)
- [ ] 3.4 Create `src/services/subscription.service.ts` (Basic/Pro/Enterprise plans)
- [ ] 3.5 Create `src/routes/subscription.routes.ts` (GET /api/subscriptions/:userId, upgrade/downgrade)
- [ ] 3.6 Create `src/routes/admin.routes.ts` (user management, generation oversight)
- [ ] 3.7 Create `src/services/admin.service.ts` (user list, generation stats)
- [ ] 3.8 Create `src/routes/coupons.routes.ts` (POST /api/coupons, validate)
- [ ] 3.9 Create `src/services/coupons.service.ts` (code generation, usage limits)
- [ ] 3.10 Create `src/routes/reviews.routes.ts` (POST /api/reviews, GET /api/reviews/:productId)
- [ ] 3.11 Create `src/services/reviews.service.ts` (review CRUD with approval)

## Phase 4: WooCommerce + n8n (PR 4)

- [ ] 4.1 Create `rendertry-woocommerce/` plugin dir with `rendertry-woocommerce.php` entry
- [ ] 4.2 Create `includes/class-rendertry-api-client.php` (payload builder for `/api/woocommerce/products`)
- [ ] 4.3 Create `includes/class-rendertry-product-mapper.php` (Rines→RIN, Wraps→WRAP, Paint→PAINT)
- [ ] 4.4 Create `includes/class-rendertry-widget.php` (inject JS before "Add to Cart")
- [ ] 4.5 Create `n8n/rin-visualization.json` (n8n workflow: wheel blend prompt)
- [ ] 4.6 Create `n8n/wrap-visualization.json` (n8n workflow: vinyl wrap prompt)
- [ ] 4.7 Create `n8n/paint-visualization.json` (n8n workflow: paint recolor prompt)