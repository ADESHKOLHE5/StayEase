package com.property.property_service.dto;



import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PropertyCardShowDto {

    private String propertyId;
    private String propertyName;
    private String propertyType;

    private String city;
    private String state;
    private String address;

    private Long ownerId;
    private String ownerName;

    private Double rentPerMonth;

    private Integer availableRooms;
    private Integer totalRooms;

    private List<String> facilities;

    private String description;

    private String imageUrl;

    private String checkInTime;
    private String checkOutTime;
}
