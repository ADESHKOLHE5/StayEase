package com.property.property_service.entity;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "properties")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Property {
    @Id
    private String propertyId;

    private Long ownerId;// Will extract from JWT
    private String ownerName;     // Will extract from JWT

    @NotBlank(message = "Property name cannot be empty")
    @Size(min = 3, max = 100, message = "Property name must be between 3 and 100 characters")
    private String propertyName;

    @NotBlank(message = "Property type is required (e.g., Apartment, Villa, Pg ,Hostel,)")
    private String propertyType;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotNull(message = "Total rooms count is required")
    private Integer totalRooms;

    private Integer availableRooms;

    @NotNull(message = "Rent amount is required")
    @Positive(message = "Rent must be greater than zero")
    private Double rentPerMonth;

    private String imageUrl;


    private List<String> facilities;


}


