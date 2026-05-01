/**
 * REST endpoint contracts. Each function maps 1:1 to a backend route.
 *
 * Routes (suggested):
 *   POST   /auth/login                  -> LoginResponse
 *   POST   /auth/logout                 -> 204
 *   GET    /sessions                    -> ClassSessionDTO[]
 *   POST   /sessions                    -> ClassSessionDTO     (instructor)
 *   DELETE /sessions/:id                -> 204                 (instructor)
 *   GET    /sessions/:id/attendance     -> AttendanceRecordDTO[]
 *   POST   /attendance/scan             -> ScanQrResponse      (student, public)
 *   GET    /attendance                  -> AttendanceRecordDTO[] (instructor)
 *
 * The functions below are wired up to apiFetch but currently fall back to
 * a local in-memory store so the frontend works without a backend. Once
 * the API is live, delete the `USE_STUB` branch in each function.
 */

import { apiFetch } from "./client";
import { setToken } from "./auth";
import type {
  AttendanceRecordDTO,
  ClassSessionDTO,
  CreateSessionRequest,
  LoginRequest,
  LoginResponse,
  ScanQrRequest,
  ScanQrResponse,
} from "./types";

const USE_STUB =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) === undefined;

/* ---------- in-memory stub store (remove once backend is live) ---------- */

const stub = {
  sessions: [] as ClassSessionDTO[],
  attendance: [] as AttendanceRecordDTO[],
};

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/* ---------- Auth ---------- */

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  if (USE_STUB) {
    const res: LoginResponse = {
      token: "stub.jwt.token",
      user: {
        id: uid(),
        name: payload.email.split("@")[0],
        email: payload.email,
        role: "instructor",
        created_at: new Date().toISOString(),
      },
    };
    setToken(res.token);
    return res;
  }
  const res = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
    anonymous: true,
  });
  setToken(res.token);
  return res;
}

/* ---------- Sessions ---------- */

export async function listSessions(): Promise<ClassSessionDTO[]> {
  if (USE_STUB) return [...stub.sessions];
  return apiFetch<ClassSessionDTO[]>("/sessions");
}

export async function createSession(
  payload: CreateSessionRequest,
): Promise<ClassSessionDTO> {
  if (USE_STUB) {
    const token = uid().slice(0, 8);
    const session: ClassSessionDTO = {
      id: uid(),
      course_id: payload.course_id ?? uid(),
      name: payload.name,
      token,
      qr_payload: `${typeof window !== "undefined" ? window.location.origin : ""}/?join=${token}`,
      started_at: new Date().toISOString(),
      ended_at: null,
    };
    stub.sessions = [session, ...stub.sessions];
    return session;
  }
  return apiFetch<ClassSessionDTO>("/sessions", { method: "POST", body: payload });
}

export async function deleteSession(id: string): Promise<void> {
  if (USE_STUB) {
    stub.sessions = stub.sessions.filter((s) => s.id !== id);
    return;
  }
  await apiFetch<void>(`/sessions/${id}`, { method: "DELETE" });
}

/* ---------- Attendance ---------- */

export async function scanQr(payload: ScanQrRequest): Promise<ScanQrResponse> {
  if (USE_STUB) {
    // Locate session by token embedded in qr_payload (matches backend signing logic).
    const session =
      stub.sessions.find((s) => payload.qr_payload.includes(s.token)) ??
      stub.sessions[0];
    if (!session) {
      const err = { message: "No active session for this QR code", status: 404 };
      throw err;
    }
    const record: AttendanceRecordDTO = {
      id: uid(),
      session_id: session.id,
      session_name: session.name,
      student_name: payload.student_name,
      student_id: null,
      scanned_at: new Date().toISOString(),
    };
    stub.attendance = [record, ...stub.attendance];
    return { record };
  }
  return apiFetch<ScanQrResponse>("/attendance/scan", {
    method: "POST",
    body: payload,
    anonymous: true,
  });
}

export async function listAttendance(): Promise<AttendanceRecordDTO[]> {
  if (USE_STUB) return [...stub.attendance];
  return apiFetch<AttendanceRecordDTO[]>("/attendance");
}
