# Review Fixes

| # | Finding | Severity | Fix | File(s) | Status |
|---|---------|----------|-----|---------|--------|
| 1 | Specific ticket routes declared after `/:id` | Medium | Register `/status` and `/comments` before `/:id` handlers | `backend/src/routes/tickets.ts` | Done |
| 2 | List page ignored later URL query changes | Low | Reload from `searchParams` in `useEffect` | `frontend/src/pages/TicketListPage.tsx` | Done |
