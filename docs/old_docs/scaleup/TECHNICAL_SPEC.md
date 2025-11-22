# Wabi Care: Technical Specification

**Version**: 1.0  
**Date**: October 16, 2025  
**Owner**: Engineering Team  
**Status**: Draft

---

## Purpose

This document describes **how Wabi Care is built** from a technical perspective. It covers system architecture, microservices design, database schemas, API specifications, infrastructure, and deployment strategies.

**Audience**: Software engineers, DevOps engineers, technical architects, security engineers

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Microservices Design](#microservices-design)
4. [Database Design](#database-design)
5. [API Specifications](#api-specifications)
6. [Infrastructure & Deployment](#infrastructure--deployment)
7. [Security & Compliance](#security--compliance)
8. [Performance & Scalability](#performance--scalability)
9. [Monitoring & Observability](#monitoring--observability)
10. [Development Workflow](#development-workflow)

---

## System Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Client Applications                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mobile    │  │   Desktop   │  │   Admin     │         │
│  │   (PWA)     │  │   (PWA)     │  │   Portal    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└──────────────────────────────────────────────────────────────┘
                     │
                     ▼ HTTPS (TLS 1.3)
┌──────────────────────────────────────────────────────────────┐
│                 Azure Static Web Apps                         │
│                 (CDN + Global Distribution)                   │
└──────────────────────────────────────────────────────────────┘
                     │
                     ▼ API Calls
┌──────────────────────────────────────────────────────────────┐
│            Azure API Management (API Gateway)                 │
│  - Authentication (Azure AD B2C)                             │
│  - Rate Limiting & Throttling                                │
│  - API Versioning (/v1, /v2)                                 │
└──────────────────────────────────────────────────────────────┘
                     │
                     ▼ Routes to Microservices
┌──────────────────────────────────────────────────────────────┐
│           Microservices (Azure Container Apps)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Auth    │ │ Patient  │ │  Goal    │ │  Data    │      │
│  │ Service  │ │ Service  │ │ Service  │ │Collection│      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Schedule  │ │ Billing  │ │Analytics │ │   AI     │      │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└──────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Cosmos DB   │  │  Azure SQL  │  │  Synapse    │  │   Azure     │
│ (NoSQL)     │  │  (RDBMS)    │  │  (Data WH)  │  │ AI Foundry  │
│             │  │             │  │             │  │             │
│ - Patients  │  │ - Users     │  │ - Analytics │  │ - GPT-4     │
│ - Goals     │  │ - Billing   │  │ - Reports   │  │ - ML Models │
│ - Sessions  │  │ - Schedules │  │             │  │ - Prompts   │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

### Architecture Principles

1. **Microservices**: Independent, loosely coupled services
2. **API-First**: All services expose REST APIs
3. **Event-Driven**: Asynchronous communication via Azure Service Bus
4. **Stateless Services**: No session state stored in services
5. **Database-per-Service**: Each service owns its data
6. **Cloud-Native**: Leverage Azure PaaS services (no VM management)
7. **Security by Default**: Zero trust, encryption everywhere

---

## Technology Stack

### Frontend Stack

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Framework** | Next.js | 14.x | Server components, edge rendering, SEO |
| **UI Library** | React | 18.x | Industry standard, large ecosystem |
| **Language** | TypeScript | 5.x | Type safety, better DX |
| **Styling** | Tailwind CSS | 3.x | Utility-first, small bundle size |
| **Components** | Shadcn UI | Latest | Accessible, customizable, no runtime JS |
| **State Management** | Zustand / React Context | Latest | Simple, performant |
| **Forms** | React Hook Form + Zod | Latest | Type-safe validation |
| **Charts** | Recharts | Latest | React-native, responsive |
| **Offline Storage** | IndexedDB (Dexie.js) | Latest | PWA offline support |
| **Real-time** | SignalR Client | Latest | Azure SignalR integration |

**Build Tools:**
- **Package Manager**: npm 10.x
- **Bundler**: Webpack (via Next.js)
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library

---

### Backend Stack

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Primary Runtime** | Node.js | 20 LTS | TypeScript support, async I/O |
| **Framework** | Express.js | 4.x | Lightweight, flexible middleware |
| **Language** | TypeScript | 5.x | Type safety, maintainability |
| **AI/ML Runtime** | Python | 3.11+ | Better for data science, ML libraries |
| **AI/ML Framework** | FastAPI | Latest | Modern, async, auto-docs |
| **API Gateway** | Azure API Management | Managed | Enterprise-grade, built-in policies |
| **Container Runtime** | Docker | Latest | Standardized packaging |
| **Orchestration** | Azure Container Apps | Managed | Serverless Kubernetes |

**Libraries:**
- **HTTP Client**: Axios
- **Validation**: Joi / Zod
- **ORM (SQL)**: Prisma
- **NoSQL Client**: @azure/cosmos
- **Authentication**: @azure/msal-node
- **Logging**: Winston
- **Testing**: Jest + Supertest

---

### Database Stack

| Database | Use Case | Justification |
|----------|----------|---------------|
| **Azure Cosmos DB** | Clinical data (patients, goals, sessions) | Global distribution, offline sync, flexible schema, low latency |
| **Azure SQL Database** | Transactional data (billing, scheduling, users) | ACID compliance, complex queries, mature tooling |
| **Azure Synapse Analytics** | Data warehouse (analytics, reporting) | Columnar storage, fast aggregations, Power BI integration |
| **Azure Blob Storage** | Documents, images, recordings | Cost-effective, durable, integrated with Azure services |
| **Azure AI Search** | Vector search, semantic search | AI-powered search, RAG for chatbot |
| **Azure Cache for Redis** | Session cache, rate limiting | In-memory speed, pub/sub for real-time |

---

### AI/ML Stack

| Service | Use Case | Justification |
|---------|----------|---------------|
| **Azure AI Foundry** | AI orchestration, prompt management | Central hub for all AI operations, low-code |
| **Azure OpenAI Service** | GPT-4 (notes), GPT-3.5 (chat), Embeddings | Enterprise SLA, private endpoint, compliance |
| **Azure Cognitive Services** | Speech-to-Text (Whisper), Language, Vision | Managed services, no infrastructure |
| **Azure Machine Learning** | Custom ML models (predictions, risk scoring) | Model training, MLOps, experiment tracking |
| **LangChain / Semantic Kernel** | RAG pipelines, agent workflows | Open-source, flexible orchestration |

---

### Infrastructure & DevOps Stack

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Hosting** | Azure Container Apps | Serverless, auto-scaling, cost-effective |
| **Frontend Hosting** | Azure Static Web Apps | Global CDN, built-in auth, custom domains |
| **CI/CD** | GitHub Actions | Native GitHub integration, matrix builds |
| **Container Registry** | Azure Container Registry | Private registry, vulnerability scanning |
| **Secrets Management** | Azure Key Vault | Centralized secrets, automatic rotation |
| **Monitoring** | Azure Monitor + Application Insights | Distributed tracing, logs, metrics |
| **Logging** | Azure Log Analytics | Kusto queries, log aggregation |
| **Alerting** | Azure Monitor Alerts | Proactive notifications |
| **IaC** | Terraform / Bicep | Infrastructure as code, version control |

---

## Microservices Design

### Service Overview

| Service | Tech Stack | Database | Priority |
|---------|-----------|----------|----------|
| **API Gateway** | Azure API Management | None (stateless) | P0 |
| **Auth Service** | Node.js + Express | Azure SQL | P0 |
| **Patient Service** | Node.js + Express | Cosmos DB | P0 |
| **Goal Service** | Node.js + Express | Cosmos DB | P0 |
| **Data Collection Service** | Node.js + Express | Cosmos DB + Redis | P0 |
| **Scheduling Service** | Node.js + Express | Azure SQL | P1 |
| **Billing Service** | Node.js + Express | Azure SQL | P1 |
| **Notification Service** | Node.js + Express | Azure SQL | P1 |
| **Analytics Service** | Node.js + Express | Synapse Analytics | P2 |
| **AI Service** | Python + FastAPI | Azure AI Foundry | P2 |

---

### 1. API Gateway Service

**Purpose**: Central entry point for all client requests

**Tech Stack:**
- Azure API Management (PaaS)
- OAuth 2.0 / Azure AD B2C

**Configuration:**
```xml
<!-- Rate Limiting Policy -->
<rate-limit calls="100" renewal-period="60" />

<!-- JWT Validation -->
<validate-jwt header-name="Authorization" failed-validation-httpcode="401">
  <openid-config url="https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration" />
  <audiences>
    <audience>api://wabicare</audience>
  </audiences>
</validate-jwt>

<!-- CORS Policy -->
<cors allow-credentials="true">
  <allowed-origins>
    <origin>https://app.wabicare.com</origin>
  </allowed-origins>
  <allowed-methods>
    <method>GET</method>
    <method>POST</method>
    <method>PUT</method>
    <method>DELETE</method>
  </allowed-methods>
</cors>
```

**Routing:**
```
/v1/auth/*       → Auth Service
/v1/patients/*   → Patient Service
/v1/goals/*      → Goal Service
/v1/sessions/*   → Data Collection Service
/v1/schedules/*  → Scheduling Service
/v1/billing/*    → Billing Service
/v1/ai/*         → AI Service
```

---

### 2. Authentication Service

**Purpose**: User authentication, authorization, session management

**Tech Stack:**
- Node.js + Express + TypeScript
- Azure AD B2C (managed auth)
- JWT tokens
- bcrypt (for custom passwords if needed)

**Database Schema (Azure SQL):**
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  azure_ad_oid VARCHAR(36), -- Azure AD Object ID
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'bcba', 'rbt', 'biller', 'parent')),
  practice_id VARCHAR(36) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_active BIT DEFAULT 1,
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  last_login DATETIME2,
  INDEX idx_practice_id (practice_id),
  INDEX idx_email (email)
);

CREATE TABLE roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  permissions NVARCHAR(MAX), -- JSON array of permissions
  created_at DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE user_sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expires_at DATETIME2 NOT NULL,
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);
```

**API Endpoints:**
```typescript
// POST /auth/login
interface LoginRequest {
  email: string;
  password?: string; // Only if not using SSO
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

// POST /auth/refresh
interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

// POST /auth/logout
interface LogoutRequest {
  refreshToken: string;
}

// GET /auth/me
interface MeResponse {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  practice: {
    id: string;
    name: string;
  };
}
```

**JWT Payload:**
```typescript
interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: string;
  practiceId: string;
  iss: 'https://api.wabicare.com';
  aud: 'api://wabicare';
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}
```

**Security Considerations:**
- Tokens expire after 1 hour (access token) and 30 days (refresh token)
- Refresh token rotation (new refresh token on each refresh)
- Token revocation on logout (blacklist in Redis)
- MFA required for admin and BCBA roles (via Azure AD)

---

### 3. Patient Management Service

**Purpose**: Patient CRUD, demographics, enrollment

**Tech Stack:**
- Node.js + Express + TypeScript
- Azure Cosmos DB (partition key: `practiceId`)

**Document Schema (Cosmos DB):**
```typescript
interface PatientDocument {
  id: string; // UUID
  practiceId: string; // Partition key
  firstName: string;
  lastName: string;
  dob: string; // ISO date
  diagnosis: string[];
  status: 'active' | 'inactive' | 'discharged' | 'waitlist';
  
  // Insurance
  insurance: {
    provider: string;
    memberId: string;
    groupNumber?: string;
    authorizationNumber?: string;
    authorizationStartDate?: string;
    authorizationEndDate?: string;
    hoursAuthorized?: number;
    hoursUsed?: number;
  };
  
  // Guardians
  guardians: {
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
    email: string;
    phone: string;
    isPrimary: boolean;
  }[];
  
  // Demographics
  gender?: string;
  ethnicity?: string;
  language?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Metadata
  enrollmentDate: string;
  dischargeDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  
  // Search optimization
  searchText: string; // Computed: firstName + lastName + memberId
}
```

**API Endpoints:**
```typescript
// GET /patients
interface GetPatientsQuery {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'discharged' | 'waitlist';
  search?: string;
  sort?: 'firstName' | 'lastName' | 'enrollmentDate';
  order?: 'asc' | 'desc';
}

// POST /patients
interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dob: string;
  diagnosis: string[];
  guardians: Guardian[];
  insurance?: InsuranceInfo;
  // ... other fields
}

// GET /patients/:id
// PUT /patients/:id
// DELETE /patients/:id (soft delete)
// GET /patients/:id/sessions
// GET /patients/:id/goals
```

**Cosmos DB Queries:**
```sql
-- List active patients for a practice
SELECT * FROM c 
WHERE c.practiceId = @practiceId 
  AND c.status = 'active'
ORDER BY c.firstName

-- Search patients by name
SELECT * FROM c 
WHERE c.practiceId = @practiceId 
  AND CONTAINS(LOWER(c.searchText), LOWER(@searchTerm))

-- Get patient with goals (JOIN)
SELECT p.id, p.firstName, g.id as goalId, g.goalStatement
FROM patients p
JOIN g IN p.goals
WHERE p.id = @patientId
```

**Performance Optimizations:**
- Partition by `practiceId` (most queries scoped to practice)
- Composite index on `practiceId + status + firstName`
- Computed `searchText` field for full-text search
- TTL (time-to-live) for discharged patients (archive after 7 years)

---

### 4. Goal Management Service

**Purpose**: Therapy goals, targets, mastery criteria

**Tech Stack:**
- Node.js + Express + TypeScript
- Azure Cosmos DB (partition key: `patientId`)

**Document Schema (Cosmos DB):**
```typescript
interface GoalDocument {
  id: string; // UUID
  patientId: string; // Partition key
  practiceId: string;
  
  // Goal definition
  domain: string; // "Communication", "Social Skills", etc.
  goalStatement: string;
  description?: string;
  
  // Targets
  targets: {
    id: string;
    name: string;
    description?: string;
    order: number; // Display order
    
    // Prompt levels
    promptLevels: string[]; // ["Full Prompt", "Partial Prompt", "Independent"]
    
    // Mastery criteria
    masteryCriteria: {
      accuracyPercent: number; // e.g., 90
      consecutiveSessions: number; // e.g., 3
      promptLevel?: string; // Must be at this level or better
    };
    
    // Status
    status: 'active' | 'mastered' | 'discontinued';
    masteredDate?: string;
    
    // Progress tracking
    currentAccuracy?: number;
    consecutiveSessionsMet?: number;
    lastSessionDate?: string;
  }[];
  
  // Goal metadata
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'discontinued';
  phase?: string; // "Acquisition", "Fluency", "Maintenance", "Generalization"
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
```

**API Endpoints:**
```typescript
// GET /goals?patientId=xxx
// GET /goals/:id
// POST /goals
// PUT /goals/:id
// DELETE /goals/:id
// POST /goals/:goalId/targets
// PUT /goals/:goalId/targets/:targetId
// POST /goals/from-template/:templateId
```

**Goal Bank Templates:**
```typescript
interface GoalTemplate {
  id: string;
  domain: string;
  name: string;
  goalStatement: string; // May contain variables: "{patientName}"
  targets: {
    name: string;
    promptLevels: string[];
    masteryCriteria: {
      accuracyPercent: number;
      consecutiveSessions: number;
    };
  }[];
  tags: string[]; // ["receptive language", "early learner"]
}

// Example templates:
{
  id: 'comm-identify-colors',
  domain: 'Communication',
  name: 'Identify Colors',
  goalStatement: '{patientName} will identify 10 colors with 90% accuracy',
  targets: [
    { name: 'Red', promptLevels: ['FP', 'PP', 'I'], masteryCriteria: { accuracyPercent: 90, consecutiveSessions: 3 } },
    { name: 'Blue', ... },
    // ... 10 colors total
  ],
  tags: ['receptive language', 'early learner']
}
```

---

### 5. Data Collection Service

**Purpose**: Trial recording, session management, real-time accuracy

**Tech Stack:**
- Node.js + Express + TypeScript
- Azure Cosmos DB (partition key: `sessionId`)
- Azure SignalR (real-time updates)
- Redis (session caching)

**Document Schema (Cosmos DB):**
```typescript
interface SessionDocument {
  id: string; // UUID
  sessionId: string; // Partition key (same as id)
  practiceId: string;
  patientId: string;
  therapistId: string;
  
  // Goal/Target
  goalId: string;
  targetId: string;
  
  // Timing
  startTime: string; // ISO datetime
  endTime?: string;
  duration?: number; // minutes
  
  // Trials
  trials: {
    id: string;
    timestamp: string;
    trialNumber: number;
    
    // Stimulus/Response
    sd?: string; // Stimulus/Discriminative stimulus
    response?: string;
    
    // Scoring
    correct: boolean;
    promptLevel: string;
    
    // Optional
    duration?: number; // seconds (for duration recording)
    frequency?: number; // count (for frequency recording)
    notes?: string;
    attachments?: string[]; // Blob URLs
  }[];
  
  // Summary (calculated)
  summary: {
    totalTrials: number;
    correctTrials: number;
    incorrectTrials: number;
    accuracy: number; // percentage
    independentTrials: number;
    promptedTrials: number;
    independentAccuracy?: number;
  };
  
  // Session notes
  sessionNotes?: string;
  guardianSignature?: string; // Blob URL
  
  // Status
  status: 'in_progress' | 'completed' | 'cancelled';
  syncStatus: 'pending' | 'synced' | 'conflict';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  completedBy?: string;
  deviceId?: string; // For offline tracking
}
```

**API Endpoints:**
```typescript
// POST /sessions/start
interface StartSessionRequest {
  patientId: string;
  goalId: string;
  targetId: string;
  location?: string;
}

interface StartSessionResponse {
  sessionId: string;
  startTime: string;
}

// POST /sessions/:id/trials
interface RecordTrialRequest {
  correct: boolean;
  promptLevel: string;
  sd?: string;
  response?: string;
  duration?: number;
  notes?: string;
}

interface RecordTrialResponse {
  trialId: string;
  trialNumber: number;
  sessionSummary: {
    totalTrials: number;
    accuracy: number;
  };
}

// POST /sessions/:id/end
interface EndSessionRequest {
  sessionNotes?: string;
  guardianSignature?: string; // Base64 encoded
}

// GET /sessions/:id
// GET /sessions?patientId=xxx&startDate=xxx&endDate=xxx
// DELETE /sessions/:id/trials/:trialId
// GET /sessions/:id/stats (real-time)
```

**Real-Time Updates (SignalR):**
```typescript
// Server-side hub
class SessionHub {
  async recordTrial(sessionId: string, trial: Trial) {
    // Save to database
    await saveTrialToDb(sessionId, trial);
    
    // Broadcast to connected clients
    await this.clients.group(sessionId).sendAsync('trialRecorded', {
      trialId: trial.id,
      accuracy: calculateAccuracy(sessionId)
    });
  }
}

// Client-side connection
const connection = new signalR.HubConnectionBuilder()
  .withUrl('/hubs/session', {
    accessTokenFactory: () => getAccessToken()
  })
  .build();

connection.on('trialRecorded', (data) => {
  updateAccuracyDisplay(data.accuracy);
});

await connection.start();
await connection.invoke('JoinSession', sessionId);
```

**Offline Sync Strategy:**

1. **Client-Side (IndexedDB)**:
```typescript
interface OfflineSession {
  sessionId: string;
  data: SessionDocument;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'conflict';
  lastModified: number; // timestamp
  retryCount: number;
}

// Save offline
async function saveSessionOffline(session: SessionDocument) {
  await db.sessions.put({
    sessionId: session.id,
    data: session,
    syncStatus: 'pending',
    lastModified: Date.now(),
    retryCount: 0
  });
}

// Sync when online
async function syncPendingSessions() {
  const pendingSessions = await db.sessions
    .where('syncStatus').equals('pending')
    .toArray();
  
  for (const session of pendingSessions) {
    try {
      await axios.post('/sessions/sync', session.data);
      await db.sessions.update(session.sessionId, { syncStatus: 'synced' });
    } catch (error) {
      if (error.status === 409) { // Conflict
        await db.sessions.update(session.sessionId, { syncStatus: 'conflict' });
      } else {
        // Retry later
        await db.sessions.update(session.sessionId, { retryCount: session.retryCount + 1 });
      }
    }
  }
}
```

2. **Server-Side Conflict Resolution**:
```typescript
async function syncSession(incomingSession: SessionDocument) {
  const existingSession = await cosmosClient.readItem(incomingSession.id);
  
  if (!existingSession) {
    // New session, just save
    await cosmosClient.createItem(incomingSession);
    return { status: 'created' };
  }
  
  // Conflict: compare timestamps
  if (new Date(incomingSession.updatedAt) > new Date(existingSession.updatedAt)) {
    // Incoming is newer, merge trials
    const mergedTrials = mergeTrial(existingSession.trials, incomingSession.trials);
    incomingSession.trials = mergedTrials;
    await cosmosClient.replaceItem(incomingSession);
    return { status: 'merged' };
  } else {
    // Existing is newer, reject incoming
    return { status: 'conflict', message: 'Server version is newer' };
  }
}
```

---

### 6. Scheduling Service

**Purpose**: Session scheduling, calendar sync, therapist availability

**Tech Stack:**
- Node.js + Express + TypeScript
- Azure SQL Database (relational data)
- Microsoft Graph API (Outlook integration)

**Database Schema (Azure SQL):**
```sql
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  practice_id VARCHAR(36) NOT NULL,
  patient_id VARCHAR(36) NOT NULL,
  therapist_id VARCHAR(36) NOT NULL,
  goal_id VARCHAR(36),
  
  -- Scheduling
  start_time DATETIME2 NOT NULL,
  end_time DATETIME2 NOT NULL,
  location VARCHAR(255),
  appointment_type VARCHAR(50) CHECK (appointment_type IN ('1-on-1', 'group', 'parent-training', 'assessment')),
  
  -- Status
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  
  -- Recurrence
  recurrence_rule VARCHAR(255), -- iCal RRULE format
  recurrence_parent_id VARCHAR(36), -- For recurring appointments
  
  -- Integration
  outlook_event_id VARCHAR(255), -- Microsoft Graph event ID
  
  -- Metadata
  notes NVARCHAR(MAX),
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  updated_at DATETIME2 DEFAULT GETUTCDATE(),
  created_by VARCHAR(36),
  
  -- Indexes
  INDEX idx_therapist_time (therapist_id, start_time),
  INDEX idx_patient (patient_id),
  INDEX idx_practice_time (practice_id, start_time)
);

CREATE TABLE therapist_availability (
  id VARCHAR(36) PRIMARY KEY,
  therapist_id VARCHAR(36) NOT NULL,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BIT DEFAULT 1,
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  INDEX idx_therapist (therapist_id)
);

CREATE TABLE time_off_requests (
  id VARCHAR(36) PRIMARY KEY,
  therapist_id VARCHAR(36) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason NVARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  INDEX idx_therapist_dates (therapist_id, start_date, end_date)
);
```

**API Endpoints:**
```typescript
// GET /schedules/appointments
// POST /schedules/appointments
// PUT /schedules/appointments/:id
// DELETE /schedules/appointments/:id
// GET /schedules/therapists/:id/availability
// PUT /schedules/therapists/:id/availability
// GET /schedules/conflicts?therapistId=xxx&startTime=xxx&endTime=xxx
// POST /schedules/bulk-create (for recurring)
```

**Outlook Calendar Integration:**
```typescript
import { Client } from '@microsoft/microsoft-graph-client';

async function createOutlookEvent(appointment: Appointment) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken); // Service-to-service token
    }
  });
  
  const event = {
    subject: `ABA Session: ${appointment.patientName}`,
    body: {
      contentType: 'HTML',
      content: `
        <p><strong>Patient:</strong> ${appointment.patientName}</p>
        <p><strong>Goal:</strong> ${appointment.goalName}</p>
        <p><a href="${appointment.sessionLink}">Open in Wabi Care</a></p>
      `
    },
    start: {
      dateTime: appointment.startTime,
      timeZone: appointment.timezone
    },
    end: {
      dateTime: appointment.endTime,
      timeZone: appointment.timezone
    },
    location: {
      displayName: appointment.location
    },
    attendees: [
      {
        emailAddress: {
          address: appointment.parentEmail,
          name: appointment.parentName
        },
        type: 'optional'
      }
    ],
    isReminderOn: true,
    reminderMinutesBeforeStart: 60
  };
  
  const createdEvent = await client
    .api(`/users/${appointment.therapistEmail}/calendar/events`)
    .post(event);
  
  // Save event ID for two-way sync
  await db.appointments.update(appointment.id, {
    outlookEventId: createdEvent.id
  });
  
  return createdEvent;
}

// Webhook for Outlook changes
app.post('/webhooks/outlook/calendar', async (req, res) => {
  const notification = req.body;
  
  // User changed event in Outlook
  if (notification.changeType === 'updated') {
    const eventId = notification.resourceData.id;
    
    // Find appointment
    const appointment = await db.appointments.findOne({ outlookEventId: eventId });
    
    // Fetch updated event from Graph API
    const updatedEvent = await graphClient.api(`/me/events/${eventId}`).get();
    
    // Update Wabi Care appointment
    await db.appointments.update(appointment.id, {
      startTime: updatedEvent.start.dateTime,
      endTime: updatedEvent.end.dateTime,
      status: updatedEvent.isCancelled ? 'cancelled' : 'scheduled'
    });
  }
  
  res.status(202).send(); // Acknowledge webhook
});
```

---

### 7. Billing Service

**Purpose**: Claims management, RCM, payment tracking

**Tech Stack:**
- Node.js + Express + TypeScript
- Azure SQL Database (ACID compliance for financial data)
- Stripe API (payment processing)
- Payer APIs (claim submission)

**Database Schema (Azure SQL):**
```sql
CREATE TABLE claims (
  id VARCHAR(36) PRIMARY KEY,
  practice_id VARCHAR(36) NOT NULL,
  patient_id VARCHAR(36) NOT NULL,
  session_ids NVARCHAR(MAX), -- JSON array of session IDs
  
  -- Claim details
  claim_number VARCHAR(50) UNIQUE,
  submission_date DATETIME2,
  service_date DATE NOT NULL,
  
  -- Payer info
  payer_name VARCHAR(255) NOT NULL,
  payer_id VARCHAR(50),
  member_id VARCHAR(50) NOT NULL,
  authorization_number VARCHAR(50),
  
  -- Billing codes
  cpt_codes NVARCHAR(MAX) NOT NULL, -- JSON: [{ code: '97153', units: 2, amount: 75.00 }]
  diagnosis_codes NVARCHAR(MAX), -- JSON: ['F84.0']
  
  -- Financial
  billed_amount DECIMAL(10,2) NOT NULL,
  allowed_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2),
  patient_responsibility DECIMAL(10,2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'submitted', 'accepted', 'denied', 'paid')),
  denial_reason NVARCHAR(MAX),
  
  -- Metadata
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  updated_at DATETIME2 DEFAULT GETUTCDATE(),
  created_by VARCHAR(36),
  
  INDEX idx_practice_status (practice_id, status),
  INDEX idx_patient (patient_id),
  INDEX idx_submission_date (submission_date)
);

CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  claim_id VARCHAR(36) NOT NULL,
  payment_date DATETIME2 NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) CHECK (payment_method IN ('insurance', 'credit-card', 'check', 'ach')),
  transaction_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
  INDEX idx_claim (claim_id),
  INDEX idx_payment_date (payment_date)
);

CREATE TABLE claim_validation_errors (
  id VARCHAR(36) PRIMARY KEY,
  claim_id VARCHAR(36) NOT NULL,
  error_code VARCHAR(50) NOT NULL,
  error_message NVARCHAR(MAX) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('error', 'warning', 'info')),
  resolved BIT DEFAULT 0,
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
);
```

**Claim Generation Logic:**
```typescript
async function generateClaim(sessionIds: string[]) {
  // 1. Fetch sessions
  const sessions = await db.sessions.find({ id: { $in: sessionIds } });
  
  // 2. Validate
  const errors: ValidationError[] = [];
  
  for (const session of sessions) {
    // Check authorization
    const patient = await db.patients.findOne(session.patientId);
    if (!patient.insurance.authorizationNumber) {
      errors.push({ code: 'AUTH_MISSING', message: 'Authorization number missing' });
    }
    
    // Check authorization hours
    if (patient.insurance.hoursUsed >= patient.insurance.hoursAuthorized) {
      errors.push({ code: 'AUTH_EXCEEDED', message: 'Authorization hours exceeded' });
    }
    
    // Check for duplicate claims
    const existingClaim = await db.claims.findOne({
      patientId: session.patientId,
      serviceDate: session.startTime.split('T')[0],
      status: { $ne: 'denied' }
    });
    if (existingClaim) {
      errors.push({ code: 'DUPLICATE_CLAIM', message: 'Claim already exists for this date' });
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationException(errors);
  }
  
  // 3. Map to CPT codes
  const cptCodes = sessions.map(session => {
    const duration = session.duration; // minutes
    const units = Math.ceil(duration / 30); // 30 min = 1 unit
    
    // Determine CPT code based on role
    let code = '97153'; // RBT
    if (session.therapistRole === 'bcba') {
      code = '97155'; // BCBA
    }
    
    return {
      code,
      units,
      amount: units * 37.50 // $37.50 per unit (example)
    };
  });
  
  // 4. Calculate totals
  const billedAmount = cptCodes.reduce((sum, cpt) => sum + cpt.amount, 0);
  
  // 5. Create claim
  const claim = await db.claims.create({
    practiceId: sessions[0].practiceId,
    patientId: sessions[0].patientId,
    sessionIds: sessionIds,
    claimNumber: generateClaimNumber(),
    serviceDate: sessions[0].startTime.split('T')[0],
    payerName: patient.insurance.provider,
    memberId: patient.insurance.memberId,
    authorizationNumber: patient.insurance.authorizationNumber,
    cptCodes: JSON.stringify(cptCodes),
    diagnosisCodes: JSON.stringify(patient.diagnosis.map(mapDiagnosisToICD10)),
    billedAmount,
    status: 'ready'
  });
  
  return claim;
}
```

---

### 8. Notification Service

**Purpose**: Email, SMS, push notifications

**Tech Stack:**
- Node.js + Express + TypeScript
- Azure Communication Services (Email + SMS)
- Firebase Cloud Messaging (push)
- Azure Service Bus (event queue)

**Database Schema (Azure SQL):**
```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  notification_type VARCHAR(50) CHECK (notification_type IN ('email', 'sms', 'push', 'teams')),
  template_id VARCHAR(36),
  
  -- Content
  subject VARCHAR(255),
  body NVARCHAR(MAX),
  data NVARCHAR(MAX), -- JSON payload
  
  -- Delivery
  recipient VARCHAR(255) NOT NULL, -- Email or phone number
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  sent_at DATETIME2,
  delivered_at DATETIME2,
  error_message NVARCHAR(MAX),
  
  -- Metadata
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  INDEX idx_user_status (user_id, status),
  INDEX idx_sent_at (sent_at)
);

CREATE TABLE notification_preferences (
  user_id VARCHAR(36) PRIMARY KEY,
  email_enabled BIT DEFAULT 1,
  sms_enabled BIT DEFAULT 1,
  push_enabled BIT DEFAULT 1,
  teams_enabled BIT DEFAULT 1,
  preferences NVARCHAR(MAX), -- JSON: { "sessionReminder": true, "claimDenied": true }
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Event-Driven Architecture:**
```typescript
// Producer (Data Collection Service)
import { ServiceBusClient } from '@azure/service-bus';

async function publishSessionCompletedEvent(session: Session) {
  const client = new ServiceBusClient(connectionString);
  const sender = client.createSender('session-events');
  
  await sender.sendMessages({
    body: {
      eventType: 'session.completed',
      sessionId: session.id,
      patientId: session.patientId,
      therapistId: session.therapistId,
      accuracy: session.summary.accuracy,
      timestamp: new Date().toISOString()
    }
  });
  
  await sender.close();
  await client.close();
}

// Consumer (Notification Service)
import { ServiceBusClient } from '@azure/service-bus';

async function subscribeToEvents() {
  const client = new ServiceBusClient(connectionString);
  const receiver = client.createReceiver('session-events');
  
  receiver.subscribe({
    processMessage: async (message) => {
      const event = message.body;
      
      if (event.eventType === 'session.completed') {
        // Send notification to BCBA
        const patient = await db.patients.findOne(event.patientId);
        const bcba = await db.users.findOne({ role: 'bcba', practiceId: patient.practiceId });
        
        await sendTeamsNotification(bcba.email, {
          title: 'New Session Data',
          patient: patient.firstName + ' ' + patient.lastName,
          accuracy: event.accuracy + '%',
          link: `https://app.wabicare.com/sessions/${event.sessionId}`
        });
      }
    },
    processError: async (error) => {
      console.error('Error processing message:', error);
    }
  });
}
```

---

### 9. Analytics Service

**Purpose**: Progress tracking, reporting, dashboards

**Tech Stack:**
- Node.js + Express + TypeScript
- Azure Synapse Analytics (data warehouse)
- Power BI Embedded
- Azure Data Factory (ETL)

**Data Pipeline:**
```
Cosmos DB (Sessions) 
    ↓ Change Feed
Azure Functions (transform)
    ↓
Azure Synapse (aggregate)
    ↓
Power BI / Custom API
```

**Synapse Tables:**
```sql
-- Fact table: Session analytics
CREATE TABLE fact_sessions (
  session_id VARCHAR(36) PRIMARY KEY,
  practice_id VARCHAR(36),
  patient_id VARCHAR(36),
  therapist_id VARCHAR(36),
  goal_id VARCHAR(36),
  target_id VARCHAR(36),
  
  -- Dimensions
  date_key INT, -- YYYYMMDD
  time_key INT, -- HHMM
  
  -- Measures
  duration_minutes INT,
  total_trials INT,
  correct_trials INT,
  incorrect_trials INT,
  accuracy_percent DECIMAL(5,2),
  independent_trials INT,
  prompted_trials INT,
  
  -- Metadata
  created_date DATETIME2
)
WITH (DISTRIBUTION = HASH(patient_id), CLUSTERED COLUMNSTORE INDEX);

-- Dimension: Patients
CREATE TABLE dim_patients (
  patient_id VARCHAR(36) PRIMARY KEY,
  practice_id VARCHAR(36),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  dob DATE,
  diagnosis VARCHAR(255),
  status VARCHAR(50)
)
WITH (DISTRIBUTION = REPLICATE);

-- Dimension: Goals
CREATE TABLE dim_goals (
  goal_id VARCHAR(36) PRIMARY KEY,
  patient_id VARCHAR(36),
  domain VARCHAR(100),
  goal_statement VARCHAR(500),
  status VARCHAR(50)
)
WITH (DISTRIBUTION = REPLICATE);
```

**API Endpoints:**
```typescript
// GET /analytics/patients/:patientId/progress
interface ProgressResponse {
  patient: {
    id: string;
    name: string;
  };
  goals: {
    goalId: string;
    goalStatement: string;
    currentAccuracy: number;
    trend: 'improving' | 'stable' | 'declining';
    sessionsCompleted: number;
    chart: {
      dates: string[];
      accuracy: number[];
    };
  }[];
}

// GET /analytics/practice/dashboard
interface PracticeDashboardResponse {
  overview: {
    activePatients: number;
    sessionsThisMonth: number;
    averageAccuracy: number;
    billedAmount: number;
  };
  trends: {
    month: string;
    sessions: number;
    revenue: number;
  }[];
  topPerformers: {
    therapistName: string;
    sessionsCompleted: number;
    averageAccuracy: number;
  }[];
}
```

---

### 10. AI Service

**Purpose**: Azure AI Foundry integration, GPT-4, predictions

**Tech Stack:**
- Python + FastAPI
- Azure AI Foundry
- Azure OpenAI Service
- LangChain / Semantic Kernel

**API Endpoints:**
```python
from fastapi import FastAPI, UploadFile
from azure.ai.inference import ChatCompletionsClient
from azure.ai.projects import AIProjectClient

app = FastAPI()

# POST /ai/notes/generate
@app.post("/ai/notes/generate")
async def generate_note(audio_file: UploadFile):
    # 1. Transcribe audio (Whisper)
    transcript = await transcribe_audio(audio_file)
    
    # 2. Retrieve patient context (RAG)
    patient_context = await retrieve_patient_context(patient_id)
    
    # 3. Generate note (GPT-4)
    prompt = f"""
    You are an ABA therapist writing a session progress note.
    
    Session transcript: {transcript}
    Patient context: {patient_context}
    
    Generate a professional progress note including:
    - Session summary
    - Goals worked on
    - Patient performance
    - Recommendations for next session
    """
    
    completion = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    note = completion.choices[0].message.content
    
    # 4. Content safety check
    safety_result = await content_safety_client.analyze_text(note)
    if safety_result.severity == "high":
        raise HTTPException(400, "Note contains unsafe content")
    
    return {"note": note, "confidence": completion.usage.total_tokens}

# POST /ai/predictions/outcome
@app.post("/ai/predictions/outcome")
async def predict_outcome(patient_id: str, goal_id: str):
    # Fetch historical data
    sessions = await db.sessions.find({"patientId": patient_id, "goalId": goal_id})
    
    # Prepare features
    features = extract_features(sessions)
    
    # Load ML model
    model = await load_model("goal-mastery-predictor")
    
    # Predict
    prediction = model.predict(features)
    
    return {
        "probability_of_mastery": float(prediction[0]),
        "estimated_sessions_remaining": int(prediction[1]),
        "confidence": float(prediction[2])
    }

# POST /ai/chat
@app.post("/ai/chat")
async def chat(message: str, user_id: str, conversation_id: str):
    # Retrieve conversation history
    history = await db.conversations.find_one({"id": conversation_id})
    
    # Retrieve relevant documents (RAG)
    docs = await vector_search(message, user_id)
    
    # Build prompt
    context = "\n".join([doc.content for doc in docs])
    prompt = f"""
    You are an AI assistant for Wabi Care, an ABA practice management platform.
    Answer the user's question using the following context.
    
    Context: {context}
    
    User question: {message}
    """
    
    # Call GPT-4
    response = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=history.messages + [{"role": "user", "content": prompt}]
    )
    
    answer = response.choices[0].message.content
    
    # Save to history
    await db.conversations.update_one(
        {"id": conversation_id},
        {"$push": {"messages": [
            {"role": "user", "content": message},
            {"role": "assistant", "content": answer}
        ]}}
    )
    
    return {"answer": answer, "sources": [doc.title for doc in docs]}
```

---

## Database Design

### Database Selection Matrix

| Data Type | Database | Reason |
|-----------|----------|--------|
| **Clinical Data** (patients, goals, sessions) | Cosmos DB | Flexible schema, offline sync, global distribution, partition by patient |
| **Transactional Data** (users, billing, schedules) | Azure SQL | ACID compliance, complex joins, financial accuracy |
| **Analytics Data** (aggregated metrics, reports) | Synapse Analytics | Columnar storage, fast aggregations, Power BI integration |
| **Documents** (PDFs, images, audio) | Blob Storage | Cost-effective, durable, Azure services integration |
| **Search** (semantic search for chat) | Azure AI Search | Vector search, full-text search, RAG pipelines |
| **Cache** (sessions, rate limits) | Redis | In-memory speed, pub/sub for real-time updates |

---

### Cosmos DB Design Principles

1. **Partition Key Selection**:
   - `patients` collection: Partition by `practiceId` (most queries scoped to practice)
   - `goals` collection: Partition by `patientId` (goals always queried per patient)
   - `sessions` collection: Partition by `sessionId` (point reads during data collection)

2. **Indexing Strategy**:
```json
{
  "indexingMode": "consistent",
  "includedPaths": [
    { "path": "/practiceId/?" },
    { "path": "/patientId/?" },
    { "path": "/status/?" },
    { "path": "/createdAt/?" }
  ],
  "excludedPaths": [
    { "path": "/trials/*" }, // Large arrays, don't index
    { "path": "/sessionNotes/?" } // Free text
  ],
  "compositeIndexes": [
    [
      { "path": "/practiceId", "order": "ascending" },
      { "path": "/status", "order": "ascending" },
      { "path": "/createdAt", "order": "descending" }
    ]
  ]
}
```

3. **Change Feed for Real-Time Events**:
```typescript
import { ChangeFeedIterator } from "@azure/cosmos";

const iterator: ChangeFeedIterator<SessionDocument> = container
  .items
  .changeFeed({ startFromBeginning: false })
  .getChangeFeedIterator();

while (iterator.hasMoreResults) {
  const response = await iterator.readNext();
  
  for (const doc of response.resources) {
    // Publish event to Service Bus
    await serviceBusClient.send({
      eventType: 'session.updated',
      sessionId: doc.id,
      accuracy: doc.summary.accuracy
    });
  }
}
```

---

### Azure SQL Design Principles

1. **Normalized Schema** (3NF for transactional tables)
2. **Indexes** on foreign keys and frequent query columns
3. **Partitioning** for large tables (e.g., claims by month)
4. **Temporal Tables** for audit trail

Example temporal table:
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255),
  role VARCHAR(50),
  is_active BIT,
  
  -- Temporal columns
  SysStartTime DATETIME2 GENERATED ALWAYS AS ROW START NOT NULL,
  SysEndTime DATETIME2 GENERATED ALWAYS AS ROW END NOT NULL,
  PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime)
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.users_history));

-- Query historical data
SELECT * FROM users
FOR SYSTEM_TIME AS OF '2024-01-01 00:00:00'
WHERE email = 'user@example.com';
```

---

## API Specifications

### REST API Standards

1. **Base URL**: `https://api.wabicare.com`
2. **Versioning**: `/v1/`, `/v2/` (URL-based)
3. **Authentication**: Bearer token (JWT)
4. **Content-Type**: `application/json`
5. **HTTP Methods**:
   - `GET`: Retrieve resources
   - `POST`: Create resources
   - `PUT`: Update entire resource
   - `PATCH`: Partial update
   - `DELETE`: Delete resource

6. **Status Codes**:
   - `200 OK`: Success
   - `201 Created`: Resource created
   - `204 No Content`: Success, no response body
   - `400 Bad Request`: Invalid input
   - `401 Unauthorized`: Missing/invalid token
   - `403 Forbidden`: Insufficient permissions
   - `404 Not Found`: Resource not found
   - `409 Conflict`: Resource conflict (e.g., duplicate)
   - `429 Too Many Requests`: Rate limit exceeded
   - `500 Internal Server Error`: Server error

7. **Error Response Format**:
```typescript
interface ErrorResponse {
  error: {
    code: string; // Machine-readable code
    message: string; // Human-readable message
    details?: any; // Optional additional info
    traceId: string; // For support debugging
  };
}

// Example:
{
  "error": {
    "code": "PATIENT_NOT_FOUND",
    "message": "Patient with ID '12345' not found",
    "traceId": "abc-123-xyz"
  }
}
```

8. **Pagination**:
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Query params: ?page=1&limit=20
```

9. **Filtering & Sorting**:
```
GET /patients?status=active&sort=firstName:asc&search=sarah
```

10. **Rate Limiting Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

### OpenAPI Specification Example

```yaml
openapi: 3.0.0
info:
  title: Wabi Care API
  version: 1.0.0
  description: ABA practice management platform API

servers:
  - url: https://api.wabicare.com/v1
    description: Production
  - url: https://api-staging.wabicare.com/v1
    description: Staging

security:
  - BearerAuth: []

paths:
  /patients:
    get:
      summary: List patients
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: status
          in: query
          schema:
            type: string
            enum: [active, inactive, discharged]
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PatientListResponse'
    
    post:
      summary: Create patient
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePatientRequest'
      responses:
        '201':
          description: Patient created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Patient'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Patient:
      type: object
      properties:
        id:
          type: string
          format: uuid
        firstName:
          type: string
        lastName:
          type: string
        dob:
          type: string
          format: date
        status:
          type: string
          enum: [active, inactive, discharged]
```

---

## Infrastructure & Deployment

### Azure Resources

| Resource | SKU/Tier | Purpose | Estimated Cost/Month |
|----------|----------|---------|---------------------|
| **Azure Container Apps** | Consumption | Microservices hosting | $50-200 (scales to zero) |
| **Azure Static Web Apps** | Standard | Frontend hosting | $9 |
| **Azure API Management** | Developer | API gateway | $50 |
| **Azure Cosmos DB** | Provisioned (4000 RU/s) | Clinical data | $200 |
| **Azure SQL Database** | General Purpose (2 vCores) | Transactional data | $250 |
| **Azure Synapse Analytics** | Serverless | Data warehouse | $100 (pay-per-query) |
| **Azure OpenAI Service** | Standard | GPT-4, embeddings | $500 (usage-based) |
| **Azure Blob Storage** | Hot tier (1 TB) | Documents | $20 |
| **Azure Redis Cache** | Basic (1 GB) | Session cache | $15 |
| **Azure Service Bus** | Standard | Event queue | $10 |
| **Azure SignalR** | Standard (100 concurrent) | Real-time updates | $50 |
| **Azure Monitor** | Pay-as-you-go | Observability | $50 |
| **Azure Key Vault** | Standard | Secrets management | $1 |
| **Total** | | | **~$1,500-2,000/month** |

**Cost Optimization:**
- Use Azure Reserved Instances (save 30-50%)
- Auto-scale Container Apps to zero during off-hours
- Use Azure Cost Management alerts

---

### Deployment Architecture

```
GitHub Repository
    ↓ (push to main)
GitHub Actions CI/CD
    ↓
┌─────────────────────────────────────┐
│   1. Build & Test                   │
│   - npm install                     │
│   - npm test                        │
│   - Docker build                    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   2. Security Scanning              │
│   - Trivy (container vulnerabilities│
│   - Snyk (dependency vulnerabilities)│
│   - SonarCloud (code quality)       │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   3. Push to Azure Container Registy│
│   - Tag: {service}-{commit-sha}     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   4. Deploy to Staging              │
│   - Azure Container Apps (staging)  │
│   - Run smoke tests                 │
└─────────────────────────────────────┘
    ↓ (manual approval)
┌─────────────────────────────────────┐
│   5. Deploy to Production           │
│   - Blue/Green deployment           │
│   - Health checks                   │
│   - Rollback on failure             │
└─────────────────────────────────────┘
```

### GitHub Actions Workflow Example

```yaml
name: Deploy Microservice

on:
  push:
    branches: [main]
    paths:
      - 'services/patient-service/**'

env:
  SERVICE_NAME: patient-service
  AZURE_CONTAINER_REGISTRY: wabicare.azurecr.io

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd services/${{ env.SERVICE_NAME }}
          npm ci
      
      - name: Run tests
        run: |
          cd services/${{ env.SERVICE_NAME }}
          npm test
      
      - name: Build Docker image
        run: |
          cd services/${{ env.SERVICE_NAME }}
          docker build -t ${{ env.AZURE_CONTAINER_REGISTRY }}/${{ env.SERVICE_NAME }}:${{ github.sha }} .
      
      - name: Login to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ env.AZURE_CONTAINER_REGISTRY }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
      
      - name: Push to ACR
        run: |
          docker push ${{ env.AZURE_CONTAINER_REGISTRY }}/${{ env.SERVICE_NAME }}:${{ github.sha }}
      
      - name: Deploy to Azure Container Apps
        uses: azure/container-apps-deploy-action@v1
        with:
          resource-group: wabicare-rg
          container-app-name: ${{ env.SERVICE_NAME }}
          image: ${{ env.AZURE_CONTAINER_REGISTRY }}/${{ env.SERVICE_NAME }}:${{ github.sha }}
          azure-credentials: ${{ secrets.AZURE_CREDENTIALS }}
```

---

## Security & Compliance

### Security Layers

1. **Network Security**:
   - Azure Virtual Network (VNet)
   - Private endpoints for databases
   - No public internet access to databases
   - Network Security Groups (NSGs)

2. **Identity & Access Management**:
   - Azure AD B2C for user authentication
   - Managed identities for service-to-service auth
   - Role-based access control (RBAC)
   - Least privilege principle

3. **Data Security**:
   - Encryption at rest (Azure Storage Service Encryption)
   - Encryption in transit (TLS 1.3)
   - Customer-managed keys (Azure Key Vault)
   - Data masking for sensitive fields

4. **Application Security**:
   - Input validation (Joi/Zod)
   - SQL injection prevention (parameterized queries)
   - XSS prevention (Content Security Policy)
   - CSRF protection (SameSite cookies)
   - Rate limiting (Azure API Management)

5. **Secrets Management**:
   - Azure Key Vault for all secrets
   - No secrets in code or environment variables
   - Automatic secret rotation

6. **Audit & Compliance**:
   - Azure Monitor audit logs
   - Activity logs for all API calls
   - Retention: 7 years (HIPAA requirement)

### HIPAA Compliance Checklist

- [ ] Business Associate Agreement (BAA) with Azure
- [ ] Encryption at rest and in transit
- [ ] Audit logs for all PHI access
- [ ] Access controls (RBAC)
- [ ] Automatic session timeout (15 minutes)
- [ ] Data retention policy (7 years)
- [ ] Disaster recovery plan (RPO < 1 hour)
- [ ] Security incident response plan
- [ ] Regular security audits
- [ ] Employee training on HIPAA
- [ ] Data breach notification procedures

---

## Performance & Scalability

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response Time (p95)** | < 200ms | Application Insights |
| **Database Query Time (p95)** | < 50ms | Cosmos DB metrics |
| **Page Load Time** | < 2s | Lighthouse |
| **Offline Sync Time** | < 10s | Custom telemetry |
| **Uptime SLA** | 99.9% | Azure Monitor |
| **Concurrent Users** | 1000+ per clinic | Load testing |

### Scalability Strategy

1. **Horizontal Scaling**:
   - Azure Container Apps auto-scale based on HTTP requests
   - Cosmos DB auto-scale (4000-20000 RU/s)
   - Azure SQL elastic pool for multiple databases

2. **Caching**:
   - Redis for session data (TTL: 1 hour)
   - CDN caching for static assets (TTL: 1 day)
   - API response caching for read-heavy endpoints (TTL: 5 min)

3. **Database Optimization**:
   - Cosmos DB: Partition strategy, indexing
   - Azure SQL: Query optimization, indexes, columnstore
   - Synapse: Materialized views for common queries

4. **Asynchronous Processing**:
   - Azure Service Bus for long-running tasks
   - Background jobs for report generation, email sending
   - Retry logic with exponential backoff

---

## Monitoring & Observability

### Monitoring Stack

1. **Application Performance Monitoring (APM)**:
   - Azure Application Insights
   - Distributed tracing across microservices
   - Custom telemetry for business metrics

2. **Logging**:
   - Azure Log Analytics
   - Centralized logs from all services
   - Kusto Query Language (KQL) for analysis

3. **Metrics**:
   - Azure Monitor Metrics
   - Custom metrics (e.g., trial recording rate)
   - Dashboards in Azure Portal

4. **Alerting**:
   - Azure Monitor Alerts
   - PagerDuty integration for critical alerts
   - Slack/Teams notifications

### Key Metrics to Track

| Metric | Threshold | Alert |
|--------|-----------|-------|
| **API Error Rate** | > 5% | Critical |
| **Database CPU** | > 80% | Warning |
| **Response Time (p95)** | > 500ms | Warning |
| **Failed Logins** | > 10 in 5 min | Security alert |
| **Offline Sync Failures** | > 1% | Critical |
| **Claims Denial Rate** | > 15% | Info (send to billing team) |

### Distributed Tracing Example

```typescript
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';

// Initialize tracer
const provider = new NodeTracerProvider();
const exporter = new AzureMonitorTraceExporter({
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

// Trace HTTP requests
app.use((req, res, next) => {
  const tracer = provider.getTracer('patient-service');
  const span = tracer.startSpan(`${req.method} ${req.path}`, {
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
      'user.id': req.user?.id
    }
  });
  
  res.on('finish', () => {
    span.setAttribute('http.status_code', res.statusCode);
    span.end();
  });
  
  next();
});
```

---

## Development Workflow

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/wabicare/platform.git
cd platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with Azure credentials

# 4. Start dependencies (Docker Compose)
docker-compose up -d # Starts Redis, SQL Server

# 5. Run database migrations
npm run migrate

# 6. Start microservices (parallel)
npm run dev:patient-service &
npm run dev:goal-service &
npm run dev:data-collection-service &

# 7. Start frontend
cd frontend
npm run dev
```

### Git Workflow

1. **Branching Strategy**: Git Flow
   - `main`: Production-ready code
   - `develop`: Integration branch
   - `feature/*`: Feature branches
   - `hotfix/*`: Urgent fixes

2. **Pull Request Process**:
   - Create feature branch from `develop`
   - Write tests for new code
   - Run linter and tests locally
   - Create PR with description
   - Automated checks run (tests, linting, security scan)
   - Code review by 2+ team members
   - Merge to `develop` after approval

3. **Commit Message Convention**:
   ```
   type(scope): subject

   body

   footer
   ```
   
   Example:
   ```
   feat(patient-service): add insurance authorization validation

   - Check authorization hours before session start
   - Display warning when < 10 hours remaining
   - Block session if authorization expired

   Closes #123
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Appendix: Reference Documents

- [PRD (Product Requirements Document)](./PRD.md)
- [Functional Specification](./FUNCTIONAL_SPEC.md)
- [Microsoft 365 Integration Guide](./M365_INTEGRATION.md)
- [API Documentation](https://api.wabicare.com/docs) - Swagger UI
- [Database Schema Diagrams](./diagrams/)
- [Mermaid Architecture Diagrams](./design_mermaid.md)

---

**Document History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-10-14 | Engineering Team | Initial draft |
| 1.0 | 2025-10-16 | Engineering Team | Added microservices details, M365 integration specs |

