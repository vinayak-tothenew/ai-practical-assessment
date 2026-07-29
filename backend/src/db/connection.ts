import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import Database from "better-sqlite3";

import { getDatabasePath } from "./paths.js";

type BetterSqliteDatabase = InstanceType<typeof Database>;
type DatabaseDriver = BetterSqliteDatabase | DatabaseSync;

export class SqliteStatement {
  public constructor(
    private readonly statement: ReturnType<DatabaseDriver["prepare"]>,
  ) {}

  public get(...parameters: unknown[]): unknown {
    return Reflect.apply(this.statement.get, this.statement, parameters);
  }

  public all(...parameters: unknown[]): unknown[] {
    return Reflect.apply(this.statement.all, this.statement, parameters);
  }

  public run(...parameters: unknown[]): unknown {
    return Reflect.apply(this.statement.run, this.statement, parameters);
  }
}

export class SqliteDatabase {
  public constructor(
    private readonly driver: DatabaseDriver,
    public readonly driverName: "better-sqlite3" | "node:sqlite",
  ) {}

  public exec(sql: string): void {
    this.driver.exec(sql);
  }

  public prepare(sql: string): SqliteStatement {
    return new SqliteStatement(this.driver.prepare(sql));
  }

  public transaction<T>(operation: () => T): () => T {
    return () => {
      this.exec("BEGIN IMMEDIATE");

      try {
        const result = operation();
        this.exec("COMMIT");
        return result;
      } catch (error) {
        this.exec("ROLLBACK");
        throw error;
      }
    };
  }

  public close(): void {
    this.driver.close();
  }
}

function createDriver(databasePath: string): SqliteDatabase {
  try {
    return new SqliteDatabase(
      new Database(databasePath),
      "better-sqlite3",
    );
  } catch (error) {
    const isBlockedNativeModule =
      error instanceof Error &&
      "code" in error &&
      error.code === "ERR_DLOPEN_FAILED";

    if (!isBlockedNativeModule) {
      throw error;
    }

    console.warn(
      "better-sqlite3 native module was blocked; using Node's built-in SQLite driver for this run.",
    );
    return new SqliteDatabase(new DatabaseSync(databasePath), "node:sqlite");
  }
}

export function openDatabase(databasePath = getDatabasePath()): SqliteDatabase {
  if (databasePath !== ":memory:") {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const database = createDriver(databasePath);
  database.exec("PRAGMA foreign_keys = ON");

  return database;
}
