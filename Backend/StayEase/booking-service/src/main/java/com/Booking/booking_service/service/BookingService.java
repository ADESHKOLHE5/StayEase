package com.Booking.booking_service.service;

import com.Booking.booking_service.client.PropertyClient;
import com.Booking.booking_service.dto.PropertyDTO;
import com.Booking.booking_service.entity.Booking;
import com.Booking.booking_service.entity.BookingStatus;
import com.Booking.booking_service.repository.BookingRepository;
import jakarta.el.PropertyNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyClient    propertyClient;

    @Value("${booking.tenant.max-active-requests:5}")
    private int maxActiveRequests;

    private static final List<BookingStatus> ACTIVE_STATUSES =
            List.of(BookingStatus.PENDING, BookingStatus.APPROVED);


    @Transactional
    public Booking requestBooking(String propertyId, Long tenantId, String tenantUsername) {

        // guard 1 — global active-request cap per tenant
        long activeCount = bookingRepository
                .countByTenantIdAndStatusIn(tenantId, ACTIVE_STATUSES);
        if (activeCount >= maxActiveRequests) {
            throw new IllegalStateException(
                    "You have reached the maximum of " + maxActiveRequests +
                            " active booking requests. Cancel an existing one before requesting more."
            );
        }

        // Guard 2 — no duplicate on same property
        boolean duplicate = bookingRepository
                .existsByTenantIdAndPropertyIdAndStatusIn(tenantId, propertyId, ACTIVE_STATUSES);
        if (duplicate) {
            throw new IllegalStateException(
                    "You already have an active booking request for this property."
            );
        }

        // Guard 3 — fetch property (Feign)
        PropertyDTO property = fetchProperty(propertyId);

        if (property.getAvailableRooms() == null || property.getAvailableRooms() <= 0) {
            throw new IllegalStateException(
                    "No rooms available for property: " + property.getPropertyName()
            );
        }

        // Guard 4 — per-property request cap (type-based)
        long propertyActiveCount = bookingRepository
                .countByPropertyIdAndStatusIn(propertyId, ACTIVE_STATUSES);
        if (propertyActiveCount >= property.getRequestLimit()) {
            throw new IllegalStateException(
                    "This property has reached its maximum request capacity (" +
                            property.getRequestLimit() + " for type " + property.getPropertyType() + ")."
            );
        }

        // All guards passed — create booking
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

        return bookingRepository.save(booking);
    }

  //tenant dashboard showing my booking
    public List<Booking> getTenantBookings(Long tenantId) {
        return bookingRepository.findByTenantId(tenantId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    //tenant delete thier own pending request
    @Transactional
    public Booking cancelBooking(Long bookingId, Long tenantId) {
        Booking booking = getById(bookingId);

        if (!booking.getTenantId().equals(tenantId))
            throw new IllegalStateException("You can only cancel your own bookings.");

        if (booking.getStatus() != BookingStatus.PENDING)
            throw new IllegalStateException(
                    "Only PENDING bookings can be cancelled. Current status: " + booking.getStatus()
            );

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    // ═══════════════════════════════════════════════════════════════════
    //  OWNER OPERATIONS
    // ═══════════════════════════════════════════════════════════════════

    /** Owner dashboard — all bookings across all their properties, newest first */
    public List<Booking> getOwnerDashboard(Long ownerId) {
        return bookingRepository.findByOwnerId(ownerId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    /** Owner dashboard filtered by status (e.g., ?status=PENDING) */
    public List<Booking> getOwnerDashboardByStatus(Long ownerId, BookingStatus status) {
        return bookingRepository.findByOwnerId(ownerId).stream()
                .filter(b -> b.getStatus() == status)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    /**
     * Owner approves a booking:
     *  1. Sets APPROVED + approvalDate
     *  2. Calls property service to decrement availableRooms
     *  3. If property is now full → auto-cancel all remaining PENDING requests for it
     */
    @Transactional
    public Booking approveBooking(Long bookingId, Long ownerId) {
        Booking booking = getById(bookingId);

        if (!booking.getOwnerId().equals(ownerId))
            throw new IllegalStateException("You can only approve bookings for your own properties.");

        if (booking.getStatus() != BookingStatus.PENDING)
            throw new IllegalStateException(
                    "Only PENDING bookings can be approved. Current status: " + booking.getStatus()
            );

        // Step 1 — approve
        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovalDate(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        Booking approved = bookingRepository.save(booking);

        // Step 2 — decrement rooms in property service
        try {
            propertyClient.updateRooms(booking.getPropertyId(), -1);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Booking approved but failed to update property availability. " +
                            "Please contact support. Error: " + e.getMessage()
            );
        }

        // Step 3 — auto-cancel remaining PENDING requests if property is now full
        try {
            PropertyDTO property = fetchProperty(booking.getPropertyId());
            if (property.getAvailableRooms() != null && property.getAvailableRooms() <= 0) {
                autoCancelPendingBookings(booking.getPropertyId(), bookingId);
            }
        } catch (Exception e) {
            // Non-critical — log and continue
            log.warn("Auto-cancel check failed for property {}: {}", booking.getPropertyId(), e.getMessage());
        }

        return approved;
    }

    // owner rejects a booking only
    @Transactional
    public Booking rejectBooking(Long bookingId, Long ownerId) {
        Booking booking = getById(bookingId);

        if (!booking.getOwnerId().equals(ownerId))
            throw new IllegalStateException("You can only reject bookings for your own properties.");

        if (booking.getStatus() != BookingStatus.PENDING)
            throw new IllegalStateException(
                    "Only PENDING bookings can be rejected. Current status: " + booking.getStatus()
            );

        booking.setStatus(BookingStatus.REJECTED);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }


    public Booking getContactDetails(Long bookingId, Long userId, String role) {
        Booking booking = getById(bookingId);

        boolean isTenant = "TENANT".equalsIgnoreCase(role) && booking.getTenantId().equals(userId);
        boolean isOwner  = "OWNER".equalsIgnoreCase(role)  && booking.getOwnerId().equals(userId);

        if (!isTenant && !isOwner)
            throw new IllegalStateException("Access denied. This booking does not belong to you.");

        if (booking.getStatus() != BookingStatus.APPROVED)
            throw new IllegalStateException(
                    "Contact details are only available for APPROVED bookings. " +
                            "Current status: " + booking.getStatus()
            );

        return booking;
    }

    // ═══════════════════════════════════════════════════════════════════
    //  HELPERS
    // ═══════════════════════════════════════════════════════════════════

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

    /**
     * When a property becomes fully booked, cancel all remaining PENDING requests
     * (except the one just approved). Uses Stream API for clean filtering.
     */
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
            log.info("Auto-cancelled {} pending bookings for property {} (property now full)",
                    toCancel.size(), propertyId);
        }
    }
}