package com.rollcheck.auth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/owner")
public class OwnerController {

    @PostMapping("/add")
    @PreAuthorize("hasRole('OWNER')")
    public String add() {
        return "Owner added property";
    }

    @GetMapping("/view")
    @PreAuthorize("hasRole('OWNER')")
    public String view() {
        return "Owner can manage properties";
    }
}
