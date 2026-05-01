package com.O.attendance_system.AuthModule.Dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String id;
    private String fullName;
    private String email;
    private String role;




}
