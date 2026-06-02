# WooCommerce Plugin Specification

## Purpose

WordPress WooCommerce plugin that syncs products to Rendertry API and embeds visualization widget on product pages.

## Requirements

### Requirement: API Key Authentication

The plugin SHALL authenticate to Rendertry API using an API key stored in WordPress options. Requests MUST include Authorization: Bearer {api_key} header. Invalid keys SHALL return HTTP 401.

### Requirement: Product Sync

The plugin SHALL sync WooCommerce products to Rendertry via POST /api/woocommerce/products. Sync payload MUST include wooProductId, name, description, price, category (RIN/WRAP/PAINT), images, and storeUrl. Sync MUST support manual trigger and optional webhook-based real-time sync.

### Requirement: Product Type Mapping

The plugin SHALL map WooCommerce product categories to Rendertry categories: "Rines" or "RIN" to RIN, "Wraps" or "WRAP" to WRAP, "Paint" or "PAINT" to PAINT. Products without valid mapping SHALL be synced with category UNKNOWN.

### Requirement: Visualization Widget

The plugin SHALL embed Rendertry visualization widget on single product pages. Widget MUST load from Rendertry CDN with product configuration passed via data attributes. Widget container MUST be rendered before the add-to-cart button.

### Requirement: Sync Status Reporting

The plugin SHALL display sync status in WordPress admin (last sync time, synced count, errors). Failed syncs MUST be logged with error details and retry option.

## Scenarios

### Scenario: Successful Product Sync

- GIVEN WooCommerce product with RIN category
- WHEN sync is triggered
- THEN POST /api/woocommerce/products is called with correct payload
- AND product is created in Rendertry
- AND sync status shows success

### Scenario: Sync with Invalid API Key

- GIVEN invalid Rendertry API key in settings
- WHEN sync is triggered
- THEN HTTP 401 is received
- AND error is logged in admin
- AND sync status shows authentication failure

### Scenario: Widget Display on Product Page

- GIVEN Rendertry widget is configured with API key
- WHEN single product page loads
- THEN widget container is rendered before add-to-cart
- AND widget loads with correct product configuration

### Scenario: Product Without Category Mapping

- GIVEN WooCommerce product with category "Accessories"
- WHEN sync is triggered
- THEN product is synced with category UNKNOWN
- AND warning is logged

### Scenario: Manual Sync from Admin

- GIVEN admin clicks "Sync to Rendertry" button
- WHEN button is clicked
- THEN all active products are synced in batch
- AND success/error summary is displayed

### Scenario: Real-time Sync via Webhook

- GIVEN WooCommerce product is created/updated
- WHEN product hook fires
- THEN POST /api/woocommerce/products is called within 5 seconds
- AND product is updated in Rendertry
