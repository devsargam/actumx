import { APP_PORT } from "./config/constants";
import { initializeDatabase } from "./db/init";
import { app } from "./app";
import { auth } from "./auth";

initializeDatabase();

const authContext = await auth.$context;
await authContext.runMigrations();

app.listen(APP_PORT);

console.log(`x402 API running on http://localhost:${APP_PORT}`);
