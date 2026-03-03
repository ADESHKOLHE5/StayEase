package com.property.property_service.entity;

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
    private Long ownerId;        // Will extract from JWT
    private String ownerName;    // Will extract from JWT
    private String propertyName;
    private String propertyType;
    private String address;
    private String city;
    private Integer totalRooms;
    private Integer availableRooms;
    private Double rentPerMonth;
    private List<String> facilities;
}