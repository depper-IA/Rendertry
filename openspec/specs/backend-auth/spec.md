# Backend Authentication Specification

## Purpose

Secure JWT-based authentication for the Rendertry API handling user registration, login, session management, and route protection.

## Requirements

### Requirement: User Registration

The system SHALL allow users to register with email and password. The password MUST be hashed using bcryptjs with a minimum cost factor of 10. The email MUST be validated for proper format before storage. Duplicate emails SHALL be rejected with a 409 Conflict response.

### Requirement: JWT Authentication

The system SHALL issue JWT tokens upon successful login with a 7-day TTL. Tokens MUST be signed with HS256 using a secret from environment configuration. The token payload MUST include userId, email, and plan tier.

### Requirement: Account Lockout

The system SHALL lock an account after 5 consecutive failed login attempts for 15 minutes. Locked accounts MUST return HTTP 423 Locked with a message indicating when the lock expires.

### Requirement: Route Protection Middleware

The system SHALL use JWT middleware to protect all `/api/*` routes except `/api/auth/*` and `/api/health`. Protected routes MUST validate the JWT signature and expiry. Invalid tokens MUST return HTTP 401 Unauthorized.

### Requirement: Password Security

The system SHALL enforce minimum 8-character passwords. Passwords SHALL NOT be stored in plain text. The system SHALL NOT return passwords in any API response.

## Scenarios

### Scenario: Successful Registration

- GIVEN a valid email and password (8+ chars)
- WHEN POST /api/auth/register is called
- THEN status 201 is returned with userId and email
- AND password is stored as a bcrypt hash

### Scenario: Registration with Duplicate Email

- GIVEN an email already registered
- WHEN POST /api/auth/register is called with that email
- THEN status 409 is returned with conflict message

### Scenario: Successful Login

- GIVEN valid credentials
- WHEN POST /api/auth/login is called
- THEN status 200 is returned with JWT token
- AND token expires in 7 days

### Scenario: Failed Login with Lockout

- GIVEN an account with 5 previous failed attempts
- WHEN POST /api/auth/login is called with wrong password
- THEN status 423 is returned with lockout expiration time

### Scenario: Accessing Protected Route with Valid Token

- GIVEN a valid JWT token in Authorization header
- WHEN GET /api/products is called
- THEN status 200 is returned with data

### Scenario: Accessing Protected Route Without Token

- GIVEN no JWT token
- WHEN GET /api/products is called
- THEN status 401 is returned with unauthorized message
