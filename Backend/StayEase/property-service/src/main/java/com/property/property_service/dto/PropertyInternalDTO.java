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
}