# Proposal: Rendertry Backend

## Intent

Establish a secure, high-performance Express/TypeScript backend for Rendertry, mirroring the proven Lookitry SaaS architecture but customized for automotive visualization (Rines, Vinyl Wraps, Paint). This system will power the existing HTML frontend and connect WooCommerce stores to AI visualization workflows.

## Scope

### In Scope
- Express/TypeScript codebase setup with robust MVC architecture.
- Supabase PostgreSQL schema (`aekbpnscqtswdtaimxwn`) for RIN, WRAP, and PAINT.
- JWT-based auth, Multi-tenant Brand & Product CRUD APIs.
- n8n workflow integration for image visualization generation.
- Subscriptions (Basic/Pro/Enterprise) & Wompi payment gateway.
- WordPress WooCommerce plugin (`rendertry-woocommerce`).
- VPS Docker deployment at `api.rendertry.com` (IP: `31.220.18.39`).

### Out of Scope
- Blog automation and PayPal integration.
- Next.js frontend migration (existing HTML frontend used).
- Phase 2 Lead management.

## Capabilities

### New Capabilities
- `backend-auth`: Handles secure registration, login, and JWT authentication.
- `backend-catalog`: Multi-tenant brands, coupons, reviews, and product CRUD (RIN, WRAP, PAINT).
- `backend-generations`: Visualization requests processed via n8n AI workflows.
- `backend-payments`: Subscription plans billing and Wompi payment processing.
- `woocommerce-plugin`: Syncs WooCommerce products to Rendertry for visualization.

### Modified Capabilities
- None

## Approach

1. **Clone & Adapt**: Fork the Lookitry backend, stripping PayPal and blog automation modules.
2. **Schema & DB Setup**: Deploy the new PostgreSQL schema to Supabase instance `aekbpnscqtswdtaimxwn`.
3. **API Alignment**: Build out RIN/WRAP/PAINT categorization APIs and adapt JWT/Wompi systems.
4. **Integration**: Adapt n8n generation pipelines for wheel blending and vehicle wrap/paint overlays.
5. **WooCommerce Sync**: Build the connector plugin to link external shops with Rendertry.
6. **Docker VPS Deployment**: Deploy to VPS `31.220.18.39` under `api.rendertry.com`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `rendertry-backend/` | New | Node.js/TypeScript backend service repository. |
| `rendertry-woocommerce/` | New | WordPress WooCommerce integration plugin. |
| VPS: `/root/rendertry-backend/` | New | Deploy directory, Nginx, Docker compose config on `31.220.18.39`. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Supabase migration bugs | Medium | Rigid test schema verification prior to production rollout. |
| n8n pipeline overlay failures | Medium | Rigorous testing of RIN/WRAP/PAINT sample overlays on n8n. |
| VPS CPU/RAM resource limits | Low | Resource limits in Docker config; monitor host metrics. |

## Rollback Plan

- **Backend**: Keep existing Lookitry service untouched on the shared VPS.
- **DNS**: Quick DNS fallback to redirect `api.rendertry.com` or stop the new Docker container.
- **Database**: Retain backup state of Supabase `aekbpnscqtswdtaimxwn` during rollout.

## Dependencies

- Supabase PostgreSQL instance `aekbpnscqtswdtaimxwn`
- Copy of Lookitry's core backend, n8n workflows, and WooCommerce plugin codebase.
- VPS SSH access for root deployment on host `31.220.18.39`.

## Success Criteria

- [ ] `/api/health` returns status `200 OK` on `api.rendertry.com`.
- [ ] Successful user JWT auth flow (register, login, route guard).
- [ ] Products CRUD successfully handles RIN, WRAP, and PAINT custom schemas.
- [ ] Wompi webhook completes subscription payments successfully.
- [ ] WordPress plugin fetches visualization configurations from Rendertry.
- [ ] n8n workflows successfully process and output customized car images.
