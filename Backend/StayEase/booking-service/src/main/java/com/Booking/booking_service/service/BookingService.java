package com.Booking.booking_service.service;

import com.Booking.booking_service.client.AuthClient;
import com.Booking.booking_service.client.PropertyClient;
import com.Booking.booking_service.dto.BookingRequestDto;
import com.Booking.booking_service.dto.PropertyDTO;
import com.Booking.booking_service.entity.Booking;
import com.Booking.booking_service.entity.BookingStatus;
import com.Booking.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyClient    propertyClient;
    private final AuthClient        authClient;       // ← new
    private final EmailService      emailService;     // ← new

    @Value("${booking.tenant.max-active-requests:30}")
    private int maxActiveRequests;

    // Used for global cap and property capacity checks (pending + approved both "occupy" a slot)
    private static final List<BookingStatus> ACTIVE_STATUSES =
            List.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    // Used ONLY for the per-tenant duplicate guard — only PENDING blocks a new request.
    // If the previous booking was APPROVED, REJECTED, or CANCELLED the tenant can rebook.
    private static final List<BookingStatus> BLOCKING_STATUSES =
            List.of(BookingStatus.PENDING);

    // ── Request Booking
    @Transactional
    public Booking requestBooking(BookingRequestDto dto, Long tenantId, String tenantUsername) {

        String propertyId = dto.getPropertyId();

        // Guard 1 — global active-request cap per tenant
        long activeCount = bookingRepository.countByTenantIdAndStatusIn(tenantId, ACTIVE_STATUSES);
        if (activeCount >= maxActiveRequests) {
            throw new IllegalStateException(
                    "You have reached the maximum of " + maxActiveRequests +
                            " active booking requests. Cancel an existing one before requesting more.");
        }

        // Guard 2 — block only if a PENDING booking already exists for this property.
        // APPROVED / REJECTED / CANCELLED statuses allow the tenant to rebook.
        boolean pendingExists = bookingRepository
                .existsByTenantIdAndPropertyIdAndStatusIn(tenantId, propertyId, BLOCKING_STATUSES);
        if (pendingExists) {
            throw new IllegalStateException(
                    "You already have a pending booking request for this property. " +
                    "Please wait for the owner to respond, or cancel your existing request first.");
        }

        // Guard 3 — fetch property (Feign)
        PropertyDTO property = fetchProperty(propertyId);

        if (property.getAvailableRooms() == null || property.getAvailableRooms() <= 0) {
            throw new IllegalStateException(
                    "No rooms available for property: " + property.getPropertyName());
        }

        // Guard 4 — per-property request cap
        long propertyActiveCount = bookingRepository
                .countByPropertyIdAndStatusIn(propertyId, ACTIVE_STATUSES);
        if (propertyActiveCount >= property.getRequestLimit()) {
            throw new IllegalStateException(
                    "This property has reached its maximum request capacity (" +
                            property.getRequestLimit() + " for type " + property.getPropertyType() + ").");
        }

        // Build booking
        Booking booking = new Booking();
        booking.setPropertyId(propertyId);
        booking.setPropertyName(property.getPropertyName());
        booking.setTenantId(tenantId);
        booking.setTenantUsername(tenantUsername);
        booking.setOwnerId(property.getOwnerId());
        booking.setOwnerName(property.getOwnerName());
        booking.setRentAmount(property.getRentPerMonth());
        booking.setStatus(BookingStatus.PENDING);
        booking.setRequestDate(LocalDateTime.now());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setCheckInDate(dto.getCheckInDate());
        booking.setCheckOutDate(dto.getCheckOutDate());
        booking.setCheckInTime(property.getCheckInTime());
        booking.setCheckOutTime(property.getCheckOutTime());
        booking.setNumberOfRooms(dto.getNumberOfRooms());
        booking.setNumberOfGuests(dto.getNumberOfGuests());
        booking.setTotalPrice(dto.getTotalPrice());
        booking.setPropertyImageUrl(property.getImageUrl());
        booking.setPropertyAddress(property.getAddress());
        booking.setPropertyCity(property.getCity());
        booking.setPropertyState(property.getState());
        booking.setPropertyType(property.getPropertyType());

        Booking saved = bookingRepository.save(booking);

        //  Send emails (async — won't delay the API response) ──
        sendTenantBookingRequestedEmail(tenantId, saved);
        sendOwnerNewRequestEmail(property.getOwnerId(), saved);

        return saved;
    }

    //  Tenant: get my bookings
    public List<Booking> getTenantBookings(Long tenantId) {
        return bookingRepository.findByTenantId(tenantId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // Tenant: cancel a pending booking
    @Transactional
    public Booking cancelBooking(Long bookingId, Long tenantId) {
        Booking booking = getById(bookingId);

        if (!booking.getTenantId().equals(tenantId))
            throw new IllegalStateException("You can only cancel your own bookings.");

        if (booking.getStatus() != BookingStatus.PENDING)
            throw new IllegalStateException(
                    "Only PENDING bookings can be cancelled. Current status: " + booking.getStatus());

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking cancelled = bookingRepository.save(booking);

        //  Email
        sendTenantCancelledEmail(tenantId, cancelled);

        return cancelled;
    }

    //  Owner: full dashboard
    public List<Booking> getOwnerDashboard(Long ownerId) {
        return bookingRepository.findByOwnerId(ownerId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<Booking> getOwnerDashboardByStatus(Long ownerId, BookingStatus status) {
        return bookingRepository.findByOwnerId(ownerId).stream()
                .filter(b -> b.getStatus() == status)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // ── Owner: approve ────────────────────────────────────────────────────────
    @Transactional
    public Booking approveBooking(Long bookingId, Long ownerId) {
        Booking booking = getById(bookingId);

        if (!booking.getOwnerId().equals(ownerId))
            throw new IllegalStateException("You can only approve bookings for your own properties.");

        if (booking.getStatus() != BookingStatus.PENDING)
            throw new IllegalStateException(
                    "Only PENDING bookings can be approved. Current status: " + booking.getStatus());

        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovalDate(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        Booking approved = bookingRepository.save(booking);

        // Decrement rooms in property service
        try {
            propertyClient.updateRooms(booking.getPropertyId(), -1);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Booking approved but failed to update property availability. Error: " + e.getMessage());
        }

        // Auto-cancel remaining PENDING if property is now full
        try {
            PropertyDTO property = fetchProperty(booking.getPropertyId());
            if (property.getAvailableRooms() != null && property.getAvailableRooms() <= 0) {
                autoCancelPendingBookings(booking.getPropertyId(), bookingId);
            }
        } catch (Exception e) {
            log.warn("Auto-cancel check failed for property {}: {}", booking.getPropertyId(), e.getMessage());
        }

        // ── Email tenant ──
        sendTenantApprovedEmail(booking.getTenantId(), approved);

        return approved;
    }

    // ── Owner: reject ─────────────────────────────────────────────────────────
    @Transactional
    public Booking rejectBooking(Long bookingId, Long ownerId) {
        Booking booking = getById(bookingId);

        if (!booking.getOwnerId().equals(ownerId))
            throw new IllegalStateException("You can only reject bookings for your own properties.");

        if (booking.getStatus() != BookingStatus.PENDING)
            throw new IllegalStateException(
                    "Only PENDING bookings can be rejected. Current status: " + booking.getStatus());

        booking.setStatus(BookingStatus.REJECTED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking rejected = bookingRepository.save(booking);

        // ── Email tenant ──
        sendTenantRejectedEmail(booking.getTenantId(), rejected);

        return rejected;
    }

    // ── Contact details ───────────────────────────────────────────────────────
    public Booking getContactDetails(Long bookingId, Long userId, String role) {
        Booking booking = getById(bookingId);

        boolean isTenant = "TENANT".equalsIgnoreCase(role) && booking.getTenantId().equals(userId);
        boolean isOwner  = "OWNER".equalsIgnoreCase(role)  && booking.getOwnerId().equals(userId);

        if (!isTenant && !isOwner)
            throw new IllegalStateException("Access denied. This booking does not belong to you.");

        if (booking.getStatus() != BookingStatus.APPROVED)
            throw new IllegalStateException(
                    "Contact details are only available for APPROVED bookings. Current status: " + booking.getStatus());

        return booking;
    }

    // ═══════════════════════════════════════════════════════════════════
    //  EMAIL HELPERS — all safe (swallow exceptions so booking never fails)
    // ═══════════════════════════════════════════════════════════════════

    private void sendTenantBookingRequestedEmail(Long tenantId, Booking booking) {
        try {
            Map<String, Object> user = authClient.getUserById(tenantId);
            String email     = (String) user.get("email");
            String firstName = (String) user.get("firstname");
            emailService.sendBookingRequestedEmail(booking, email, firstName);
        } catch (Exception e) {
            log.warn("Could not send booking-requested email to tenant {}: {}", tenantId, e.getMessage());
        }
    }

    private void sendOwnerNewRequestEmail(Long ownerId, Booking booking) {
        try {
            Map<String, Object> owner = authClient.getUserById(ownerId);
            String email     = (String) owner.get("email");
            String firstName = (String) owner.get("firstname");
            emailService.sendNewRequestToOwnerEmail(booking, email, firstName);
        } catch (Exception e) {
            log.warn("Could not send new-request email to owner {}: {}", ownerId, e.getMessage());
        }
    }

    private void sendTenantApprovedEmail(Long tenantId, Booking booking) {
        try {
            Map<String, Object> user = authClient.getUserById(tenantId);
            emailService.sendBookingApprovedEmail(booking,
                    (String) user.get("email"), (String) user.get("firstname"));
        } catch (Exception e) {
            log.warn("Could not send approved email to tenant {}: {}", tenantId, e.getMessage());
        }
    }

    private void sendTenantRejectedEmail(Long tenantId, Booking booking) {
        try {
            Map<String, Object> user = authClient.getUserById(tenantId);
            emailService.sendBookingRejectedEmail(booking,
                    (String) user.get("email"), (String) user.get("firstname"));
        } catch (Exception e) {
            log.warn("Could not send rejected email to tenant {}: {}", tenantId, e.getMessage());
        }
    }

    private void sendTenantCancelledEmail(Long tenantId, Booking booking) {
        try {
            Map<String, Object> user = authClient.getUserById(tenantId);
            emailService.sendBookingCancelledEmail(booking,
                    (String) user.get("email"), (String) user.get("firstname"));
        } catch (Exception e) {
            log.warn("Could not send cancelled email to tenant {}: {}", tenantId, e.getMessage());
        }
    }


    //  PRIVATE HELPERS
    private Booking getById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Booking not found with id: " + bookingId));
    }

    private PropertyDTO fetchProperty(String propertyId) {
        try {
            return propertyClient.getProperty(propertyId);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Property service unavailable or property not found: " + propertyId);
        }
    }

    private void autoCancelPendingBookings(String propertyId, Long excludeBookingId) {
        List<Booking> toCancel = bookingRepository
                .findByPropertyIdAndStatus(propertyId, BookingStatus.PENDING)
                .stream()
                .filter(b -> !b.getBookingId().equals(excludeBookingId))
                .peek(b -> {
                    b.setStatus(BookingStatus.CANCELLED);
                    b.setUpdatedAt(LocalDateTime.now());
                })
                .collect(Collectors.toList());

        if (!toCancel.isEmpty()) {
            bookingRepository.saveAll(toCancel);
            log.info("Auto-cancelled {} pending bookings for property {} (now full)",
                    toCancel.size(), propertyId);
        }
    }
}