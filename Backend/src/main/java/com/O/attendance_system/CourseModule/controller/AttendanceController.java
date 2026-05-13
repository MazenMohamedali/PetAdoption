package com.O.attendance_system.CourseModule.controller;

import com.O.attendance_system.CourseModule.dto.request.ScanQRRequest;
import com.O.attendance_system.CourseModule.dto.response.AttendanceResponse;
import com.O.attendance_system.CourseModule.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // Student scans QR
    @PostMapping("/scan")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<AttendanceResponse> scanQR(
            @Valid @RequestBody ScanQRRequest request) {
        return ResponseEntity.ok(attendanceService.scanQR(request));
    }

    // Lecturer views attendance for a course
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAuthority('LECTURER')")
    public ResponseEntity<List<AttendanceResponse>> getCourseAttendance(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(attendanceService.getCourseAttendance(courseId));
    }
}