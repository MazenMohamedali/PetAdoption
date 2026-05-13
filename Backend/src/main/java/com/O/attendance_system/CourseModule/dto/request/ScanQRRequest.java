package com.O.attendance_system.CourseModule.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ScanQRRequest {

    @NotBlank(message = "QR code is required")
    private String qrCode;
}