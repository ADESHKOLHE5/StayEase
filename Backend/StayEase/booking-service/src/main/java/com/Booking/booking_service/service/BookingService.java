package com.Booking.booking_service.service;

import com.Booking.booking_service.Feign.PropertyClient;
import com.Booking.booking_service.entity.Booking;
import com.Booking.booking_service.entity.BookingStatus;
import com.Booking.booking_service.repository.BookingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository repository;
    private final PropertyClient propertyClient;

    // TENANT → Send Booking Request
    public Booking createBooking(Booking booking) {
        booking.setStatus(BookingStatus.PENDING);
        booking.setRequestDate(LocalDateTime.now());
        return repository.save(booking);
    }

    // OWNER → Approve Booking
    @Transactional
    public Booking approveBooking(Long bookingId, Long ownerId) {
        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify owner owns this property
        if (booking.getOwnerId() == null || !booking.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to approve this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking already processed");
        }

        // Reduce available room in Property Service
        propertyClient.reduceRoom(booking.getPropertyId());

        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovalDate(LocalDateTime.now());

        return repository.save(booking);
    }

    // OWNER → Reject Booking
    public Booking rejectBooking(Long bookingId, Long ownerId) {
        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify owner owns this property
        if (booking.getOwnerId() == null || !booking.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to reject this booking");
        }

        booking.setStatus(BookingStatus.REJECTED);

        return repository.save(booking);
    }

    // TENANT → Get own bookings
    public List<Booking> getBookingsByTenant(Long tenantId) {
        return repository.findByTenantId(tenantId);
    }

    // OWNER → Get bookings by property and owner
    public List<Booking> getBookingsByPropertyAndOwner(String propertyId, Long ownerId) {
        return repository.findByPropertyIdAndOwnerId(propertyId, ownerId);
    }

    // ADMIN → Get all bookings
    public List<Booking> getAllBookings() {
        return repository.findAll();
    }
}
