/**
 * Thin fetch wrapper for the backend REST API.
 *
 *  - Base URL: VITE_API_BASE_URL (defaults to http://localhost:8000/api)
 *  - Adds `Authorization: Bearer <jwt>` automatically when a token is stored.
 *  - 401 responses clear the stored token so the UI can redirect to login.
 */

import { getToken, clearToken } from "./auth";
import type { ApiError } from "./types";

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "/api";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip Authorization header even if a token exists (e.g. login/register). */
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
    let code: string | undefined;
    try {
      const data = (await res.json()) as { message?: string; error?: string; code?: string };
      message = data.message ?? data.error ?? message;
      code = data.code;
    } catch {
      /* non-JSON error body */
    }
    const err: ApiError = { message, status: res.status, code };
    throw err;
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
