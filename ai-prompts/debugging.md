# AI Prompts — Debugging Phase

## Prompt 1 — Fix db:verify after application-created tickets

**Date:** 2026-07-30  
**Phase:** Debugging (pre-M6, discovered during manual validation)

### Prompt

Manual testing found `db:verify` failing with `Expected 6 tickets records, found 7` after the API created ticket #7. Frontend was fine. Fix verification so seed records are confirmed while allowing additional application-created tickets/comments. Do not delete ticket #7. Do not start M6.

### AI response (summary)

- Identified exact-count checks in `verify.ts` as the root cause for tickets and comments.
- Kept exact user count (no user CRUD in Core).
- Changed tickets/comments verification to: seed ID presence + minimum baseline counts.
- Retained migration and foreign-key checks.
- Rejected deleting application data to make the old check pass.
- Updated setup notes and debugging evidence.

### Accepted

- Seed ID presence checks for users 1–5, tickets 1–6, comments 1–8
- `tickets >= 6` and `comments >= 8`
- Exact user count of 5
- Documentation updates in debugging notes, setup notes, and test-results

### Changed

- `db:init` / `db:verify` console output now reports seed baseline vs actual totals

### Rejected

- Deleting ticket #7 (or resetting the DB) solely to satisfy verification
- Removing verification entirely
- Treating users as a growing entity in Core (no user management exists)

### Validation

```powershell
cd backend
npm run build
npm run db:init
npm run db:verify
```

Confirmed ticket #7 still present after successful verification.
