package com.zanta.lfp.user.controller;


import com.zanta.lfp.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/admin/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    @PostMapping("/{id}/make-admin")
    public ResponseEntity<?> createAdminUser(@PathVariable Long id) {
        return userService.createAdminUser(id);
    }

}


// localhost:8080/api/v1/admin/users  [GET]
// localhost:8080/api/v1/admin/users/{id}  [DELETE]
// localhost:8080/api/v1/admin/users/{id}/make-admin  [POST]