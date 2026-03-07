package com.Booking.booking_service.dto;

import lombok.Data;

@Data
public class PropertyDTO {

    private String  propertyId;
    private Long    ownerId;
    private String  ownerName;
    private String  propertyName;
    private String  propertyType;
    private Integer availableRooms;
    private Integer totalRooms;
    private Double  rentPerMonth;
    private Integer requestLimit;   // computed limit sent by property service
}