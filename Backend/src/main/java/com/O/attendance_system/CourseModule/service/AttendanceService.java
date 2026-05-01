package com.O.attendance_system.CourseModule.service;

import com.O.attendance_system.AuthModule.Model.User;
import com.O.attendance_system.AuthModule.Repository.UserRepository;
import com.O.attendance_system.CourseModule.dto.request.ScanQRRequest;
import com.O.attendance_system.CourseModule.dto.response.AttendanceResponse;
import com.O.attendance_system.CourseModule.model.Attendance;
import com.O.attendance_system.CourseModule.model.Course;
import com.O.attendance_system.CourseModule.repository.AttendanceRepository;
import com.O.attendance_system.CourseModule.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Student scans QR code
    public AttendanceResponse scanQR(ScanQRRequest request) {
        User student = getCurrentUser();

        Course course = courseRepository.findByQrCode(request.getQrCode())
                .orElseThrow(() -> new RuntimeException("Invalid QR code"));

        if (!course.isActive()) {
            throw new RuntimeException("This course is no longer active");
        }

        // Check if already attended
        if (attendanceRepository.findByStudentAndCourse(student, course).isPresent()) {
            throw new RuntimeException("You already attended this class");
        }

        Attendance attendance = Attendance.builder()
                .student(student)
                .course(course)
                .build();

        attendanceRepository.save(attendance);

        return mapToResponse(attendance);
    }

    // Lecturer views attendance for a course
    public List<AttendanceResponse> getCourseAttendance(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return attendanceRepository.findByCourse(course)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentName(attendance.getStudent().getFullName())
                .studentEmail(attendance.getStudent().getEmail())
                .courseName(attendance.getCourse().getName())
                .scannedAt(attendance.getScannedAt())
                .build();
    }
}