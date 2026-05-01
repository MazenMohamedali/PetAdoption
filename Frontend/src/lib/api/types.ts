/**
 * Shared type definitions mirroring the backend DB schema.
 * Backend tables (suggested):
 *   - users        (id, name, email, password_hash, role, created_at)
 *   - courses      (id, name, instructor_id, created_at)
 *   - sessions     (id, course_id, token, qr_payload, started_at, ended_at)
 *   - attendance   (id, session_id, student_id | student_name, scanned_at, ip, device)
 *
 * Keep field names in snake_case here so the frontend matches the API
 * contract directly without an extra mapping layer.
 */

export type UserRole = "instructor" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string; // ISO 8601
}

export interface Course {
  id: string;
  name: string;
  instructor_id: string;
  created_at: string; // ISO 8601
}

/**
 * A class session (one occurrence of a course).
 * `qr_payload` is what the QR encodes — backend signs/validates it.
 */
export interface ClassSessionDTO {
  id: string;
  course_id: string;
  name: string;          // course name, denormalized for convenience
  token: string;         // short opaque token included in QR + join URL
  qr_payload: string;    // full string encoded into the QR (e.g. signed JWT)
  started_at: string;    // ISO 8601
  ended_at: string | null;
}

export interface AttendanceRecordDTO {
  id: string;
  session_id: string;
  session_name: string;  // denormalized (course/session name)
  student_name: string;
  student_id: string | null;
  scanned_at: string;    // ISO 8601
}

/* ---------- Auth ---------- */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;     // JWT
  user: User;
}

/* ---------- Sessions ---------- */

export interface CreateSessionRequest {
  name: string;       // course / session name
  course_id?: string; // optional if backend auto-creates a course
}

/* ---------- Attendance ---------- */

export interface ScanQrRequest {
  qr_payload: string;   // raw string read from the QR code
  student_name: string; // for unauthenticated student flow
}

export interface ScanQrResponse {
  record: AttendanceRecordDTO;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
