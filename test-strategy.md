# Test Strategy

## Test Scope

Core mandatory test tier: **integration tests** that prove state machine rules using Jest + Supertest against the real Express application with a test SQLite database.

Unit tests and component tests are optional for Core (Stretch evidence). Focus integration tests on the highest-risk business logic.

## Unit Tests

_Not planned for Core milestone. State machine logic is tested via integration tests. May add isolated unit tests for `ticketStatusService` in M6 if time permits._

## Component Tests

_Not planned for Core. Manual UI testing documented in test-results.md._

## API / Integration Tests

### Setup
- Jest test runner with `ts-jest` or `@swc/jest`
- Supertest for HTTP assertions
- Test database: in-memory SQLite or `tests/fixtures/test.db` reset before each suite
- Seed minimal users before ticket tests

### Test file: `tests/integration/ticketStatus.test.ts`

#### Valid transitions (must pass)
| Test case | From | To |
|-----------|------|-----|
| open to in progress | Open | In Progress |
| in progress to resolved | In Progress | Resolved |
| resolved to closed | Resolved | Closed |
| open to cancelled | Open | Cancelled |
| in progress to cancelled | In Progress | Cancelled |

#### Invalid transitions (must be rejected with 422)
| Test case | From | To |
|-----------|------|-----|
| open to resolved | Open | Resolved |
| open to closed | Open | Closed |
| in progress to open | In Progress | Open |
| resolved to in progress | Resolved | In Progress |
| closed to open | Closed | Open |
| cancelled to in progress | Cancelled | In Progress |

### Test file: `tests/integration/tickets.test.ts` (supporting)

- Create ticket with valid data → 201
- Create ticket missing title → 400
- List tickets with search query → filtered results
- List tickets with status filter → filtered results
- Get ticket by ID → 200
- Get non-existent ticket → 404
- Update ticket fields → 200
- Update closed ticket fields → still 200 (terminal status blocks status transitions only; field updates remain allowed per approved Core decision)

### Test file: `tests/integration/comments.test.ts` (supporting)

- Add comment to ticket → 201
- Add comment to non-existent ticket → 404
- List comments for ticket → ordered by createdAt

## Edge Case Tests

| Case | Expected |
|------|----------|
| Status change via PATCH /tickets/:id (not status endpoint) | Ignored or 400 |
| Double transition to same status | 422 |
| Comment on closed ticket | 201 (allowed) |

## Tests Not Covered (and why)

| Area | Reason |
|------|--------|
| Frontend component tests | Core scope prioritizes state machine integration tests |
| Authentication | Not in Core scope |
| Pagination/sorting | Stretch feature |
| Performance/load testing | Out of scope for mini project |
| E2E browser tests (Playwright) | Manual UI verification sufficient for Core |

## Running Tests

```bash
cd backend
npm test
```

Uses Jest 29 + Supertest + `@swc/jest`. Results are documented in `test-results.md`.
