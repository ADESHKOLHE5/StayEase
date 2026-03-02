//package com.rollcheck.auth.service;
//
//import com.rollcheck.auth.entity.Status;
//import com.rollcheck.auth.entity.User;
//import com.rollcheck.auth.repository.UserRepository;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.server.ResponseStatusException;
//
//@Service
//@RequiredArgsConstructor
//public class UserService {
//
//    private final UserRepository userRepository;
//
//    // Requirement: GET /auth/profile logic
//    public User getProfile(String email) {
//        return userRepository.findByEmail(email)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found"));
//    }
//
//    // Requirement: ADMIN status management (Block/Unblock)
//    @Transactional
//    public void updateUserStatus(Long userId, Status newStatus) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + userId));
//        user.setStatus(newStatus);
//        userRepository.save(user); // Persistence via @Transactional
//    }
//}
