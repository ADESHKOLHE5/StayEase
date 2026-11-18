package com.property.property_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InValidIdException extends RuntimeException {
    public InValidIdException(String invalidUserId) {
        super(invalidUserId);
    }
}
