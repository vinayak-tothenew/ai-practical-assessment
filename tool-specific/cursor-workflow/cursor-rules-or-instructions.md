# Cursor Rules & Instructions

Use these rules when working on this project in Cursor. Add relevant sections to `.cursor/rules/` or reference this file at the start of each session.

---

## Project Rules

### Scope discipline
- Implement **only** the current task from `tasks.md`.
- Do not add Stretch features (auth, pagination, Swagger, Docker, user CRUD).
- If a suggestion goes beyond Core scope, reject it and note why in prompt history.

### Spec-driven development
- Read `project-context.md` and `spec.md` before generating code.
- Generated code must match `api-contract.md` and `data-model.md`.
- If implementation reveals a spec gap, update the spec first, then code.

### Architecture
- Backend layers: Routes → Controllers → Services → Repositories.
- State machine logic lives **only** in `ticketStatusService.ts`.
- Status changes go through `PATCH /api/tickets/:id/status` — never via general PATCH.
- SQL queries live in repository files only.

### TypeScript
- Strict mode enabled.
- Avoid `any`. Use proper types/interfaces in `types/`.
- Export shared types from `backend/src/types/index.ts`.

### Validation
- Validate at the service/controller boundary.
- Return structured errors matching the API contract error shape.
- Priority enum: `Low` | `Medium` | `High`
- Status enum: `Open` | `In Progress` | `Resolved` | `Closed` | `Cancelled`

### State machine (non-negotiable)
```typescript
const VALID_TRANSITIONS = {
  'Open': ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  'Resolved': ['Closed'],
  'Closed': [],
  'Cancelled': [],
};
```
- Invalid transition → throw `InvalidTransitionError` → HTTP 422.
- Terminal statuses (`Closed`, `Cancelled`) block status transitions only; normal field updates remain allowed.

### Database
- Use `better-sqlite3` (synchronous).
- Enable foreign keys: `PRAGMA foreign_keys = ON`.
- Schema in `database/schema.sql`; seed in `database/seed.sql`.
- DB file path from `DATABASE_PATH` env var (default: `./data/tickets.db`).

### Frontend
- React 18 + Vite + TypeScript.
- React Router for `/`, `/tickets/new`, `/tickets/:id`.
- Fetch API for HTTP calls; centralize in `src/api/client.ts`.
- Show only valid status transition buttons based on current status.
- Display API errors as user-friendly messages.

### Testing
- Jest + Supertest for integration tests.
- Test against real Express app with test SQLite DB.
- State machine tests are mandatory — do not skip.
- Reset test DB before each test suite.

### Security
- No secrets in code, tests, or docs.
- Use `.env` for config; provide `.env.example`.
- `.gitignore` must exclude `.env`, `*.db`, `node_modules/`.

---

## Session Instructions

When starting a Cursor session:

1. **Read context:** `project-context.md` → `tasks.md` → find current task.
2. **Confirm scope:** State which task(s) you will implement this session.
3. **Reference specs:** Cite relevant sections from `spec.md`, `api-contract.md`, `data-model.md`.
4. **Implement incrementally:** One task or small group per session.
5. **Validate:** Run TypeScript check and relevant tests.
6. **Update artifacts:**
   - Mark task complete in `tasks.md`
   - Add prompt entry to appropriate `ai-prompts/*.md` file
   - Update `debugging-notes.md` if issues were encountered

When reviewing AI output:

- Verify state machine logic by hand against the transition table.
- Check that status cannot be changed via the general PATCH endpoint.
- Confirm error responses match `api-contract.md` shapes.
- Reject over-engineered solutions (abstractions, patterns not needed for Core).

---

## Prompt Templates

### Starting a milestone
```
I'm working on milestone [M#] task [T#.#] for the Support Ticket Management System.
Read tool-specific/cursor-workflow/project-context.md and tasks.md.
Implement only [specific task]. Follow api-contract.md and data-model.md.
Do not implement features from other milestones.
```

### State machine implementation
```
Implement ticketStatusService.ts with the state machine from data-model.md.
Valid transitions: Open→In Progress/Cancelled, In Progress→Resolved/Cancelled, Resolved→Closed.
Invalid transitions must throw InvalidTransitionError (422).
Write no route code — service only.
```

### Integration tests
```
Write Jest + Supertest integration tests for ticket status transitions per test-strategy.md.
Test all 5 valid transitions and at least 6 invalid ones.
Use the test DB setup from [existing test harness file].
```

### Code review
```
Review [file(s)] against spec.md and acceptance-criteria.md.
Focus on: state machine correctness, validation, error handling, scope creep.
List issues by severity. Do not fix — just report.
```

---

## What to Reject

- Adding authentication "while we're at it"
- Combining status update with field update in one endpoint
- ORM libraries (use better-sqlite3 directly for clarity)
- State machine logic duplicated in routes and services
- Frontend status dropdown that allows any status value
- Copy-pasting AI code without reading it
