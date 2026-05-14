package com.zanta.lfp.auth.service;


import com.zanta.lfp.auth.dto.RegisterRequest;
import com.zanta.lfp.auth.dto.AuthenticationRequest;
import com.zanta.lfp.auth.dto.AuthenticationResponse;
import com.zanta.lfp.user.Dto.UserDto;
import com.zanta.lfp.config.JwtService;
import com.zanta.lfp.user.enums.ERole;
import com.zanta.lfp.user.model.User;
import com.zanta.lfp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        checkUsername(request.getUsername());
        checkEmail(request.getEmail());
        return saveUser(request);
    }

    public ResponseEntity<?> authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        if (!repository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        var user = repository.findByUsername(request.getUsername()).orElseThrow();

        return ResponseEntity.ok().body(response(user));
    }

    private AuthenticationResponse saveUser(RegisterRequest request) {
        ERole roleToAssign = repository.count() == 0 ? ERole.ADMIN : ERole.USER;
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(roleToAssign)
                .gender(request.getGender())
                .joinDate(LocalDateTime.now())
                .build();
        repository.save(user);
        return response(user);
    }

    private AuthenticationResponse response(User user) {
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(UserDto.from(user))
                .build();
    }

    // Checkers
    private void checkUsername(String username) {
        if (repository.existsByUsername(username)) {
            throw new RuntimeException("Username already taken");
        }
    }

    private void checkEmail(String email) {
        if (repository.existsByEmail(email)) {
            throw new RuntimeException("Email already taken");
        }
    }
}
