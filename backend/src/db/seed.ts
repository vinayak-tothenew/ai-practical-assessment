import fs from "node:fs";

import { openDatabase, type SqliteDatabase } from "./connection.js";
import { getDatabaseAssetPath, isMainModule } from "./paths.js";

export function seedDatabase(database: SqliteDatabase): void {
  const seedSql = fs.readFileSync(getDatabaseAssetPath("seed.sql"), "utf8");
  database.transaction(() => database.exec(seedSql))();
}

if (isMainModule(import.meta.url)) {
  const database = openDatabase();

  try {
    seedDatabase(database);
    console.log("Seed data applied.");
  } finally {
    database.close();
  }
}
