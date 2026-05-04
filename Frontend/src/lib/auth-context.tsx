import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as api from "@/lib/api";
import type { LoginRequest, RegisterRequest, StoredUser, UserRole } from "@/lib/api";

interface AuthContextValue {
  user: StoredUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<StoredUser>;
  register: (payload: RegisterRequest) => Promise<StoredUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);

  // Hydrate from localStorage on mount (SSR-safe).
  useEffect(() => {
    setUser(api.getUser());
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await api.login(payload);
    const u: StoredUser = { role: res.role, fullName: res.fullName, email: res.email };
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const res = await api.register(payload);
    const u: StoredUser = { role: res.role, fullName: res.fullName, email: res.email };
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
