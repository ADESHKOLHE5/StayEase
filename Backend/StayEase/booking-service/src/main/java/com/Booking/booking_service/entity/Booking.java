package com.Booking.booking_service.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;


    @NotBlank(message = "Property ID is required")
    @Size(max = 50, message = "Property ID cannot exceed 50 characters")
    private String propertyId;

    @NotBlank(message = "Property name is required")
    @Size(min = 3, max = 100, message = "Property name must be between 3 and 100 characters")
    private String propertyName;


    @NotNull(message = "Tenant ID is required")
    @Positive(message = "Tenant ID must be positive")
    private Long tenantId;

    @NotBlank(message = "Tenant username is required")
    @Size(min = 3, max = 50, message = "Tenant username must be between 3 and 50 characters")
    private String tenantUsername;


    @NotNull(message = "Owner ID is required")
    @Positive(message = "Owner ID must be positive")
    private Long ownerId;

    @NotBlank(message = "Owner name is required")
    @Size(min = 3, max = 100, message = "Owner name must be between 3 and 100 characters")
    private String ownerName;


    @NotBlank(message = "Room number is required")
    @Size(max = 10, message = "Room number cannot exceed 10 characters")
    private String roomNumber;


    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;



    @PastOrPresent(message = "Request date cannot be in the future")
    private LocalDateTime requestDate = LocalDateTime.now();

    private LocalDateTime approvalDate;

    @NotNull(message = "Rent amount is required")
    @Positive(message = "Rent amount must be greater than zero")
    private Double rentAmount;



    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}