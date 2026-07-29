# Requirement Analysis

## Selected Project Option

**Backend-Heavy — Support Ticket Management System**

## My Understanding (in my own words)

Internal users need a small web application to manage support tickets. Users can create tickets with title, description, and priority; view a list of tickets; open a detail view; update fields and reassign tickets; add comments; and change ticket status only through a strict state machine. The backend must reject invalid transitions and invalid input. Data must persist in SQLite across restarts. Users are seeded in the database only — no user management UI. Search by keyword and filter by status are required.

The signature engineering challenge is the **status state machine**: transitions are limited to specific paths, and both backend and frontend must enforce/handle this clearly.

## Functional Requirements

### Users (seeded only)
- FR-1: System has pre-seeded users with `id`, `name`, `email`, `role`.
- FR-2: Tickets reference users as `createdBy` and `assignedTo` (assignee optional).

### Tickets
- FR-3: Create a ticket with title, description, priority, and creator.
- FR-4: List all tickets (with optional search and status filter).
- FR-5: View a single ticket with full detail and comments.
- FR-6: Update ticket fields: title, description, priority, assignee.
- FR-7: Change ticket status only via valid state machine transitions.
- FR-8: Persist tickets with `createdAt` and `updatedAt` timestamps.

### Comments
- FR-9: Add a comment to a ticket (message + author).
- FR-10: List comments on ticket detail view, ordered by creation time.

### Search & Filter
- FR-11: Keyword search across ticket title and description.
- FR-12: Filter tickets by status.

### State Machine
- FR-13: Valid transitions:
  - Open → In Progress
  - In Progress → Resolved
  - Resolved → Closed
  - Open → Cancelled
  - In Progress → Cancelled
- FR-14: All other transitions must be rejected by the backend with a clear error.

## Non-Functional Requirements

- NFR-1: Data survives application restart (SQLite persistence).
- NFR-2: Backend validates all required fields; reject invalid input at API layer.
- NFR-3: Frontend shows meaningful error states for validation and transition failures.
- NFR-4: README provides clear local setup instructions.
- NFR-5: No secrets committed to the repository.
- NFR-6: Integration tests prove state machine rules (valid succeed, invalid rejected).

## Assumptions

- A1: Single-tenant internal app — no authentication required for Core.
- A2: One default "current user" is selected in the UI for create/comment actions (from seeded users).
- A3: Priority values: `Low`, `Medium`, `High` (fixed enum).
- A4: Status values: `Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled`.
- A5: Assignee can be null (unassigned ticket).
- A6: SQLite file database is acceptable for local development and assessment.

## Clarifications (questions for a product owner)

| # | Question | Proposed default |
|---|----------|------------------|
| Q1 | Can normal fields be changed after ticket is Closed/Cancelled? | Yes for Core; terminal only blocks further status transitions |
| Q2 | Is partial keyword match case-insensitive? | Yes |
| Q3 | Should list be sorted by `updatedAt` desc? | Yes |
| Q4 | Who can add comments on any ticket? | Any seeded user (no auth) |

## Edge Cases

| Case | Expected behavior |
|------|-------------------|
| Empty title or description on create/update | 400 validation error |
| Invalid priority value | 400 validation error |
| Transition Open → Resolved | 409 or 422 rejected |
| Transition Closed → Open | Rejected |
| Transition Resolved → In Progress | Rejected |
| Search with no matches | Empty list, 200 OK |
| Ticket not found | 404 |
| Comment on non-existent ticket | 404 |
| Assign to non-existent user | 400 validation error |
| Update normal fields in Closed/Cancelled status | Allowed; terminal status only affects status transitions |
