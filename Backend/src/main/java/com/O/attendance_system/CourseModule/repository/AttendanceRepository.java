package com.O.attendance_system.CourseModule.repository;

import com.O.attendance_system.CourseModule.model.Attendance;
import com.O.attendance_system.CourseModule.model.Course;
import com.O.attendance_system.AuthModule.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByCourse(Course course);
    Optional<Attendance> findByStudentAndCourse(User student, Course course);
    int countByCourse(Course course);
}