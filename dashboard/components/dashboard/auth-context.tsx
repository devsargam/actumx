"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest, type User } from "@/lib/api";
import { clearRawKeys } from "@/lib/raw-keys";
import { clearSessionToken, getSessionToken } from "@/lib/session";

type DashboardAuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const DashboardAuthContext = createContext<DashboardAuthContextValue | null>(null);

export function DashboardAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    const currentToken = getSessionToken();
    if (currentToken) {
      await apiRequest("/v1/auth/logout", { method: "POST", token: currentToken });
    }

    clearSessionToken();
    clearRawKeys();
    setToken(null);
    setUser(null);
    router.replace("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    const currentToken = getSessionToken();
    if (!currentToken) {
      clearSessionToken();
      clearRawKeys();
      setToken(null);
      setUser(null);
      setLoading(false);
      router.replace("/login");
      return;
    }

    const meResult = await apiRequest<{ user?: User; error?: string }>("/v1/auth/me", {
      token: currentToken,
    });

    if (meResult.status >= 400 || !meResult.data.user) {
      clearSessionToken();
      clearRawKeys();
      setToken(null);
      setUser(null);
      setLoading(false);
      router.replace("/login");
      return;
    }

    setToken(currentToken);
    setUser(meResult.data.user);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <DashboardAuthContext.Provider
      value={{
        token,
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth() {
  const context = useContext(DashboardAuthContext);
  if (!context) {
    throw new Error("useDashboardAuth must be used within DashboardAuthProvider");
  }

  return context;
}
