package com.Booking.booking_service.controller;

import com.Booking.booking_service.entity.Booking;
import com.Booking.booking_service.entity.BookingStatus;
import com.Booking.booking_service.exception.UnauthorizedUserException;
import com.Booking.booking_service.exception.UserIDHeaderMissingException;
import com.Booking.booking_service.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

     // /bookings/tenant/request?propertyId=abc123
    @PostMapping("/tenant/request")
    public ResponseEntity<Booking> requestBooking(@RequestParam String propertyId,
                                            HttpServletRequest request) {
        String role          = request.getHeader("X-User-Role");
        String userIdHeader  = request.getHeader("X-User-Id");
        String username      = request.getHeader("X-Username");

        if (role == null || !role.equalsIgnoreCase("TENANT"))
            throw new UnauthorizedUserException("Only tenants can request bookings.");

        if (userIdHeader == null)
            throw new UserIDHeaderMissingException("User ID header missing.");

        try {
            Long tenantId = Long.parseLong(userIdHeader);
            Booking booking1 = bookingService.requestBooking(propertyId, tenantId, username);
            return new ResponseEntity<>(booking1,HttpStatus.CREATED);
        } catch (NumberFormatException e) {
            throw new  UserIDHeaderMissingException("Invalid user ID format."+e);
        } catch (IllegalStateException e) {
            throw new RuntimeException(e.getMessage());
        }
    }


    // /bookings/tenant/my
    //own dashboard
    @GetMapping("/tenant/my")
    public ResponseEntity<List<Booking>> myBookings(HttpServletRequest request) {
        String role         = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("TENANT"))
            throw new UnauthorizedUserException("Only tenants can view their bookings.");

        if (userIdHeader == null)
            throw new UserIDHeaderMissingException("User ID header missing.");

        try {
            Long tenantId = Long.parseLong(userIdHeader);
            List<Booking> bookings = bookingService.getTenantBookings(tenantId);
            return new ResponseEntity<>(bookings,HttpStatus.OK);
        } catch (NumberFormatException e) {
            throw new UserIDHeaderMissingException("Invalid user ID format.");
        }
    }


     // /bookings/tenant/cancel/{bookingId}
    // /bookings/tenant/cancel/{bookingId}

    @DeleteMapping("/tenant/cancel/{bookingId}")
    public ResponseEntity<Map<String, Object>> cancelBooking(
            @PathVariable Long bookingId,
            HttpServletRequest request) {

        String role = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        // Validate role
        if (role == null || !role.equalsIgnoreCase("TENANT")) {
            throw new UnauthorizedUserException("Only tenants can cancel their bookings.");
        }

        // Validate userId header
        if (userIdHeader == null || userIdHeader.isBlank()) {
            throw new UserIDHeaderMissingException("User ID header is missing.");
        }

        Long tenantId;
        try {
            tenantId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid user ID format.");
        }

        Booking cancelledBooking = bookingService.cancelBooking(bookingId, tenantId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Booking cancelled successfully. You can now create a new request.");
        response.put("booking", cancelledBooking);

        return ResponseEntity.ok(response);
    }
    // /bookings/tenant/contact/{bookingId}
    //return contact details if approved
    @GetMapping("/tenant/contact/{bookingId}")
    public ResponseEntity<?> tenantContactDetails(@PathVariable Long bookingId,
                                                  HttpServletRequest request) {
        String role         = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("TENANT"))
            throw new UnauthorizedUserException("Access denied.");

        if (userIdHeader == null)
            throw new UserIDHeaderMissingException("User ID header missing.");

        try {
            Long userId = Long.parseLong(userIdHeader);
            Booking booking = bookingService.getContactDetails(bookingId, userId, role);
            return ResponseEntity.ok(Map.of(
                    "message",      "Your booking is approved! Contact the owner to arrange move-in.",
                    "bookingId",    booking.getBookingId(),
                    "propertyName", booking.getPropertyName(),
                    "ownerName",    booking.getOwnerName(),
                    "rentAmount",   booking.getRentAmount(),
                    "approvalDate", booking.getApprovalDate()
            ));
        } catch (NumberFormatException e) {
            throw new UserIDHeaderMissingException("Invalid user ID format.");
        } catch (IllegalArgumentException e) {
            return notFound(e.getMessage());
        } catch (IllegalStateException e) {
            return forbidden(e.getMessage());
        }
    }



     // /bookings/owner/dashboard
     // /bookings/owner/dashboard?status=PENDING    //optonal search on status
    @GetMapping("/owner/dashboard")
    public ResponseEntity<?> ownerDashboard(@RequestParam(required = false) BookingStatus status,
                                            HttpServletRequest request) {
        String role         = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("OWNER"))
            return forbidden("Only owners can view their dashboard.");

        if (userIdHeader == null)
            return badRequest("User ID header missing.");

        try {
            Long ownerId = Long.parseLong(userIdHeader);
            List<Booking> bookings = (status != null)
                    ? bookingService.getOwnerDashboardByStatus(ownerId, status)
                    : bookingService.getOwnerDashboard(ownerId);
            return ResponseEntity.ok(bookings);
        } catch (NumberFormatException e) {
            return badRequest("Invalid user ID format.");
        }
    }

    /**
       /bookings/owner/approve/{bookingId}

     * owner approve pending booking
     *  decrements property availableRooms via Feign
     *  Auto-cancels remaining pending requests if property becomes full
     *   Returns tenant contact info in response
     */
    @PutMapping("/owner/approve/{bookingId}")
    public ResponseEntity<?> approveBooking(@PathVariable Long bookingId,
                                            HttpServletRequest request) {
        String role         = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("OWNER"))
            return forbidden("Only owners can approve bookings.");

        if (userIdHeader == null)
            return badRequest("User ID header missing.");

        try {
            Long ownerId = Long.parseLong(userIdHeader);
            Booking approved = bookingService.approveBooking(bookingId, ownerId);
            return ResponseEntity.ok(Map.of(
                    "message",         "Booking approved! Contact the tenant to proceed.",
                    "tenantUsername",  approved.getTenantUsername(),
                    "rentAmount",      approved.getRentAmount(),
                    "approvalDate",    approved.getApprovalDate(),
                    "booking",         approved
            ));
        } catch (NumberFormatException e) {
            return badRequest("Invalid user ID format.");
        } catch (IllegalArgumentException e) {
            return notFound(e.getMessage());
        } catch (IllegalStateException e) {
            return conflict(e.getMessage());
        }
    }

    /**
     /bookings/owner/reject/{bookingId}
     * Owner rejects a pending booking.
     * The tenant active request slot is freed
     */
    @PutMapping("/owner/reject/{bookingId}")
    public ResponseEntity<?> rejectBooking(@PathVariable Long bookingId,
                                           HttpServletRequest request) {
        String role         = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("OWNER"))
            return forbidden("Only owners can reject bookings.");

        if (userIdHeader == null)
            return badRequest("User ID header missing.");

        try {
            Long ownerId = Long.parseLong(userIdHeader);
            Booking rejected = bookingService.rejectBooking(bookingId, ownerId);
            return ResponseEntity.ok(Map.of(
                    "message", "Booking rejected.",
                    "booking", rejected
            ));
        } catch (NumberFormatException e) {
            return badRequest("Invalid user ID format.");
        } catch (IllegalArgumentException e) {
            return notFound(e.getMessage());
        } catch (IllegalStateException e) {
            return conflict(e.getMessage());
        }
    }

    /**
     * GET /bookings/owner/contact/{bookingId}
     *
     * Returns tenant contact (tenantUsername) for an APPROVED booking.
     */
    @GetMapping("/owner/contact/{bookingId}")
    public ResponseEntity<?> ownerContactDetails(@PathVariable Long bookingId,
                                                 HttpServletRequest request) {
        String role         = request.getHeader("X-User-Role");
        String userIdHeader = request.getHeader("X-User-Id");

        if (role == null || !role.equalsIgnoreCase("OWNER"))
            return forbidden("Access denied.");

        if (userIdHeader == null)
            return badRequest("User ID header missing.");

        try {
            Long userId = Long.parseLong(userIdHeader);
            Booking booking = bookingService.getContactDetails(bookingId, userId, role);
            return ResponseEntity.ok(Map.of(
                    "message",         "Contact the tenant to arrange move-in.",
                    "bookingId",       booking.getBookingId(),
                    "propertyName",    booking.getPropertyName(),
                    "tenantUsername",  booking.getTenantUsername(),
                    "rentAmount",      booking.getRentAmount(),
                    "approvalDate",    booking.getApprovalDate()
            ));
        } catch (NumberFormatException e) {
            return badRequest("Invalid user ID format.");
        } catch (IllegalArgumentException e) {
            return notFound(e.getMessage());
        } catch (IllegalStateException e) {
            return forbidden(e.getMessage());
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    //  RESPONSE HELPERS (keep controller thin)
    // ═══════════════════════════════════════════════════════════════════

    private ResponseEntity<Map<String, String>> forbidden(String msg) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", msg));
    }

    private ResponseEntity<Map<String, String>> badRequest(String msg) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", msg));
    }

    private ResponseEntity<Map<String, String>> conflict(String msg) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", msg));
    }

    private ResponseEntity<Map<String, String>> notFound(String msg) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", msg));
    }
}