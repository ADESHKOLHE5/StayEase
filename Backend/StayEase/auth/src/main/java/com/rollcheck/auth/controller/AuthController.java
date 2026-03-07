package com.rollcheck.auth.controller;

import com.rollcheck.auth.entity.User;
import com.rollcheck.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = authService.register(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            String token = authService.login(user);
            return ResponseEntity.ok(new TokenResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid username or password"));
        }
    }

    // inner classes for response objects
    @lombok.Data
    @lombok.AllArgsConstructor
    static class ErrorResponse {
        private String message;
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    static class TokenResponse {
        private String token;
    }
}