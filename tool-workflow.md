# Tool Workflow

**Primary AI tool:** Cursor  
**Project:** Support Ticket Management System (Core)  
**Last updated:** 2026-07-29

## Primary AI Tool Used

Cursor is the primary AI tool for this exercise. Work is organized spec-driven: persistent context documents in `tool-specific/cursor-workflow/` guide each implementation phase, and prompt history is captured under `ai-prompts/`.

## How I Provide Project Context to the Tool

1. **Persistent context files** — `tool-specific/cursor-workflow/project-context.md` defines stack, constraints, and non-goals.
2. **Spec and tasks** — `spec.md` and `tasks.md` are referenced at the start of each implementation session.
3. **Design artifacts** — `api-contract.md`, `data-model.md`, and `design-notes.md` are attached or cited when generating code.
4. **Cursor rules** — `cursor-rules-or-instructions.md` encodes coding standards and validation rules for the session.
5. **Incremental scope** — Each prompt targets one milestone (e.g., "implement ticket state machine service only") rather than the full app.

## How I Use AI for Requirement Analysis

- Paste the assignment brief and ask Cursor to help break down functional vs non-functional requirements.
- Review and correct AI interpretations; document final understanding in `requirements-analysis.md`.
- Use AI to surface edge cases (invalid transitions, empty search, missing assignee) then validate against acceptance criteria.
- **Evidence:** `requirements-analysis.md`, `ai-prompts/planning.md`

## How I Use AI for Planning and Design

- Request architecture proposals constrained to the chosen stack (React/Vite, Express/TS, SQLite).
- Ask for API contract drafts and database schema; review and refine before accepting.
- Break work into ordered tasks with clear dependencies in `tasks.md`.
- Reject over-engineered suggestions (auth, pagination, Docker) when Core scope is active.
- **Evidence:** `implementation-plan.md`, `design-notes.md`, `api-contract.md`, `data-model.md`, `tool-specific/cursor-workflow/spec.md`

## How I Use AI for Code Generation

- Generate one layer at a time: schema → repository → service → routes → frontend components.
- Provide the relevant spec section and existing file structure in each prompt.
- Accept structural patterns; manually verify business logic (especially state machine rules).
- **Evidence:** `ai-prompts/implementation.md`, commit history

## How I Validate AI-Generated Code

- Read generated code before committing; trace logic against `api-contract.md` and acceptance criteria.
- Run TypeScript compiler and linter after each change.
- Run integration tests after backend features land.
- Manually exercise UI flows for error states and invalid transitions.
- Cross-check AI suggestions against the state machine table in `data-model.md`.

## How I Use AI for Testing

- Ask Cursor to draft integration tests from the state machine specification.
- Review test cases for missing invalid-transition scenarios.
- Run tests locally; fix failures with AI-assisted debugging, then verify the fix myself.
- **Evidence:** `test-strategy.md`, `tests/`, `ai-prompts/testing.md`, `test-results.md`

## How I Use AI for Debugging

- Describe the failure (test output, request/response, stack trace) with relevant code context.
- Ask for hypotheses, not blind fixes; validate each hypothesis.
- Document the investigation and final fix in `debugging-notes.md`.
- **Evidence:** `debugging-notes.md`, `ai-prompts/debugging.md`

## How I Use AI for Code Review

- Ask Cursor to review completed milestones against spec and acceptance criteria.
- Focus review prompts on validation, error handling, and state machine correctness.
- Record observations, accepted changes, and rejected suggestions in `code-review-notes.md`.
- **Evidence:** `code-review-notes.md`, `review-fixes.md`, `ai-prompts/code-review.md`

## What Information I Avoid Sharing Unnecessarily with AI Tools

- Passwords, API keys, tokens, or production credentials (none used in this project).
- Personal identifiable information beyond seeded sample data.
- Internal company URLs or infrastructure details unrelated to the exercise.
- Entire codebase dumps when a focused file + spec excerpt is sufficient.

## How I Would Reuse This Workflow in a Real Project

1. Start with `project-context.md` and a living `spec.md` before any code.
2. Maintain `tasks.md` as the single source of work order; update status after each session.
3. Capture prompt history by lifecycle phase, not as a single dump at the end.
4. Enforce incremental prompts: one feature or layer per session with explicit acceptance checks.
5. Use Cursor rules for stack-specific conventions so generated code stays consistent.
6. Run tests and review after each milestone before moving to the next.
7. Keep `debugging-notes.md` and `reflection.md` honest — they are the highest-value feedback inputs.
