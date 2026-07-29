import type { User } from "../types/index.js";
import { getDb } from "../db/index.js";

export function findAllUsers(): User[] {
  return getDb()
    .prepare(
      `SELECT id, name, email, role
       FROM users
       ORDER BY id ASC`,
    )
    .all() as User[];
}

export function findUserById(id: number): User | undefined {
  return getDb()
    .prepare(
      `SELECT id, name, email, role
       FROM users
       WHERE id = ?`,
    )
    .get(id) as User | undefined;
}
