package com.Booking.booking_service.client;


import com.Booking.booking_service.config.FeignConfig;
import com.Booking.booking_service.dto.PropertyDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name          = "property-service",
        url           = "${property.service.url}",
        configuration = FeignConfig.class// from application.properties

)
public interface PropertyClient {

    //property+request
    @GetMapping("/properties/internal/{id}")
    PropertyDTO getProperty(@PathVariable("id") String id);

   //room inc decrease
    @PutMapping("/properties/internal/update-rooms/{id}")
    void updateRooms(@PathVariable("id") String id, @RequestParam("delta") int delta);
    
   
}