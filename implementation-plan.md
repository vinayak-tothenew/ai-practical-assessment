# Implementation Plan

## Overview

Build the Support Ticket Management System incrementally in six milestones. Each milestone produces a reviewable artifact, updates prompt history, and passes defined acceptance checks before the next begins. No Stretch features in Core phase.

## Task Breakdown

| Milestone | Scope | Deliverables | Depends on |
|-----------|-------|--------------|------------|
| M0 | Planning & scaffold | Docs, spec, tasks, DB design | — |
| M1 | Database layer | Schema, seed, init script, setup notes | M0 |
| M2 | Backend foundation | Express app, models, repositories | M1 |
| M3 | Ticket API + state machine | CRUD, status transitions, validation | M2 |
| M4 | Comments + search/filter | Comment endpoints, list query params | M3 |
| M5 | Frontend | List, detail, create, update, comments, errors | M4 |
| M6 | Integration tests + polish | State machine tests, README setup, review | M5 |

## Milestones

### M0 — Planning & Scaffold (complete)
- [x] Repository structure and lifecycle docs
- [x] Requirements analysis and acceptance criteria
- [x] Architecture, API, and data model design
- [x] Cursor workflow artifacts
- [x] User review and approval before M1

### M1 — Database Layer (complete)
- [x] SQLite schema (`users`, `tickets`, `comments`)
- [x] Seed data (5 users, 6 tickets, 8 comments)
- [x] Database migration, initialization, and verification modules
- [x] `database/setup-notes.md` with exact run instructions

### M2 — Backend Foundation (complete)
- Express + TypeScript app with `app.ts` / `server.ts`
- Health and users endpoints
- Centralized error handling and CORS/JSON middleware

### M3 — Ticket API + State Machine (complete)
- Ticket CRUD + dedicated status transition endpoint
- Central `ticketStatusService`
- Backend validation for required fields and enums

### M4 — Comments + Search/Filter (complete)
- Comment list/create endpoints
- Keyword search and status filter on ticket list
- Default sort by `updatedAt` descending

### M5 — Frontend (complete)
- React + Vite + TypeScript UI
- List, create, and detail pages with comments and error states
- Uses `VITE_API_BASE_URL`; talks only to Express

### M6 — Integration Tests + Polish
- Jest + Supertest state machine integration tests
- End-to-end manual test pass
- Update README setup instructions
- Code review and reflection artifacts

## AI Usage Plan

| Phase | AI role | Human role |
|-------|---------|------------|
| Requirements | Draft breakdown, edge cases | Approve final requirements doc |
| Design | Propose architecture, API, schema | Review and correct before implementation |
| Implementation | Generate boilerplate and feature code | Verify business logic, especially state machine |
| Testing | Draft test cases from spec | Run tests, add missing edge cases |
| Debugging | Hypothesize causes from errors | Validate fixes, document in debugging-notes |
| Review | Suggest improvements | Accept/reject with rationale |

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Building too much in one AI session | Poor traceability, harder review | Strict one-milestone-per-session rule |
| State machine bugs | Core acceptance failure | Dedicated service + integration tests early |
| SQLite locking in tests | Flaky tests | Use in-memory SQLite or test DB file per suite |
| AI over-engineering (auth, pagination) | Scope creep | project-context.md non-goals, reject in review |

## Mitigation

- Lock scope to Core in `project-context.md` and cursor rules.
- State machine logic in a single testable module, not scattered in routes.
- Update `tasks.md` status after every session.
- Capture prompts in `ai-prompts/` before moving to next milestone.
