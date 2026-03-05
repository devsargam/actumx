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
    const xApiKey = request.headers.get("x-api-key");
    if (xApiKey) {
      return xApiKey;
    }

    const authorization = request.headers.get("authorization");
    if (!authorization) {
      return null;
    }

    const [scheme, token] = authorization.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return null;
    }

    return token;
  }
}
