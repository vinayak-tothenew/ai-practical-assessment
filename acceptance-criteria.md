# Acceptance Criteria

## Core

- [ ] User can create a ticket via the UI (title, description, priority, creator)
- [ ] User can view all tickets from the database
- [ ] User can open a ticket detail view (fields + comments)
- [ ] User can update ticket fields (title, description, priority, assignee)
- [ ] User can add comments to a ticket
- [ ] Status changes only through valid transitions; invalid ones rejected by backend
- [ ] Invalid transitions show clear error in the UI
- [ ] Keyword search works (title + description)
- [ ] Status filter works
- [ ] Data remains available after application restart

## Validation

- [ ] Backend rejects missing required fields (title, description, priority)
- [ ] Backend rejects invalid enum values (priority, status)
- [ ] Backend rejects invalid assignee user ID
- [ ] Frontend displays validation errors from API responses

## Error Handling

- [ ] 404 for non-existent ticket
- [ ] 400 for validation failures with structured error message
- [ ] 409/422 for invalid status transitions with clear reason
- [ ] Frontend shows user-friendly error states (not raw stack traces)

## Testing

- [x] Integration tests: valid transitions succeed (all 5 paths)
- [x] Integration tests: invalid transitions are rejected (minimum 4 cases)
- [x] Tests run via documented npm script
- [x] Test results documented in `test-results.md`

## Documentation

- [ ] README has working setup instructions
- [ ] Database schema, seed data, and setup notes provided
- [ ] `.env.example` if environment variables are used
- [ ] Full prompt history in `ai-prompts/`
- [ ] Reflection and PR description completed before submission
