package com.property.property_service.entity;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "properties")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Property {

    @Id
    private String propertyId;

    private Long ownerId;
    private String ownerName;

    @NotBlank(message = "Property name is required")
    @Size(min = 3, max = 100, message = "Property name must be 3–100 characters")
    private String propertyName;

    @NotBlank(message = "Property type is required")
    private String propertyType;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;
    private String pincode;


    @NotNull(message = "Total units count is required")
    @Positive(message = "Total units must be > 0")
    private Integer totalRooms;

    private Integer availableRooms;

    @NotNull(message = "Rent is required")
    @Positive(message = "Rent must be > 0")
    private Double rentPerMonth;


    @NotNull(message = "Rent is required")
    @Positive(message = "Rent must be > 0")
    private Double securityDeposit;

    private String rentIncludes;


    private List<String> facilities;

    private String checkInTime;
    private String checkOutTime;

    private String description;

    private String imageUrl;


    private String cancellationPolicy;
    private String depositPolicy;
    private String houseRules;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


