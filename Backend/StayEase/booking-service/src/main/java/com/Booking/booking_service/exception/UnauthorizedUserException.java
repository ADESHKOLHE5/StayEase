package com.Booking.booking_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedUserException extends RuntimeException {
    public UnauthorizedUserException(String s) {
        super(s);
    }
}
