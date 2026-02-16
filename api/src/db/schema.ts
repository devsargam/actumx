import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  revokedAt: text("revoked_at"),
  createdAt: text("created_at").notNull(),
});

export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  keyHash: text("key_hash").notNull().unique(),
  revokedAt: text("revoked_at"),
  lastUsedAt: text("last_used_at"),
  createdAt: text("created_at").notNull(),
});

export const paymentIntents = sqliteTable("payment_intents", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull(),
  providerReference: text("provider_reference"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const creditLedger = sqliteTable("credit_ledger", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  direction: text("direction").notNull(),
  amountCents: integer("amount_cents").notNull(),
  source: text("source").notNull(),
  referenceId: text("reference_id"),
  createdAt: text("created_at").notNull(),
});

export const x402Transactions = sqliteTable("x402_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  apiKeyId: text("api_key_id").notNull(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull(),
  paymentIntentId: text("payment_intent_id"),
  receiptId: text("receipt_id"),
  consumedAt: text("consumed_at"),
  metadata: text("metadata"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const usageEvents = sqliteTable("usage_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  apiKeyId: text("api_key_id").notNull(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  units: integer("units").notNull(),
  costCents: integer("cost_cents").notNull(),
  x402TransactionId: text("x402_transaction_id").notNull(),
  createdAt: text("created_at").notNull(),
});
