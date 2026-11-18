package com.Booking.booking_service.dto;

import lombok.Data;

@Data
public class BookingRequestDto {

    private String propertyId;
    private String checkInDate;       // "2026-04-15"
    private String checkOutDate;      // "2026-05-15"
    private Integer numberOfRooms;
    private Integer numberOfGuests;
    private Double totalPrice;
}
