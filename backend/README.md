# EventHub Backend - Microservices Architecture

This directory contains the source code for the Faculty Service and updated logic for the Event Service.

## Architecture Overview

1. **Student Service (Port 8081)**: Manages student registration and authentication.
2. **Event Service (Port 8082)**: Core logic for event storage and participation tracking.
3. **Faculty Service (Port 8083)**: New service for faculty management and event oversight.
4. **Registration Service (Port 8084)**: Handles detailed event registration flow.

## Running the Services

### Prerequisites
- Java 17+
- Maven 3.8+

### Step-by-Step Instructions

1. **Start Student Service**:
   ```bash
   cd student-service
   mvn spring-boot:run
   ```

2. **Start Event Service**:
   ```bash
   cd event-service
   mvn spring-boot:run
   ```

3. **Start Faculty Service**:
   ```bash
   cd faculty-service
   mvn spring-boot:run
   ```

4. **Start Registration Service**:
   ```bash
   cd registration-service
   mvn spring-boot:run
   ```

## API Endpoints (Registration Service)

- `POST /api/registrations/register`: Submit a detailed registration.
- `GET /api/registrations/student/{studentId}`: Get all registrations for a student.
- `GET /api/registrations/event/{eventId}`: Get all registrations for an event (Faculty only).
- `PUT /api/registrations/{id}/approve`: Approve a registration.
- `PUT /api/registrations/{id}/reject`: Reject a registration.

## Database
All services use **H2 In-Memory Database** for development. You can access the console at `/h2-console` on each service's port.
