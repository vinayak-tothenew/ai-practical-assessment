# Acceptance Criteria — Cursor Workflow

This mirrors the repository-level `acceptance-criteria.md` with Cursor-specific traceability. Use this file to validate each milestone before moving on.

## M0 — Planning (complete)

- [x] `project-context.md` defines stack, scope, and non-goals
- [x] `spec.md` covers all Core features with traceability table
- [x] `tasks.md` has ordered milestones with acceptance checks
- [x] `api-contract.md` documents all endpoints
- [x] `data-model.md` documents schema and state machine
- [x] User has reviewed and approved design before M1

## Core Application

### Tickets
- [ ] Create ticket via UI → persisted in SQLite
- [x] List all tickets from database (API verified)
- [x] View ticket detail with user refs (API verified)
- [x] Update title, description, priority, assignee (API verified)
- [x] Status changes only via valid transitions (API verified)

### State Machine
- [x] Open → In Progress succeeds (API verified)
- [x] In Progress → Resolved succeeds (integration test)
- [x] Resolved → Closed succeeds (integration test)
- [x] Open → Cancelled succeeds (integration test)
- [x] In Progress → Cancelled succeeds (integration test)
- [x] Invalid transitions return 422 from API
- [ ] UI shows clear error on invalid transition attempt
- [x] Closed/Cancelled tickets block further status transitions only

### Comments
- [x] Add comment on any ticket (API verified)
- [ ] Comments listed on detail page in chronological order

### Search & Filter
- [x] Keyword search matches title and description (API verified)
- [x] Status filter returns only matching tickets (API verified)
- [ ] Combined search + filter works

### Persistence
- [x] Data survives API restart

## Validation & Errors
- [ ] Backend rejects missing required fields (400)
- [ ] Backend rejects invalid enums (400)
- [ ] 404 for missing ticket/user
- [ ] Frontend shows meaningful errors (not stack traces)

## Testing
- [ ] `npm test` runs state machine integration tests
- [ ] All valid transitions tested and passing
- [ ] All invalid transitions tested and rejected
- [ ] Results in `test-results.md`

## Documentation & AI Evidence
- [ ] README setup works from scratch
- [ ] `tool-workflow.md` complete
- [ ] Prompt history in `ai-prompts/` covers all lifecycle phases
- [ ] `reflection.md` and `pr-description.md` written
- [ ] No secrets in repository

## Milestone Gates

| Milestone | Gate |
|-----------|------|
| M1 | ✅ `npm run db:init` → 5 users, 6 tickets, 8 comments; 0 FK violations |
| M2 | ✅ API starts; health + users work |
| M3 | ✅ Ticket endpoints + 422 invalid transitions |
| M4 | ✅ Search, filter, comments via API |
| M5 | ✅ Frontend built; browser validation pending |
| M6 | ✅ State-machine integration tests 13/13; remaining docs/review pending |
