# Booking System Implementation Plan

## Phase 1: Configuration Updates
- [ ] Update booking-service application.properties with request limits
- [ ] Add CANCELLED status to BookingStatus enum

## Phase 2: Entity Updates
- [ ] Update Property entity with maxBookingRequests field
- [ ] Update Booking entity with new fields (contactDetails, propertyName)

## Phase 3: Property Service Updates
- [ ] Add method to get property by ID for booking service
- [ ] Add method to get max booking requests per property type

## Phase 4: Booking Service Updates
- [ ] Update PropertyClient with new Feign methods
- [ ] Update BookingService with 5 request limit logic
- [ ] Add auto-cancel logic when property is full
- [ ] Add contact details sharing after approval

## Phase 5: Controller Updates
- [ ] Update BookingController with new endpoints
- [ ] Add owner dashboard endpoint




Property Service (MongoDB): Manages properties with fields like propertyId, ownerId, propertyName, propertyType, totalRooms, availableRooms, rentPerMonth
Booking Service (MySQL): Manages bookings with bookingId, propertyId, tenantId, ownerId, status (PENDING/APPROVED/REJECTED), requestDate, approvalDate
Feign Client: Exists between booking-service and property-service for communication
Current BookingStatus: PENDING, APPROVED, REJECTED (need to add CANCELLED)
Requirements to Implement:
Owner can approve/reject/keep pending booking requests
Owner can see all requests for all their properties (dashboard)
After confirmation, owner/tenant get contact details
User dashboard shows "my bookings" with status
User can send only 5 booking requests total
Each property has request limit based on property type (Hostel: 50, PG: 30, Apartment: 5, Villa: 3)
If property is full, other pending requests get automatically cancelled
After cancellation, user can make more requests
Use Stream API and application.properties for configuration
