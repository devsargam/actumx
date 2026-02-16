import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

const dbDirectory = join(process.cwd(), "data");
mkdirSync(dbDirectory, { recursive: true });

const sqlite = new Database(join(dbDirectory, "x402.sqlite"), {
  create: true,
  strict: true,
});

sqlite.exec("PRAGMA foreign_keys = ON;");

export const db = drizzle(sqlite, { schema });
export { sqlite };
