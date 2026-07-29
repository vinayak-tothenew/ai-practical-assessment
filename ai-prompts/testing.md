# AI Prompts — Testing Phase

## Prompt 1 — Write and run state-machine integration tests

**Date:** 2026-07-30  
**Phase:** Testing (Core mandatory tier)

### Prompt

Write and run Jest + Supertest integration tests proving the ticket status state machine: valid transitions succeed; invalid transitions are rejected.

### AI response (summary)

- Added isolated test DB helpers (`resetDb`, migrate, seed users).
- Wrote `tests/integration/ticketStatus.test.ts` covering 5 valid + 6+ invalid transitions and status-via-general-PATCH rejection.
- Hit tooling blockers: `ts-jest` incompatible with TypeScript 7; Jest 30 resolver native binding missing on this machine.
- Switched to Jest 29 + `@swc/jest`, then all 13 tests passed.

### Accepted

- Integration tests against real Express app and SQLite
- Temp DB per test (does not mutate developer DB)
- Coverage of all Core state-machine paths plus same-status and PATCH authority cases

### Changed

- Jest 30 → Jest 29 due to broken `unrs-resolver` native binding
- `@swc/jest` instead of `ts-jest` because of TypeScript 7 peer range

### Rejected

- Deleting/resetting developer DB to make tests pass
- Skipping invalid-transition cases
- Using a non-Jest runner solely to avoid the resolver issue (kept Jest as required)

### Validation

```powershell
cd backend
npm test
```

Result: 13/13 passed.
