package com.rollcheck.auth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tenant")
public class TenantController{

    @GetMapping("/view")

//    @PreAuthorize("hasRole('TENANT')")
    public String view() {
        return "Tenant can view properties";
    }
}