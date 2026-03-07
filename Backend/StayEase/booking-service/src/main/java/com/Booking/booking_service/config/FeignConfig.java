package com.Booking.booking_service.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            // Always mark as internal so property service skips role checks
            template.header("X-Internal-Service", "booking-service");

            // forward JWT headers in case property service ever needs them
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest req = attrs.getRequest();
                String auth = req.getHeader("Authorization");
                if (auth != null) template.header("Authorization", auth);
                String userId = req.getHeader("X-User-Id");
                if (userId != null) template.header("X-User-Id", userId);
                String role = req.getHeader("X-User-Role");
                if (role != null) template.header("X-User-Role", role);
            }
        };
    }
}