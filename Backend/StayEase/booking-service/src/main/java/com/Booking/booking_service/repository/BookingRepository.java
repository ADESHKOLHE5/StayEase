package com.Booking.booking_service.repository;

import com.Booking.booking_service.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByTenantId(Long tenantId);
    List<Booking> findByOwnerId(Long ownerId);
    List<Booking> findByPropertyIdAndOwnerId(String propertyId, Long ownerId);
    List<Booking> findByPropertyId(String propertyId);
}
