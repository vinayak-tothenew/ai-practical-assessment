# Code Review Notes

## AI-Assisted Review Summary

Reviewed Core backend routes/services and frontend list/detail flows against `spec.md`, `api-contract.md`, and `acceptance-criteria.md`, focusing on state-machine correctness, validation, error handling, and scope creep.

## My Review Observations

| # | Severity | Observation |
|---|----------|-------------|
| 1 | Medium | Ticket router registered `PATCH /:id` before `PATCH /:id/status` and comment routes. Express matches by specificity in practice, but more-specific routes should be declared first to avoid future regressions. |
| 2 | Low | Ticket list loaded filters only on first mount; URL search params were not re-applied when navigating back with query string. |
| 3 | Low | Frontend duplicates the transition table (`VALID_TRANSITIONS`) for UX button filtering. Backend remains authoritative; duplication is acceptable for Core but could drift. |
| 4 | Info | Invalid transitions are hard to trigger from UI because only allowed buttons are shown — intentional; covered by API tests. |
| 5 | Info | No auth / pagination / Swagger — correctly excluded as Stretch. |
| 6 | Info | `db:verify` previously used exact ticket counts; already fixed earlier (Issue 2). |

## Changes Made After Review

1. Reordered ticket routes so `/status` and `/comments` are registered before `/:id`.
2. Ticket list now syncs and reloads from `searchParams` when the query string changes.

See `review-fixes.md`.

## Suggestions Rejected (and why)

| Suggestion | Why rejected |
|------------|--------------|
| Add auth to “finish” the app | Stretch; not required for Core |
| Expose OpenAPI/Swagger now | Stretch; would delay submission artifacts |
| Drive frontend transitions only from a new API endpoint | Nice-to-have; current duplication is explicit and tests cover backend authority |
| Delete application-created tickets before verify | Would destroy persistence evidence; verify already fixed |
| Add full CRUD integration suite before submitting | Valuable, but Core mandatory tier (state machine) already passes; remaining time better spent on reflection/PR/Git |
