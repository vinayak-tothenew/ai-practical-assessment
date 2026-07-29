# Design Notes

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React + Vite)                   │
│  Pages: TicketList | TicketDetail | CreateTicket             │
│  Components: SearchBar, StatusFilter, CommentList, etc.      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Express API (Node.js + TypeScript)              │
│  Routes → Controllers → Services → Repositories            │
│  Middleware: error handler, validation, CORS               │
└──────────────────────────┬──────────────────────────────────┘
                           │ better-sqlite3
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     SQLite Database                          │
│  Tables: users | tickets | comments                          │
└─────────────────────────────────────────────────────────────┘
```

### Layer responsibilities

| Layer | Responsibility |
|-------|----------------|
| **Routes** | HTTP mapping, parse params/query, call controller |
| **Controllers** | Request/response shaping, status codes |
| **Services** | Business logic, state machine, validation orchestration |
| **Repositories** | SQL queries, data mapping |
| **Middleware** | Global error handling, CORS, JSON body parsing |

## Frontend Design

### Tech choices
- **React 18** with **Vite** and **TypeScript**
- **React Router** for list/detail/create routes
- Fetch API for HTTP (no extra client library needed for Core)
- CSS modules or a single `styles/` folder — keep styling simple and functional

### Key screens
1. **Ticket List** (`/`) — table/list, search input, status dropdown filter, link to detail, "Create" button
2. **Ticket Detail** (`/tickets/:id`) — all fields, status action buttons (only valid transitions shown), comment thread, add comment form
3. **Create Ticket** (`/tickets/new`) — form with title, description, priority, creator (select from seeded users)

### State management
- Local component state + `useEffect` for data fetching (no Redux for Core scope)
- Shared API client module in `src/api/client.ts`

### Error handling
- Parse API error responses into a consistent `{ message, fieldErrors? }` shape
- Display inline form errors and banner for transition failures

## Backend Design

### Project structure (implemented)
```
backend/
  src/
    app.ts
    server.ts
    config.ts
    db/
    middleware/
    routes/
    controllers/
    services/
      ticketService.ts
      ticketStatusService.ts
      commentService.ts
      userService.ts
    repositories/
    types/
    utils/
frontend/
  src/
    api/client.ts
    pages/
      TicketListPage.tsx
      CreateTicketPage.tsx
      TicketDetailPage.tsx
    components/Layout.tsx
```

### State machine design

Centralize in `ticketStatusService.ts`:

```typescript
const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  'Open': ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  'Resolved': ['Closed'],
  'Closed': [],
  'Cancelled': [],
};
```

- `validateTransition(current, next)` throws `InvalidTransitionError` if not allowed
- Status changes go through a dedicated endpoint: `PATCH /api/tickets/:id/status`
- Field updates (`PATCH /api/tickets/:id`) do **not** allow status changes

### Validation strategy
- Use lightweight validation (Zod or manual checks) at controller/service boundary
- Required: title, description, priority on create/update
- Enum checks for priority and status
- Foreign key checks for user IDs

## Database Design

See `data-model.md` for full schema. Summary:

- **users** — seeded, referenced by tickets and comments
- **tickets** — main entity with status, priority, assignee FK
- **comments** — child of tickets, cascade delete optional

Indexes:
- `tickets(status)` for filter queries
- `tickets(title, description)` — FTS or `LIKE` for keyword search (Core: `LIKE` is sufficient)

## Validation Strategy

| Input | Rule |
|-------|------|
| title | Required, 1–200 chars |
| description | Required, 1–5000 chars |
| priority | Enum: Low, Medium, High |
| status | Enum, only changed via transition endpoint |
| assignedTo | Optional, must reference existing user |
| createdBy | Required, must reference existing user |

## Error Handling Strategy

| Scenario | HTTP | Response shape |
|----------|------|----------------|
| Validation failure | 400 | `{ error: "Validation failed", details: [...] }` |
| Not found | 404 | `{ error: "Ticket not found" }` |
| Invalid transition | 422 | `{ error: "Invalid status transition", from, to }` |
| Server error | 500 | `{ error: "Internal server error" }` |

Express error middleware catches `AppError` subclasses and formats responses consistently.

## Testing Strategy Link

See `test-strategy.md`. State machine integration tests are the mandatory Core test tier and run against the real Express app with a test SQLite database.
