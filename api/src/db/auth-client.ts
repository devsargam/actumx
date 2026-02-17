import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "../config/env";
import * as authSchema from "./auth-schema";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const authDb = drizzle(pool, { schema: authSchema });
export { authSchema };
