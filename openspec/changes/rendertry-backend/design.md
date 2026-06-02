# Design: Rendertry Backend

## Technical Approach
We will adapt Lookitry's Express/TypeScript MVC backend. By stripping the blog and PayPal modules, we retain a streamlined, focused service. Authentication and route guards remain identical. Multi-tenant product categories are adapted specifically for automotive customization (`RIN`, `WRAP`, `PAINT`).

## Architecture Decisions

| Decision | Tradeoffs | Selected Choice & Rationale |
| :--- | :--- | :--- |
| **Database Isolation** | Shared Lookitry DB (prone to schema conflicts) vs. Dedicated instance. | **Separate Supabase Instance** (`aekbpnscqtswdtaimxwn`): Cleaner tenant boundary, zero cross-talk, independent scaling. |
| **Custom JWT Auth** | Supabase Auth (lock-in, complex migration) vs. Custom Express JWT middleware. | **Custom JWT Middleware**: 7-day TTL and Redis lockout. Reuses proven Lookitry security pattern with zero overhead. |
| **Product Schema** | Flexible JSON vs. SQL Enum for categories. | **SQL Enum (`RIN`, `WRAP`, `PAINT`)**: Guarantees database-level integrity for wheel blending, wraps, and paint. |
| **Payment Gateway** | PayPal & Wompi vs. Wompi Only. | **Wompi Only (COP)**: Simplifies code footprint, targeted at local Colombian subscriber base; PayPal adds unused bulk. |
| **n8n AI Prompts** | Client-side prompts (insecure) vs. Hardcoded server-side category prompts. | **Server-Side prompts fed to n8n**: Restricts user prompt injection and optimizes visual blending quality. |

## Data Flow

### Request Generation Pipeline
```
User ──[POST /api/generations]──→ Express API ──[Axios + 3x Retry]──→ n8n Webhook
  ▲                                  │ (Auth/Plan Guard)                  │
  │                                  ▼                                    │ (AI Process)
  └───────[WS/SSE / Polling]───── Supabase DB <───[POST /callback]────────┘
```

### WooCommerce Product Synchronization
```
WooCommerce Shop ──[Webhook POST + Bearer]──→ Express (/woocommerce/products) ──→ Supabase DB
```

### Sequence: Generation Callback Retry Logic
```
[Client]              [Express API]              [n8n Webhook]           [Supabase DB]
   │                         │                         │                       │
   │───POST /generations────>│                         │                       │
   │                         │───Create DB Record─────>│                       │
   │                         │<──OK (Pending)──────────┼───────────────────────│
   │<──201 Created (Pending)─│                         │                       │
   │                         │───POST try-on (Retry)──>│                       │
   │                         │                         │ [Fails 3x with Backoff]
   │                         │───Update DB (FAILED)────┼───────────────────────>│
   │                         │                         │                       │
   │                         │───POST try-on (Success)─>│                       │
   │                         │                         │ [Process Image]       │
   │                         │<──POST /callback────────│                       │
   │                         │───Update DB (SUCCESS)───┼───────────────────────>│
```

## File Changes

| File | Action | Description |
| :--- | :--- | :--- |
| `supabase/schema.sql` | Create | DB setup: `custom_category` enum, multi-tenant schemas, indexes. (No blog/PayPal tables). |
| `src/index.ts` / `app.ts` | Create | App entry, security config (Helmet/CORS), routes/middleware wiring. |
| `src/routes/` | Create | Route handlers: auth, products, generations, payments (Wompi), WooCommerce webhook, admin, coupons, reviews. |
| `src/services/auth.service.ts` | Create | Hashing (bcryptjs), verification token generation, Redis account lockout. |
| `src/services/` | Create | Client interfaces: `n8n.client.ts` (3x retry, backoff 1s/2s/4s), `wompi.service.ts` (signature validation). |
| `src/middleware/` | Create | Guards: `auth.ts` (Bearer/Cookie parser), `rateLimiter.ts` (Redis-backed), `errorHandler.ts`. |
| `Dockerfile` / `docker-compose.yml` | Create | Multi-container setup containing Express API and Redis cache. |

## Database Schema Changes
- **Category Enum**:
  ```sql
  CREATE TYPE custom_category AS ENUM ('RIN', 'WRAP', 'PAINT', 'UNKNOWN');
  ```
- **Products Table**: Add `category custom_category NOT NULL DEFAULT 'UNKNOWN'`. Drop Lookitry's size/gender fields.
- **Exclusions**: Drop tables `blogs`, `blog_categories`, `blog_settings`, `blog_topics`, `blog_draft_articles`, `blog_topic_images`, `paypal_orders`.

## WooCommerce Plugin Structure
Adapted from `lookitry-woocommerce`:
- `rendertry-woocommerce.php`: Plugin entry hook (`woocommerce_update_product` real-time sync).
- `includes/class-rendertry-api-client.php`: Payload builder sending mapped categories to `/api/woocommerce/products`.
- `includes/class-rendertry-product-mapper.php`: Maps "Rines" -> `RIN`, "Wraps" -> `WRAP`, "Paint" -> `PAINT`.
- `includes/class-rendertry-widget.php`: Injects JS widget before product pages "Add to Cart" button.

## n8n Workflow Prompt Adjustments
- **RIN**: *"Blend custom wheels {product_image_url} onto the target car in {selfie_url}. Maintain original lighting, perspective, and diameter."*
- **WRAP**: *"Apply vinyl wrap pattern {product_image_url} onto the car body in {selfie_url}. Exclude windows, trim, and lights. Preserve shadows."*
- **PAINT**: *"Recolor the car body in {selfie_url} to match paint sample {product_image_url}. Retain metallic flakes and reflections."*

## Testing Strategy

| Layer | Target | Approach / Tools |
| :--- | :--- | :--- |
| **Unit** | Services, clients (`n8n.client.ts`) | Jest: Mock external webhooks, test 3x retry and exponential backoff logic. |
| **Integration** | Auth guards, endpoints | Supertest: Verify HTTP 401 (no token), 403 (plan limits exceeded), 423 (locked accounts). |
| **E2E / Smoke** | Critical paths | Supertest / Curl: Complete happy-path test (register -> sync product -> generate visualization). |

## Migration / Rollout
- **Database**: Zero data migration. Deploy schema directly to clean Supabase instance `aekbpnscqtswdtaimxwn`.
- **VPS Deployment**: Deploy via Docker on VPS `31.220.18.39`. Reverse-proxy using Nginx on domain `api.rendertry.com`.

## Open Questions
- [ ] Is any additional fields required by the WooCommerce visualization widget metadata beyond `category` and `product_id`?
- [ ] What are the exact Wompi production payment keys and integrity secrets for the COP subscriptions?
