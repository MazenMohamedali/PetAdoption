package com.O.attendance_system.CourseModule.controller;

import com.O.attendance_system.CourseModule.dto.request.CreateCourseRequest;
import com.O.attendance_system.CourseModule.dto.response.CourseResponse;
import com.O.attendance_system.CourseModule.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // Lecturer creates a course
    @PostMapping
    @PreAuthorize("hasAuthority('LECTURER')")
    public ResponseEntity<CourseResponse> createCourse(
            @Valid @RequestBody CreateCourseRequest request) {
        return ResponseEntity.ok(courseService.createCourse(request));
    }

    // Lecturer sees his courses
    @GetMapping("/my-courses")
    @PreAuthorize("hasAuthority('LECTURER')")
    public ResponseEntity<List<CourseResponse>> getMyCourses() {
        return ResponseEntity.ok(courseService.getMyCourses());
    }

    // Student sees all active courses
    @GetMapping
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<List<CourseResponse>> getAllActiveCourses() {
        return ResponseEntity.ok(courseService.getAllActiveCourses());
    }

    // Lecturer deactivates a course
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('LECTURER')")
    public ResponseEntity<CourseResponse> deactivateCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.deactivateCourse(id));
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debugRole(Authentication authentication) {
        return ResponseEntity.ok(authentication.getAuthorities());
    }
}