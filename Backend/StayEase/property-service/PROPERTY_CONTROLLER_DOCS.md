# StayEase Property Service - Role-Based Controller Documentation

## Overview
The Property Service now has comprehensive role-based access control with endpoints for TENANT, OWNER, and PUBLIC access. All requests go through the API Gateway which validates JWT tokens and forwards user information as headers.

## Architecture
```
Client Request (with JWT)
        ↓
API Gateway (8080) - Validates JWT, extracts role
        ↓
Property Service (8082) - Reads headers, enforces role restrictions
        ↓
Database (MongoDB)
```

---

## TENANT ENDPOINTS

### 1. Browse All Properties
- **URL**: `GET /properties/tenant/browse`
- **Gateway Route**: `GET http://localhost:8080/properties/tenant/browse`
- **Headers Required**: 
  - `Authorization: Bearer <JWT_TOKEN>`
- **Role Required**: TENANT
- **Response**: List of all available properties
- **Example**:
```bash
curl -X GET http://localhost:8080/properties/tenant/browse \
  -H "Authorization: Bearer eyJhbGc..."
```

### 2. Search Properties by City
- **URL**: `GET /properties/tenant/search?city=NYC`
- **Gateway Route**: `GET http://localhost:8080/properties/tenant/search?city=NYC`
- **Headers Required**: 
  - `Authorization: Bearer <JWT_TOKEN>`
- **Role Required**: TENANT
- **Query Parameters**: `city` (required)
- **Response**: List of properties in the specified city
- **Example**:
```bash
curl -X GET "http://localhost:8080/properties/tenant/search?city=NYC" \
  -H "Authorization: Bearer eyJhbGc..."
```

### 3. View Property Details
- **URL**: `GET /properties/tenant/details/{id}`
- **Gateway Route**: `GET http://localhost:8080/properties/tenant/details/{id}`
- **Headers Required**: 
  - `Authorization: Bearer <JWT_TOKEN>`
- **Role Required**: TENANT
- **Path Parameters**: `id` (Property ID)
- **Response**: Property details
- **Example**:
```bash
curl -X GET http://localhost:8080/properties/tenant/details/property123 \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## OWNER ENDPOINTS

### 1. Add New Property
- **URL**: `POST /properties/owner/add`
- **Gateway Route**: `POST http://localhost:8080/properties/owner/add`
- **Headers Required**: 
  - `Authorization: Bearer <JWT_TOKEN>`
  - `Content-Type: application/json`
- **Role Required**: OWNER or ADMIN
- **Request Body**:
```json
{
  "propertyName": "Modern Villa",
  "propertyType": "Villa",
  "address": "123 Main St",
  "city": "NYC",
  "totalRooms": 5,
  "rentPerMonth": 2500.00,
  "facilities": ["WiFi", "Parking", "Pool"]
}
```
- **Response**: Created property with ID
- **Example**:
```bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"propertyName":"Villa","city":"NYC","totalRooms":5}'
```

### 2. View My Properties
- **URL**: `GET /properties/owner/my`
- **Gateway Route**: `GET http://localhost:8080/properties/owner/my`
- **Headers Required**: 
  - `Authorization: Bearer <JWT_TOKEN>`
- **Role Required**: OWNER
- **Response**: List of all properties owned by the authenticated user
- **Example**:
```bash
curl -X GET http://localhost:8080/properties/owner/my \
  -H "Authorization: Bearer eyJhbGc..."
```

### 3. Update Property
- **URL**: `PUT /properties/owner/update/{id}`
- **Gateway Route**: `PUT http://localhost:8080/properties/owner/update/{id}`
- **Headers Required**: 
  - `Authorization: Bearer <JWT_TOKEN>`
  - `Content-Type: application/json`
- **Role Required**: OWNER
- **Path Parameters**: `id` (Property ID)
- **Request Body**: Any property fields to update
```json
{
  "rentPerMonth": 3000.00,
  "facilities": ["WiFi", "Parking", "Pool", "Gym"]
}
```
- **Response**: Updated property details
- **Example**:
```bash
curl -X PUT http://localhost:8080/properties/owner/update/property123 \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"rentPerMonth": 3000}'
```

### 4. Delete Property
- **URL**: `DELETE /properties/owner/delete/{id}`
- **Gateway Route**: `DELETE http://localhost:8080/properties/owner/delete/{id}`
- **Headers Required**: 
  - `Authorization: Bearer <JWT_TOKEN>`
- **Role Required**: OWNER
- **Path Parameters**: `id` (Property ID)
- **Response**: Success message
- **Example**:
```bash
curl -X DELETE http://localhost:8080/properties/owner/delete/property123 \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## PUBLIC ENDPOINTS (No Authentication Required)

### Browse All Properties
- **URL**: `GET /properties/all`
- **Gateway Route**: `GET http://localhost:8080/properties/all`
- **Headers Required**: None
- **Response**: List of all properties
- **Example**:
```bash
curl -X GET http://localhost:8080/properties/all
```

---

## INTERNAL ENDPOINTS (For Microservice Communication)

### Reduce Available Rooms
- **URL**: `PUT /properties/internal/reduce-room/{id}`
- **Gateway Route**: Not exposed (internal only)
- **Used By**: Booking Service
- **Purpose**: Decrements available rooms when a booking is made
- **Headers**: Forwarded Authorization header from gateway

---

## Error Responses

### 403 Forbidden
```json
{
  "message": "Only owners can add properties"
}
```
**Causes**:
- Wrong role accessing endpoint
- TENANT trying to add/update/delete properties
- OWNER trying to access tenant endpoints

### 400 Bad Request
```json
{
  "message": "Missing user id"
}
```
**Causes**:
- Missing required parameters
- Invalid user ID format
- Missing header validation

### 404 Not Found
```json
{
  "message": "Property not found with ID: xyz"
}
```
**Causes**:
- Property doesn't exist
- Invalid property ID

---

## Gateway Header Forwarding

The API Gateway automatically extracts information from JWT tokens and forwards them as headers:

| Header | Source | Example Value |
|--------|--------|---|
| `X-Username` | JWT Subject | `owner1` |
| `X-User-Id` | JWT Claim "userId" | `123` |
| `X-User-Role` | JWT Claim "role" | `OWNER` |
| `Authorization` | Original JWT Header | `Bearer eyJhbGc...` |

---

## Security Summary

✅ **Enabled**:
- JWT validation at API Gateway
- Role-based access control via headers
- Owner permission verification (can only update/delete own properties)
- Input validation (property name, city, etc.)

⚠️ **Important**:
- All requests except `/properties/all` must go through gateway
- Internal endpoints (`/properties/internal/**`) are open but only callable from registered services
- JWT token must be valid and not expired

---

## Testing Flow

### 1. Register User as Owner
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "owner1",
    "email": "owner@example.com",
    "password": "pass123",
    "age": 30,
    "role": "OWNER"
  }'
```

### 2. Login to Get JWT
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "owner1",
    "password": "pass123"
  }'
# Response: eyJhbGciOiJIUzI1NiJ9...
```

### 3. Add Property
```bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "propertyName": "Luxury Apartment",
    "propertyType": "Apartment",
    "address": "456 Park Ave",
    "city": "NYC",
    "totalRooms": 3,
    "rentPerMonth": 3500
  }'
```

### 4. View Own Properties
```bash
curl -X GET http://localhost:8080/properties/owner/my \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

### 5. Register Tenant and Search
```bash
# Register as TENANT
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tenant1",
    "email": "tenant@example.com",
    "password": "pass123",
    "age": 25,
    "role": "TENANT"
  }'

# Login as tenant
# Use token to search
curl -X GET "http://localhost:8080/properties/tenant/search?city=NYC" \
  -H "Authorization: Bearer <TENANT_TOKEN>"
```

---

## Service Methods in PropertyService

| Method | Purpose |
|--------|---------|
| `saveProperty()` | Add new property |
| `findAll()` | Get all properties |
| `findById()` | Get property by ID |
| `findByOwnerId()` | Get owner's properties |
| `findByCity()` | Search properties by city |
| `updateProperty()` | Update property (with owner verification) |
| `deleteProperty()` | Delete property (with owner verification) |
| `updateAvailability()` | Update available rooms (internal) |

