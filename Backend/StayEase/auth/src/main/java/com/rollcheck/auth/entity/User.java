package com.rollcheck.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotBlank
    private String username;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    private String password;

    @Min(15)
    @Max(95)
    private int age;

    @Column(unique = true, length = 10)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    private LocalDateTime createdAt = LocalDateTime.now();
}