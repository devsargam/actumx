import { headers } from "next/headers";

import { API_BASE_URL } from "@/lib/api";

export type ServerSession = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
};

export async function getServerSession(): Promise<ServerSession | null> {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie") ?? "";

  const response = await fetch(`${API_BASE_URL}/auth/api/get-session`, {
    method: "GET",
    headers: {
      cookie,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ServerSession | null;
  return data;
}
