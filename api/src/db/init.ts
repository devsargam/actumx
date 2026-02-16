import { sqlite } from "./client";

export function initializeDatabase(): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      revoked_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      key_prefix TEXT NOT NULL,
      key_hash TEXT NOT NULL UNIQUE,
      revoked_at TEXT,
      last_used_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payment_intents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      status TEXT NOT NULL,
      provider_reference TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS credit_ledger (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      direction TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      source TEXT NOT NULL,
      reference_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS x402_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      api_key_id TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      status TEXT NOT NULL,
      payment_intent_id TEXT,
      receipt_id TEXT,
      consumed_at TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (api_key_id) REFERENCES api_keys(id),
      FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id)
    );

    CREATE TABLE IF NOT EXISTS usage_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      api_key_id TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      units INTEGER NOT NULL,
      cost_cents INTEGER NOT NULL,
      x402_transaction_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (api_key_id) REFERENCES api_keys(id),
      FOREIGN KEY (x402_transaction_id) REFERENCES x402_transactions(id)
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
    CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON payment_intents(user_id);
    CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);
    CREATE INDEX IF NOT EXISTS idx_x402_transactions_user_id ON x402_transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_usage_events_user_id ON usage_events(user_id);
  `);
}
