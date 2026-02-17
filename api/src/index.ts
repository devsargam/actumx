import { APP_PORT } from "./config/constants";
import { app } from "./app";

app.listen(APP_PORT);

console.log(`x402 API running on http://localhost:${APP_PORT}`);
