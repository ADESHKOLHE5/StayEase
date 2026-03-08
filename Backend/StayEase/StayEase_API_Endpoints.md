# StayEase API Endpoints - Complete Testing Guide

## Base URL: http://localhost:8080 (API Gateway)

---

## 1. AUTH SERVICE (Port 8081)
### Endpoints through Gateway: http://localhost:8080/auth/...

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | /auth/register | Register new user | JSON | Created User |
| POST | /auth/login | Login user | JSON | { "token": "jwt..." } |

### Sample Request Bodies:

**POST /auth/register**
```
json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "TENANT"
}
```
Available roles: TENANT, OWNER, ADMIN

**POST /auth/login**
```
json
{
  "username": "john_doe",
  "password": "password123"
}
```

---

## 2. PROPERTY SERVICE (Port 8082)
### Endpoints through Gateway: http://localhost:8080/properties/...

| Method | Endpoint | Description | Headers Required | Request Body |
|--------|----------|-------------|------------------|--------------|
| POST | /properties/owner/add | Add new property | X-User-Id, X-User-Role: OWNER | Property JSON |
| GET | /properties/owner/my | Get owner's properties | X-User-Id, X-User-Role: OWNER | - |
| PUT | /properties/owner/update/{id} | Update property | X-User-Id, X-User-Role: OWNER | Property JSON |
| DELETE | /properties/owner/delete/{id} | Delete property | X-User-Id, X-User-Role: OWNER | - |
| GET | /properties/tenant/browse | Browse all properties | X-User-Role: TENANT | - |
| GET | /properties/tenant/search | Search properties | X-User-Role: TENANT | Query params: city, propertyType, maxRent |
| GET | /properties/tenant/details/{id} | Property details | X-User-Role: TENANT | - |
| GET | /properties/all | Public - all properties | None | - |

### Sample Request Bodies:

**POST /properties/owner/add**
```
json
{
  "propertyName": "Sunshine Apartments",
  "propertyType": "Apartment",
  "address": "123 Main Street",
  "city": "Delhi",
  "totalRooms": 10,
  "availableRooms": 8,
  "rentPerMonth": 15000.00,
  "imageUrl": "https://example.com/image.jpg",
  "facilities": ["WiFi", "Parking", "Security"]
}
```

Property Types: Apartment, Villa, Pg, Hostel

---

## 3. BOOKING SERVICE (Port 8083)
### Endpoints through Gateway: http://localhost:8080/bookings/...

### Tenant Endpoints:

| Method | Endpoint | Description | Headers Required |
|--------|----------|-------------|------------------|
| POST | /bookings/tenant/request?propertyId={id} | Request booking | X-User-Id, X-User-Role: TENANT |
| GET | /bookings/tenant/my | My bookings | X-User-Id, X-User-Role: TENANT |
| DELETE | /bookings/tenant/cancel/{bookingId} | Cancel booking | X-User-Id, X-User-Role: TENANT |
| GET | /bookngs/tenant/contaict/{bookingId} | Get owner contact | X-User-Id, X-User-Role: TENANT |

### Owner Endpoints:

| Method | Endpoint | Description | Headers Required |
|--------|----------|-------------|------------------|
| GET | /bookings/owner/dashboard | Owner dashboard | X-User-Id, X-User-Role: OWNER |
| GET | /bookings/owner/dashboard?status=PENDING | Filter by status | X-User-Id, X-User-Role: OWNER |
| PUT | /bookings/owner/approve/{bookingId} | Approve booking | X-User-Id, X-User-Role: OWNER |
| PUT | /bookings/owner/reject/{bookingId} | Reject booking | X-User-Id, X-User-Role: OWNER |
| GET | /bookings/owner/contact/{bookingId} | Get tenant contact | X-User-Id, X-User-Role: OWNER |

---

## Testing Flow:

### Step 1: Register Users
```
bash
# Register Owner
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"owner1","email":"owner@test.com","password":"pass123","role":"OWNER"}'

# Register Tenant
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"tenant1","email":"tenant@test.com","password":"pass123","role":"TENANT"}'
```

### Step 2: Login (Get Token)
```
bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"owner1","password":"pass123"}'
```

### Step 3: Add Property (as Owner)
```
bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -H "X-User-Role: OWNER" \
  -d '{"propertyName":"Sunshine Apartments","propertyType":"Apartment","address":"123 Main St","city":"Delhi","totalRooms":10,"availableRooms":8,"rentPerMonth":15000}'
```

### Step 4: Browse Properties (as Tenant)
```
bash
curl -X GET http://localhost:8080/properties/tenant/browse \
  -H "X-User-Role: TENANT"
```

### Step 5: Request Booking (as Tenant)
```
bash
curl -X POST "http://localhost:8080/bookings/tenant/request?propertyId=PROPERTY_ID" \
  -H "X-User-Id: 2" \
  -H "X-User-Role: TENANT" \
  -H "X-Username: tenant1"
```

### Step 6: Owner Approves Booking
```
bash
curl -X PUT http://localhost:8080/bookings/owner/approve/BOOKING_ID \
  -H "X-User-Id: 1" \
  -H "X-User-Role: OWNER"
```

---

## Booking Status Values:
- PENDING
- APPROVED
- REJECTED
- CANCELLED

---

## Service Ports:
| Service | Port |
|---------|------|
| API Gateway | 8080 |
| Auth Service | 8081 |
| Property Service | 8082 |
| Booking Service | 8083 |

---

## Internal Endpoints (Feign Client - Not Direct):
These are called by booking-service internally:
- GET /properties/internal/{id} - Get property details
- PUT /properties/internal/update-rooms/{id}?delta=-1 - Update room count

**Note:** These endpoints require header `X-Internal-Service: booking-service`
