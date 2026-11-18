# ✅ Complete Testing Checklist

## Phase 1: Setup & Authentication ✓
- [ ] Start MongoDB: `mongosh mongodb://localhost:27017`
- [ ] Start Auth Service (8081)
- [ ] Start Property Service (8082)
- [ ] Start API Gateway (8080)

## Phase 2: User Registration ✓
- [ ] Register Owner #1 (owner_amol)
- [ ] Register Owner #2 (owner_john)
- [ ] Register Tenant #1 (tenant_sarah)
- [ ] Register Tenant #2 (tenant_mike)

## Phase 3: User Login ✓
- [ ] Login Owner #1 → Save `$OWNER_TOKEN_1`
- [ ] Login Owner #2 → Save `$OWNER_TOKEN_2`
- [ ] Login Tenant #1 → Save `$TENANT_TOKEN_1`
- [ ] Login Tenant #2 → Save `$TENANT_TOKEN_2`

## Phase 4: Owner Functions ✓

### Add Properties
- [ ] Owner #1 Add Property (Manhattan) → Save `$PROPERTY_ID_1`
- [ ] Owner #1 Add Property (Brooklyn) → Save `$PROPERTY_ID_2`
- [ ] Owner #1 Add Property (LA Condo) → Save `$PROPERTY_ID_4`
- [ ] Owner #2 Add Property (Queens Villa) → Save `$PROPERTY_ID_3`

**Expected**: 4 properties in database

### View My Properties
- [ ] Owner #1 View My → Should see 3 properties
- [ ] Owner #2 View My → Should see 1 property

### Update Property
- [ ] Owner #1 Update Property #1 (rent change) → Should succeed
- [ ] Owner #1 Try Update Property #3 (other owner) → Should FAIL with 403
- [ ] Verify update applied correctly

### Delete Property
- [ ] Owner #1 Delete Property #2 → Should succeed
- [ ] Owner #1 View My → Should see 2 properties (Brooklyn deleted)
- [ ] Verify only 3 properties remain in database

## Phase 5: Tenant Functions ✓

### Browse Properties
- [ ] Tenant #1 Browse → Should see 3 properties
- [ ] Tenant #2 Browse → Should see 3 properties
- [ ] Verify both tenants see same properties

### Search by City
- [ ] Tenant Search "New York" → Should see 2 properties
- [ ] Tenant Search "Los Angeles" → Should see 1 property
- [ ] Tenant Search "Chicago" → Should see 0 properties

### View Details
- [ ] Tenant View Details Property #1 → Should succeed
- [ ] Tenant View Details Property #3 → Should succeed
- [ ] Tenant View Details Invalid ID → Should FAIL

## Phase 6: Public Functions ✓
- [ ] Browse All (No Auth) → Should see 3 properties
- [ ] Verify no token needed

## Phase 7: Authorization Testing ✓

### Role Violations
- [ ] Tenant Try Add Property → Should FAIL (403)
- [ ] Tenant Try Update Property → Should FAIL (403)
- [ ] Tenant Try Delete Property → Should FAIL (403)
- [ ] Owner Try Browse → Should FAIL (403)
- [ ] Owner Try Search → Should FAIL (403)

### Token Validation
- [ ] Invalid Token → Should FAIL (401)
- [ ] Expired Token → Should FAIL (401)
- [ ] Missing Header → Should FAIL (401)
- [ ] No Token on Protected → Should FAIL (401)

### Permission Checks
- [ ] Owner #1 Delete Owner #2 Property → Should FAIL (500)
- [ ] Owner #1 Update Owner #2 Property → Should FAIL (500)

### Data Validation
- [ ] Add without property name → Should FAIL (400)
- [ ] Search without city → Should FAIL (400)
- [ ] Invalid property ID → Should FAIL (500)
- [ ] Non-existent property ID → Should FAIL (500)

## Phase 8: Database Verification ✓

### MongoDB Checks
- [ ] Count documents: `db.properties.countDocuments()` → Should = 3
- [ ] Find by city: `db.properties.find({"city": "New York"})` → Should = 2
- [ ] Find by owner: `db.properties.find({"ownerId": 1})` → Should = 2
- [ ] Check deleted property gone → Should not exist
- [ ] Verify data integrity → All fields correct

## Phase 9: API Gateway Integration ✓
- [ ] Token validation at gateway → JWT verified
- [ ] Header forwarding → X-User-Role set correctly
- [ ] Role checking works → Property service reads headers
- [ ] Multi-service routing → All routes work through gateway

## Final Validation ✓

### Method Count
- [ ] Total Methods Implemented: 8
  - ✅ saveProperty
  - ✅ findAll
  - ✅ findById
  - ✅ findByOwnerId
  - ✅ findByCity
  - ✅ updateProperty
  - ✅ deleteProperty
  - ✅ updateAvailability

### Endpoint Count
- [ ] Total Endpoints: 11
  - ✅ POST /properties/owner/add
  - ✅ GET /properties/owner/my
  - ✅ PUT /properties/owner/update/{id}
  - ✅ DELETE /properties/owner/delete/{id}
  - ✅ GET /properties/tenant/browse
  - ✅ GET /properties/tenant/search
  - ✅ GET /properties/tenant/details/{id}
  - ✅ GET /properties/all
  - ✅ PUT /properties/internal/reduce-room/{id}

### Security Features
- [ ] JWT validation ✅
- [ ] Role-based access ✅
- [ ] Owner permission verification ✅
- [ ] Input validation ✅
- [ ] Error handling ✅

---

## Quick Reference Tokens

```bash
# After login, save these
export OWNER_TOKEN_1="eyJhbGc..."
export OWNER_TOKEN_2="eyJhbGc..."
export TENANT_TOKEN_1="eyJhbGc..."
export TENANT_TOKEN_2="eyJhbGc..."

# Property IDs from creation
export PROPERTY_ID_1="507f1f77bcf86cd799439011"
export PROPERTY_ID_2="507f1f77bcf86cd799439012"
export PROPERTY_ID_3="507f1f77bcf86cd799439014"
export PROPERTY_ID_4="507f1f77bcf86cd799439013"
```

---

## Common Issues & Solutions

### Issue: 403 Forbidden on Owner Endpoint
**Solution**: Make sure using OWNER token, not TENANT token

### Issue: Property Not Found
**Solution**: Verify property ID is correct 24-char hex string

### Issue: "You don't have permission"
**Solution**: Owner is trying to update/delete another owner's property

### Issue: "Only owners can..."
**Solution**: Tenant trying to use owner endpoint

### Issue: "Only tenants can..."
**Solution**: Owner trying to use tenant endpoint

### Issue: Gateway 504
**Solution**: Check if property service is running on 8082

### Issue: MongoDB Connection Error
**Solution**: Verify MongoDB running on 27017

### Issue: JWT Expired
**Solution**: Re-login to get new token

---

## Performance Notes

- **Property Search**: O(n) - scans all properties
- **Owner Properties**: O(n) - MongoDB index on ownerId helps
- **City Search**: Indexed, fast lookup
- **Add Property**: O(1) - direct insert
- **Delete Property**: O(1) - direct delete

---

## Security Notes

✅ **Implemented**:
- JWT validation at API Gateway
- Role-based access control (RBAC)
- Owner verification on updates/deletes
- Input validation on all endpoints
- Secure password hashing (BCrypt)
- HTTP status codes for errors

⚠️ **Future Enhancements**:
- Rate limiting
- SQL injection prevention (MongoDB safe by default)
- CORS configuration
- API key rotation
- Audit logging
- Request/response encryption

