# Backend Payments Specification

## Purpose

Subscription plan management and Wompi payment gateway integration for Rendertry SaaS billing.

## Requirements

### Requirement: Subscription Plans

The system SHALL define three plans: BASIC, PRO, ENTERPRISE. Each plan MUST have id, name, price, interval (monthly/yearly), productLimit, features array, and isActive flag. Plans MUST be stored in the database.

### Requirement: Wompi Payment Gateway

The system SHALL integrate with Wompi Colombian payment gateway. Payment creation MUST include amount in COP, currency (COP), reference (unique orderId), and customer email. The system SHALL store paymentId, status, and transaction details.

### Requirement: Subscription Status Management

The system SHALL track subscription status: trial (7 days), active, expiring_soon (7 days before expiry), expired. Status transitions MUST be automatic based on expiry date checks.

### Requirement: Webhook Handling

The system SHALL handle Wompi webhook callbacks at POST /api/payments/webhook. The webhook MUST validate Wompi signature from headers. Valid payments MUST update subscription status to active.

### Requirement: Prorate on Upgrade

The system SHALL calculate prorated amounts when upgrading plans mid-cycle. The prorate calculation MUST consider remaining days in current period and price difference between plans.

## Scenarios

### Scenario: Creating Wompi Payment

- GIVEN user on BASIC plan wanting to upgrade to PRO
- WHEN POST /api/payments/create is called with amount and email
- THEN status 201 is returned with paymentId and Wompi URL
- AND payment record is stored with pending status

### Scenario: Wompi Webhook Confirmation

- GIVEN Wompi sends valid signed webhook with approved transaction
- WHEN POST /api/payments/webhook is called
- THEN subscription status is updated to active
- AND payment status is updated to approved

### Scenario: Invalid Webhook Signature

- GIVEN Wompi sends webhook with invalid signature
- WHEN POST /api/payments/webhook is called
- THEN status 401 is returned
- AND payment status is not updated

### Scenario: Subscription Expiring Soon

- GIVEN active subscription with expiry in 5 days
- WHEN daily cron job checks subscriptions
- THEN status is updated to expiring_soon

### Scenario: Plan Upgrade Prorate Calculation

- GIVEN user on BASIC (30 days used, 30 days remaining) upgrading to PRO
- WHEN upgrade is initiated
- THEN prorated amount is calculated for 30 days difference

### Scenario: Expired Subscription

- GIVEN subscription with past expiry date
- WHEN user attempts to create product
- THEN status 403 is returned with expired subscription message
