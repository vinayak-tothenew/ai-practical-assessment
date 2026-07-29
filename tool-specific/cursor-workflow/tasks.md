# Tasks — Incremental Implementation Plan

**Last updated:** 2026-07-29  
**Current milestone:** M2–M5 complete — awaiting manual UI testing before M6

Status legend: `[ ]` pending · `[~]` in progress · `[x]` done · `[-]` skipped

---

## M0 — Planning & Scaffold

- [x] T0.1 Create repository structure and `.gitignore`
- [x] T0.2 Write `requirements-analysis.md`
- [x] T0.3 Write `acceptance-criteria.md`
- [x] T0.4 Write `design-notes.md`, `api-contract.md`, `data-model.md`, `ui-flow.md`
- [x] T0.5 Write `implementation-plan.md` and `test-strategy.md`
- [x] T0.6 Create `tool-workflow.md`
- [x] T0.7 Create Cursor workflow artifacts (this folder)
- [x] T0.8 Draft `database/schema.sql` and `database/seed.sql`
- [x] T0.9 Create placeholder lifecycle artifact files
- [x] T0.10 User review and approval of design
- [ ] T0.11 Initialize git repo locally (if not done)

---

## M1 — Database Layer

- [x] T1.1 Scaffold `backend/` package (package.json, tsconfig, dependencies)
- [x] T1.2 Implement `backend/src/db/connection.ts` (SQLite init)
- [x] T1.3 Implement `db:init` script (run schema + seed)
- [x] T1.4 Verify seed data counts and FK integrity
- [x] T1.5 Update `database/setup-notes.md` with working commands
- [x] T1.6 Capture prompts in `ai-prompts/implementation.md`

**M1 acceptance:** `npm run db:init` creates DB with 5 users, 6 tickets, 8 comments.

---

## M2 — Backend Foundation

- [x] T2.1 Express app setup (`app.ts`, `server.ts`, CORS, JSON middleware)
- [x] T2.2 Error handling middleware and `AppError` classes
- [x] T2.3 Config module (PORT, DATABASE_PATH) + `.env.example`
- [x] T2.4 User repository + `GET /api/users`
- [x] T2.5 Health check endpoint
- [ ] T2.6 Jest + Supertest test harness with test DB

**M2 acceptance:** API starts, `GET /api/health` returns 200, `GET /api/users` returns 5 users.

---

## M3 — Ticket API + State Machine

- [x] T3.1 Ticket repository (CRUD queries)
- [x] T3.2 `ticketStatusService.ts` — transition validation
- [x] T3.3 `ticketService.ts` — business logic
- [x] T3.4 `POST /api/tickets` with validation
- [x] T3.5 `GET /api/tickets` and `GET /api/tickets/:id`
- [x] T3.6 `PATCH /api/tickets/:id` (field updates; reject status in general PATCH)
- [x] T3.7 `PATCH /api/tickets/:id/status` (state machine)
- [x] T3.8 Capture prompts and update `ai-prompts/implementation.md`

**M3 acceptance:** All ticket endpoints work via curl/Postman. Invalid transitions return 422.

---

## M4 — Comments + Search/Filter

- [x] T4.1 Comment repository
- [x] T4.2 `GET/POST /api/tickets/:id/comments`
- [x] T4.3 Search (`?search=`) on ticket list
- [x] T4.4 Status filter (`?status=`) on ticket list
- [x] T4.5 Combined search + filter

**M4 acceptance:** Search and filter work via API. Comments CRUD works.

---

## M5 — Frontend

- [x] T5.1 Scaffold `frontend/` (Vite + React + TypeScript + Router)
- [x] T5.2 API client module
- [x] T5.3 Ticket List page (search, filter, table)
- [x] T5.4 Create Ticket page
- [x] T5.5 Ticket Detail page (fields, status actions)
- [x] T5.6 Comment list + add comment form
- [x] T5.7 Error states (validation, 422 transitions, 404)
- [x] T5.8 Basic styling (functional, responsive)

**M5 acceptance:** Full Core user flows work in browser against local API.

---

## M6 — Integration Tests + Polish

- [x] T6.1 State machine integration tests (5 valid, 6+ invalid)
- [ ] T6.2 Supporting CRUD/validation integration tests
- [x] T6.3 Run full test suite, document in `test-results.md`
- [x] T6.4 Update README with complete setup instructions
- [x] T6.5 AI-assisted code review → `code-review-notes.md`
- [x] T6.6 Fix review findings → `review-fixes.md`
- [x] T6.7 Write `reflection.md` and `final-ai-usage-summary.md`
- [x] T6.8 Write `pr-description.md`

**M6 acceptance (tests + docs):** State-machine tests pass; submission artifacts filled. Git remote + form remain candidate actions.

---

## Dependency Graph

```
M0 → M1 → M2 → M3 → M4 → M5 → M6
```

Do not skip milestones. Do not start frontend before M4 API is stable.

## How to use this file

1. At session start, find the first `[ ]` task in the current milestone.
2. Implement only that task (or the next small group if tightly coupled).
3. Mark `[x]` when done and add a prompt entry to `ai-prompts/`.
4. Do not proceed to the next milestone without acceptance check.
