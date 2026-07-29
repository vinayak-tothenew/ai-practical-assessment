# AI Prompts — Planning Phase

Prompt history for requirement analysis, design, and planning.

---

## Prompt 1 — Initial project setup

**Date:** 2026-07-29  
**Phase:** Planning

### Prompt (summary)
User provided the full AI Capability Exercise brief and asked to create the Support Ticket Management System. Confirmed stack: React + Vite + TypeScript, Node.js + Express + TypeScript, SQLite, Jest + Supertest, Cursor, Core only. Requested spec-driven incremental workflow — scaffold and docs first, no feature implementation yet.

### AI response (summary)
- Proposed project name `ai-practical-assessment` at `~/Projects/`
- Created repository structure and lifecycle documentation
- Produced requirements analysis, architecture, API contract, data model, UI flows, test strategy
- Created Cursor workflow artifacts (project-context, spec, tasks, rules)
- Presented design for user review before M1

### Accepted
- Full documentation structure and design proposals
- Incremental milestone plan (M0–M6)
- State machine as dedicated service with separate status endpoint
- SQLite with better-sqlite3

### Changed
- Seed data: fixed comment `created_by` to non-null (was incorrectly NULL in draft)
- Terminal status rule: comments still allowed on Closed/Cancelled tickets

### Rejected
- Building entire application in one step (user explicitly requested incremental workflow)
- Stretch features (auth, pagination, Swagger, Docker) — out of Core scope

### Why
User needs traceable AI usage evidence across the lifecycle. Incremental milestones support prompt history, debugging notes, and review artifacts per phase.

---

_Template for future entries:_

```
## Prompt N — [Title]
**Date:** YYYY-MM-DD
**Phase:** [planning|design|implementation|testing|debugging|review|documentation]

### Prompt
[Full or summarized prompt text]

### AI response (summary)
[What the AI suggested/generated]

### Accepted
[What was kept]

### Changed
[What was modified and why]

### Rejected
[What was not used and why]
```
