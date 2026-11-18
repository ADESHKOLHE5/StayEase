package com.rollcheck.auth.controller;


import com.rollcheck.auth.entity.User;
import com.rollcheck.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/internal")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserRepository userRepository;

    /*
      called by booking-service (via feign) to get tenant/owner email.
      protected by x-internal-service header check — never exposed to frontend.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long userId,
            @RequestHeader(value = "X-Internal-Service", required = false) String internalService) {

        if (!"booking-service".equals(internalService)) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized internal access"));
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        return ResponseEntity.ok(Map.of(
                "userId",    user.getUserId(),
                "username",  user.getUsername(),
                "email",     user.getEmail(),
                "firstname", user.getFirstname()
        ));
    }
}
