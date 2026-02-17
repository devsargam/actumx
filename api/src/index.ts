import { APP_PORT } from "./config/constants";
import { initializeDatabase } from "./db/init";
import { app } from "./app";

initializeDatabase();

app.listen(APP_PORT);

console.log(`x402 API running on http://localhost:${APP_PORT}`);
