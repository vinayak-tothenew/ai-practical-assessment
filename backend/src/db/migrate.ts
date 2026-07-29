import fs from "node:fs";

import { openDatabase, type SqliteDatabase } from "./connection.js";
import { getDatabaseAssetPath, isMainModule } from "./paths.js";

const INITIAL_MIGRATION = "001_initial_schema";

export function migrateDatabase(database: SqliteDatabase): boolean {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const existingMigration = database
    .prepare("SELECT version FROM schema_migrations WHERE version = ?")
    .get(INITIAL_MIGRATION);

  if (existingMigration) {
    return false;
  }

  const schemaSql = fs.readFileSync(
    getDatabaseAssetPath("schema.sql"),
    "utf8",
  );

  database.transaction(() => {
    database.exec(schemaSql);
    database
      .prepare(
        "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)",
      )
      .run(INITIAL_MIGRATION, new Date().toISOString());
  })();

  return true;
}

if (isMainModule(import.meta.url)) {
  const database = openDatabase();

  try {
    const applied = migrateDatabase(database);
    console.log(
      applied
        ? `Applied migration ${INITIAL_MIGRATION}.`
        : `Migration ${INITIAL_MIGRATION} is already applied.`,
    );
  } finally {
    database.close();
  }
}
