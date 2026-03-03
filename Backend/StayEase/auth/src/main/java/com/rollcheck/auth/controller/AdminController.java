package com.rollcheck.auth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/block")
    @PreAuthorize("hasRole('ADMIN')")
    public String block() {
        return "Admin blocked user";
    }

    @PutMapping("/manage")
    @PreAuthorize("hasRole('ADMIN')")
    public String manage() {
        return "Admin managing users";
    }
}
