# Database Setup Notes

## Database Choice

**SQLite** via `better-sqlite3` (synchronous, fast, no separate server process).

- File location: `backend/data/tickets.db` (gitignored)
- Schema: `database/schema.sql`
- Seed data: `database/seed.sql`
- Migration ledger: `schema_migrations`
- Migration runner: `backend/src/db/migrate.ts`
- Seed runner: `backend/src/db/seed.ts`
- Verification: `backend/src/db/verify.ts`

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

## Install

From the repository root in PowerShell:

```powershell
Set-Location backend
npm install
```

## Initialize

`db:init` applies pending migrations, applies the idempotent seed, and verifies integrity:

```powershell
npm run db:init
```

Expected output includes:

```text
Migration: 001_initial_schema already applied
Seed verified: 5 seed users, 6 seed tickets, 8 seed comments
Totals: 5 users, N tickets, M comments (extras beyond seed allowed for tickets/comments)
Foreign-key violations: 0
```

`db:verify` checks that:

- migration `001_initial_schema` is recorded
- foreign keys are intact
- seeded user IDs 1–5 exist (exact user count remains 5 — Core has no user CRUD)
- seeded ticket IDs 1–6 exist, and ticket count is **at least** 6 (application-created tickets are allowed)
- seeded comment IDs 1–8 exist, and comment count is **at least** 8 (application-created comments are allowed)

Do **not** delete application-created tickets/comments just to make verification pass.

The command is safe to run again. The migration ledger prevents reapplying the schema, and fixed seed IDs with `INSERT OR IGNORE` prevent duplicate records.

## Individual Commands

```powershell
npm run db:migrate  # Apply pending schema migrations only
npm run db:seed     # Apply seed data only (run migration first)
npm run db:verify   # Verify migration, seed IDs, minimum mutable counts, and foreign keys
npm run build       # Type-check the database tooling
```

## Database Path

The default path is `backend/data/tickets.db`. Override it for a PowerShell session:

```powershell
$env:DATABASE_PATH = "C:\temp\support-tickets.db"
npm run db:init
```

Relative `DATABASE_PATH` values are resolved from the current working directory. `backend/.env.example` documents the expected value for later application configuration; M1 scripts read `process.env` directly.

## Driver Note

`better-sqlite3` is the configured primary driver. On this assessment machine, Windows Application Control blocked its native `.node` binary. The connection module therefore falls back only for `ERR_DLOPEN_FAILED` to Node.js 24's built-in `node:sqlite` driver. This preserves initialization and verification without bypassing the machine's security policy. Environments that allow the signed/native package use `better-sqlite3`.

## M1 Traceability

| Requirement / decision | Design or task | Resulting files | Verification |
|------------------------|----------------|-----------------|--------------|
| Database persistence is mandatory | `data-model.md`; T1.1–T1.3 | `schema.sql`, `connection.ts`, `migrate.ts`, `init.ts` | Migration recorded and file DB created |
| User, Ticket, Comment relationships | `data-model.md`; T1.2 | `schema.sql` | `PRAGMA foreign_key_check` returns 0 |
| Schema/setup and sample data required | T1.3–T1.5 | `schema.sql`, `seed.sql`, `setup-notes.md` | Seed IDs present; tickets/comments may exceed seed baseline |
| Data setup must be repeatable | M1 acceptance gate | `migrate.ts`, `seed.ts` | Second `db:init` does not duplicate data |
| Verification must tolerate app-created data | Issue 2 in `debugging-notes.md` | `verify.ts` | Seed presence + minimum mutable counts |
| Core scope only | `project-context.md` | Database files only | No routes, APIs, or frontend added |

## Test Database (future M2/M6)

Integration tests will use either:
- In-memory SQLite (`:memory:`), or
- A temporary file reset before each test suite

Test seed will include minimal users only; tickets created by tests.

## Persistence Check

1. Start the API, create a ticket via UI or curl
2. Stop the API
3. Restart the API
4. Confirm the ticket still exists in the list

_Status: M1 database setup implemented and verified on 2026-07-29._
