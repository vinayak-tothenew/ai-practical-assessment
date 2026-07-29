# AI Practical Assessment — Support Ticket Management System

A full-stack support ticket management application built as part of the AI Capability Exercise. This repository demonstrates spec-driven, AI-assisted development with Cursor across the software development lifecycle.

## Project Status

**Phase:** M2–M5 Core application complete — awaiting manual browser testing before M6  
**Stack:** React + Vite + TypeScript | Node.js + Express + TypeScript | SQLite | Jest + Supertest (planned for M6)

## Quick Start

### 1. Database

```powershell
Set-Location backend
npm install
npm run db:init
npm run db:verify
```

### 2. Backend API

```powershell
Set-Location backend
npm run start
```

API: `http://localhost:3001/api`

### 3. Frontend

```powershell
Set-Location frontend
npm install
npm run dev
```

UI: `http://localhost:5173`  
Uses `VITE_API_BASE_URL` from `frontend/.env`.

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_PATH=./data/tickets.db
PORT=3001
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Core Features

| Feature | Status |
|---------|--------|
| Create / list / view / update tickets | Implemented |
| Status state machine (backend enforced) | Implemented |
| Add comments to tickets | Implemented |
| Keyword search + status filter | Implemented |
| Backend validation + UI error states | Implemented |
| SQLite persistence across restarts | Implemented |
| State-machine integration tests | Implemented (`npm test` in `backend/`) |

## Tests

```powershell
Set-Location backend
npm test
```

See `test-results.md` for the latest run (13/13 state-machine cases).

## Repository Structure

```
ai-practical-assessment/
├── README.md
├── backend/                 # Express API + SQLite tooling
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config.ts
│   │   ├── db/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── ...
│   └── data/tickets.db      # local DB (gitignored)
├── frontend/                # React + Vite UI
│   └── src/
│       ├── api/client.ts
│       ├── pages/
│       └── components/
├── database/                # schema.sql, seed.sql, setup-notes.md
├── ai-prompts/
└── tool-specific/cursor-workflow/
```

## Documentation Index

| Document | Purpose |
|----------|---------|
| `requirements-analysis.md` | Problem understanding and requirements |
| `acceptance-criteria.md` | Testable completion checklist |
| `implementation-plan.md` | Milestones and incremental build order |
| `design-notes.md` | Architecture and design decisions |
| `api-contract.md` | REST API specification |
| `data-model.md` | Entity relationships and schema |
| `ui-flow.md` | Frontend screens and user flows |
| `test-strategy.md` | Testing approach (M6) |
| `tool-workflow.md` | How AI is used across the lifecycle |
| `tool-specific/cursor-workflow/` | Cursor-specific context, spec, tasks, rules |

## AI Tool

**Primary tool:** Cursor  
See `tool-workflow.md` and `tool-specific/cursor-workflow/` for workflow documentation and prompt traceability.

## License

Internal competency exercise — not for public distribution.
