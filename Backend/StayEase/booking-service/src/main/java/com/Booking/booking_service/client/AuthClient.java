package com.Booking.booking_service.client;


import com.Booking.booking_service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(
        name          = "auth-service",
        url           = "${auth.service.url}",
        configuration = FeignConfig.class
)
public interface AuthClient {

    /*
      fetches email + name for a user by their id.
      feignConfig automatically adds x-internal-service header.
     */
    @GetMapping("/auth/internal/user/{userId}")
    Map<String, Object> getUserById(@PathVariable("userId") Long userId);
}
