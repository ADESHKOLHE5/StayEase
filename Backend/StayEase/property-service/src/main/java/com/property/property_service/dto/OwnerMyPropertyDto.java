package com.property.property_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OwnerMyPropertyDto {

    private String propertyId;
    private String propertyName;
    private String imageUrl;
    private String city;
    private String address;
    private Double rentPerMonth;
    private Integer availableRooms;
    private Integer totalRooms;
}


