package com.property.property_service.controller;

import com.property.property_service.entity.Property;
import com.property.property_service.exception.UnauthorizedAccessException;
import com.property.property_service.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService service;

    // ===================== TENANT ENDPOINTS =====================

    // Accessible via Gateway: /properties/tenant/browse
    // Tenants can browse all available properties

    @GetMapping("/tenant/browse")
    public ResponseEntity<List<Property>> browseProperties(HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");

        if (role == null || !role.equalsIgnoreCase("TENANT"))
            throw new UnauthorizedAccessException("Only tenants can browse properties");


        List<Property> AllProperty = service.findAll();
        return new ResponseEntity<>(AllProperty,HttpStatus.OK);
    }

    // Accessible via Gateway: /properties/tenant/search?city=NYC
    // Tenants can search properties by city

    @GetMapping("/tenant/search")
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Double maxRent,
            HttpServletRequest request) {

        String role = request.getHeader("X-User-Role");

        if (role == null || !role.equalsIgnoreCase("TENANT")) {
            throw new RuntimeException("Only tenants can search properties");
        }

        List<Property> properties = service.searchWithFilters(
                city, propertyType, maxRent);

        return ResponseEntity.ok(properties);
    }

    // Accessible via Gateway: /properties/tenant/details/{id}
    // Tenants can view property details
    @GetMapping("/tenant/details/{id}")
    public ResponseEntity<?> getPropertyDetails(@PathVariable String id, HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        
        if (role == null || !role.equalsIgnoreCase("TENANT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only tenants can view property details");
        }
        
        return ResponseEntity.ok(service.findById(id));
    }

    // ===================== OWNER ENDPOINTS =====================

    // Accessible via Gateway: /properties/owner/add
    // Only owners can add new properties

    @PostMapping("/owner/add")
    public ResponseEntity<Property> addProperty(@Valid @RequestBody Property property, HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");
        String username = request.getHeader("X-Username");

        // Role check: allow OWNER or ADMIN
        if (role == null || !(role.equalsIgnoreCase("OWNER") || role.equalsIgnoreCase("ADMIN"))) {
            throw new UnauthorizedAccessException("Only owners or admins can add properties. Your role: " + (role == null ? "GUEST" : role));
        }

        Long ownerId = null;
        try {
            if (userIdHeader != null) ownerId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException ignored) {

        }
        Property saved = service.saveProperty(property, ownerId, username);
        return new ResponseEntity<>(saved,HttpStatus.CREATED);
    }

    // Accessible via Gateway: /properties/owner/my
    // Owners can view their own properties
    @GetMapping("/owner/my")
    public ResponseEntity<?> myProperties(HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");
        
        if (role == null || !role.equalsIgnoreCase("OWNER")) {
            throw new UnauthorizedAccessException("Only owners can view their properties");
        }
        
        if (userIdHeader == null) {
            return ResponseEntity.badRequest().body("Missing user id");
        }
        
        Long ownerId;
        try {
            ownerId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid user id");
        }
        
        return ResponseEntity.ok(service.findByOwnerId(ownerId));
    }

    // Accessible via Gateway: /properties/owner/update/{id}
    // Owners can update their properties
    @PutMapping("/owner/update/{id}")
    public ResponseEntity<?> updateProperty(@PathVariable String id,
                                            @RequestBody Property property,
                                            HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");
        
        if (role == null || !role.equalsIgnoreCase("OWNER")) {
            throw new UnauthorizedAccessException("Only owners can update properties");
        }
        
        if (userIdHeader == null) {
            return ResponseEntity.badRequest().body("Missing user id");
        }
        
        Long ownerId;
        try {
            ownerId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid user id");
        }
        
        Property updated = service.updateProperty(id, property, ownerId);
        return ResponseEntity.ok(updated);
    }

    // Accessible via Gateway: /properties/owner/delete/{id}
    // Owners can delete their properties
    @DeleteMapping("/owner/delete/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable String id, HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");
        
        if (role == null || !role.equalsIgnoreCase("OWNER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only owners can delete properties");
        }
        
        if (userIdHeader == null) {
            return ResponseEntity.badRequest().body("Missing user id");
        }
        
        Long ownerId;
        try {
            ownerId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid user id");
        }
        
        service.deleteProperty(id, ownerId);
        return ResponseEntity.ok("Property deleted successfully");
    }

    // ===================== PUBLIC ENDPOINTS =====================

    // Public endpoint: browse all properties without authentication
    @GetMapping("/all")
    public List<Property> getAll() {
        return service.findAll();
    }

    // Internal call for Booking Service (Feign)
    @PutMapping("/internal/reduce-room/{id}")
    public ResponseEntity<?> reduceRoom(@PathVariable String id,
                                        HttpServletRequest request) {

        String role = request.getHeader("X-User-Role");

        // Allow only OWNER or SERVICE role (recommended)
        if (role == null ||
                !(role.equalsIgnoreCase("OWNER") || role.equalsIgnoreCase("ADMIN"))) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Unauthorized internal access");
        }

        service.updateAvailability(id, -1);
        return ResponseEntity.ok("Room reduced successfully");
    }
}
