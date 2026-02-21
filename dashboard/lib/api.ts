export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type BillingSummary = {
  balanceCents: number;
  topUpTotalCents: number;
  usageTotalCents: number;
  activeApiKeys: number;
  x402Transactions: number;
};

export type ApiKeyRecord = {
  id: string;
  name: string;
  keyPrefix: string;
  revokedAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
};

export type Transaction = {
  id: string;
  status: string;
  method: string;
  endpoint: string;
  amountCents: number;
  receiptId: string | null;
  consumedAt: string | null;
  createdAt: string;
  updatedAt: string;
  apiKeyId: string;
  apiKeyName: string;
  apiKeyPrefix: string;
};

export type UsageEvent = {
  id: string;
  endpoint: string;
  method: string;
  costCents: number;
  createdAt: string;
  apiKeyId: string;
};

export type PaymentIntent = {
  id: string;
  amountCents: number;
  status: string;
  createdAt: string;
};

export type AgentRecord = {
  id: string;
  name: string;
  publicKey: string;
  createdAt: string;
  balanceLamports: number | null;
  balanceSol: number | null;
  error: string | null;
};

export type ApiResponse<T> = {
  status: number;
  data: T;
};

export async function apiRequest<T>(
  path: string,
  options?: {
    method?: "GET" | "POST" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
  }
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options?.method ?? "GET",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(options?.headers ?? {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();
  return { status: response.status, data };
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatTimestamp(value: string | null): string {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}
