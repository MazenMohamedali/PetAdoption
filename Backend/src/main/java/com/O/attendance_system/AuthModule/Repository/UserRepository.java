package com.O.attendance_system.AuthModule.Repository;

import com.O.attendance_system.AuthModule.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
