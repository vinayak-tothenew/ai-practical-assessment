# Data Model

## Entity Relationship

```
┌──────────────┐       ┌──────────────────────┐       ┌──────────────┐
│    users     │       │       tickets        │       │   comments   │
├──────────────┤       ├──────────────────────┤       ├──────────────┤
│ id (PK)      │◄──┐   │ id (PK)              │◄──────│ id (PK)      │
│ name         │   ├───│ created_by (FK)      │       │ ticket_id(FK)│
│ email        │   │   │ assigned_to (FK,null)│       │ message      │
│ role         │   └───│ title                │       │ created_by(FK)│
└──────────────┘       │ description          │       │ created_at   │
                       │ priority             │       └──────────────┘
                       │ status               │
                       │ created_at           │
                       │ updated_at           │
                       └──────────────────────┘
```

## Entities

### User (seeded only)

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL UNIQUE |
| role | TEXT | NOT NULL — `admin`, `agent`, `user` |

### Ticket

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| title | TEXT | NOT NULL |
| description | TEXT | NOT NULL |
| priority | TEXT | NOT NULL — `Low`, `Medium`, `High` |
| status | TEXT | NOT NULL DEFAULT `Open` |
| assigned_to | INTEGER | NULL, FK → users(id) |
| created_by | INTEGER | NOT NULL, FK → users(id) |
| created_at | TEXT | NOT NULL (ISO 8601) |
| updated_at | TEXT | NOT NULL (ISO 8601) |

### Comment

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| ticket_id | INTEGER | NOT NULL, FK → tickets(id) ON DELETE CASCADE |
| message | TEXT | NOT NULL |
| created_by | INTEGER | NOT NULL, FK → users(id) |
| created_at | TEXT | NOT NULL (ISO 8601) |

## Enums

### TicketStatus
`Open` | `In Progress` | `Resolved` | `Closed` | `Cancelled`

### TicketPriority
`Low` | `Medium` | `High`

### UserRole
`admin` | `agent` | `user`

## State Machine

```
                    ┌─────────────┐
                    │    Open     │
                    └──────┬──────┘
              ┌────────────┼────────────┐
              ▼            │            ▼
     ┌────────────────┐    │    ┌───────────────┐
     │  In Progress   │    │    │  Cancelled    │ (terminal)
     └───────┬────────┘    │    └───────────────┘
             │             │
      ┌──────┴──────┐      │
      ▼             ▼      │
┌──────────┐  ┌───────────┐│
│ Resolved │  │ Cancelled │◄┘
└────┬─────┘  └───────────┘
     ▼
┌─────────┐
│ Closed  │ (terminal)
└─────────┘
```

### Transition table

| From | To | Valid |
|------|----|-------|
| Open | In Progress | ✅ |
| Open | Cancelled | ✅ |
| Open | Resolved | ❌ |
| Open | Closed | ❌ |
| In Progress | Resolved | ✅ |
| In Progress | Cancelled | ✅ |
| In Progress | Open | ❌ |
| Resolved | Closed | ✅ |
| Resolved | In Progress | ❌ |
| Closed | * | ❌ |
| Cancelled | * | ❌ |

## Terminal Status Rules

Tickets in `Closed` or `Cancelled` status:
- Status transitions are **blocked**
- Normal field updates remain allowed
- Comments may still be added

## Indexes

```sql
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_updated_at ON tickets(updated_at DESC);
CREATE INDEX idx_comments_ticket_id ON comments(ticket_id);
```

## Seed Data Plan

- **5 users**: 1 admin, 2 agents, 2 regular users
- **6 tickets**: covering all statuses and priorities
- **8 comments**: distributed across tickets

Implemented in `database/seed.sql` and verified by `backend/src/db/verify.ts`.
