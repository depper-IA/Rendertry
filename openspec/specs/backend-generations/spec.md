# Backend Generations Specification

## Purpose

Handle visualization request creation and processing via n8n AI workflows for automotive customization (wheel blending, vinyl wraps, paint simulation).

## Requirements

### Requirement: Generation Request Creation

The system SHALL accept POST /api/generations with productId, category (RIN/WRAP/PAINT), and options. The request MUST be validated and queued to the n8n webhook URL from environment config.

### Requirement: Category-Specific Processing

The system SHALL route requests based on category: RIN triggers wheel blending, WRAP triggers vinyl overlay, PAINT triggers color simulation. Category MUST be validated against enum values.

### Requirement: n8n Webhook Integration

The system SHALL POST generation data to the configured n8n webhook URL. The webhook payload MUST include generationId, productId, category, options, and callbackUrl for completion notification.

### Requirement: Retry Logic

The system SHALL retry failed webhook calls up to 3 times with exponential backoff (1s, 2s, 4s). After 3 failed attempts, the generation status MUST be set to failed.

### Requirement: Generation Status Tracking

The system SHALL track generation status: pending, processing, completed, failed. Status updates MUST be stored with generationId, status, imageUrl (on completion), error message (on failure), and timestamps.

## Scenarios

### Scenario: Creating RIN Generation Request

- GIVEN valid productId and RIN category with wheel options
- WHEN POST /api/generations is called
- THEN status 201 is returned with generationId and pending status
- AND n8n webhook is called with correct payload

### Scenario: Creating Generation for Invalid Category

- GIVEN valid productId but invalid category "INVALID"
- WHEN POST /api/generations is called
- THEN status 400 is returned with validation error

### Scenario: n8n Webhook Success

- GIVEN a pending generation
- WHEN n8n calls callback with imageUrl
- THEN status is updated to completed with imageUrl

### Scenario: n8n Webhook Failure with Retry

- GIVEN n8n webhook returns 500 error
- WHEN generation is created
- THEN webhook is retried 3 times with exponential backoff
- AND status is set to failed after all retries fail

### Scenario: Fetching Generation Status

- GIVEN an existing generationId
- WHEN GET /api/generations/{generationId} is called
- THEN current status, imageUrl (if completed), or error (if failed) is returned
