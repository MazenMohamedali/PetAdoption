/**
 * JWT token + current-user storage helpers.
 * Backend issues a JWT + role on /auth/login and /auth/register;
 * we persist both in localStorage so the client can:
 *   - inject `Authorization: Bearer <token>` on every request
 *   - decide which role-specific page to render after refresh.
 */

import type { AuthResponse, UserRole } from "./types";

const TOKEN_KEY = "attendance.jwt";
const USER_KEY = "attendance.user";

export interface StoredUser {
  role: UserRole;
  fullName: string;
  email: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function setSession(res: AuthResponse): void {
  setToken(res.token);
  if (typeof window === "undefined") return;
  const user: StoredUser = {
    role: res.role,
    fullName: res.fullName,
    email: res.email,
  };
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
