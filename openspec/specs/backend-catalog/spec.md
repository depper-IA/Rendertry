# Backend Catalog Specification

## Purpose

Multi-tenant product catalog management for automotive visualization including brands, products (RIN/WRAP/PAINT), coupons, and reviews.

## Requirements

### Requirement: Multi-Tenant Brands

The system SHALL support multi-tenant SaaS where each brand belongs to a tenant identified by ownerUserId. Brand records MUST include id, name, logoUrl, ownerUserId, and createdAt.

### Requirement: Product CRUD

The system SHALL provide CRUD operations for products. Each product MUST belong to exactly one brand and have a category of RIN, WRAP, or PAINT. Products MUST include id, name, description, price, category, brandId, images array, active status, and timestamps.

### Requirement: Plan-Based Product Limits

The system SHALL enforce product count limits based on subscription plan: BASIC=5 products max, PRO=15 products max, ENTERPRISE=unlimited. Creating products beyond the limit SHALL return HTTP 403 Forbidden.

### Requirement: Coupon Management

The system SHALL support coupon codes with type PERCENTAGE or FIXED. Coupon records MUST include code (unique), type, value, expiresAt, maxUses, and currentUses count. Expired or fully-redeemed coupons SHALL be rejected.

### Requirement: Brand Reviews

The system SHALL allow authenticated users to submit reviews for brands with a rating (1-5 stars) and comment. Reviews MUST be approved by an admin before publication. Pending reviews SHALL be visible only to the reviewer.

## Scenarios

### Scenario: Creating Product Within Plan Limit

- GIVEN user on BASIC plan with 3 existing products
- WHEN POST /api/products is called with valid product data
- THEN status 201 is returned with created product
- AND product count is now 4

### Scenario: Creating Product Exceeding Plan Limit

- GIVEN user on BASIC plan with 5 existing products
- WHEN POST /api/products is called
- THEN status 403 is returned with plan limit message

### Scenario: Creating Coupon

- GIVEN valid coupon data (code, type, value)
- WHEN POST /api/coupons is called
- THEN status 201 is returned with coupon
- AND code is stored uppercase

### Scenario: Redeeming Expired Coupon

- GIVEN a coupon with expiredAt in the past
- WHEN POST /api/orders/apply-coupon is called
- THEN status 400 is returned with expiration message

### Scenario: Submitting Brand Review

- GIVEN authenticated user
- WHEN POST /api/brands/{brandId}/reviews is called with rating 4 and comment
- THEN status 201 is returned with pending review

### Scenario: Fetching Products by Category

- GIVEN existing products in RIN and WRAP categories
- WHEN GET /api/products?category=RIN is called
- THEN only RIN products are returned
