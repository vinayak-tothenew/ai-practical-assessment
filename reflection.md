# Reflection

## What I Built

A Core Support Ticket Management System: React frontend, Express API, SQLite persistence, seeded users, ticket CRUD, comments, keyword search + status filter, and a backend-enforced status state machine with Jest/Supertest integration tests. Stretch features (auth, pagination, Swagger, Docker) were intentionally out of scope.

## How I Used AI (across the lifecycle)

| Phase | How Cursor was used |
|-------|---------------------|
| Requirements | Broke down the assignment into FRs/NFRs, edge cases, and acceptance criteria |
| Planning/design | Architecture, API contract, data model, UI flow, incremental milestones |
| Implementation | Generated layers incrementally (DB → API → UI) against the living spec |
| Testing | Drafted state-machine integration tests from the transition table |
| Debugging | Diagnosed SQLite driver block, verify exact-count bug, Jest resolver failure |
| Review | Reviewed routes, frontend filter sync, and validation boundaries |
| Documentation | Kept prompt history and lifecycle artifacts updated per milestone |

Work stayed spec-driven via `tool-specific/cursor-workflow/` rather than one-shot code generation.

## What AI Helped With Most

- Structuring the repository and lifecycle artifacts to match the assessment format
- Scaffolding Express layering and React pages quickly once the API contract was fixed
- Generating thorough state-machine test cases from the transition table
- Surfacing hypotheses during environment-specific failures (native module blocks)

## What AI Got Wrong

1. **Over-constrained terminal statuses** — initially blocked normal field updates on Closed/Cancelled; assignment only requires terminal *status transitions*. Corrected after review.
2. **Exact-count `db:verify`** — assumed ticket/comment totals would forever equal seed counts; broke after real API-created data. Fixed to seed-ID + minimum-count checks.
3. **Tooling assumptions** — first Jest 30 / `ts-jest` choices failed on this machine (resolver native binding; TS 7 peer range). Adjusted to Jest 29 + `@swc/jest`.

## How I Validated AI Output

- Read and corrected generated business logic against `data-model.md` / `api-contract.md`
- Ran TypeScript builds for backend and frontend
- Exercised API with create/update/status/search/filter/comment checks
- Confirmed persistence after backend restart
- Ran `npm test` (13/13 state-machine cases)
- Manually validated UI flows in the browser
- Rejected deleting application data just to satisfy a bad verification check

## What I Would Improve Next

- Add supporting CRUD/validation integration tests beyond the mandatory state-machine suite
- Reduce frontend/backend transition-table duplication (e.g., expose allowed transitions from API)
- Add a thin CI workflow once Git remote is available (Stretch)
- Improve prompt history for design/documentation phases with more iteration detail

## Reusable Workflow (prompts, rules, specs, templates)

- `tool-specific/cursor-workflow/project-context.md` — persistent stack/scope/non-goals
- `tool-specific/cursor-workflow/spec.md` + `tasks.md` — living spec and ordered work
- `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` — generation constraints
- Prompt templates in those rules for milestone starts, state machine work, tests, and review
- `ai-prompts/` history pattern: Prompt → Response → Accepted / Changed / Rejected
