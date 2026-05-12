package com.O.attendance_system.CourseModule.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private String name;
    private String description;
    private String lecturerName;
    private String qrCode;
    private boolean active;
    private int attendanceCount;
    private LocalDateTime createdAt;
}