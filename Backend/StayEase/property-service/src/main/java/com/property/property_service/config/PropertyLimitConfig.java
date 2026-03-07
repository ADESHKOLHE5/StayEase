package com.property.property_service.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "property.request.limit")
@Data
public class PropertyLimitConfig {

    private int hostel = 50;
    private int pg = 30;
    private int apartment = 5;
    private int villa = 3;
    private int defaultLimit = 10;

    public int getLimitForType(String propertyType) {
        if (propertyType == null) return defaultLimit;
        return switch (propertyType.trim().toLowerCase()) {
            case "hostel"    -> hostel;
            case "pg"        -> pg;
            case "apartment" -> apartment;
            case "villa"     -> villa;
            default          -> defaultLimit;
        };
    }
}