# Test Results

## State-machine integration tests (Core mandatory)

**Date:** 2026-07-30  
**Command:** `cd backend && npm test`  
**Result:** **PASSED**

```text
PASS ../tests/integration/ticketStatus.test.ts
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

### Valid transitions

| Case | Result |
|------|--------|
| Open → In Progress | Pass |
| In Progress → Resolved | Pass |
| Resolved → Closed | Pass |
| Open → Cancelled | Pass |
| In Progress → Cancelled | Pass |

### Invalid transitions (expect 422)

| Case | Result |
|------|--------|
| Open → Resolved | Pass |
| Open → Closed | Pass |
| In Progress → Open | Pass |
| Resolved → In Progress | Pass |
| Closed → Open | Pass |
| Cancelled → In Progress | Pass |
| Open → Open (same status) | Pass |

### Additional authority check

| Case | Result |
|------|--------|
| General PATCH cannot change status | Pass (400) |

### How tests run

- Jest 29 + Supertest against real Express `createApp()`
- Isolated temp SQLite DB per test (`resetDb` + migrate + minimal users)
- No dependency on the developer `tickets.db` file

### Tooling note

Jest 30 was attempted first but failed on this machine because `unrs-resolver` could not load its native binding (`findNodeModule` returned null for all packages). Jest **29.7.0** was used instead (JS-based resolver). Tests still use Jest + Supertest as required.

TypeScript transform uses `@swc/jest` (compatible with TypeScript 7; `ts-jest` peer range does not include TS 7).

## Pre-M6 Manual / Tooling Validation

**Date:** 2026-07-30

### Frontend

- Manual browser testing: **passed** (reported by candidate)

### Database verification bug

Fixed separately — see `debugging-notes.md` Issue 2. Application-created tickets remain intact; verify allows totals above seed baseline.

## Summary

| Suite | Tests | Passed | Failed |
|-------|-------|--------|--------|
| ticketStatus.test.ts | 13 | 13 | 0 |
| tickets.test.ts (supporting) | — | deferred | — |
| comments.test.ts (supporting) | — | deferred | — |
