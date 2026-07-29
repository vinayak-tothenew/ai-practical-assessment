import { openDatabase } from "./connection.js";
import { migrateDatabase } from "./migrate.js";
import { getDatabasePath } from "./paths.js";
import { seedDatabase } from "./seed.js";
import { verifyDatabase } from "./verify.js";

const databasePath = getDatabasePath();
const database = openDatabase(databasePath);

try {
  const migrationApplied = migrateDatabase(database);
  seedDatabase(database);
  const result = verifyDatabase(database);

  console.log(`Database: ${databasePath}`);
  console.log(
    migrationApplied
      ? "Migration: 001_initial_schema applied"
      : "Migration: 001_initial_schema already applied",
  );
  console.log(
    `Seed verified: ${result.seedUsersPresent} seed users, ${result.seedTicketsPresent} seed tickets, ${result.seedCommentsPresent} seed comments`,
  );
  console.log(
    `Totals: ${result.users} users, ${result.tickets} tickets, ${result.comments} comments (extras beyond seed allowed for tickets/comments)`,
  );
  console.log("Foreign-key violations: 0");
} finally {
  database.close();
}
