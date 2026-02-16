import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "../../db/client";
import { apiKeys } from "../../db/schema";
import { hashSecret, newApiKey, newId } from "../../lib/crypto";
import { AuthContextService } from "../../services/auth-context.service";
import { TimeService } from "../../services/time.service";
import type { ApiKeysModel } from "./model";

export abstract class ApiKeysService {
  static async list(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        revokedAt: apiKeys.revokedAt,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, auth.user.id))
      .orderBy(desc(apiKeys.createdAt));

    return { statusCode: 200, body: { keys } };
  }

  static async create(request: Request, payload: ApiKeysModel.CreateApiKeyBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const rawKey = newApiKey();
    const keyPrefix = rawKey.slice(0, 14);
    const timestamp = TimeService.nowIso();
    const keyId = newId("key");

    await db.insert(apiKeys).values({
      id: keyId,
      userId: auth.user.id,
      name: payload.name,
      keyPrefix,
      keyHash: hashSecret(rawKey),
      revokedAt: null,
      lastUsedAt: null,
      createdAt: timestamp,
    });

    return {
      statusCode: 200,
      body: {
        apiKeyId: keyId,
        apiKey: rawKey,
        keyPrefix,
        warning: "Store this key now. It is shown only once.",
      },
    };
  }

  static async revoke(request: Request, id: string) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    await db
      .update(apiKeys)
      .set({ revokedAt: TimeService.nowIso() })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, auth.user.id), isNull(apiKeys.revokedAt)));

    return { statusCode: 200, body: { success: true } };
  }
}
