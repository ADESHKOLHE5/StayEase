package com.property.property_service.dto;

import lombok.Data;
import java.util.List;

// Used by post /ai/summarize
@Data
public class SummarizeRequest {
    private String       propertyName;
    private String       propertyType;
    private String       city;
    private String       state;
    private String       address;
    private Double       rentPerMonth;
    private Double       securityDeposit;
    private Integer      availableRooms;
    private List<String> facilities;
    private String       description;
    private String       checkInTime;
    private String       checkOutTime;
}
