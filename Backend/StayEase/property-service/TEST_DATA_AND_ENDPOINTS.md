# StayEase Property Service - Complete Testing Guide with Sample Data

## Prerequisites
- Auth Service running on `http://localhost:8081`
- Property Service running on `http://localhost:8082`
- API Gateway running on `http://localhost:8080`
- MongoDB running on `mongodb://localhost:27017`

---

## PHASE 1: USER REGISTRATION & LOGIN

### 1.1 Register Owner User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "owner_amol",
    "email": "owner@stayease.com",
    "password": "Owner@123",
    "age": 35,
    "role": "OWNER"
  }'
```

**Expected Response** (Status: 200):
```json
{
  "userId": 1,
  "username": "owner_amol",
  "email": "owner@stayease.com",
  "age": 35,
  "role": "OWNER",
  "status": "ACTIVE",
  "createdAt": "2026-03-04T10:30:00"
}
```

### 1.2 Register Second Owner
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "owner_john",
    "email": "john@stayease.com",
    "password": "John@123",
    "age": 42,
    "role": "OWNER"
  }'
```

**Expected Response** (Status: 200):
```json
{
  "userId": 2,
  "username": "owner_john",
  "email": "john@stayease.com",
  "age": 42,
  "role": "OWNER",
  "status": "ACTIVE"
}
```

### 1.3 Register Tenant User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tenant_sarah",
    "email": "sarah@stayease.com",
    "password": "Tenant@123",
    "age": 28,
    "role": "TENANT"
  }'
```

**Expected Response** (Status: 200):
```json
{
  "userId": 3,
  "username": "tenant_sarah",
  "email": "sarah@stayease.com",
  "age": 28,
  "role": "TENANT",
  "status": "ACTIVE"
}
```

### 1.4 Register Second Tenant
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tenant_mike",
    "email": "mike@stayease.com",
    "password": "Tenant@123",
    "age": 31,
    "role": "TENANT"
  }'
```

### 1.5 Login - Owner
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "owner_amol",
    "password": "Owner@123"
  }'
```

**Expected Response** (Status: 200):
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lcl9hbW9sIiwidXNlcklkIjoxLCJyb2xlIjoiT1dORVIiLCJpYXQiOjE2NzMzODk0MDAsImV4cCI6MTY3MzM5MzAwMH0.abc...
```

**Save as**: `$OWNER_TOKEN_1`

### 1.6 Login - Second Owner
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "owner_john",
    "password": "John@123"
  }'
```

**Save as**: `$OWNER_TOKEN_2`

### 1.7 Login - Tenant
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tenant_sarah",
    "password": "Tenant@123"
  }'
```

**Save as**: `$TENANT_TOKEN_1`

### 1.8 Login - Second Tenant
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tenant_mike",
    "password": "Tenant@123"
  }'
```

**Save as**: `$TENANT_TOKEN_2`

---

## PHASE 2: OWNER ENDPOINTS TESTING

### 2.1 Owner Add Property #1
```bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Authorization: Bearer $OWNER_TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyName": "Luxury Manhattan Apartment",
    "propertyType": "Apartment",
    "address": "123 Fifth Avenue",
    "city": "New York",
    "totalRooms": 3,
    "rentPerMonth": 3500.00,
    "facilities": ["WiFi", "Parking", "Gym", "Swimming Pool"]
  }'
```

**Expected Response** (Status: 200):
```json
{
  "propertyId": "507f1f77bcf86cd799439011",
  "ownerId": 1,
  "ownerName": "owner_amol",
  "propertyName": "Luxury Manhattan Apartment",
  "propertyType": "Apartment",
  "address": "123 Fifth Avenue",
  "city": "New York",
  "totalRooms": 3,
  "availableRooms": 3,
  "rentPerMonth": 3500.00,
  "facilities": ["WiFi", "Parking", "Gym", "Swimming Pool"]
}
```

**Save ID as**: `$PROPERTY_ID_1 = 507f1f77bcf86cd799439011`

### 2.2 Owner Add Property #2 (Same Owner)
```bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Authorization: Bearer $OWNER_TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyName": "Modern Brooklyn Loft",
    "propertyType": "Loft",
    "address": "456 Madison Avenue",
    "city": "New York",
    "totalRooms": 2,
    "rentPerMonth": 2800.00,
    "facilities": ["WiFi", "Rooftop Terrace"]
  }'
```

**Save ID as**: `$PROPERTY_ID_2`

### 2.3 Second Owner Add Property #3
```bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Authorization: Bearer $OWNER_TOKEN_2" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyName": "Cozy Queens Villa",
    "propertyType": "Villa",
    "address": "789 Broadway",
    "city": "New York",
    "totalRooms": 5,
    "rentPerMonth": 4200.00,
    "facilities": ["WiFi", "Parking", "Garden", "Pool"]
  }'
```

**Save ID as**: `$PROPERTY_ID_3`

### 2.4 Owner Add Property in Different City
```bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Authorization: Bearer $OWNER_TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyName": "Downtown Los Angeles Condo",
    "propertyType": "Condo",
    "address": "999 Sunset Boulevard",
    "city": "Los Angeles",
    "totalRooms": 2,
    "rentPerMonth": 2200.00,
    "facilities": ["WiFi", "Parking", "Gym"]
  }'
```

**Save ID as**: `$PROPERTY_ID_4`

### 2.5 Owner View My Properties
```bash
curl -X GET http://localhost:8080/properties/owner/my \
  -H "Authorization: Bearer $OWNER_TOKEN_1"
```

**Expected Response** (Status: 200):
```json
[
  {
    "propertyId": "507f1f77bcf86cd799439011",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Luxury Manhattan Apartment",
    "propertyType": "Apartment",
    "address": "123 Fifth Avenue",
    "city": "New York",
    "totalRooms": 3,
    "availableRooms": 3,
    "rentPerMonth": 3500.00,
    "facilities": ["WiFi", "Parking", "Gym", "Swimming Pool"]
  },
  {
    "propertyId": "507f1f77bcf86cd799439012",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Modern Brooklyn Loft",
    "propertyType": "Loft",
    "address": "456 Madison Avenue",
    "city": "New York",
    "totalRooms": 2,
    "availableRooms": 2,
    "rentPerMonth": 2800.00,
    "facilities": ["WiFi", "Rooftop Terrace"]
  },
  {
    "propertyId": "507f1f77bcf86cd799439013",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Downtown Los Angeles Condo",
    "propertyType": "Condo",
    "address": "999 Sunset Boulevard",
    "city": "Los Angeles",
    "totalRooms": 2,
    "availableRooms": 2,
    "rentPerMonth": 2200.00,
    "facilities": ["WiFi", "Parking", "Gym"]
  }
]
```

**✅ Should Return**: 3 properties (all owned by owner_amol)

### 2.6 Second Owner View My Properties
```bash
curl -X GET http://localhost:8080/properties/owner/my \
  -H "Authorization: Bearer $OWNER_TOKEN_2"
```

**Expected Response** (Status: 200):
```json
[
  {
    "propertyId": "507f1f77bcf86cd799439014",
    "ownerId": 2,
    "ownerName": "owner_john",
    "propertyName": "Cozy Queens Villa",
    "propertyType": "Villa",
    "address": "789 Broadway",
    "city": "New York",
    "totalRooms": 5,
    "availableRooms": 5,
    "rentPerMonth": 4200.00,
    "facilities": ["WiFi", "Parking", "Garden", "Pool"]
  }
]
```

**✅ Should Return**: 1 property (owned only by owner_john)

### 2.7 Owner Update Property #1
```bash
curl -X PUT http://localhost:8080/properties/owner/update/$PROPERTY_ID_1 \
  -H "Authorization: Bearer $OWNER_TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "rentPerMonth": 3800.00,
    "facilities": ["WiFi", "Parking", "Gym", "Swimming Pool", "Concierge"]
  }'
```

**Expected Response** (Status: 200):
```json
{
  "propertyId": "507f1f77bcf86cd799439011",
  "ownerId": 1,
  "ownerName": "owner_amol",
  "propertyName": "Luxury Manhattan Apartment",
  "propertyType": "Apartment",
  "address": "123 Fifth Avenue",
  "city": "New York",
  "totalRooms": 3,
  "availableRooms": 3,
  "rentPerMonth": 3800.00,
  "facilities": ["WiFi", "Parking", "Gym", "Swimming Pool", "Concierge"]
}
```

### 2.8 Owner Update Different Owner's Property (Should Fail)
```bash
curl -X PUT http://localhost:8080/properties/owner/update/$PROPERTY_ID_3 \
  -H "Authorization: Bearer $OWNER_TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "rentPerMonth": 5000.00
  }'
```

**Expected Response** (Status: 500 - Error):
```json
{
  "message": "You don't have permission to update this property"
}
```

**✅ Should Reject**: owner_amol cannot update owner_john's property

### 2.9 Owner Delete Property
```bash
curl -X DELETE http://localhost:8080/properties/owner/delete/$PROPERTY_ID_2 \
  -H "Authorization: Bearer $OWNER_TOKEN_1"
```

**Expected Response** (Status: 200):
```json
{
  "message": "Property deleted successfully"
}
```

### 2.10 Verify Property is Deleted
```bash
curl -X GET http://localhost:8080/properties/owner/my \
  -H "Authorization: Bearer $OWNER_TOKEN_1"
```

**✅ Should Return**: 2 properties (Property #2 is deleted, only #1 and #4 remain)

---

## PHASE 3: TENANT ENDPOINTS TESTING

### 3.1 Tenant Browse All Properties
```bash
curl -X GET http://localhost:8080/properties/tenant/browse \
  -H "Authorization: Bearer $TENANT_TOKEN_1"
```

**Expected Response** (Status: 200):
```json
[
  {
    "propertyId": "507f1f77bcf86cd799439011",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Luxury Manhattan Apartment",
    "propertyType": "Apartment",
    "address": "123 Fifth Avenue",
    "city": "New York",
    "totalRooms": 3,
    "availableRooms": 3,
    "rentPerMonth": 3800.00,
    "facilities": ["WiFi", "Parking", "Gym", "Swimming Pool", "Concierge"]
  },
  {
    "propertyId": "507f1f77bcf86cd799439013",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Downtown Los Angeles Condo",
    "propertyType": "Condo",
    "address": "999 Sunset Boulevard",
    "city": "Los Angeles",
    "totalRooms": 2,
    "availableRooms": 2,
    "rentPerMonth": 2200.00,
    "facilities": ["WiFi", "Parking", "Gym"]
  },
  {
    "propertyId": "507f1f77bcf86cd799439014",
    "ownerId": 2,
    "ownerName": "owner_john",
    "propertyName": "Cozy Queens Villa",
    "propertyType": "Villa",
    "address": "789 Broadway",
    "city": "New York",
    "totalRooms": 5,
    "availableRooms": 5,
    "rentPerMonth": 4200.00,
    "facilities": ["WiFi", "Parking", "Garden", "Pool"]
  }
]
```

**✅ Should Return**: All available properties (3 total)

### 3.2 Tenant Search Properties by City - New York
```bash
curl -X GET "http://localhost:8080/properties/tenant/search?city=New%20York" \
  -H "Authorization: Bearer $TENANT_TOKEN_1"
```

**Expected Response** (Status: 200):
```json
[
  {
    "propertyId": "507f1f77bcf86cd799439011",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Luxury Manhattan Apartment",
    "propertyType": "Apartment",
    "address": "123 Fifth Avenue",
    "city": "New York",
    "totalRooms": 3,
    "availableRooms": 3,
    "rentPerMonth": 3800.00,
    "facilities": ["WiFi", "Parking", "Gym", "Swimming Pool", "Concierge"]
  },
  {
    "propertyId": "507f1f77bcf86cd799439014",
    "ownerId": 2,
    "ownerName": "owner_john",
    "propertyName": "Cozy Queens Villa",
    "propertyType": "Villa",
    "address": "789 Broadway",
    "city": "New York",
    "totalRooms": 5,
    "availableRooms": 5,
    "rentPerMonth": 4200.00,
    "facilities": ["WiFi", "Parking", "Garden", "Pool"]
  }
]
```

**✅ Should Return**: 2 properties in New York

### 3.3 Tenant Search Properties by City - Los Angeles
```bash
curl -X GET "http://localhost:8080/properties/tenant/search?city=Los%20Angeles" \
  -H "Authorization: Bearer $TENANT_TOKEN_1"
```

**Expected Response** (Status: 200):
```json
[
  {
    "propertyId": "507f1f77bcf86cd799439013",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Downtown Los Angeles Condo",
    "propertyType": "Condo",
    "address": "999 Sunset Boulevard",
    "city": "Los Angeles",
    "totalRooms": 2,
    "availableRooms": 2,
    "rentPerMonth": 2200.00,
    "facilities": ["WiFi", "Parking", "Gym"]
  }
]
```

**✅ Should Return**: 1 property in Los Angeles

### 3.4 Tenant View Property Details
```bash
curl -X GET http://localhost:8080/properties/tenant/details/$PROPERTY_ID_1 \
  -H "Authorization: Bearer $TENANT_TOKEN_1"
```

**Expected Response** (Status: 200):
```json
{
  "propertyId": "507f1f77bcf86cd799439011",
  "ownerId": 1,
  "ownerName": "owner_amol",
  "propertyName": "Luxury Manhattan Apartment",
  "propertyType": "Apartment",
  "address": "123 Fifth Avenue",
  "city": "New York",
  "totalRooms": 3,
  "availableRooms": 3,
  "rentPerMonth": 3800.00,
  "facilities": ["WiFi", "Parking", "Gym", "Swimming Pool", "Concierge"]
}
```

### 3.5 Second Tenant Browse Properties
```bash
curl -X GET http://localhost:8080/properties/tenant/browse \
  -H "Authorization: Bearer $TENANT_TOKEN_2"
```

**✅ Should Return**: Same 3 properties

---

## PHASE 4: PUBLIC ENDPOINTS TESTING

### 4.1 Public - Browse All Properties (No Auth)
```bash
curl -X GET http://localhost:8080/properties/all
```

**Expected Response** (Status: 200):
```json
[
  {
    "propertyId": "507f1f77bcf86cd799439011",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Luxury Manhattan Apartment",
    "propertyType": "Apartment",
    "address": "123 Fifth Avenue",
    "city": "New York",
    "totalRooms": 3,
    "availableRooms": 3,
    "rentPerMonth": 3800.00,
    "facilities": ["WiFi", "Parking", "Gym", "Swimming Pool", "Concierge"]
  },
  {
    "propertyId": "507f1f77bcf86cd799439013",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Downtown Los Angeles Condo",
    "propertyType": "Condo",
    "address": "999 Sunset Boulevard",
    "city": "Los Angeles",
    "totalRooms": 2,
    "availableRooms": 2,
    "rentPerMonth": 2200.00,
    "facilities": ["WiFi", "Parking", "Gym"]
  },
  {
    "propertyId": "507f1f77bcf86cd799439014",
    "ownerId": 2,
    "ownerName": "owner_john",
    "propertyName": "Cozy Queens Villa",
    "propertyType": "Villa",
    "address": "789 Broadway",
    "city": "New York",
    "totalRooms": 5,
    "availableRooms": 5,
    "rentPerMonth": 4200.00,
    "facilities": ["WiFi", "Parking", "Garden", "Pool"]
  }
]
```

**✅ Should Return**: All properties without authentication

---

## PHASE 5: ERROR & AUTHORIZATION TESTING

### 5.1 Tenant Try to Add Property (Should Fail)
```bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Authorization: Bearer $TENANT_TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyName": "My Property",
    "city": "NYC",
    "totalRooms": 2
  }'
```

**Expected Response** (Status: 403):
```json
{
  "message": "Only owners can add properties"
}
```

**✅ Correctly Rejects**: Tenant cannot add property

### 5.2 Tenant Try to Update Property (Should Fail)
```bash
curl -X PUT http://localhost:8080/properties/owner/update/$PROPERTY_ID_1 \
  -H "Authorization: Bearer $TENANT_TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "rentPerMonth": 5000.00
  }'
```

**Expected Response** (Status: 403):
```json
{
  "message": "Only owners can update properties"
}
```

**✅ Correctly Rejects**: Tenant cannot update property

### 5.3 Tenant Try to Delete Property (Should Fail)
```bash
curl -X DELETE http://localhost:8080/properties/owner/delete/$PROPERTY_ID_1 \
  -H "Authorization: Bearer $TENANT_TOKEN_1"
```

**Expected Response** (Status: 403):
```json
{
  "message": "Only owners can delete properties"
}
```

**✅ Correctly Rejects**: Tenant cannot delete property

### 5.4 Owner Try to View Tenant Endpoint (Should Fail)
```bash
curl -X GET http://localhost:8080/properties/tenant/browse \
  -H "Authorization: Bearer $OWNER_TOKEN_1"
```

**Expected Response** (Status: 403):
```json
{
  "message": "Only tenants can browse properties"
}
```

**✅ Correctly Rejects**: Owner cannot use tenant endpoints

### 5.5 Invalid Token
```bash
curl -X GET http://localhost:8080/properties/tenant/browse \
  -H "Authorization: Bearer invalid_token_xyz"
```

**Expected Response** (Status: 401):
```json
{
  "message": "Invalid or expired token"
}
```

### 5.6 Missing Authorization Header
```bash
curl -X GET http://localhost:8080/properties/owner/my
```

**Expected Response** (Status: 401):
```json
{
  "message": "Missing authorization header"
}
```

### 5.7 Owner Try to Delete Non-existent Property
```bash
curl -X DELETE http://localhost:8080/properties/owner/delete/999999999999 \
  -H "Authorization: Bearer $OWNER_TOKEN_1"
```

**Expected Response** (Status: 500):
```json
{
  "message": "Property not found with ID: 999999999999"
}
```

### 5.8 Invalid Property ID Format
```bash
curl -X GET http://localhost:8080/properties/tenant/details/invalid_id \
  -H "Authorization: Bearer $TENANT_TOKEN_1"
```

**Expected Response** (Status: 500):
```json
{
  "message": "Property not found with ID: invalid_id"
}
```

### 5.9 Missing Required Field in Add Property
```bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Authorization: Bearer $OWNER_TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyType": "Apartment",
    "city": "NYC"
  }'
```

**Expected Response** (Status: 400):
```json
{
  "message": "Property name is required"
}
```

### 5.10 Missing City Parameter in Search
```bash
curl -X GET "http://localhost:8080/properties/tenant/search" \
  -H "Authorization: Bearer $TENANT_TOKEN_1"
```

**Expected Response** (Status: 400):
```json
{
  "message": "City parameter is required"
}
```

---

## PHASE 6: DATABASE VERIFICATION

### Check MongoDB Collections
```bash
# Login to MongoDB
mongosh mongodb://localhost:27017

# Switch to database
use propertydb

# Count documents
db.properties.countDocuments()
# Should return: 3

# Find all properties
db.properties.find().pretty()

# Find properties by city
db.properties.find({"city": "New York"})

# Find properties by owner
db.properties.find({"ownerId": 1})

# Check indexes
db.properties.getIndexes()
```

---

## SUMMARY TABLE

| Feature | Owner | Tenant | Public |
|---------|-------|--------|--------|
| Browse All | ❌ | ✅ | ✅ |
| Search by City | ❌ | ✅ | ❌ |
| View Details | ❌ | ✅ | ❌ |
| Add Property | ✅ | ❌ | ❌ |
| View My Properties | ✅ | ❌ | ❌ |
| Update Property | ✅ | ❌ | ❌ |
| Delete Property | ✅ | ❌ | ❌ |
| Update Availability | Internal Only | - | - |

---

## EXPECTED FINAL STATE

After completing all tests:
- **Total Properties**: 3 (1 deleted)
- **Owner 1 Properties**: 2 (Manhattan Apt, LA Condo)
- **Owner 2 Properties**: 1 (Queens Villa)
- **Tenants**: 2 (Can see all properties)
- **Authorization**: Working correctly for all roles
- **Data Integrity**: No cross-owner access

