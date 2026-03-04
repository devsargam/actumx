import { createAuthClient } from "better-auth/react";

import { API_BASE_URL } from "@/lib/api";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  basePath: "/auth/api/auth",
});
