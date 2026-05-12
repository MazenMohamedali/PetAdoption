/**
 * Shared type definitions matching the backend REST API
 * (see Attendance_System_APIs.pdf).
 *
 * Base URL: http://localhost:8000/api  (override via VITE_API_BASE_URL)
 */

export type UserRole = "STUDENT" | "LECTURER";

/* ---------- Auth ---------- */

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  age: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: UserRole;
  fullName: string;
  email: string;
}

/* ---------- Courses ---------- */

export interface CourseDTO {
  id: number;
  name: string;
  description: string;
  lecturerName: string;
  qrCode: string;          // UUID encoded into the QR
  active: boolean;
  attendanceCount: number;
  createdAt: string;       // ISO 8601
}

export interface CreateCourseRequest {
  name: string;
  description: string;
}

/* ---------- Attendance ---------- */

export interface ScanQrRequest {
  qrCode: string;
}

export interface AttendanceDTO {
  id: number;
  studentName: string;
  studentEmail: string;
  courseName: string;
  scannedAt: string;       // ISO 8601
}

/* ---------- Errors ---------- */

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
