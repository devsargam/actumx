import { auth } from "../auth";

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

    return {
      user: session.user,
      session: session.session,
    };
  }
}
