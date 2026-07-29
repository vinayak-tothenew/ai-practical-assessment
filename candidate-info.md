# Candidate Information

**Name:** Vinayak Sharma  
**Role:** Senior Software Engineer  
**Primary Technology Stack:** React, Node.js, TypeScript, SQLite

**Primary AI Tool Used:** Cursor  
**Project Option Selected:** Backend-Heavy — Support Ticket Management System

**Assessment Start Date:** 2026-07-29  
**Submission Date:** 2026-07-30

## Project Summary

A full-stack Support Ticket Management System (Core only). Internal users can create, list, view, update, comment on, search, and progress tickets through a backend-enforced status state machine. Built with React + Vite + TypeScript, Express + TypeScript, and SQLite, using Cursor in a spec-driven incremental workflow.

## Tools Used

| Tool | Purpose |
|------|---------|
| Cursor | Primary AI assistant across requirement analysis, planning, implementation, testing, debugging, review |
| React + Vite + TypeScript | Frontend |
| Node.js + Express + TypeScript | Backend API |
| SQLite (`better-sqlite3` with `node:sqlite` fallback) | Database persistence |
| Jest 29 + Supertest + `@swc/jest` | State-machine integration tests |

## Setup Summary

```powershell
# Database + API
cd backend
npm install
npm run db:init
npm run start

# Frontend (second terminal)
cd frontend
npm install
npm run dev

# Tests
cd backend
npm test
```

See `README.md` and `database/setup-notes.md` for environment variables and verification details.
