import { fileURLToPath } from "node:url";
import path from "node:path";

const DEFAULT_DATABASE_PATH = path.join("data", "tickets.db");

export function getDatabasePath(): string {
  const configuredPath = process.env.DATABASE_PATH ?? DEFAULT_DATABASE_PATH;

  if (configuredPath === ":memory:" || path.isAbsolute(configuredPath)) {
    return configuredPath;
  }

  return path.resolve(process.cwd(), configuredPath);
}

export function getDatabaseAssetPath(fileName: string): string {
  return fileURLToPath(
    new URL(`../../../database/${fileName}`, import.meta.url),
  );
}

export function isMainModule(metaUrl: string): boolean {
  const entryPoint = process.argv[1];
  return Boolean(entryPoint) && fileURLToPath(metaUrl) === path.resolve(entryPoint);
}
