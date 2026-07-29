import type {
  Comment,
  CommentRow,
  CreateCommentInput,
} from "../types/index.js";
import { getDb } from "../db/index.js";

function mapComment(row: CommentRow): Comment {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    message: row.message,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

export function findCommentsByTicketId(ticketId: number): Comment[] {
  const rows = getDb()
    .prepare(
      `SELECT id, ticket_id, message, created_by, created_at
       FROM comments
       WHERE ticket_id = ?
       ORDER BY created_at ASC, id ASC`,
    )
    .all(ticketId) as CommentRow[];

  return rows.map(mapComment);
}

export function createComment(
  ticketId: number,
  input: CreateCommentInput,
): Comment {
  const createdAt = new Date().toISOString();
  const result = getDb()
    .prepare(
      `INSERT INTO comments (ticket_id, message, created_by, created_at)
       VALUES (?, ?, ?, ?)`,
    )
    .run(ticketId, input.message, input.createdBy, createdAt) as {
    lastInsertRowid: number | bigint;
  };

  const row = getDb()
    .prepare(
      `SELECT id, ticket_id, message, created_by, created_at
       FROM comments
       WHERE id = ?`,
    )
    .get(Number(result.lastInsertRowid)) as CommentRow;

  return mapComment(row);
}
