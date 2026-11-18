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

    @NotNull
    private String firstname;

    @NotNull
    @Size(min = 3, max = 20)
    private String lastname;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    private String username;

    @Column(unique = true, length = 10)
    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String password;

    @Min(15)
    @Max(95)
    private int age;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Gender gender;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    private LocalDateTime createdAt = LocalDateTime.now();
}