package com.property.property_service.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdatePropertyRequest {

    // basic info
    @Size(min = 3, max = 100, message = "Property name must be 3–100 characters")
    private String propertyName;

    private String propertyType;

    private String address;
    private String city;
    private String state;
    private String pincode;


    @Positive(message = "Total rooms must be greater than 0")
    private Integer totalRooms;

    @Positive(message = "Available rooms must be >= 0")
    private Integer availableRooms;

    @Positive(message = "Rent must be greater than 0")
    private Double rentPerMonth;

    @Positive(message = "Security deposit must be greater than 0")
    private Double securityDeposit;

    private String rentIncludes;


    private List<String> facilities;

    private String checkInTime;
    private String checkOutTime;

    private String description;
    private String imageUrl;

    //  policies
    private String cancellationPolicy;
    private String depositPolicy;
    private String houseRules;
}