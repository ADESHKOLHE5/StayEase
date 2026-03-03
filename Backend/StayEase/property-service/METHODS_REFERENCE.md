# Property Service - Methods Reference Card

## PropertyService Methods

### 1. `saveProperty(Property property, Long ownerId, String ownerName)`
**Purpose**: Create/Save a new property  
**Used By**: POST `/properties/owner/add`  
**Parameters**:
- `property`: Property object with details
- `ownerId`: User ID from token
- `ownerName`: Username from token

**Sample Input**:
```json
{
  "propertyName": "Luxury Apartment",
  "propertyType": "Apartment",
  "address": "123 Main St",
  "city": "New York",
  "totalRooms": 3,
  "rentPerMonth": 3500.00,
  "facilities": ["WiFi", "Parking"]
}
```

**Sample Output**:
```json
{
  "propertyId": "507f1f77bcf86cd799439011",
  "ownerId": 1,
  "ownerName": "owner_amol",
  "propertyName": "Luxury Apartment",
  "propertyType": "Apartment",
  "address": "123 Main St",
  "city": "New York",
  "totalRooms": 3,
  "availableRooms": 3,
  "rentPerMonth": 3500.00,
  "facilities": ["WiFi", "Parking"]
}
```

**Validation**:
- ✅ Property name required
- ✅ Auto-sets availableRooms = totalRooms if not provided
- ✅ Sets ownerId from header
- ✅ Sets ownerName from header

---

### 2. `findAll()`
**Purpose**: Retrieve all properties  
**Used By**:
- GET `/properties/all` (Public)
- GET `/properties/tenant/browse` (Tenant)

**Parameters**: None

**Sample Output**:
```json
[
  {
    "propertyId": "507f1f77bcf86cd799439011",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Luxury Apartment",
    ...
  },
  {
    "propertyId": "507f1f77bcf86cd799439012",
    "ownerId": 2,
    "ownerName": "owner_john",
    "propertyName": "Villa",
    ...
  }
]
```

---

### 3. `findById(String propertyId)`
**Purpose**: Get a specific property by ID  
**Used By**: GET `/properties/tenant/details/{id}`  
**Parameters**:
- `propertyId`: Property's MongoDB ObjectId (24 character hex string)

**Sample Input**: `"507f1f77bcf86cd799439011"`

**Sample Output**:
```json
{
  "propertyId": "507f1f77bcf86cd799439011",
  "ownerId": 1,
  "ownerName": "owner_amol",
  "propertyName": "Luxury Apartment",
  "propertyType": "Apartment",
  "address": "123 Main St",
  "city": "New York",
  "totalRooms": 3,
  "availableRooms": 3,
  "rentPerMonth": 3500.00,
  "facilities": ["WiFi", "Parking"]
}
```

**Error**:
```json
{
  "message": "Property not found with ID: 507f1f77bcf86cd799439011"
}
```

---

### 4. `findByOwnerId(Long ownerId)`
**Purpose**: Get all properties owned by a specific user  
**Used By**: GET `/properties/owner/my`  
**Parameters**:
- `ownerId`: Owner's user ID (from X-User-Id header)

**Sample Input**: `1`

**Sample Output**:
```json
[
  {
    "propertyId": "507f1f77bcf86cd799439011",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Luxury Apartment",
    ...
  },
  {
    "propertyId": "507f1f77bcf86cd799439012",
    "ownerId": 1,
    "ownerName": "owner_amol",
    "propertyName": "Downtown Condo",
    ...
  }
]
```

---

### 5. `findByCity(String city)`
**Purpose**: Search properties by city name  
**Used By**: GET `/properties/tenant/search?city=NYC`  
**Parameters**:
- `city`: City name (case-insensitive)

**Sample Input**: `"New York"` or `"new york"` or `"NEW YORK"`

**Sample Output**:
```json
[
  {
    "propertyId": "507f1f77bcf86cd799439011",
    "propertyName": "Luxury Apartment",
    "city": "New York",
    ...
  },
  {
    "propertyId": "507f1f77bcf86cd799439014",
    "propertyName": "Queens Villa",
    "city": "New York",
    ...
  }
]
```

---

### 6. `updateProperty(String propertyId, Property propertyDetails, Long ownerId)`
**Purpose**: Update a property (with owner verification)  
**Used By**: PUT `/properties/owner/update/{id}`  
**Parameters**:
- `propertyId`: Property's MongoDB ID
- `propertyDetails`: Object with fields to update
- `ownerId`: Current user's ID (from header)

**Sample Input**:
```json
{
  "rentPerMonth": 4000.00,
  "facilities": ["WiFi", "Parking", "Gym", "Concierge"]
}
```

**Sample Output**:
```json
{
  "propertyId": "507f1f77bcf86cd799439011",
  "ownerId": 1,
  "ownerName": "owner_amol",
  "propertyName": "Luxury Apartment",
  "propertyType": "Apartment",
  "address": "123 Main St",
  "city": "New York",
  "totalRooms": 3,
  "availableRooms": 3,
  "rentPerMonth": 4000.00,
  "facilities": ["WiFi", "Parking", "Gym", "Concierge"]
}
```

**Updatable Fields**:
- propertyName
- address
- city
- propertyType
- rentPerMonth
- totalRooms
- facilities

**Non-updatable Fields** (system managed):
- propertyId
- ownerId
- ownerName
- availableRooms

**Errors**:
```json
{
  "message": "You don't have permission to update this property"
}
```

---

### 7. `deleteProperty(String propertyId, Long ownerId)`
**Purpose**: Delete a property (with owner verification)  
**Used By**: DELETE `/properties/owner/delete/{id}`  
**Parameters**:
- `propertyId`: Property's MongoDB ID
- `ownerId`: Current user's ID (from header)

**Sample Input**: 
- propertyId: `"507f1f77bcf86cd799439011"`
- ownerId: `1`

**Sample Output**:
```json
{
  "message": "Property deleted successfully"
}
```

**Validation**:
- ✅ Owner must own the property
- ✅ Removes from MongoDB completely
- ✅ Cascade delete (handles dependencies)

**Errors**:
```json
{
  "message": "You don't have permission to delete this property"
}
```

---

### 8. `updateAvailability(String propertyId, int change)`
**Purpose**: Update available rooms (for bookings)  
**Used By**: PUT `/properties/internal/reduce-room/{id}` (Internal only)  
**Parameters**:
- `propertyId`: Property ID
- `change`: Number to add/subtract (-1 for booking)

**Sample Input**:
- propertyId: `"507f1f77bcf86cd799439011"`
- change: `-1`

**Sample Output**: No response body (void method)

**Side Effects**:
- Decrements availableRooms by 1
- Validates no negative availability

**Errors**:
```json
{
  "message": "No rooms available for this property!"
}
```

---

## PropertyRepository Methods

### MongoDB Query Methods

#### 1. `findByCity(String city)`
```java
List<Property> findByCity(String city);
```
- **Case Sensitive**: Exact match
- **Returns**: All properties matching city
- **Example**: `findByCity("New York")` - ✅ Matches, `findByCity("new york")` - ❌ No match

#### 2. `findByCityIgnoreCase(String city)`
```java
List<Property> findByCityIgnoreCase(String city);
```
- **Case Insensitive**: Ignores case
- **Returns**: All properties matching city (any case)
- **Example**: `findByCityIgnoreCase("new york")` - ✅ Matches "New York"

#### 3. `findByOwnerId(Long ownerId)`
```java
List<Property> findByOwnerId(Long ownerId);
```
- **Returns**: All properties owned by user
- **Example**: `findByOwnerId(1)` - Returns all properties where ownerId = 1

#### 4. `findById(String id)` (Inherited)
```java
Optional<Property> findById(String id);
```
- **Returns**: Single property or empty
- **Example**: `findById("507f...")` - Returns property or empty

#### 5. `findAll()` (Inherited)
```java
List<Property> findAll();
```
- **Returns**: All properties in database
- **Usage**: No parameters

#### 6. `save(Property p)` (Inherited)
```java
Property save(Property p);
```
- **Creates or Updates** property
- **Returns**: Saved property with ID

#### 7. `deleteById(String id)` (Inherited)
```java
void deleteById(String id);
```
- **Deletes** property by ID
- **No Return**: Void

---

## Quick Test Commands

### Test Add Property
```bash
curl -X POST http://localhost:8080/properties/owner/add \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyName": "Test Apt",
    "city": "NYC",
    "totalRooms": 2,
    "rentPerMonth": 2500
  }'
```

### Test Find By City
```bash
curl -X GET "http://localhost:8080/properties/tenant/search?city=NYC" \
  -H "Authorization: Bearer TOKEN"
```

### Test Update
```bash
curl -X PUT http://localhost:8080/properties/owner/update/PROPERTY_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rentPerMonth": 3000}'
```

### Test Delete
```bash
curl -X DELETE http://localhost:8080/properties/owner/delete/PROPERTY_ID \
  -H "Authorization: Bearer TOKEN"
```

### Test View My Properties
```bash
curl -X GET http://localhost:8080/properties/owner/my \
  -H "Authorization: Bearer TOKEN"
```

---

## MongoDB Data Structure

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "propertyId": "507f1f77bcf86cd799439011",
  "ownerId": 1,
  "ownerName": "owner_amol",
  "propertyName": "Luxury Apartment",
  "propertyType": "Apartment",
  "address": "123 Main St",
  "city": "New York",
  "totalRooms": 3,
  "availableRooms": 3,
  "rentPerMonth": 3500.00,
  "facilities": ["WiFi", "Parking", "Gym"],
  "_class": "com.property.property_service.entity.Property"
}
```

