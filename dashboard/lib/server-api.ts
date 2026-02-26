import { headers } from "next/headers";

import { API_BASE_URL } from "@/lib/api";

type ServerApiOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

export async function serverApiRequest<T>(path: string, options?: ServerApiOptions) {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie") ?? "";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options?.method ?? "GET",
    headers: {
      "content-type": "application/json",
      cookie,
      ...(options?.headers ?? {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as T;
  return { status: response.status, data };
}
