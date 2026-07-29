import type {
  CreateTicketInput,
  Ticket,
  TicketListQuery,
  TicketPriority,
  TicketRow,
  TicketStatus,
  UpdateTicketInput,
} from "../types/index.js";
import { getDb } from "../db/index.js";

function mapTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    assignedTo: row.assigned_to,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function findTickets(query: TicketListQuery = {}): Ticket[] {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (query.search?.trim()) {
    clauses.push(
      `(LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))`,
    );
    const term = `%${query.search.trim()}%`;
    params.push(term, term);
  }

  if (query.status) {
    clauses.push(`status = ?`);
    params.push(query.status);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

  const rows = getDb()
    .prepare(
      `SELECT id, title, description, priority, status,
              assigned_to, created_by, created_at, updated_at
       FROM tickets
       ${where}
       ORDER BY updated_at DESC`,
    )
    .all(...params) as TicketRow[];

  return rows.map(mapTicket);
}

export function findTicketById(id: number): Ticket | undefined {
  const row = getDb()
    .prepare(
      `SELECT id, title, description, priority, status,
              assigned_to, created_by, created_at, updated_at
       FROM tickets
       WHERE id = ?`,
    )
    .get(id) as TicketRow | undefined;

  return row ? mapTicket(row) : undefined;
}

export function createTicket(input: CreateTicketInput): Ticket {
  const now = new Date().toISOString();
  const result = getDb()
    .prepare(
      `INSERT INTO tickets (
         title, description, priority, status, assigned_to, created_by, created_at, updated_at
       ) VALUES (?, ?, ?, 'Open', ?, ?, ?, ?)`,
    )
    .run(
      input.title,
      input.description,
      input.priority,
      input.assignedTo ?? null,
      input.createdBy,
      now,
      now,
    ) as { lastInsertRowid: number | bigint };

  const id = Number(result.lastInsertRowid);
  const ticket = findTicketById(id);

  if (!ticket) {
    throw new Error("Failed to load created ticket");
  }

  return ticket;
}

export function updateTicketFields(
  id: number,
  input: UpdateTicketInput,
): Ticket | undefined {
  const existing = findTicketById(id);
  if (!existing) {
    return undefined;
  }

  const title = input.title ?? existing.title;
  const description = input.description ?? existing.description;
  const priority = (input.priority ?? existing.priority) as TicketPriority;
  const assignedTo =
    input.assignedTo !== undefined ? input.assignedTo : existing.assignedTo;
  const updatedAt = new Date().toISOString();

  getDb()
    .prepare(
      `UPDATE tickets
       SET title = ?, description = ?, priority = ?, assigned_to = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(title, description, priority, assignedTo, updatedAt, id);

  return findTicketById(id);
}

export function updateTicketStatus(
  id: number,
  status: TicketStatus,
): Ticket | undefined {
  const existing = findTicketById(id);
  if (!existing) {
    return undefined;
  }

  const updatedAt = new Date().toISOString();

  getDb()
    .prepare(
      `UPDATE tickets
       SET status = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(status, updatedAt, id);

  return findTicketById(id);
}
