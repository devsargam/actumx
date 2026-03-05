import { and, eq, isNull } from "drizzle-orm";

import { db } from "../db/client";
import { apiKeys } from "../db/schema";
import { hashSecret } from "../lib/crypto";

export abstract class ApiKeyContextService {
  static async getAuthenticatedApiKey(request: Request): Promise<typeof apiKeys.$inferSelect | null> {
    const rawApiKey = ApiKeyContextService.extractApiKey(request);
    if (!rawApiKey) {
      return null;
    }

    const [apiKey] = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.keyHash, hashSecret(rawApiKey)), isNull(apiKeys.revokedAt)))
      .limit(1);

    return apiKey ?? null;
  }

  private static extractApiKey(request: Request): string | null {
    const xApiKeyHeaders = [
      "x-api-key",
      "x-api_key",
      "api-key",
      "x-actumx-api-key",
    ];
    for (const headerName of xApiKeyHeaders) {
      const value = request.headers.get(headerName)?.trim();
      if (value) {
        return value;
      }
    }

    const authorization = request.headers.get("authorization");
    if (!authorization) {
      return null;
    }

    const normalized = authorization.trim();
    const [scheme, token] = normalized.split(/\s+/, 2);
    const schemeLower = scheme?.toLowerCase();
    if (
      (schemeLower === "bearer" || schemeLower === "token") &&
      token?.trim()
    ) {
      return token.trim();
    }

    // Some MCP clients pass the raw token as Authorization header value.
    if (!token && normalized) {
      return normalized;
    }

    const proxyAuthorization = request.headers.get("proxy-authorization");
    if (!proxyAuthorization) {
      return null;
    }

    const [proxyScheme, proxyToken] = proxyAuthorization
      .trim()
      .split(/\s+/, 2);
    if (
      (proxyScheme?.toLowerCase() === "bearer" ||
        proxyScheme?.toLowerCase() === "token") &&
      proxyToken?.trim()
    ) {
      return proxyToken.trim();
    }

    return null;
  }
}
