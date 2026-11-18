// com/property/property_service/config/FeignConfig.java

package com.property.property_service.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes == null) return;   // ← safe exit, no change needed below

            String header = attributes.getRequest().getHeader("Authorization");
            if (header != null) {
                requestTemplate.header("Authorization", header);
            }
        };
    }
}