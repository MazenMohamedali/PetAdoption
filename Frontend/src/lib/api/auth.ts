/**
 * JWT token storage helper.
 * Backend issues a JWT at POST /auth/login — we persist it in localStorage
 * and inject it as `Authorization: Bearer <token>` on every request.
 *
 * For higher security the backend can switch to httpOnly cookies; in that
 * case this file becomes a no-op and the fetch wrapper should send
 * `credentials: "include"` instead.
 */

const TOKEN_KEY = "attendance.jwt";

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
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
