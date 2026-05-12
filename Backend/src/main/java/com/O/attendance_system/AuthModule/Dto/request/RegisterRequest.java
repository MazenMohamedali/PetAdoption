package com.O.attendance_system.AuthModule.Dto.request;


import com.O.attendance_system.AuthModule.Model.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required ")
    private String fullName;

    @Email(message = "Invalid Email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min =4 , message = "Password min 4")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    @Min(value = 16, message = "Age must be at least 16")
    private int age;

}
