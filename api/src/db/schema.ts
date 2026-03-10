import { index, integer, pgTable, text } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  keyHash: text("key_hash").notNull().unique(),
  revokedAt: text("revoked_at"),
  lastUsedAt: text("last_used_at"),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  apiKeysUserIdIdx: index("idx_api_keys_user_id").on(table.userId),
}));

export const paymentIntents = pgTable("payment_intents", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull(),
  providerReference: text("provider_reference"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => ({
  paymentIntentsUserIdIdx: index("idx_payment_intents_user_id").on(table.userId),
}));

export const creditLedger = pgTable("credit_ledger", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  direction: text("direction").notNull(),
  amountCents: integer("amount_cents").notNull(),
  source: text("source").notNull(),
  referenceId: text("reference_id"),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  creditLedgerUserIdIdx: index("idx_credit_ledger_user_id").on(table.userId),
}));

export const x402Transactions = pgTable("x402_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  apiKeyId: text("api_key_id").notNull().references(() => apiKeys.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull(),
  paymentIntentId: text("payment_intent_id").references(() => paymentIntents.id, { onDelete: "set null" }),
  receiptId: text("receipt_id"),
  consumedAt: text("consumed_at"),
  metadata: text("metadata"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => ({
  x402TransactionsUserIdIdx: index("idx_x402_transactions_user_id").on(table.userId),
}));

export const usageEvents = pgTable("usage_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  apiKeyId: text("api_key_id").notNull().references(() => apiKeys.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  units: integer("units").notNull(),
  costCents: integer("cost_cents").notNull(),
  x402TransactionId: text("x402_transaction_id").notNull().references(() => x402Transactions.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  usageEventsUserIdIdx: index("idx_usage_events_user_id").on(table.userId),
}));

export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  publicKey: text("public_key").notNull().unique(),
  privateKey: text("private_key").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  agentsUserIdIdx: index("idx_agents_user_id").on(table.userId),
}));

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  faviconUrl: text("favicon_url"),
  baseUrl: text("base_url").notNull(),
  websocketUrl: text("websocket_url"),
  authMethod: text("auth_method").notNull(),
  apiKey: text("api_key"),
  isLive: text("is_live").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => ({
  servicesUserIdIdx: index("idx_services_user_id").on(table.userId),
}));

export const endpoints = pgTable("endpoints", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  method: text("method").notNull(),
  path: text("path").notNull(),
  priceCents: integer("price_cents").notNull(),
  isEnabled: text("is_enabled").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => ({
  endpointsServiceIdIdx: index("idx_endpoints_service_id").on(table.serviceId),
}));

export const paymentLinks = pgTable("payment_links", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  amountCents: integer("amount_cents").notNull(),
  description: text("description"),
  isReusable: text("is_reusable").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  paymentLinksUserIdIdx: index("idx_payment_links_user_id").on(table.userId),
}));
