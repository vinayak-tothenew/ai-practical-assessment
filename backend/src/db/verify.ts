import { openDatabase, type SqliteDatabase } from "./connection.js";
import { isMainModule } from "./paths.js";

/**
 * Seed baselines from database/seed.sql.
 * Users are seeded-only in Core (no user CRUD), so an exact user count remains meaningful.
 * Tickets and comments are mutable via the API, so verification checks that seed rows exist
 * and that totals are at least the seed baseline — not that totals never grow.
 */
const SEED_USER_IDS = [1, 2, 3, 4, 5] as const;
const SEED_TICKET_IDS = [1, 2, 3, 4, 5, 6] as const;
const SEED_COMMENT_IDS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export interface VerifyResult {
  users: number;
  tickets: number;
  comments: number;
  seedUsersPresent: number;
  seedTicketsPresent: number;
  seedCommentsPresent: number;
}

interface CountResult {
  count: number;
}

interface IdRow {
  id: number;
}

interface ForeignKeyViolation {
  table: string;
  rowid: number;
  parent: string;
  fkid: number;
}

interface MigrationResult {
  version: string;
}

function countRows(database: SqliteDatabase, table: string): number {
  const result = database
    .prepare(`SELECT COUNT(*) AS count FROM ${table}`)
    .get() as CountResult;
  return result.count;
}

function findMissingIds(
  database: SqliteDatabase,
  table: string,
  expectedIds: readonly number[],
): number[] {
  const placeholders = expectedIds.map(() => "?").join(", ");
  const rows = database
    .prepare(`SELECT id FROM ${table} WHERE id IN (${placeholders})`)
    .all(...expectedIds) as IdRow[];

  const present = new Set(rows.map((row) => row.id));
  return expectedIds.filter((id) => !present.has(id));
}

export function verifyDatabase(database: SqliteDatabase): VerifyResult {
  const migration = database
    .prepare(
      "SELECT version FROM schema_migrations WHERE version = '001_initial_schema'",
    )
    .get() as MigrationResult | undefined;

  if (!migration) {
    throw new Error("Initial schema migration is not recorded.");
  }

  const foreignKeyViolations = database
    .prepare("PRAGMA foreign_key_check")
    .all() as ForeignKeyViolation[];

  if (foreignKeyViolations.length > 0) {
    throw new Error(
      `Foreign-key verification failed: ${JSON.stringify(foreignKeyViolations)}`,
    );
  }

  const missingUsers = findMissingIds(database, "users", SEED_USER_IDS);
  if (missingUsers.length > 0) {
    throw new Error(
      `Missing seeded users (expected IDs ${SEED_USER_IDS.join(", ")}): ${missingUsers.join(", ")}`,
    );
  }

  const missingTickets = findMissingIds(database, "tickets", SEED_TICKET_IDS);
  if (missingTickets.length > 0) {
    throw new Error(
      `Missing seeded tickets (expected IDs ${SEED_TICKET_IDS.join(", ")}): ${missingTickets.join(", ")}`,
    );
  }

  const missingComments = findMissingIds(
    database,
    "comments",
    SEED_COMMENT_IDS,
  );
  if (missingComments.length > 0) {
    throw new Error(
      `Missing seeded comments (expected IDs ${SEED_COMMENT_IDS.join(", ")}): ${missingComments.join(", ")}`,
    );
  }

  const users = countRows(database, "users");
  const tickets = countRows(database, "tickets");
  const comments = countRows(database, "comments");

  // Users are seeded-only in Core — exact count still validates the baseline set.
  if (users !== SEED_USER_IDS.length) {
    throw new Error(
      `Expected exactly ${SEED_USER_IDS.length} users (seeded only; no user CRUD in Core), found ${users}.`,
    );
  }

  // Tickets and comments grow when the app is used — require seed baseline or more.
  if (tickets < SEED_TICKET_IDS.length) {
    throw new Error(
      `Expected at least ${SEED_TICKET_IDS.length} tickets (seed baseline), found ${tickets}.`,
    );
  }

  if (comments < SEED_COMMENT_IDS.length) {
    throw new Error(
      `Expected at least ${SEED_COMMENT_IDS.length} comments (seed baseline), found ${comments}.`,
    );
  }

  return {
    users,
    tickets,
    comments,
    seedUsersPresent: SEED_USER_IDS.length,
    seedTicketsPresent: SEED_TICKET_IDS.length,
    seedCommentsPresent: SEED_COMMENT_IDS.length,
  };
}

if (isMainModule(import.meta.url)) {
  const database = openDatabase();

  try {
    const result = verifyDatabase(database);
    console.log(
      `Users: ${result.users} (seed IDs present: ${result.seedUsersPresent})`,
    );
    console.log(
      `Tickets: ${result.tickets} (seed IDs present: ${result.seedTicketsPresent}; extras allowed)`,
    );
    console.log(
      `Comments: ${result.comments} (seed IDs present: ${result.seedCommentsPresent}; extras allowed)`,
    );
    console.log("Migration: 001_initial_schema");
    console.log("Foreign-key violations: 0");
  } finally {
    database.close();
  }
}
