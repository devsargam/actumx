"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { clearRawKeys } from "@/lib/raw-keys";

type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type DashboardAuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const DashboardAuthContext = createContext<DashboardAuthContextValue | null>(null);

export function DashboardAuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: SessionUser;
}) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    await apiRequest("/auth/api/sign-out", { method: "POST" });
    clearRawKeys();
    setUser(null);
    router.replace("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const meResult = await apiRequest<{ user?: SessionUser; error?: string }>("/auth/api/get-session");

    if (meResult.status >= 400 || !meResult.data.user) {
      clearRawKeys();
      setUser(null);
      setLoading(false);
      router.replace("/login");
      return;
    }

    setUser(meResult.data.user);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <DashboardAuthContext.Provider
      value={{
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
