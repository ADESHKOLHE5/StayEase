# StayEase — Architecture Overview

## 1. High-level Architecture

StayEase uses a microservice architecture with the following services:
- API Gateway
- Auth Service (MySQL)
- Property Service (MongoDB)
- Booking Service (MySQL)
- AI Service (Recommendation Engine)

Two primary roles:
- Tenant / User
- Property Owner

## 2. Components & Responsibilities

- API Gateway: routes requests, enforces JWT validation for protected routes, forwards to services.
- Auth Service: user registration, login, password encoding, JWT generation. Uses MySQL.
- Property Service: property CRUD, image URL storage, calls AI Service for summaries/recommendations. Uses MongoDB for flexible property documents.
- Booking Service: room & booking management, booking lifecycle (PENDING → APPROVED / REJECTED). Uses MySQL.
- AI Service: generates `aiSummary` and recommendation scores based on property data.

## 3. Datastore Schemas

**Auth (MySQL) — USER table**
- userId (PK)
- email
- password (bcrypt/argon2)
- name
- phone
- role (USER / OWNER / MANAGER)
- createdAt, updatedAt

**Property (MongoDB) — PROPERTY document sample**
{
  "propertyId": 101,
  "ownerId": 5,
  "propertyName": "StayEase PG",
  "propertyType": "PG",
  "location": "Pune",
  "city": "Pune",
  "state": "Maharashtra",
  "totalRooms": 10,
  "availableRooms": 3,
  "rentPerMonth": 8000,
  "facilities": ["WiFi", "AC", "Parking"],
  "images": ["/uploads/img1.jpg","/uploads/img2.jpg"],
  "description": "Comfortable stay",
  "aiSummary": "Best for IT professionals"
}

**Rooms (Booking DB — MySQL) — ROOM table**
- roomId (PK)
- propertyId (FK)
- roomNumber
- capacity
- isAvailable (boolean)
- rent

**Booking (Booking DB — MySQL) — BOOKING table**
- bookingId (PK)
- propertyId (FK)
- tenantId (FK)
- ownerId (FK)
- roomId (FK)
- status (PENDING / APPROVED / REJECTED)
- requestDate
- approvalDate
- moveInDate
- rentAmount
- createdAt, updatedAt

## 4. Flows (Step-by-step)

**Authentication Flow**
1. Client → API Gateway: POST /auth/register or /auth/login
2. API Gateway → Auth Service
3. Auth Service encodes password, stores/validates user in MySQL, issues JWT
4. Client stores JWT and uses it in `Authorization: Bearer <token>` for future requests

**Property Management Flow**
1. Owner (authenticated) → API Gateway → Property Service
2. Upload images to file store (local or cloud). Only URLs saved in MongoDB `images[]`.
3. Property Service stores document (includes flexible `facilities[]` and `aiSummary`).
4. On create/update, Property Service may call AI Service for `aiSummary` and recommendation data.

**Booking Flow**
1. Tenant (authenticated) views property via Property Service endpoints.
2. Tenant selects room and submits booking request to Booking Service via API Gateway.
3. Booking Service validates property/room (calls Property Service via Feign/HTTP).
4. Booking created with status = PENDING in Booking DB.
5. Owner reviews request; approves or rejects. Booking status updated accordingly.

**AI Service Interaction**
- Property Service calls AI Service with property metadata and images (or image URLs) to receive:
  - `aiSummary` (short description)
  - `recommendationScore` and textual recommendation
- AI Service returns structured results; Property Service stores `aiSummary` in MongoDB.

## 5. Routing Diagram (text)
Client
  ↓
API Gateway
  ↓
  ├─ Auth Service (MySQL)
  ├─ Property Service (MongoDB) → AI Service
  └─ Booking Service (MySQL) → (validates via Property Service)

## 6. Security 
- JWT-based authentication for all protected endpoints.
- Role-based authorization: `role` field in USER determines access (OWNER endpoints vs USER endpoints).
- Services validate JWTs at the Gateway or within service depending on trust model.

## 7. Storage Notes
- Images: store in a dedicated uploads folder or cloud (S3/GCS/Azure Blob). Only store URLs in MongoDB.

## 8. Deployment & Integration Notes
- Property Service uses MongoDB for flexible documents (arrays, nested data).
- Auth & Booking use MySQL for relational integrity (FKs between users, bookings, rooms).
- Use Feign or HTTP client with retries & timeouts for inter-service calls (e.g., Booking → Property).

## 9. Next Steps (suggested)
- Add API endpoint list (contract) for each service (paths, payloads, auth requirements).
- Create sequence diagrams for Auth, Property, and Booking flows.
- Add example Postman collection or OpenAPI specs.

---
Generated for the StayEase repo to centralize architecture and flows.
