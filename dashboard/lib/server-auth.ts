import { serverApiRequest } from "@/lib/server-api";

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
  const result = await serverApiRequest<ServerSession | null>("/auth/api/auth/get-session");
  if (result.status < 200 || result.status >= 300) {
    return null;
  }
  return result.data;
}
