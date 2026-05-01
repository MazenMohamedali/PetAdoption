package com.O.attendance_system.CourseModule.model;

import com.O.attendance_system.AuthModule.Model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToOne
    @JoinColumn(name = "lecturer_id")
    private User lecturer;

    @Column(unique = true)
    private String qrCode;

    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}