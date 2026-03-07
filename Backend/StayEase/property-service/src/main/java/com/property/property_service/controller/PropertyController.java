package com.property.property_service.controller;

import com.property.property_service.entity.Property;
import com.property.property_service.exception.InValidIdException;
import com.property.property_service.exception.ResourceNotFoundException;
import com.property.property_service.exception.UnauthorizedAccessException;
import com.property.property_service.exception.UserNotFoundException;
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

    private final PropertyService propertyService;

    //user controllers

    // /properties/tenant/browse
    @GetMapping("/tenant/browse")
    public ResponseEntity<List<Property>> browseProperties(HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");

        if (role == null || !role.equalsIgnoreCase("TENANT"))
            throw new UnauthorizedAccessException("Only tenants can browse properties");

        List<Property> AllProperty = propertyService.findAll();
        return new ResponseEntity<>(AllProperty,HttpStatus.OK);
    }

    // /properties/tenant/search?city=Delhi
    // search by city,property,type and rent
    @GetMapping("/tenant/search")
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Double maxRent,
            HttpServletRequest request) {

        String role = request.getHeader("X-User-Role");

        if (role == null || !role.equalsIgnoreCase("TENANT")) {
            throw new UnauthorizedAccessException("Only tenants can search properties");
        }

        List<Property> filteredProperty = propertyService.searchWithFilters(
                city, propertyType, maxRent);

        return ResponseEntity.ok(filteredProperty);
    }

    //  /properties/tenant/details/{id}
    // user can see the each property details
    @GetMapping("/tenant/details/{id}")
    public ResponseEntity<Property> getPropertyDetails(@PathVariable String id, HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        
        if (role == null || !role.equalsIgnoreCase("TENANT")) {
            throw new UnauthorizedAccessException("Only tenants can view property details");
        }
        Property singleProperty = propertyService.findById(id);
        return ResponseEntity.ok(singleProperty);
    }

    // owner access

    // /properties/owner/add
    // only owners can add new properties
    @PostMapping("/owner/add")
    public ResponseEntity<Property> addProperty(@Valid @RequestBody Property property, HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");
        String username = request.getHeader("X-Username");


        if (role == null || !(role.equalsIgnoreCase("OWNER"))) {
            throw new UnauthorizedAccessException("Only owners or admins can add properties. Your role: " + (role == null ? "GUEST" : role));
        }

        Long ownerId = null;
        try {
            if (userIdHeader != null) ownerId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException ignored) {

        }
        Property saved = propertyService.saveProperty(property, ownerId, username);
        return new ResponseEntity<>(saved,HttpStatus.CREATED);
    }

    //  /properties/owner/my
    // owners can view their own all properties
    @GetMapping("/owner/my")
    public ResponseEntity<List<Property>> myProperties(HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        //  auth Check
        if (role == null || !role.equalsIgnoreCase("OWNER")) {
            throw new UnauthorizedAccessException("Access denied. Only registered owners can view property listings.");
        }

        //  identity check
        if (userIdHeader == null) {
            throw new UserNotFoundException("User identification header is missing.");
        }

        Long ownerId;
        try {
            ownerId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            throw new InValidIdException("The provided User ID format is invalid.");
        }

        List<Property> properties = propertyService.findByOwnerId(ownerId);

        if (properties == null || properties.isEmpty()) {
            throw new ResourceNotFoundException("No properties found for this account. Please list a property before attempting to view your collection.");
        }

        return ResponseEntity.ok(properties);
    }

    // /properties/owner/update/{id}
    // owners can update their properties
    @PutMapping("/owner/update/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable String id,
                                            @RequestBody Property property,
                                            HttpServletRequest request){
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");
        
        if (role == null || !role.equalsIgnoreCase("OWNER")) {
            throw new UnauthorizedAccessException("Only owners can update properties");
        }
        
        if (userIdHeader == null) {
            throw new InValidIdException("Missing user id");
        }
        
        Long ownerId;
        try {
            ownerId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            throw new InValidIdException("Invalid user id");
        }
        
        Property updated = propertyService.updateProperty(id, property, ownerId);
        return ResponseEntity.ok(updated);
    }

    //  /properties/owner/delete/{id}
    // owners can delete their properties
    @DeleteMapping("/owner/delete/{id}")
    public ResponseEntity<String> deleteProperty(@PathVariable String id, HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");
        
        if (role == null || !role.equalsIgnoreCase("OWNER"))
            throw new UnauthorizedAccessException("Only owners can delete properties");

        
        if (userIdHeader == null)
            throw new InValidIdException("Missing user id");


        Long ownerId;
        try {
            ownerId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            throw new InValidIdException("Invalid user id");
        }

        propertyService.deleteProperty(id, ownerId);
        return ResponseEntity.ok("Property deleted successfully");
    }

    // browse all properties without authentication
    @GetMapping("/all")
    public List<Property> getAll() {
        return propertyService.findAll();
    }

    // internal call for booking service (Feign)
    @PutMapping("/internal/reduce-room/{id}")
    public ResponseEntity<String> reduceRoom(@PathVariable String id,
                                        HttpServletRequest request) {

        // Check X-Internal-Service header (consistent with other internal endpoints)
        if (!"booking-service".equals(request.getHeader("X-Internal-Service"))) {
            throw new UnauthorizedAccessException("Unauthorized internal access");
        }

        propertyService.updateAvailability(id, -1);
        return ResponseEntity.ok("Room reduced successfully");
    }

    /**
      internal get — used by booking service through Feign.
      guarded by X-Internal-Service header instead of a role header.
     */
    @GetMapping("/internal/{id}")
    public ResponseEntity<?> getPropertyInternal(@PathVariable String id,
                                                 HttpServletRequest request) {
        if (!"booking-service".equals(request.getHeader("X-Internal-Service"))) {
            throw new UnauthorizedAccessException("unauthorized internal access");
        }
        return ResponseEntity.ok(propertyService.getPropertyInternal(id));
    }

    /**
     * inter PUT — booking service calls this to decrement/increment available rooms.
     * delta = -1 for booking approval, +1 for cancellation rollback (future use).
     */
    @PutMapping("/internal/update-rooms/{id}")
    public ResponseEntity<?> updateRoomsInternal(@PathVariable String id,
                                                 @RequestParam int delta,
                                                 HttpServletRequest request) {
        if (!"booking-service".equals(request.getHeader("X-Internal-Service"))) {
            throw new UnauthorizedAccessException("Unauthorized internal access");
        }
        propertyService.updateAvailability(id, delta);
        return ResponseEntity.ok("Rooms updated successfully");
    }
}
