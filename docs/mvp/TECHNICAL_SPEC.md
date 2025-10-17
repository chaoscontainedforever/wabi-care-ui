# Wabi Care MVP: Technical Specification

**Version**: 1.0  
**Date**: October 16, 2025  
**Owner**: Engineering Team  
**Status**: Active Development

---

## Executive Summary

Wabi Care MVP is built as a **modular monolith** using Next.js 14, designed for rapid development and deployment within 4-6 weeks. This architecture prioritizes simplicity, speed to market, and ease of iteration for pilot customers while maintaining a clear path to microservices if needed post-validation.

**Architecture**: Next.js 14 full-stack monolith  
**Database**: Supabase (MVP) → Azure Cosmos DB (Scale-up)  
**Deployment**: Azure Static Web Apps  
**Cost**: $300-500/month

---

## Architecture Overview

### Modular Monolith Pattern

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 14 Application                 │
│                  (Single Deployable Unit)                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Frontend  │  │  API Routes │  │   Server    │   │
│  │  Components │  │  (/api/*)   │  │  Components │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│         │                │                  │           │
│         └────────────────┴──────────────────┘           │
│                          │                               │
│  ┌───────────────────────┴────────────────────────┐   │
│  │          Shared Business Logic Modules          │   │
│  ├──────────────────────────────────────────────────┤  │
│  │  /lib/data-collection  │  /lib/ai               │  │
│  │  /lib/scheduling       │  /lib/billing          │  │
│  │  /lib/patients         │  /lib/goals            │  │
│  │  /lib/auth             │  /lib/notifications    │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                               │
└──────────────────────────┼───────────────────────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │    Supabase (Postgres)        │
            │    Azure Cosmos DB (Phase 2)  │
            │                               │
            │  Collections:                 │
            │  - patients                   │
            │  - goals                      │
            │  - sessions                   │
            │  - users                      │
            │  - claims                     │
            └──────────────────────────────┘
```

### Why Modular Monolith?

**Benefits for MVP**:
1. **Fast Development**: Single codebase, no service boundaries
2. **Simple Deployment**: One build, one deploy
3. **Easy Debugging**: All code in one place
4. **Lower Cost**: $300-500/month vs. $1,500+ for microservices
5. **Clear Module Boundaries**: Easy to extract to microservices later

**Migration Path**: Each `/lib` module can become a microservice independently without rewriting application logic.

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | Full-stack framework (App Router) |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.x | Styling |
| **Shadcn UI** | Latest | Component library |
| **Zustand** | Latest | State management (lightweight) |
| **React Hook Form** | Latest | Form handling |
| **Zod** | Latest | Schema validation |
| **IndexedDB (Dexie.js)** | Latest | Offline storage |
| **Lucide React** | Latest | Icons |

### Backend (Next.js API Routes)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 14.x | Backend endpoints |
| **NextAuth.js** | Latest | Authentication |
| **@supabase/supabase-js** | Latest | Supabase client (current) |
| **@azure/cosmos** | Latest | Cosmos DB client (phase 2) |
| **Azure OpenAI SDK** | Latest | AI integration |
| **Azure Communication Services** | Latest | SMS/Email |
| **Microsoft Graph SDK** | Latest | M365 integration |

### Database

| Technology | Purpose |
|------------|---------|
| **Supabase Postgres** | Database (MVP) |
| **Azure Cosmos DB** | Database (Phase 2) |
| **Partition Key Strategy** | `practiceId` for multi-tenancy |

### AI/ML Services

| Service | Purpose |
|---------|---------|
| **Azure OpenAI** | GPT-4 for note generation |
| **Azure Speech Service** | Voice-to-text transcription |
| **Azure Content Safety** | Content moderation |

### Infrastructure

| Service | Purpose |
|---------|---------|
| **Azure Static Web Apps** | Frontend hosting + API routes |
| **Azure Cosmos DB** | Database |
| **Azure Blob Storage** | Documents, images |
| **Azure Key Vault** | Secrets management |
| **Azure Monitor** | Logging and monitoring |
| **Azure AD B2C** | Authentication |

---

## System Architecture

### Request Flow

```
1. User Request
   ↓
2. Azure Static Web Apps (CDN)
   ↓
3. Next.js App
   ├── Server Component (SSR) → Supabase (via RPC) *(MVP)*
   ├── Client Component (CSR) → API Route → Supabase *(MVP)*
   ├── Server Component (SSR) → Cosmos DB *(Phase 2)*
   ├── Client Component (CSR) → API Route → Cosmos DB *(Phase 2)*
   └── API Route → External Service (OpenAI, Graph API)
   ↓
4. Response
```

### Authentication Flow

```
1. User clicks "Login with Microsoft"
   ↓
2. NextAuth.js redirects to Azure AD B2C
   ↓
3. User authenticates with M365 credentials
   ↓
4. Azure AD returns token
   ↓
5. NextAuth.js creates session
   ↓
6. Session cookie stored (HTTP-only, secure)
   ↓
7. Subsequent requests include session
   ↓
8. Middleware validates session on each request
```

### Data Flow Example: Recording Session Data

```
1. Therapist records trial on mobile
   ↓
2. Data saved to IndexedDB (offline-first)
   ↓
3. When online, POST /api/sessions/trials
   ↓
4. API route validates request
   ↓
5. Save to Cosmos DB (sessions collection)
   ↓
6. Trigger real-time update (optional)
   ↓
7. Return success response
   ↓
8. Clear IndexedDB entry
```

---

## Database Design (Cosmos DB)

### Database Structure

**Database**: `wabicare-mvp`  
**Throughput**: 400-1000 RU/s (autoscale)  
**Partition Strategy**: Partition by `practiceId` for multi-tenancy

### Collections

#### 1. `users` Collection

**Partition Key**: `/practiceId`

```typescript
interface UserDocument {
  id: string; // UUID
  practiceId: string; // Partition key
  email: string;
  azureAdOid?: string; // Azure AD Object ID
  firstName: string;
  lastName: string;
  role: 'admin' | 'bcba' | 'rbt' | 'biller';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  preferences?: {
    notifications: boolean;
    language: string;
  };
}
```

#### 2. `patients` Collection

**Partition Key**: `/practiceId`

```typescript
interface PatientDocument {
  id: string;
  practiceId: string; // Partition key
  firstName: string;
  lastName: string;
  dob: string;
  diagnosis: string[];
  status: 'active' | 'inactive' | 'discharged';
  
  guardians: {
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
    email: string;
    phone: string;
    isPrimary: boolean;
  }[];
  
  insurance: {
    provider: string;
    memberId: string;
    authorizationNumber?: string;
    hoursAuthorized?: number;
    hoursUsed?: number;
    authorizationStartDate?: string;
    authorizationEndDate?: string;
  };
  
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 3. `goals` Collection

**Partition Key**: `/patientId`

```typescript
interface GoalDocument {
  id: string;
  patientId: string; // Partition key
  practiceId: string;
  
  domain: string; // "Communication", "Social Skills", etc.
  goalStatement: string;
  
  targets: {
    id: string;
    name: string;
    promptLevels: string[];
    masteryCriteria: {
      accuracyPercent: number;
      consecutiveSessions: number;
    };
    status: 'active' | 'mastered' | 'discontinued';
    masteredDate?: string;
  }[];
  
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'discontinued';
  
  createdAt: string;
  updatedAt: string;
}
```

#### 4. `sessions` Collection

**Partition Key**: `/sessionId` (for high-volume writes)

```typescript
interface SessionDocument {
  id: string; // sessionId
  sessionId: string; // Partition key (same as id)
  practiceId: string;
  patientId: string;
  therapistId: string;
  goalId: string;
  targetId: string;
  
  startTime: string;
  endTime?: string;
  duration?: number;
  
  trials: {
    id: string;
    timestamp: string;
    trialNumber: number;
    correct: boolean;
    promptLevel: string;
    notes?: string;
  }[];
  
  summary: {
    totalTrials: number;
    correctTrials: number;
    incorrectTrials: number;
    accuracy: number;
  };
  
  sessionNotes?: string;
  aiGeneratedNote?: string;
  
  status: 'in_progress' | 'completed' | 'cancelled';
  syncStatus: 'pending' | 'synced';
  
  createdAt: string;
  updatedAt: string;
}
```

#### 5. `claims` Collection

**Partition Key**: `/practiceId`

```typescript
interface ClaimDocument {
  id: string;
  practiceId: string; // Partition key
  patientId: string;
  sessionIds: string[];
  
  claimNumber: string;
  serviceDate: string;
  
  payer: string;
  memberId: string;
  authorizationNumber?: string;
  
  cptCodes: {
    code: string;
    units: number;
    amount: number;
  }[];
  
  billedAmount: number;
  status: 'draft' | 'ready' | 'submitted' | 'paid' | 'denied';
  
  aiValidation?: {
    riskScore: number;
    flags: string[];
    recommendations: string[];
  };
  
  createdAt: string;
  updatedAt: string;
}
```

### Cosmos DB Configuration (Phase 2)

```typescript
// lib/cosmos.ts
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!
});

export const database = client.database('wabicare-prod');

// Autoscale throughput (400-1000 RU/s)
export const containers = {
  users: database.container('users'),
  patients: database.container('patients'),
  goals: database.container('goals'),
  sessions: database.container('sessions'),
  claims: database.container('claims')
};
```

> **Note:** For the MVP, Supabase handles all persistence. The Cosmos client above becomes active during the scale-up phase once data migration completes.

---

## Module Structure

### `/lib` Directory Organization

```
lib/
├── auth/
│   ├── nextauth.ts          # NextAuth configuration
│   ├── middleware.ts         # Auth middleware
│   └── permissions.ts        # RBAC logic
│
├── patients/
│   ├── queries.ts            # Get, list patients
│   ├── mutations.ts          # Create, update, delete
│   └── types.ts              # TypeScript interfaces
│
├── goals/
│   ├── queries.ts
│   ├── mutations.ts
│   ├── templates.ts          # Goal bank templates
│   └── types.ts
│
├── data-collection/
│   ├── sessions.ts           # Session management
│   ├── trials.ts             # Trial recording
│   ├── offline-sync.ts       # Sync logic
│   └── types.ts
│
├── ai/
│   ├── openai.ts             # Azure OpenAI client
│   ├── note-generation.ts    # Generate progress notes
│   ├── billing-analysis.ts   # Smart billing
│   ├── scheduling.ts         # Predictive scheduling
│   └── risk-alerts.ts        # Patient risk detection
│
├── scheduling/
│   ├── appointments.ts       # CRUD operations
│   ├── availability.ts       # Check availability
│   ├── graph-calendar.ts     # Outlook sync
│   └── types.ts
│
├── billing/
│   ├── claims.ts             # Claim generation
│   ├── cpt-codes.ts          # CPT mapping logic
│   ├── validation.ts         # Pre-submission validation
│   └── types.ts
│
├── notifications/
│   ├── teams.ts              # Teams notifications
│   ├── email.ts              # Email via Azure Communication Services
│   └── sms.ts                # SMS notifications
│
├── m365/
│   ├── graph-client.ts       # Microsoft Graph API client
│   ├── onedrive.ts           # OneDrive integration
│   └── calendar.ts           # Outlook calendar
│
└── utils/
    ├── cosmos.ts             # Cosmos DB client
    ├── validation.ts         # Zod schemas
    └── errors.ts             # Error handling
```

---

## API Routes

### REST API Design

**Base URL**: `/api/v1/*`

### Authentication Endpoints

```typescript
POST   /api/auth/signin       # Azure AD SSO redirect
GET    /api/auth/callback     # OAuth callback
POST   /api/auth/signout      # Logout
GET    /api/auth/session      # Get current session
```

### Patient Endpoints

```typescript
GET    /api/v1/patients                # List patients
GET    /api/v1/patients/:id            # Get patient details
POST   /api/v1/patients                # Create patient
PUT    /api/v1/patients/:id            # Update patient
DELETE /api/v1/patients/:id            # Soft delete
GET    /api/v1/patients/:id/sessions   # Get patient sessions
GET    /api/v1/patients/:id/goals      # Get patient goals
```

### Goal Endpoints

```typescript
GET    /api/v1/goals                   # List goals (by patientId)
GET    /api/v1/goals/:id               # Get goal details
POST   /api/v1/goals                   # Create goal
PUT    /api/v1/goals/:id               # Update goal
DELETE /api/v1/goals/:id               # Delete goal
GET    /api/v1/goals/templates         # Get goal bank templates
POST   /api/v1/goals/from-template     # Create from template
```

### Session Endpoints

```typescript
POST   /api/v1/sessions/start          # Start new session
POST   /api/v1/sessions/:id/trials     # Record trial
POST   /api/v1/sessions/:id/end        # End session
GET    /api/v1/sessions/:id            # Get session details
PUT    /api/v1/sessions/:id/notes      # Update notes
POST   /api/v1/sessions/sync           # Sync offline sessions
```

### AI Endpoints

```typescript
POST   /api/v1/ai/generate-note        # Generate progress note
POST   /api/v1/ai/analyze-claim        # Smart billing analysis
POST   /api/v1/ai/suggest-schedule     # Scheduling suggestion
GET    /api/v1/ai/risk-alerts          # Get patient risk alerts
```

### Example API Route Implementation

```typescript
// app/api/v1/sessions/[id]/trials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { recordTrial } from '@/lib/data-collection/trials';

const trialSchema = z.object({
  correct: z.boolean(),
  promptLevel: z.enum(['independent', 'partial', 'full']),
  notes: z.string().optional()
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Validate request body
    const body = await req.json();
    const data = trialSchema.parse(body);
    
    // 3. Record trial
    const trial = await recordTrial(params.id, {
      ...data,
      therapistId: session.user.id,
      timestamp: new Date().toISOString()
    });
    
    // 4. Return response
    return NextResponse.json({ trial });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error recording trial:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## AI Integration

### Azure OpenAI Configuration

```typescript
// lib/ai/openai.ts
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY!)
);

export async function generateNote(sessionData: SessionData): Promise<string> {
  const systemPrompt = `You are an experienced BCBA writing clinical progress notes...`;
  
  const userPrompt = `
    Session Data:
    - Patient: ${sessionData.patientName}
    - Goal: ${sessionData.goalStatement}
    - Trials: ${sessionData.totalTrials}
    - Accuracy: ${sessionData.accuracy}%
    
    Generate a professional progress note.
  `;
  
  const response = await client.getChatCompletions(
    'gpt-4', // deployment name
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    {
      temperature: 0.3, // More deterministic
      maxTokens: 1000
    }
  );
  
  return response.choices[0].message?.content || '';
}
```

### Cost Optimization

```typescript
// Cache frequently used prompts
const promptCache = new Map<string, string>();

// Use cheaper model for simple tasks
function selectModel(complexity: 'simple' | 'complex'): string {
  return complexity === 'simple' ? 'gpt-3.5-turbo' : 'gpt-4';
}

// Batch requests when possible
async function batchGenerateNotes(sessions: SessionData[]): Promise<string[]> {
  // Process in parallel with rate limiting
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < sessions.length; i += batchSize) {
    const batch = sessions.slice(i, i + batchSize);
    const notes = await Promise.all(batch.map(generateNote));
    results.push(...notes);
  }
  
  return results;
}
```

---

## Offline-First Data Collection

### IndexedDB Schema

```typescript
// lib/offline/db.ts
import Dexie, { Table } from 'dexie';

interface OfflineSession {
  id: string;
  sessionId: string;
  data: SessionDocument;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'error';
  lastModified: number;
  retryCount: number;
}

class WabiCareDB extends Dexie {
  sessions!: Table<OfflineSession>;
  
  constructor() {
    super('wabicare-offline');
    this.version(1).stores({
      sessions: 'id, sessionId, syncStatus, lastModified'
    });
  }
}

export const db = new WabiCareDB();
```

### Sync Strategy

```typescript
// lib/offline/sync.ts
export async function syncPendingSessions() {
  const pending = await db.sessions
    .where('syncStatus')
    .equals('pending')
    .toArray();
  
  for (const session of pending) {
    try {
      // Update status
      await db.sessions.update(session.id, { syncStatus: 'syncing' });
      
      // Sync to server
      const response = await fetch('/api/v1/sessions/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session.data)
      });
      
      if (response.ok) {
        // Mark as synced
        await db.sessions.update(session.id, { syncStatus: 'synced' });
        
        // Delete after 24 hours
        setTimeout(() => db.sessions.delete(session.id), 24 * 60 * 60 * 1000);
      } else {
        throw new Error('Sync failed');
      }
      
    } catch (error) {
      // Retry with exponential backoff
      const retryCount = session.retryCount + 1;
      await db.sessions.update(session.id, {
        syncStatus: retryCount < 3 ? 'pending' : 'error',
        retryCount
      });
    }
  }
}

// Auto-sync when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', syncPendingSessions);
  
  // Also sync every 30 seconds if online
  setInterval(() => {
    if (navigator.onLine) {
      syncPendingSessions();
    }
  }, 30000);
}
```

---

## Deployment

### Azure Static Web Apps Configuration

```yaml
# staticwebapp.config.json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/admin/*",
      "allowedRoles": ["admin"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/*.{css,scss,js,png,gif,ico,jpg,svg}"]
  },
  "globalHeaders": {
    "content-security-policy": "default-src 'self' https://*.azure.com",
    "strict-transport-security": "max-age=31536000; includeSubDomains",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY"
  }
}
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy-mvp.yml
name: Deploy MVP to Azure

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: ".next"
```

---

## Security

### Authentication & Authorization

```typescript
// lib/auth/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function authMiddleware(req: NextRequest) {
  const token = await getToken({ req });
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return null; // Allow request
}

// Role-based access control
export function requireRole(role: string) {
  return async (req: NextRequest) => {
    const token = await getToken({ req });
    
    if (!token || token.role !== role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return null;
  };
}
```

### Data Encryption

- **At Rest**: Azure Cosmos DB automatic encryption
- **In Transit**: TLS 1.3
- **Secrets**: Azure Key Vault

### HIPAA Compliance

- **BAA**: Azure Business Associate Agreement signed
- **Audit Logs**: All data access logged to Azure Monitor
- **Data Retention**: 7 years minimum
- **Access Controls**: RBAC enforced at API level

---

## Monitoring & Observability

### Azure Monitor Configuration

```typescript
// lib/monitoring/insights.ts
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING
  }
});

appInsights.loadAppInsights();

export function trackEvent(name: string, properties?: Record<string, any>) {
  appInsights.trackEvent({ name, properties });
}

export function trackError(error: Error) {
  appInsights.trackException({ exception: error });
}
```

### Key Metrics to Track

| Metric | Threshold | Action |
|--------|-----------|--------|
| API Response Time | > 2s | Alert DevOps |
| Error Rate | > 5% | Alert Team |
| AI Generation Time | > 30s | Optimize prompts |
| Offline Sync Failures | > 1% | Investigate |

---

## Cost Estimate

### Monthly Azure Costs (MVP)

| Service | SKU | Cost |
|---------|-----|------|
| **Static Web Apps** | Standard | $9 |
| **Cosmos DB** | 400 RU/s autoscale | $25-50 |
| **Blob Storage** | Hot tier, 10 GB | $2 |
| **Azure OpenAI** | GPT-4, ~200 notes/week | $100-150 |
| **Azure AD B2C** | Free tier (< 50k MAU) | $0 |
| **Azure Monitor** | Basic logs | $10 |
| **Total** | | **$150-220/month** |

**Per-User Cost**: ~$3-5/month (50 users)  
**Pricing to Customer**: $49/user/month  
**Gross Margin**: 90%+

---

## Development Workflow

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/wabicare/mvp.git
cd mvp

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with Azure credentials

# 4. Run development server
npm run dev
```

### Environment Variables

```env
# Azure Cosmos DB
COSMOS_ENDPOINT=https://wabicare-mvp.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://wabicare-openai.openai.azure.com/
AZURE_OPENAI_KEY=your-openai-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# Azure AD
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# Microsoft Graph
GRAPH_CLIENT_ID=your-graph-client-id
GRAPH_CLIENT_SECRET=your-graph-secret
```

---

## Migration Path to Microservices

### When to Migrate

**Triggers**:
- 100+ active users (scaling issues)
- 5+ developers (coordination complexity)
- AI costs > $1,000/month (need independent scaling)
- Specific service bottleneck identified

### How to Extract a Service

Example: Extract AI Service

**Before** (Monolith):
```typescript
// lib/ai/note-generation.ts
import { generateNote } from './openai';
export async function createNote(session) {
  return await generateNote(session);
}
```

**After** (Microservice):
```typescript
// lib/api-clients/ai-service.ts
export async function createNote(session) {
  const response = await fetch('https://ai-service.wabicare.com/notes', {
    method: 'POST',
    body: JSON.stringify(session)
  });
  return response.json();
}
```

**Migration Steps**:
1. Create new microservice repo
2. Copy `/lib/ai/*` code to new service
3. Deploy microservice to Azure Container Apps
4. Update monolith to call microservice API
5. Monitor for issues
6. Remove `/lib/ai/*` from monolith after validation

---

## Appendix: Reference Documents

- [PRD](./PRD.md) - Product requirements
- [AI Showcase](./AI_SHOWCASE.md) - AI features deep dive
- [Features Spec](./FEATURES.md) - Detailed feature requirements
- [Infrastructure Guide](./INFRASTRUCTURE.md) - Azure setup instructions
- [Design System](./DESIGN_SYSTEM.md) - UI/UX guidelines

---

**Document History**:

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-16 | Engineering Team | Initial MVP technical specification |

