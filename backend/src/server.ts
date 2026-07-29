import { createApp } from "./app.js";
import { config } from "./config.js";
import { closeDb, getDb } from "./db/index.js";

const app = createApp();

getDb();

const server = app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});

function shutdown(): void {
  server.close(() => {
    closeDb();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
