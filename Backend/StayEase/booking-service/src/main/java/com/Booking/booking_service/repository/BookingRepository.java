package com.Booking.booking_service.repository;

import com.Booking.booking_service.entity.Booking;
import com.Booking.booking_service.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByTenantId(Long tenantId);

    List<Booking> findByOwnerId(Long ownerId);

    List<Booking> findByPropertyId(String propertyId);

    List<Booking> findByPropertyIdAndStatus(String propertyId, BookingStatus status);

 //allow 5 request only you want to send more cancel some
    long countByTenantIdAndStatusIn(Long tenantId, List<BookingStatus> statuses);

  //   Count active requests already placed on a property — enforces per-property cap
    long countByPropertyIdAndStatusIn(String propertyId, List<BookingStatus> statuses);

    //prevent for duplicate request for same user
    boolean existsByTenantIdAndPropertyIdAndStatusIn(
            Long tenantId, String propertyId, List<BookingStatus> statuses);
}