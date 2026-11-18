package com.property.property_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PropertyNotFoundExceptions extends RuntimeException{
    public PropertyNotFoundExceptions(String s) {
        super(s);
    }
}
