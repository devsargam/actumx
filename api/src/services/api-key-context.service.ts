import { and, eq, isNull } from "drizzle-orm";

import { db } from "../db/client";
import { apiKeys } from "../db/schema";
import { hashSecret } from "../lib/crypto";

export abstract class ApiKeyContextService {
  static async getAuthenticatedApiKey(request: Request): Promise<typeof apiKeys.$inferSelect | null> {
    const rawApiKey = request.headers.get("x-api-key");
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
}
