import { createHash, randomBytes } from "node:crypto";

export function newId(prefix: string): string {
  return `${prefix}_${randomBytes(12).toString("hex")}`;
}

export function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function newSessionToken(): string {
  return `sess_${randomBytes(24).toString("hex")}`;
}

export function newApiKey(): string {
  return `xk_live_${randomBytes(24).toString("hex")}`;
}
