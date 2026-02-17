import { eq } from "drizzle-orm";

import { auth } from "../auth";
import { db } from "../db/client";
import { user } from "../db/auth-schema";

export type AuthenticatedUser = {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
};

export abstract class AuthContextService {
  static async getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.session) {
      return null;
    }

    const [existingUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!existingUser) {
      return null;
    }

    return {
      user: session.user,
      session: session.session,
    };
  }
}
