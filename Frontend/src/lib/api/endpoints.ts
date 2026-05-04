/**
 * REST endpoints — 1:1 with the backend spec (Attendance_System_APIs.pdf).
 *
 *   POST  /auth/register                        -> AuthResponse           (public)
 *   POST  /auth/login                           -> AuthResponse           (public)
 *   POST  /courses                              -> CourseDTO              (LECTURER)
 *   GET   /courses/my-courses                   -> CourseDTO[]            (LECTURER)
 *   GET   /courses                              -> CourseDTO[]            (STUDENT)
 *   PUT   /courses/:id/deactivate               -> CourseDTO              (LECTURER)
 *   POST  /attendance/scan                      -> AttendanceDTO          (STUDENT)
 *   GET   /attendance/course/:courseId          -> AttendanceDTO[]        (LECTURER)
 */

import { apiFetch } from "./client";
import { setSession, clearToken } from "./auth";
import type {
  AttendanceDTO,
  AuthResponse,
  CourseDTO,
  CreateCourseRequest,
  LoginRequest,
  RegisterRequest,
  ScanQrRequest,
} from "./types";

/* ---------- Auth ---------- */

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
    anonymous: true,
  });
  setSession(res);
  return res;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
    anonymous: true,
  });
  setSession(res);
  return res;
}

export function logout(): void {
  clearToken();
}

/* ---------- Courses ---------- */

export function createCourse(payload: CreateCourseRequest): Promise<CourseDTO> {
  return apiFetch<CourseDTO>("/courses", { method: "POST", body: payload });
}

export function listMyCourses(): Promise<CourseDTO[]> {
  return apiFetch<CourseDTO[]>("/courses/my-courses");
}

export function listActiveCourses(): Promise<CourseDTO[]> {
  return apiFetch<CourseDTO[]>("/courses");
}

export function deactivateCourse(id: number): Promise<CourseDTO> {
  return apiFetch<CourseDTO>(`/courses/${id}/deactivate`, { method: "PUT" });
}

/* ---------- Attendance ---------- */

export function scanQr(payload: ScanQrRequest): Promise<AttendanceDTO> {
  return apiFetch<AttendanceDTO>("/attendance/scan", { method: "POST", body: payload });
}

export function getCourseAttendance(courseId: number): Promise<AttendanceDTO[]> {
  return apiFetch<AttendanceDTO[]>(`/attendance/course/${courseId}`);
}
