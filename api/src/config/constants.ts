import { env } from "./env";

export const APP_PORT = env.PORT;

export const SESSION_TTL_DAYS = 30;

export const X402_PAID_ENDPOINT = "/v1/protected/quote";
export const X402_PAID_REQUEST_COST_CENTS = 25;
export const X402_SETTLEMENT_ENDPOINT = "/v1/x402/settle";
