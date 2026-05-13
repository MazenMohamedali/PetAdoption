package com.O.attendance_system.AuthModule.Service;



import com.O.attendance_system.AuthModule.Dto.request.LoginRequest;
import com.O.attendance_system.AuthModule.Dto.request.RegisterRequest;
import com.O.attendance_system.AuthModule.Dto.response.AuthResponse;
import com.O.attendance_system.AuthModule.Model.User;
import com.O.attendance_system.AuthModule.Repository.UserRepository;
import com.O.attendance_system.AuthModule.Security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .age(request.getAge())
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}