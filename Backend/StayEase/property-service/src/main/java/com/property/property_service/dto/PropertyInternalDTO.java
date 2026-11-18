package com.property.property_service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyInternalDTO {
    private String  propertyId;
    private Long    ownerId;
    private String  ownerName;
    private String  propertyName;
    private String  propertyType;
    private Integer availableRooms;
    private Integer totalRooms;
    private Double  rentPerMonth;
    private Integer requestLimit;
    private String  imageUrl;
    private String  address;
    private String  city;
    private String  state;
    private String  checkInTime;
    private String  checkOutTime;
}