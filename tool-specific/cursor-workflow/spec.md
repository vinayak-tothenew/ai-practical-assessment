# Specification — Support Ticket Management System (Core)

**Version:** 0.2  
**Status:** M2–M5 Core implemented; M6 pending  
**Last updated:** 2026-07-29

## 1. Overview

Build a full-stack support ticket management application for internal users. The application allows creating, viewing, updating, and progressing tickets through a defined lifecycle, with comments, search, and status filtering. The signature engineering requirement is a backend-enforced status state machine.

## 2. Users

- Users exist in the database as seeded records only.
- Fields: `id`, `name`, `email`, `role` (`admin` | `agent` | `user`).
- No login, registration, or user management UI.
- The frontend selects a "current user" from seeded users for create/comment actions.

## 3. Tickets

### 3.1 Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | integer | auto | Primary key |
| title | string | yes | 1–200 chars |
| description | string | yes | 1–5000 chars |
| priority | enum | yes | Low, Medium, High |
| status | enum | yes | Default: Open |
| assignedTo | user ref | no | Nullable |
| createdBy | user ref | yes | |
| createdAt | datetime | auto | ISO 8601 |
| updatedAt | datetime | auto | Updated on any change |

### 3.2 Operations

- **Create:** title, description, priority, createdBy, optional assignedTo. Status = Open.
- **List:** all tickets, default sort by updatedAt desc. Supports `search` and `status` query params.
- **View:** single ticket with expanded user refs and comments.
- **Update fields:** title, description, priority, assignedTo. Allowed regardless of status.
- **Change status:** via dedicated endpoint only. Must follow state machine.

## 4. Status State Machine

```
Open → In Progress
In Progress → Resolved
Resolved → Closed
Open → Cancelled
In Progress → Cancelled
```

- Invalid transitions: HTTP 422 with `from`, `to`, and `allowed` in response.
- `Closed` and `Cancelled` are terminal for status transitions only. Normal field updates and comments remain allowed.

## 5. Comments

- Fields: `id`, `ticketId`, `message`, `createdBy`, `createdAt`.
- Can be added to any ticket regardless of status.
- Listed on ticket detail, ordered by createdAt ascending.
- Message: required, 1–2000 chars.

## 6. Search and Filter

- **Search:** case-insensitive keyword match on title OR description (`LIKE %term%`).
- **Filter:** exact match on status enum.
- Both can be combined. Empty search returns all (subject to status filter).

## 7. Validation

All validation enforced at backend. Frontend displays API errors.

| Rule | Error |
|------|-------|
| Missing required field | 400 |
| Invalid enum value | 400 |
| Non-existent user/ticket ID | 404 |
| Invalid status transition | 422 |

## 8. Persistence

- SQLite database file on disk.
- Schema and seed scripts in `database/`.
- Data survives API restart.

## 9. API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/users | List seeded users |
| GET | /api/tickets | List tickets (search, filter) |
| POST | /api/tickets | Create ticket |
| GET | /api/tickets/:id | Get ticket detail |
| PATCH | /api/tickets/:id | Update fields (not status) |
| PATCH | /api/tickets/:id/status | Change status (state machine) |
| GET | /api/tickets/:id/comments | List comments |
| POST | /api/tickets/:id/comments | Add comment |

Full request/response shapes in `api-contract.md`.

## 10. Frontend Screens

1. **Ticket List** — search, status filter, table, create button
2. **Create Ticket** — form with validation errors
3. **Ticket Detail** — fields, status actions, comments

See `ui-flow.md` for wireframes and component map.

## 11. Testing (Core mandatory)

Integration tests with Jest + Supertest:
- All 5 valid transitions succeed
- Minimum 6 invalid transitions rejected with 422
- Supporting tests for CRUD, validation, search/filter

See `test-strategy.md`.

## 12. Out of Scope (Stretch — do not implement)

- Authentication and authorization
- User CRUD
- Pagination, sorting, priority/assignee filters
- OpenAPI/Swagger
- Docker, CI
- Unit/component test tiers

## 13. Acceptance

See `acceptance-criteria.md` and `tool-specific/cursor-workflow/acceptance-criteria.md`.

## 14. Traceability

| Spec section | Design doc | Implementation |
|--------------|------------|----------------|
| §3 Tickets | data-model.md, api-contract.md | backend/src/services/ticketService.ts |
| §4 State machine | data-model.md | backend/src/services/ticketStatusService.ts |
| §5 Comments | api-contract.md | backend/src/services/commentService.ts |
| §6 Search | api-contract.md | backend/src/repositories/ticketRepository.ts |
| §10 Frontend | ui-flow.md | frontend/src/pages/ |
