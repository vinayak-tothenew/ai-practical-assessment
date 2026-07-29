import { openDatabase, type SqliteDatabase } from "./connection.js";
import { getDatabasePath } from "./paths.js";

let database: SqliteDatabase | undefined;

export function getDb(): SqliteDatabase {
  if (!database) {
    database = openDatabase(getDatabasePath());
  }

  return database;
}

export function closeDb(): void {
  if (database) {
    database.close();
    database = undefined;
  }
}

/** Close any open connection and open a new one (used by integration tests). */
export function resetDb(databasePath?: string): SqliteDatabase {
  closeDb();

  if (databasePath !== undefined) {
    process.env.DATABASE_PATH = databasePath;
  }

  database = openDatabase(getDatabasePath());
  return database;
}
