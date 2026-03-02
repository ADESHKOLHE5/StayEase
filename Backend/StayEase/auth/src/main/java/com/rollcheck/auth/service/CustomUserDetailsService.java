package com.rollcheck.auth.service;


import com.rollcheck.auth.entity.User;
import com.rollcheck.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = repository.findByUsername(username);
        if (user == null)
            throw new UsernameNotFoundException("User not found");

        return new CustomUserDetails(user);
    }
}