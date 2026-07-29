import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import request from "supertest";

import { createApp } from "../../backend/src/app.js";
import { closeDb, getDb, resetDb } from "../../backend/src/db/index.js";
import { migrateDatabase } from "../../backend/src/db/migrate.js";
import type { TicketStatus } from "../../backend/src/types/index.js";

export type TestContext = {
  app: ReturnType<typeof createApp>;
  databasePath: string;
};

export async function setupTestApp(): Promise<TestContext> {
  const databasePath = path.join(
    os.tmpdir(),
    `support-tickets-test-${Date.now()}-${Math.random().toString(16).slice(2)}.db`,
  );

  if (fs.existsSync(databasePath)) {
    fs.unlinkSync(databasePath);
  }

  resetDb(databasePath);
  migrateDatabase(getDb());

  getDb()
    .prepare(
      `INSERT INTO users (id, name, email, role) VALUES
        (1, 'Alice Admin', 'alice@example.com', 'admin'),
        (2, 'Bob Agent', 'bob@example.com', 'agent')`,
    )
    .run();

  return {
    app: createApp(),
    databasePath,
  };
}

export function teardownTestApp(databasePath: string): void {
  closeDb();
  for (const suffix of ["", "-journal", "-wal", "-shm"]) {
    const filePath = `${databasePath}${suffix}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export async function createTicket(
  app: ReturnType<typeof createApp>,
  overrides: Record<string, unknown> = {},
): Promise<{ id: number; status: TicketStatus }> {
  const response = await request(app)
    .post("/api/tickets")
    .send({
      title: "State machine test ticket",
      description: "Created for integration testing",
      priority: "Medium",
      createdBy: 1,
      assignedTo: 2,
      ...overrides,
    })
    .expect(201);

  return response.body.data;
}

export function setTicketStatusDirect(
  ticketId: number,
  status: TicketStatus,
): void {
  getDb()
    .prepare(`UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?`)
    .run(status, new Date().toISOString(), ticketId);
}

export function changeStatus(
  app: ReturnType<typeof createApp>,
  ticketId: number,
  status: TicketStatus,
) {
  return request(app).patch(`/api/tickets/${ticketId}/status`).send({ status });
}
