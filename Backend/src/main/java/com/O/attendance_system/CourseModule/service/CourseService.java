package com.O.attendance_system.CourseModule.service;

import com.O.attendance_system.AuthModule.Model.User;
import com.O.attendance_system.AuthModule.Repository.UserRepository;
import com.O.attendance_system.CourseModule.dto.request.CreateCourseRequest;
import com.O.attendance_system.CourseModule.dto.response.CourseResponse;
import com.O.attendance_system.CourseModule.model.Course;
import com.O.attendance_system.CourseModule.repository.AttendanceRepository;
import com.O.attendance_system.CourseModule.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    // Get currently logged in user
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Lecturer creates a course
    public CourseResponse createCourse(CreateCourseRequest request) {
        User lecturer = getCurrentUser();

        String qrToken = UUID.randomUUID().toString(); // unique QR token

        Course course = Course.builder()
                .name(request.getName())
                .description(request.getDescription())
                .lecturer(lecturer)
                .qrCode(qrToken)
                .active(true)
                .build();

        courseRepository.save(course);

        return mapToResponse(course);
    }

    // Lecturer sees his own courses
    public List<CourseResponse> getMyCourses() {
        User lecturer = getCurrentUser();
        return courseRepository.findByLecturer(lecturer)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Student sees all active courses
    public List<CourseResponse> getAllActiveCourses() {
        return courseRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Lecturer deactivates a course (disables QR)
    public CourseResponse deactivateCourse(Long courseId) {
        User lecturer = getCurrentUser();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getLecturer().getId().equals(lecturer.getId())) {
            throw new RuntimeException("You are not the owner of this course");
        }

        course.setActive(false);
        courseRepository.save(course);
        return mapToResponse(course);
    }

    // Map Course entity to CourseResponse
    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .description(course.getDescription())
                .lecturerName(course.getLecturer().getFullName())
                .qrCode(course.getQrCode())
                .active(course.isActive())
                .attendanceCount(attendanceRepository.countByCourse(course))
                .createdAt(course.getCreatedAt())
                .build();
    }
}