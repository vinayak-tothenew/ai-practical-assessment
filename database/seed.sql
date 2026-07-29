-- Support Ticket Management System — Seed Data
-- Idempotent seed data for local development

-- Users
INSERT OR IGNORE INTO users (id, name, email, role) VALUES
  (1, 'Alice Admin',  'alice@example.com',  'admin'),
  (2, 'Bob Agent',    'bob@example.com',    'agent'),
  (3, 'Carol Agent',  'carol@example.com',  'agent'),
  (4, 'Dave User',    'dave@example.com',   'user'),
  (5, 'Eve User',     'eve@example.com',    'user');

-- Tickets (covering all statuses)
INSERT OR IGNORE INTO tickets (id, title, description, priority, status, assigned_to, created_by, created_at, updated_at) VALUES
  (1, 'Cannot login',           'User reports 500 error on login page after password reset.',  'High',   'Open',         2, 4, '2026-07-28T09:00:00.000Z', '2026-07-28T09:00:00.000Z'),
  (2, 'Slow dashboard load',    'Dashboard takes 15+ seconds to render for large accounts.',   'Medium', 'In Progress',  3, 4, '2026-07-27T14:00:00.000Z', '2026-07-29T08:00:00.000Z'),
  (3, 'Export CSV broken',      'CSV export returns empty file for date ranges over 30 days.', 'High',   'Resolved',     2, 5, '2026-07-25T10:00:00.000Z', '2026-07-28T16:00:00.000Z'),
  (4, 'Typo in welcome email',  'Welcome email template has a spelling error in the subject.', 'Low',    'Closed',         3, 1, '2026-07-20T11:00:00.000Z', '2026-07-22T09:00:00.000Z'),
  (5, 'Duplicate notifications', 'Users receive the same alert email three times.',            'Medium', 'Cancelled',    NULL, 5, '2026-07-26T08:00:00.000Z', '2026-07-27T10:00:00.000Z'),
  (6, 'Mobile layout overlap',  'Navigation menu overlaps content on screens under 400px.',    'Medium', 'Open',         NULL, 4, '2026-07-29T07:00:00.000Z', '2026-07-29T07:00:00.000Z');

-- Comments
INSERT OR IGNORE INTO comments (id, ticket_id, message, created_by, created_at) VALUES
  (1, 1, 'Reproduced on staging. Checking auth service logs.', 2, '2026-07-28T10:00:00.000Z'),
  (2, 1, 'Found null pointer in session middleware.',          2, '2026-07-28T14:00:00.000Z'),
  (3, 2, 'Profiling shows N+1 query in dashboard widget loader.', 3, '2026-07-28T09:00:00.000Z'),
  (4, 3, 'Fixed date range off-by-one in export query.',       2, '2026-07-28T15:00:00.000Z'),
  (5, 3, 'Verified fix on staging with 90-day range.',         2, '2026-07-28T16:00:00.000Z'),
  (6, 4, 'Corrected subject line in template v2.',             3, '2026-07-21T10:00:00.000Z'),
  (7, 5, 'Duplicate was caused by retry logic — wontfix for now.', 1, '2026-07-27T10:00:00.000Z'),
  (8, 6, 'Needs CSS media query fix in nav component.',        4, '2026-07-29T08:00:00.000Z');
