package com.Booking.booking_service.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "property-service", url = "http://localhost:8082")
public interface PropertyClient {

    @PutMapping("/internal/reduce-room/{id}")
    void reduceRoom(@PathVariable("id") String propertyId);
}
