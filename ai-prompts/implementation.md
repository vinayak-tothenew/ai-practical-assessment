# AI Prompts — Implementation Phase

## Prompt 1 — Implement M1 database layer only

**Date:** 2026-07-29  
**Tasks:** T1.1–T1.6

### Prompt

Proceed with M1 only: scaffold the backend TypeScript package, configure SQLite with `better-sqlite3`, implement the User/Ticket/Comment schema, migration and seed tooling, run `db:init`, verify expected records, update setup notes, and preserve traceability. Do not implement Express routes, ticket APIs, or frontend code.

The user also corrected an earlier design assumption: `Closed` and `Cancelled` are terminal for status transitions only. Normal field updates remain allowed.

### AI response (summary)

- Scaffolded a strict TypeScript backend package.
- Added `better-sqlite3` plus TypeScript database tooling.
- Implemented connection, migration, seed, initialization, and verification scripts.
- Made seed data idempotent with fixed IDs and `INSERT OR IGNORE`.
- Added database constraints, relationships, indexes, and migration ledger.
- Updated all affected specification artifacts to remove the unsupported field-update restriction.

### Accepted

- Layered database foundation under `backend/src/db/`.
- `schema_migrations` ledger with migration `001_initial_schema`.
- Foreign keys enabled for every connection.
- Nullable assignee with `ON DELETE SET NULL`.
- Comment deletion cascades when its ticket is deleted.
- Database-level enum and length checks as defense in depth.
- Idempotent initialization and explicit verification command.

### Changed

- The initial M0 draft blocked normal field updates for Closed/Cancelled tickets. This was removed from requirements, API contract, data model, UI flow, spec, tasks, rules, and acceptance criteria because the assignment only requires terminal status transitions.
- The first runtime attempt used `better-sqlite3` directly. Windows Application Control blocked its native binary, so the connection now uses `node:sqlite` only as an `ERR_DLOPEN_FAILED` fallback on restricted Node 24 environments.
- Comment seed rows were given fixed IDs so repeated seeding cannot duplicate them.

### Rejected

- Disabling or bypassing Windows Application Control: rejected because it would weaken a host security control.
- Starting Express routes or repository/API implementation: rejected because it belongs to M2/M3.
- Adding an ORM or migration dependency: rejected as unnecessary for one Core schema and contrary to minimal dependency discipline.

### Validation

Commands run:

```powershell
npm run build
npm run db:init
npm run db:init
npm run db:verify
```

Result: type-check passed; initial migration applied once; repeated init remained idempotent; 5 users, 6 tickets, 8 comments, and zero foreign-key violations verified.

---

## Prompt 2 — Implement M2–M5 Core application end-to-end

**Date:** 2026-07-30  
**Tasks:** T2.*–T5.*

### Prompt

Complete the mandatory Core application: Express foundation, ticket API with central state machine, comments + search/filter, and React + Vite frontend. Stop before M6. Keep Stretch features out of scope. Terminal statuses block status transitions only.

### AI response (summary)

- Built Express app with `app.ts` / `server.ts`, CORS, JSON parsing, 404 and centralized error handling.
- Implemented layered routes → controllers → services → repositories over the existing SQLite connection abstraction.
- Implemented ticket CRUD, dedicated status endpoint, comment endpoints, and list search/status filters.
- Scaffolded React frontend with list, create, and detail pages using `VITE_API_BASE_URL`.
- Verified API flows automatically and confirmed persistence after backend restart.

### Accepted

- Separate status endpoint and rejection of status changes via general PATCH.
- Central `ticketStatusService` transition table.
- Detail endpoint expands `createdBy` / `assignedTo` to `{ id, name }`.
- Frontend shows only allowed transition buttons for UX, while backend remains authoritative.
- Simple professional CSS without over-design.

### Changed

- Frontend `api/client.ts` import path corrected from `./types` to `../types`.
- React `FormEvent` imports converted to type-only imports for `verbatimModuleSyntax`.
- Unused `requireUser` helper removed from `userService`.

### Rejected

- Authentication, JWT, pagination, Swagger, Docker, CI, and other Stretch features.
- ORM / heavy validation frameworks — kept explicit service validation for Core clarity.
- Direct SQLite access from React — frontend talks only to Express.

### Validation

- `backend`: `npm run build` passed
- `frontend`: `npm run build` passed
- API smoke tests: health, users(5), tickets, search, filter, create, update, valid/invalid transitions, reject status-in-PATCH, comments, persistence after restart
