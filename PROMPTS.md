# Prompt Sequence — End-to-End Frequent Flyer Portal

## Project Context

Project: End-to-End Frequent Flyer Portal
Ticket: ENG-163087
Priority: P1
Story Points: 5

The goal was to build a reliable digital frequent-flyer portal for floor staff, replacing manual paper/Excel workflows with a structured web application.

---

## Prompt 1 — Project Understanding

Understand the End-to-End Frequent Flyer Portal assignment, identify the required functionality, edge cases, accessibility requirements, security requirements, telemetry requirements, testing requirements, and Definition of Done.

## Prompt 2 — Project Setup

Create the initial Node.js project structure for the Frequent Flyer Portal using Express, MongoDB/Mongoose, Jest, Supertest, Nodemon, ESLint, CORS, and dotenv.

## Prompt 3 — Database Configuration

Configure MongoDB connection using environment variables and create the application database connection module.

## Prompt 4 — Frequent Flyer Data Model

Create a Mongoose Frequent Flyer model containing member ID, name, email, phone, membership tier, miles, status, and timestamps with appropriate validation.

## Prompt 5 — Express Application

Separate the Express application configuration from the server startup file and configure middleware, static frontend serving, health checks, and API routes.

## Prompt 6 — API Routes

Implement the Frequent Flyer API for creating, retrieving, searching, and updating frequent-flyer members.

## Prompt 7 — Validation

Add server-side validation for required fields, email format, membership tiers, member status, and non-negative miles.

## Prompt 8 — Security

Sanitize user-provided text input against script tags and HTML before storing the data.

## Prompt 9 — Duplicate Handling

Handle duplicate member email addresses and return an appropriate conflict response instead of allowing duplicate records.

## Prompt 10 — Search

Implement member search by member ID, first name, last name, and email while protecting the search query from regular-expression issues.

## Prompt 11 — Telemetry

Add the required analytics console message whenever a primary create or update action successfully completes.

## Prompt 12 — Frontend

Build the Frequent Flyer Portal interface with member listing, search, add-member modal, edit functionality, loading states, empty states, validation messages, and connection status.

## Prompt 13 — Accessibility

Add labels, ARIA attributes, keyboard-friendly controls, accessible status messages, table captions, and invalid-field indicators.

## Prompt 14 — Frontend Security

Ensure frontend text inputs are safely handled and server-side sanitization is applied before persistent storage.

## Prompt 15 — Testing

Create automated API tests using Jest and Supertest for health checks, member retrieval, invalid miles, invalid membership tiers, and XSS sanitization.

## Prompt 16 — Manual Verification

Verify the application manually in the browser, including member creation, editing, searching, validation errors, duplicate emails, XSS input, loading states, empty states, and connection status.

## Prompt 17 — ESLint

Configure ESLint using the modern ESLint configuration format and ensure the project passes linting with zero errors and zero warnings.

## Prompt 18 — Final Quality Check

Run the automated tests and lint checks and verify that the application is ready for the remaining accessibility, documentation, deployment, and submission steps.

---

## Development Verification

Final automated checks completed during development:

* ESLint: Passed with 0 errors and 0 warnings
* Jest: 5/5 tests passed
* MongoDB connection: Working
* API health check: Working
* Create member: Verified
* Update member: Verified
* Search member: Verified
* Validation: Verified
* Duplicate email handling: Verified
* XSS sanitization: Verified
* Loading state: Verified
* Empty state: Verified
* Frontend manual verification: Completed
