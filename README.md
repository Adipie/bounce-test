# 🏥 Operating Room Scheduler - Express TypeScript Base

A well-structured Express.js server with TypeScript following SOLID principles and best practices, designed for managing surgical scheduling in a hospital environment.

## 🚀 Features

- **TypeScript** - Full type safety and modern JavaScript features
- **SOLID Principles** - Clean architecture with proper separation of concerns
- **Express.js Best Practices** - Proper middleware order, error handling, and route organization
- **Zod Validation** - Runtime type validation for request/response data
- **Security** - Helmet.js for security headers, CORS configuration
- **Logging** - Morgan for HTTP request logging with custom tokens
- **Error Handling** - Centralized error handling with proper HTTP status codes
- **Environment Configuration** - Type-safe environment variable management
- **Testing Ready** - Jest configuration for unit and integration tests

## 📋 Project Overview

This is an **Operating Room Scheduler** for a hospital system that manages surgical scheduling for different types of doctors (Heart Surgeons and Brain Surgeons) across 5 operating rooms with various equipment configurations.

### Business Rules

- **Working Hours**: 10:00-18:00, Monday to Friday
- **Scheduling Window**: Maximum 1 week ahead
- **Queue System**: When no slots available in the next week
- **Concurrent Access**: Multiple doctors can request simultaneously

### Operating Rooms (5 total)
1. **OR 1**: MRI + CT + ECG (3 machines)
2. **OR 2**: CT + MRI (2 machines)
3. **OR 3**: CT + MRI (2 machines)
4. **OR 4**: MRI + ECG (2 machines)
5. **OR 5**: MRI + ECG (2 machines)

### Surgery Types
- **Heart Surgery**: 3 hours, requires ECG machine
- **Brain Surgery**: 2 hours with CT, 3 hours without CT, requires MRI machine

## 📁 Project Structure

```
src/
├── config/
│   ├── environment.ts          # Environment configuration with Zod validation
│   └── surgery-config.ts       # Surgery requirements & OR configurations
├── controllers/
│   └── health-controller.ts    # Health check controller
├── middleware/
│   ├── error-handler.ts        # Centralized error handling
│   └── request-logger.ts       # Request logging and timing
├── routes/
│   └── health-routes.ts        # Health check routes
├── services/
│   └── health-service.ts       # Health check business logic
├── types/
│   ├── index.ts               # Common TypeScript type definitions
│   └── surgery.ts             # Surgery-specific types and interfaces
├── validation/
│   └── surgery-schemas.ts     # Zod validation schemas
├── __tests__/
│   ├── setup.ts               # Jest test configuration
│   └── surgery-types.test.ts  # Surgery types and configuration tests
├── app.ts                     # Express application setup
└── index.ts                   # Application entry point
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-typescript-base
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 📡 Current API Endpoints

### Health Check
- **GET** `/api/v1/health`
  - Returns application health status
  - Response includes uptime, environment, and version

### Root
- **GET** `/`
  - Welcome message with API information

## 🔧 Configuration

The application uses environment variables for configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port number |
| `NODE_ENV` | `development` | Environment (development/production/test) |
| `API_PREFIX` | `/api/v1` | API route prefix |

## 🏗️ Architecture

### SOLID Principles Implementation

1. **Single Responsibility Principle (SRP)**
   - Each class has a single responsibility
   - Controllers handle HTTP requests
   - Services contain business logic
   - Middleware handles cross-cutting concerns

2. **Open/Closed Principle (OCP)**
   - Interfaces allow for extension without modification
   - New services can be added by implementing interfaces

3. **Liskov Substitution Principle (LSP)**
   - Services can be substituted with different implementations
   - Controllers depend on interfaces, not concrete classes

4. **Interface Segregation Principle (ISP)**
   - Small, focused interfaces
   - Controllers and services have specific interfaces

5. **Dependency Inversion Principle (DIP)**
   - High-level modules depend on abstractions
   - Dependencies are injected through constructors

### Design Patterns

- **Dependency Injection** - Services are injected into controllers
- **Factory Pattern** - Route creation uses factory functions
- **Singleton Pattern** - Environment configuration uses singleton
- **Middleware Pattern** - Express middleware for cross-cutting concerns

## 🧪 Testing

The project includes comprehensive tests with Jest:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

Current test coverage includes:
- ✅ Surgery types and requirements validation
- ✅ Operating room configurations
- ✅ Equipment compatibility logic
- ✅ Surgery duration calculations

## 📝 Next Steps - Implementation Tasks

### Phase 2: Basic Services
1. **Create `HospitalService`**
   - Manage operating rooms
   - Check OR availability
   - Get OR status

2. **Create `SurgeryService`**
   - Validate surgery requirements
   - Calculate surgery duration
   - Check equipment compatibility

3. **Create `DoctorService`**
   - Manage doctor data
   - Validate doctor types vs surgery types

### Phase 3: First API Endpoint
1. **Create `GET /api/v1/operating-rooms`**
   - Return current OR status
   - Show equipment and availability

### Phase 4: Core Scheduling Logic
1. **Create `SchedulerService`**
   - Implement optimistic locking
   - Find available slots
   - Handle concurrent requests

### Phase 5: Scheduling Endpoint
1. **Create `POST /api/v1/schedule/request`**
   - Handle scheduling requests
   - Return slot conflicts with next available time
   - Add to queue when needed

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing configuration
- **Request Validation** - Zod schema validation
- **Error Handling** - No sensitive information in error responses

## 📊 Monitoring

- **Request Logging** - Morgan HTTP request logging
- **Response Time** - Custom timing middleware
- **Health Checks** - Application health monitoring
- **Error Tracking** - Centralized error handling

## 🎯 Key Files to Understand

### Data Structures (`src/types/surgery.ts`)
```typescript
enum SurgeryType {
  HEART_SURGERY = 'HEART_SURGERY',
  BRAIN_SURGERY = 'BRAIN_SURGERY'
}

enum Equipment {
  MRI = 'MRI',
  CT = 'CT',
  ECG = 'ECG'
}
```

### Configuration (`src/config/surgery-config.ts`)
```typescript
// Surgery requirements mapping
export const SURGERY_REQUIREMENTS: Record<SurgeryType, SurgeryRequirements>

// Initial OR configurations
export const INITIAL_OPERATING_ROOMS: OperatingRoom[]

// Helper functions
export const getSurgeryDuration()
export const hasRequiredEquipment()
```

### Validation (`src/validation/surgery-schemas.ts`)
```typescript
// Zod schemas for API validation
export const scheduleRequestSchema = z.object({
  doctorId: z.string().min(1),
  surgeryType: surgeryTypeSchema
})
```

## 🚀 Getting Started Commands

```bash
# Development
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start           # Start production server
npm test            # Run tests
npm run lint        # Check code quality
```

## 🎯 Success Criteria

Your implementation should:
- ✅ Handle concurrent scheduling requests
- ✅ Find available slots within working hours
- ✅ Match surgery types to OR equipment
- ✅ Queue requests when no slots available
- ✅ Return proper error responses
- ✅ Pass all tests
- ✅ Follow clean code principles

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation as needed
4. Ensure all linting checks pass

## 📄 License

MIT License - see LICENSE file for details

---

**Ready to start? The foundation is solid with 16 passing tests. Begin with Phase 2 and create your first service! 🚀** 