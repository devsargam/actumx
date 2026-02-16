import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "../db/client";
import { sessions, users } from "../db/schema";
import { hashSecret } from "../lib/crypto";
import { TimeService } from "./time.service";

export type AuthenticatedUser = {
  user: typeof users.$inferSelect;
  session: typeof sessions.$inferSelect;
};

export abstract class AuthContextService {
  static getBearerToken(request: Request): string | null {
    const header = request.headers.get("authorization");
    if (!header) {
      return null;
    }

    const [type, token] = header.split(" ");
    if (type?.toLowerCase() !== "bearer" || !token) {
      return null;
    }

    return token;
  }

  static async getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
    const token = AuthContextService.getBearerToken(request);
    if (!token) {
      return null;
    }

    const tokenHash = hashSecret(token);
    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.tokenHash, tokenHash),
          gt(sessions.expiresAt, TimeService.nowIso()),
          isNull(sessions.revokedAt)
        )
      )
      .limit(1);

    if (!session) {
      return null;
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
    if (!user) {
      return null;
    }

    return { user, session };
  }
}
