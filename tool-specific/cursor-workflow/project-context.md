# Project Context — Support Ticket Management System

**Last updated:** 2026-07-29  
**Phase:** M2–M5 Core complete — awaiting manual UI testing before M6

## Purpose

This file is the persistent context Cursor reads at the start of each session. It defines what we are building, what we are not building, and the constraints that govern all generated code.

## Project

- **Name:** ai-practical-assessment
- **Option:** Backend-Heavy — Support Ticket Management System
- **Scope:** Core only (no Stretch features)
- **Assessment:** AI Capability Exercise — lifecycle artifacts matter as much as code

## Stack (fixed — do not change)

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite via `better-sqlite3` |
| Testing | Jest + Supertest (integration tests) |
| AI tool | Cursor |

## Repository layout

```
backend/          # Express API
frontend/         # React app
database/         # schema.sql, seed.sql, setup-notes.md
tests/            # Integration tests (at repo root or in backend/)
ai-prompts/       # Prompt history by phase
tool-specific/cursor-workflow/   # This folder
```

## Core features (in scope)

1. Create, list, view, update tickets
2. Status state machine (enforced on backend)
3. Add/list comments
4. Keyword search + status filter
5. Backend validation + frontend error states
6. SQLite persistence across restarts
7. State machine integration tests

## Non-goals (do NOT implement)

- Authentication / JWT / sessions / protected routes
- User CRUD or role management UI
- Pagination, sorting (beyond default updatedAt desc)
- Filter by priority or assignee (Stretch)
- Swagger / OpenAPI docs
- Docker / CI workflow
- Third entity beyond User, Ticket, Comment

## Key business rules

### State machine (critical)
```
Open         → In Progress, Cancelled
In Progress  → Resolved, Cancelled
Resolved     → Closed
Closed       → (terminal)
Cancelled    → (terminal)
```
All other transitions must return 422 from the backend.

### Terminal statuses
Tickets in `Closed` or `Cancelled` cannot transition to another status. Normal field updates and comments remain allowed.

### Users
Seeded only. No user management UI. Used for `createdBy`, `assignedTo`, and comment author.

## API conventions

- Base path: `/api`
- JSON request/response bodies
- Success wrapper: `{ data: ... }`
- Error shape: `{ error: string, details?: ..., from?: ..., to?: ..., allowed?: [...] }`
- Status changes: `PATCH /api/tickets/:id/status` only (not via general PATCH)

## Code conventions

- TypeScript strict mode
- No `any` unless justified with a comment
- Business logic in services, not routes
- State machine in `ticketStatusService.ts`
- SQL in repositories only
- No secrets in code or commits

## Current milestone

**M5 — Frontend (complete)**  
Next: Manual browser validation, then M6 tests/review/reflection

## Reference documents

| Doc | Use when |
|-----|----------|
| `spec.md` | Feature scope and behavior |
| `tasks.md` | What to implement next |
| `acceptance-criteria.md` | Definition of done |
| `api-contract.md` | Endpoint design |
| `data-model.md` | Schema and state machine |
| `design-notes.md` | Architecture decisions |
| `ui-flow.md` | Frontend screens and flows |

## Session start checklist

1. Read this file and `tasks.md` to find the current task
2. Confirm milestone scope — implement only the current task
3. Reference relevant spec sections in your prompt
4. After completing work, update `tasks.md` status and add entry to `ai-prompts/`
