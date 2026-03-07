package com.Booking.booking_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserIDHeaderMissingException extends RuntimeException {
    public UserIDHeaderMissingException(String s) {
        super(s);
    }
}
