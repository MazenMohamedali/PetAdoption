/**
 * Thin fetch wrapper for the REST API.
 *
 * Backend integration:
 *   - Set VITE_API_BASE_URL in your .env (e.g. http://localhost:4000/api)
 *   - All requests automatically include `Authorization: Bearer <jwt>`
 *     when a token is stored via auth.ts.
 *   - 401 responses clear the stored token so the UI can redirect to login.
 */

import { getToken, clearToken } from "./auth";
import type { ApiError } from "./types";

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip Authorization header even if a token exists (e.g. login). */
  anonymous?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, anonymous, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (!anonymous) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) clearToken();

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = (await res.json()) as { message?: string; code?: string };
      if (data.message) message = data.message;
      const err: ApiError = { message, status: res.status, code: data.code };
      throw err;
    } catch {
      const err: ApiError = { message, status: res.status };
      throw err;
    }
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
