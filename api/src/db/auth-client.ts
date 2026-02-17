import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as authSchema from "./auth-schema";

const authDatabaseURL = process.env.BETTER_AUTH_DATABASE_URL;

if (!authDatabaseURL) {
  throw new Error("BETTER_AUTH_DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: authDatabaseURL,
});

export const authDb = drizzle(pool, { schema: authSchema });
export { authSchema };
