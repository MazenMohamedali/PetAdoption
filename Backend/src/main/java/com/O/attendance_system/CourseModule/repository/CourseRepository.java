package com.O.attendance_system.CourseModule.repository;

import com.O.attendance_system.CourseModule.model.Course;
import com.O.attendance_system.AuthModule.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByLecturer(User lecturer);
    List<Course> findByActiveTrue();
    Optional<Course> findByQrCode(String qrCode);
}