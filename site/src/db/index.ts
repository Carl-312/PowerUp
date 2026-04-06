import path from "node:path";
import { mkdirSync } from "node:fs";
import BetterSqlite3 from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

type SqliteClient = BetterSqlite3.Database;

const resolveDatabasePath = () => {
  const configuredPath = process.env.DATABASE_URL ?? "data/powerup.db";

  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.join(/* turbopackIgnore: true */ process.cwd(), configuredPath);
};

const databasePath = resolveDatabasePath();
mkdirSync(path.dirname(databasePath), { recursive: true });

declare global {
  var __powerup_sqlite__: SqliteClient | undefined;
}

const sqlite =
  globalThis.__powerup_sqlite__ ?? new BetterSqlite3(databasePath);

sqlite.pragma("journal_mode = WAL");

if (process.env.NODE_ENV !== "production") {
  globalThis.__powerup_sqlite__ = sqlite;
}

export { databasePath, sqlite };
export const db = drizzle(sqlite, { schema });
