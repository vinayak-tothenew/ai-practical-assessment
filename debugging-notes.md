# Debugging Notes

_Issues encountered and resolved during implementation._

---

## Issue Template

### Problem
_What went wrong?_

### How I Investigated
_Steps taken, logs checked, hypotheses tested._

### How AI Helped
_What prompts were used, what suggestions were given._

### What I Validated
_How I confirmed the fix was correct._

### Final Fix
_What changed and in which files._

---

## Issue 1 — Native SQLite driver blocked by Windows policy

### Problem

`npm run db:init` failed with `ERR_DLOPEN_FAILED` because Windows Application Control blocked `better-sqlite3`'s `win32-x64.node` native binary.

### How I Investigated

- Confirmed `npm run build` passed, isolating the failure to runtime native-module loading.
- Read the stack trace, which pointed to `better-sqlite3/lib/binding.js`.
- Did not disable or bypass the machine security policy.

### How AI Helped

AI proposed keeping `better-sqlite3` as the primary driver while handling only the blocked-native-module error with Node.js 24's built-in `node:sqlite`.

### What I Validated

- TypeScript compilation passes.
- First `db:init` applies migration `001_initial_schema`.
- Second `db:init` reports the migration already applied and does not duplicate seeds.
- Verification reports 5 users, 6 tickets, 8 comments, and zero foreign-key violations.

### Final Fix

`backend/src/db/connection.ts` now falls back to `node:sqlite` only when the native driver throws `ERR_DLOPEN_FAILED`. Other database errors are rethrown. The exception and setup implications are documented in `database/setup-notes.md`.

---

## Issue 2 — db:verify exact ticket count broke after API-created data

### Problem

After M2–M5 API/UI testing created ticket #7 (and later additional records), `npm run db:verify` / `npm run db:init` failed with:

```text
Error: Expected 6 tickets records, found 7.
```

(Manual validation later showed totals of 8 tickets / 9 comments — still valid app data.)

Frontend and persistence were correct; verification was wrong.

### Root Cause

`backend/src/db/verify.ts` treated seed baselines as permanent exact totals for **all** tables. Tickets and comments are mutable application entities: creating tickets/comments via the API correctly increases those counts. Exact-count checks were appropriate only for the seed baseline at first init, not for ongoing local development databases.

### How I Investigated

- Reproduced the failure by running `db:verify` against the live SQLite file after API creates.
- Confirmed ticket #7 still existed and was valid application data (not corruption).
- Reviewed `verify.ts` and found identical exact-count assumptions for users, tickets, and comments.
- Decided users can keep an exact-count check (Core has no user CRUD), while tickets/comments must allow growth.

### How AI Helped

AI proposed replacing exact ticket/comment counts with:

1. presence checks for fixed seed IDs (tickets 1–6, comments 1–8, users 1–5)
2. minimum counts (`>=` seed baseline) for mutable entities
3. keep migration + foreign-key checks

Deleting ticket #7 to satisfy verification was considered and **rejected**.

### What I Validated

- `npm run build` passed
- `npm run db:init` passed with totals including application-created rows
- `npm run db:verify` passed with seed IDs present and extras allowed
- Ticket #7 remained intact (`API verification ticket updated`, status `In Progress`)

### Final Fix

Updated `backend/src/db/verify.ts` and `backend/src/db/init.ts` logging, plus `database/setup-notes.md`.

Verification now checks:

- migration recorded
- foreign keys intact
- seed user/ticket/comment IDs present
- users: exact count 5 (seeded only)
- tickets/comments: count **at least** the seed baseline

### Why deleting persisted data was rejected

Ticket #7 (and other extras) prove Core persistence works. Deleting them would:

- hide a real verification bug
- destroy evidence from manual validation
- contradict the acceptance criterion that data survives restart and API use

The verification tool must adapt to a living database, not force the database back to seed-only state.

---

## Issue 3 — Jest 30 resolver could not load native binding

### Problem

Initial attempt to run Jest 30 failed during config validation: every transform/testRunner module resolved to `null` via `jest-resolve` / `unrs-resolver` (`Cannot find native binding`).

### How I Investigated

- Confirmed packages existed under `node_modules` and `require.resolve('@swc/jest')` worked.
- Proved `Resolver.findNodeModule(...)` returned `null` for even `jest` itself.
- `require('unrs-resolver')` failed with missing native binding.

### Final Fix

Downgraded to **Jest 29.7.0** (JS-based resolver). Used `@swc/jest` instead of `ts-jest` because TypeScript 7 is outside `ts-jest`'s peer range. State-machine suite then passed 13/13.
