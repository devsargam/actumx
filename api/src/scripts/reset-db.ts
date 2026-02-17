import { Pool } from "pg";

import { env } from "../config/env";

const force = process.argv.includes("--force");

if (!force) {
  console.error("Refusing to reset database without --force");
  process.exit(1);
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

try {
  console.log("Dropping public schema...");
  await pool.query(`DROP SCHEMA IF EXISTS public CASCADE;`);
  console.log("Dropping drizzle schema...");
  await pool.query(`DROP SCHEMA IF EXISTS drizzle CASCADE;`);

  console.log("Recreating public schema...");
  await pool.query(`CREATE SCHEMA public;`);

  console.log("Granting default privileges...");
  await pool.query(`GRANT ALL ON SCHEMA public TO public;`);

  console.log("Database reset complete.");
} finally {
  await pool.end();
}
