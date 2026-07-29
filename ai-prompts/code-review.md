# AI Prompts — Code Review Phase

## Prompt 1 — Pre-submission Core review

**Date:** 2026-07-30  
**Phase:** Code review

### Prompt

Review the Core implementation against the spec and acceptance criteria. Focus on state machine correctness, validation, error handling, and scope creep. Report findings; apply only small safe fixes.

### AI response (summary)

- Confirmed backend state machine and PATCH status authority look correct.
- Flagged route declaration order and list-page URL sync as improvements.
- Suggested Stretch items (auth, OpenAPI, shared transition API) and rejected them for Core submission timing.

### Accepted

- Reorder ticket routes (specific before generic)
- Sync ticket list with `searchParams`

### Rejected

- Auth / Swagger / pagination before submission
- Reworking frontend to fetch allowed transitions from a new endpoint in this pass

### Validation

- Review notes captured in `code-review-notes.md`
- Fixes tracked in `review-fixes.md`
