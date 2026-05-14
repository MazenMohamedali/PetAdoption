package com.zanta.lfp.auth.controller;


import com.zanta.lfp.auth.dto.AuthenticationRequest;
import com.zanta.lfp.auth.dto.AuthenticationResponse;
import com.zanta.lfp.auth.service.AuthenticationService;
import com.zanta.lfp.auth.dto.RegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthenticationController {
    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
            AuthenticationResponse response = service.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> register(@RequestBody AuthenticationRequest request) {
        return service.authenticate(request);
    }
}

// localhost:8080/api/v1/auth/register  [POST]
// localhost:8080/api/v1/auth/authenticate  [POST]