package com.O.attendance_system.CourseModule.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceResponse {
    private Long id;
    private String studentName;
    private String studentEmail;
    private String courseName;
    private LocalDateTime scannedAt;
}