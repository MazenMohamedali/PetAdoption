package com.O.attendance_system.AuthModule.Config;

import com.O.attendance_system.AuthModule.Model.Role;
import com.O.attendance_system.AuthModule.Model.User;
import com.O.attendance_system.AuthModule.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .fullName("ADMIN")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("1234"))
                    .role(Role.Admin)
                    .age(30)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin created: admin@gmail.com /1234");
        }
    }
}