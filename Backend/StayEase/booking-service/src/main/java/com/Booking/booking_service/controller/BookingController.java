package com.Booking.booking_service.controller;

import com.Booking.booking_service.Feign.PropertyClient;
import com.Booking.booking_service.entity.Booking;
import com.Booking.booking_service.entity.BookingStatus;
import com.Booking.booking_service.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final PropertyClient propertyClient;

    // ===================== TENANT ENDPOINTS =====================

    // TENANT: Create a new booking
    @PostMapping("/tenant/create")
    public ResponseEntity<?> createBooking(@Valid @RequestBody Booking booking, 
                                            HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        // Role check
        if (role == null || !role.equalsIgnoreCase("TENANT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only tenants can create bookings");
        }

        if (userIdHeader == null) {
            return ResponseEntity.badRequest().body("Missing user id");
        }

        Long tenantId;
        try {
            tenantId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid user id");
        }

        booking.setTenantId(tenantId);
        Booking saved = bookingService.createBooking(booking);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // TENANT: View own bookings
    @GetMapping("/tenant/my")
    public ResponseEntity<?> getMyBookings(HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("TENANT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only tenants can view their bookings");
        }

        if (userIdHeader == null) {
            return ResponseEntity.badRequest().body("Missing user id");
        }

        Long tenantId;
        try {
            tenantId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid user id");
        }

        List<Booking> bookings = bookingService.findByTenantId(tenantId);
        return ResponseEntity.ok(bookings);
    }

    // ===================== OWNER ENDPOINTS =====================

    // OWNER: View bookings for their properties
    @GetMapping("/owner/property/{propertyId}")
    public ResponseEntity<?> getBookingsForProperty(@PathVariable Long propertyId,
                                                    HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("OWNER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only owners can view bookings for their properties");
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

        List<Booking> bookings = bookingService.findByPropertyIdAndOwnerId(propertyId, ownerId);
        return ResponseEntity.ok(bookings);
    }

    // OWNER: Approve a booking
    @PutMapping("/owner/approve/{bookingId}")
    public ResponseEntity<?> approveBooking(@PathVariable Long bookingId,
                                             HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("OWNER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only owners can approve bookings");
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

        Booking approved = bookingService.approveBooking(bookingId, ownerId);
        return ResponseEntity.ok(approved);
    }

    // OWNER: Reject a booking
    @PutMapping("/owner/reject/{bookingId}")
    public ResponseEntity<?> rejectBooking(@PathVariable Long bookingId,
                                            HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("OWNER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only owners can reject bookings");
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

        Booking rejected = bookingService.rejectBooking(bookingId, ownerId);
        return ResponseEntity.ok(rejected);
    }

    // ===================== ADMIN ENDPOINTS =====================

    // ADMIN: View all bookings
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllBookings(HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");

        if (role == null || !role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only admins can view all bookings");
        }

        List<Booking> bookings = bookingService.findAll();
        return ResponseEntity.ok(bookings);
    }

    // ===================== PUBLIC ENDPOINTS =====================

    // Public: Get all bookings (read-only)
    @GetMapping("/all")
    public List<Booking> getAll() {
        return bookingService.findAll();
    }
}
