# PR Description

## Summary

Implements the Core Support Ticket Management System for the AI Capability Exercise: full-stack ticket lifecycle with backend-enforced status transitions, SQLite persistence, search/filter, comments, and mandatory state-machine integration tests. Delivery followed a Cursor-assisted, spec-driven incremental workflow (M0–M6 tests).

## Features Implemented

- Create, list, view, and update tickets
- Status transitions via dedicated endpoint and state machine
- Comments on tickets (any status)
- Keyword search (title/description) and status filter
- Seeded users for creator/assignee/comment author selection
- Meaningful API and UI error handling
- Database migrate/seed/verify tooling

## Technical Changes

- Backend: Express + TypeScript layered as routes → controllers → services → repositories
- `ticketStatusService` owns transition rules; general PATCH rejects `status`
- Frontend: React + Vite + TypeScript with list/create/detail pages
- SQLite via `better-sqlite3`, with `node:sqlite` fallback when native binding is blocked
- Jest 29 + Supertest integration tests against isolated temp databases

## Database Changes

- Schema: `users`, `tickets`, `comments`, `schema_migrations`
- Seed: 5 users, 6 tickets, 8 comments
- `db:verify` confirms seed IDs exist and allows extra application-created tickets/comments

## Testing Done

- `cd backend && npm run build` — pass
- `cd frontend && npm run build` — pass
- `cd backend && npm run db:init` / `db:verify` — pass with living DB totals
- `cd backend && npm test` — **13/13** state-machine tests pass
- Manual browser validation of Core UI flows
- API smoke tests for create/update/transition/search/filter/comments/persistence

## AI Usage Summary

Cursor used across planning, design, implementation, testing, debugging, and review. Key corrections of AI output: terminal-status field-update rule removed; verify exact-count logic fixed; Jest tooling adjusted for the local environment. Evidence in `ai-prompts/`, `debugging-notes.md`, and `tool-workflow.md`.

## Screenshots / Demo Notes

Run locally:

1. `backend`: `npm run db:init` then `npm run start` → `http://localhost:3001/api`
2. `frontend`: `npm run dev` → `http://localhost:5173`
3. Demo: list seeded tickets → create ticket → edit fields → valid status action → search/filter → add comment → restart API and confirm data remains

## Known Limitations

- No authentication (optional Stretch)
- Frontend only offers valid status buttons (invalid transitions verified via API/tests)
- Supporting CRUD integration tests beyond state machine are deferred
- Git remote / participation form are outside this PR body

## Future Improvements

Stretch candidates: auth, pagination, OpenAPI, Docker/CI, priority/assignee filters, additional test tiers.
