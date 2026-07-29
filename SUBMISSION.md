# Submission Checklist

## Completed in the repository

- [x] Working frontend + backend + SQLite
- [x] State-machine integration tests (`backend`: `npm test` → 13/13)
- [x] `tool-workflow.md` + Cursor workflow artifacts
- [x] Prompt history under `ai-prompts/`
- [x] `reflection.md`, `pr-description.md`, `code-review-notes.md`, `review-fixes.md`
- [x] `final-ai-usage-summary.md`
- [x] README + database setup notes

## You must still do locally

### 1. Fill personal fields

Edit `candidate-info.md`:

- Name
- Role
- Submission Date

### 2. Install Git (if needed) and create the repository

Git was not available in the development environment used for this project.

1. Install Git for Windows: https://git-scm.com/download/win
2. Open PowerShell in the project folder:

```powershell
cd C:\Users\Vinayak\Projects\ai-practical-assessment
git init
git add .
git status
```

3. Confirm `.env` and `*.db` are **not** staged (they are gitignored).
4. Commit:

```powershell
git commit -m "Complete Core Support Ticket Management System for AI capability exercise"
```

5. Create an empty private/public repo on GitHub/GitLab (accessible to your competency team).
6. Push:

```powershell
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

Optional: make a few logical commits instead of one large commit if your form asks for specific commits (for example, the verify-count fix or Jest setup).

### 3. Submit the participation form (Part C)

Share:

- Repository link
- Project option: Backend-Heavy — Support Ticket Management System
- Primary AI tool: Cursor
- Short written answers in your own words (requirement understanding, AI usage, design decisions, testing/debugging, improvements)

Point reviewers to:

- `reflection.md`
- `ai-prompts/`
- `debugging-notes.md` (Issues 1–3)
- `tests/integration/ticketStatus.test.ts` + `test-results.md`
- Commit that fixed AI/verify mistakes (once Git history exists)

### 4. Quick smoke check before submitting

```powershell
cd backend
npm install
npm run db:init
npm test
npm run start

# other terminal
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and confirm list/create/detail still work.
