-- Support Ticket Management System — Schema
-- SQLite
-- Migration: 001_initial_schema

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version    TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 100),
  email      TEXT    NOT NULL UNIQUE,
  role       TEXT    NOT NULL CHECK (role IN ('admin', 'agent', 'user'))
);

CREATE TABLE IF NOT EXISTS tickets (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 200),
  description TEXT    NOT NULL CHECK (length(trim(description)) BETWEEN 1 AND 5000),
  priority    TEXT    NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  status      TEXT    NOT NULL DEFAULT 'Open'
              CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled')),
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by  INTEGER NOT NULL REFERENCES users(id),
  created_at  TEXT    NOT NULL,
  updated_at  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id  INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  message    TEXT    NOT NULL CHECK (length(trim(message)) BETWEEN 1 AND 2000),
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_updated_at ON tickets(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_ticket_id ON comments(ticket_id);
