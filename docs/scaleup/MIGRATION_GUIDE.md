# Migration Guide: MVP Monolith → Scale-up Microservices

**Version**: 1.0  
**Date**: October 16, 2025  
**Purpose**: Guide for migrating from modular monolith to microservices

---

## When to Migrate

### Migration Triggers

Migrate when you hit **2 or more** of these triggers:

| Trigger | Threshold | Why Migrate |
|---------|-----------|-------------|
| **Active Users** | > 100 users | Monolith performance bottlenecks |
| **Team Size** | 5+ developers | Coordination complexity |
| **AI Costs** | > $1,000/month | Need independent AI scaling |
| **Data Volume** | > 1M sessions | Database performance issues |
| **Geographic Expansion** | Multiple regions | Need regional deployments |
| **Service Bottleneck** | Specific module slow | Isolate and scale independently |

### Don't Migrate If:
- ❌ < 50 active users (premature optimization)
- ❌ < 3 developers (overhead not justified)
- ❌ No clear bottleneck (guessing at problems)
- ❌ Just launched pilot (need to validate first)

---

## Migration Strategy

### Phase 1: Prepare Monolith (2 weeks)

#### 1.1 Audit Module Dependencies

```bash
# Analyze module coupling
npm install madge
npx madge --circular src/lib
npx madge --image deps.png src/lib
```

**Goal**: Ensure `/lib` modules are truly independent

#### 1.2 Add Service Boundaries

```typescript
// Before: Direct function calls
import { createPatient } from '@/lib/patients/mutations';

// After: API client pattern (prep for extraction)
import { patientsClient } from '@/lib/api-clients';
const patient = await patientsClient.createPatient(data);
```

#### 1.3 Database Migration Prep

```typescript
// Add service-specific connection strings
const serviceConnections = {
  auth: process.env.AUTH_DB_CONNECTION,
  patients: process.env.PATIENTS_DB_CONNECTION,
  dataCollection: process.env.DATA_COLLECTION_DB_CONNECTION
};
```

---

### Phase 2: Extract First Service (2-3 weeks)

**Recommended First Service**: AI Service

**Why**: Most expensive, most variable load, easiest to isolate

#### 2.1 Create New Microservice Repo

```bash
# Create new repository
mkdir wabicare-ai-service
cd wabicare-ai-service

# Initialize
npm init -y
npm install fastapi uvicorn azure-openai python-dotenv
```

#### 2.2 Copy AI Module Code

```bash
# Copy AI logic from monolith
cp -r ../mvp/lib/ai/* ./src/
```

#### 2.3 Create REST API Wrapper

```python
# ai-service/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ai.note_generation import generate_note

app = FastAPI()

class NoteRequest(BaseModel):
    session_data: dict
    patient_id: str

@app.post("/notes/generate")
async def create_note(request: NoteRequest):
    try:
        note = await generate_note(request.session_data)
        return {"note": note}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### 2.4 Deploy to Azure Container Apps

```bash
# Build Docker image
docker build -t wabicare-ai-service .

# Push to Azure Container Registry
az acr login --name wabicare
docker tag wabicare-ai-service wabicare.azurecr.io/ai-service:v1
docker push wabicare.azurecr.io/ai-service:v1

# Deploy to Container Apps
az containerapp create \
  --name ai-service \
  --resource-group wabicare-rg \
  --image wabicare.azurecr.io/ai-service:v1 \
  --target-port 8000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 10
```

#### 2.5 Update Monolith to Call Microservice

```typescript
// Before
import { generateNote } from '@/lib/ai/note-generation';
const note = await generateNote(sessionData);

// After
const response = await fetch(process.env.AI_SERVICE_URL + '/notes/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${serviceToken}`
  },
  body: JSON.stringify({ session_data: sessionData })
});
const { note } = await response.json();
```

#### 2.6 Monitor & Validate

```typescript
// Add monitoring
import { trackDependency } from '@/lib/monitoring';

const startTime = Date.now();
try {
  const note = await aiServiceClient.generateNote(data);
  trackDependency('ai-service', 'generateNote', Date.now() - startTime, true);
  return note;
} catch (error) {
  trackDependency('ai-service', 'generateNote', Date.now() - startTime, false);
  throw error;
}
```

#### 2.7 Remove from Monolith

```bash
# After 2 weeks of stable operation, remove AI module
rm -rf lib/ai/*
# Keep only API client
```

---

### Phase 3: Extract Remaining Services (8-10 weeks)

**Extraction Order** (by priority):

1. ✅ **AI Service** (Week 1-3) - Done
2. **Data Collection Service** (Week 4-5) - High traffic, needs scaling
3. **Billing Service** (Week 6-7) - Critical, needs isolation
4. **Scheduling Service** (Week 8-9) - Medium priority
5. **Analytics Service** (Week 10-11) - Can wait

**Keep in Monolith** (for now):
- Auth Service (low traffic, critical)
- Patient Service (simple CRUD)
- Goal Service (simple CRUD)

---

## Data Migration Strategy

### Option 1: Shared Database (Easiest)

**Timeline**: Immediate  
**Risk**: Low  
**Cost**: $0

```
Monolith ──┐
           ├──→ Shared Cosmos DB
AI Service ┘
```

**Pros**: No data migration needed  
**Cons**: Not true microservices, database coupling

---

### Option 2: Database-per-Service (Recommended)

**Timeline**: 2-4 weeks per service  
**Risk**: Medium  
**Cost**: +$100-200/month per database

```
Monolith ──→ Cosmos DB (patients, goals, users)
AI Service ──→ Cosmos DB (ai_requests, ai_logs)
Billing Service ──→ Azure SQL (claims, payments)
```

**Migration Steps**:

1. **Create New Database**
```bash
az cosmosdb sql database create \
  --account-name wabicare-ai \
  --name ai-service-db
```

2. **Dual-Write Pattern** (transitional)
```typescript
// Write to both old and new databases
await Promise.all([
  oldDb.sessions.create(data),
  newDb.aiRequests.create(data)
]);
```

3. **Backfill Historical Data**
```typescript
// One-time migration script
const sessions = await oldDb.sessions.find({ hasAiNote: true });
for (const session of sessions) {
  await newDb.aiRequests.create({
    sessionId: session.id,
    note: session.aiGeneratedNote,
    timestamp: session.createdAt
  });
}
```

4. **Switch Reads to New Database**
```typescript
// Change queries to new database
const aiNote = await newDb.aiRequests.findOne({ sessionId });
```

5. **Remove Dual-Write**
```typescript
// Only write to new database
await newDb.aiRequests.create(data);
```

---

## Service Communication Patterns

### Option 1: Synchronous (REST APIs)

**Use for**: CRUD operations, immediate results needed

```typescript
// Monolith calls AI Service
const note = await fetch('https://ai-service/notes/generate', {
  method: 'POST',
  body: JSON.stringify({ sessionData })
});
```

**Pros**: Simple, immediate response  
**Cons**: Tight coupling, cascading failures

---

### Option 2: Asynchronous (Message Queue)

**Use for**: Background jobs, fire-and-forget

```typescript
// Monolith publishes event
await serviceBus.send('session.completed', {
  sessionId: '123',
  patientId: '456'
});

// AI Service subscribes
serviceBus.subscribe('session.completed', async (event) => {
  const note = await generateNote(event.sessionId);
  await saveNote(note);
});
```

**Pros**: Loose coupling, resilient  
**Cons**: Eventual consistency, more complex

---

### Recommended Hybrid Approach

```typescript
// Synchronous for user-facing actions
POST /api/sessions/:id/generate-note → AI Service (sync)

// Asynchronous for background tasks
session.completed event → Analytics Service (async)
session.completed event → Risk Alert Service (async)
```

---

## Zero-Downtime Deployment

### Blue-Green Deployment

```
┌─────────────┐
│  Blue (Old) │ ← 100% traffic
└─────────────┘

Deploy Green (New)
┌─────────────┐
│  Blue (Old) │ ← 100% traffic
│ Green (New) │ ← 0% traffic (testing)
└─────────────┘

Switch Traffic
┌─────────────┐
│  Blue (Old) │ ← 0% traffic (standby)
│ Green (New) │ ← 100% traffic
└─────────────┘

Remove Blue
┌─────────────┐
│ Green (New) │ ← 100% traffic
└─────────────┘
```

**Implementation** (Azure Container Apps):

```bash
# Deploy new revision
az containerapp revision copy \
  --name ai-service \
  --resource-group wabicare-rg

# Split traffic (canary)
az containerapp ingress traffic set \
  --name ai-service \
  --revision-weight old=90 new=10

# Monitor for 1 hour, then full switch
az containerapp ingress traffic set \
  --name ai-service \
  --revision-weight old=0 new=100
```

---

## Monitoring & Observability

### Distributed Tracing

```typescript
// Add trace context to all requests
import { trace, context } from '@opentelemetry/api';

const tracer = trace.getTracer('wabicare-monolith');
const span = tracer.startSpan('generate-note');

try {
  const note = await aiServiceClient.generateNote(data, {
    headers: { 'traceparent': span.spanContext().traceId }
  });
  span.end();
} catch (error) {
  span.recordException(error);
  span.end();
}
```

### Service Mesh (Optional)

**Use if**: 5+ microservices, complex routing needs

```bash
# Install Dapr
az containerapp env dapr-component set \
  --name wabicare-env \
  --dapr-component-name serviceBus

# Enable service-to-service auth
az containerapp dapr enable \
  --name ai-service \
  --dapr-app-id ai-service
```

---

## Cost Comparison

### MVP Monolith
```
Azure Static Web Apps:     $9
Azure Cosmos DB (400 RU/s): $25
Azure OpenAI:              $100
Total:                     $134/month
```

### Scale-up Microservices (10 Services)
```
API Gateway:               $50
10 Container Apps:         $200
Cosmos DB (4000 RU/s):     $200
Azure SQL:                 $250
Synapse Analytics:         $100
Azure OpenAI:              $500
Monitoring:                $100
Total:                     $1,400/month
```

**Cost Increase**: 10x  
**Justified When**: Revenue > $50k/month, team > 5 devs

---

## Rollback Plan

### If Microservice Fails

1. **Immediate**: Route traffic back to monolith
```bash
# Restore old revision
az containerapp ingress traffic set \
  --name ai-service \
  --revision-weight old=100 new=0
```

2. **Temporary Fix**: Keep both running
```typescript
// Fallback to monolith if microservice fails
try {
  return await aiServiceClient.generateNote(data);
} catch (error) {
  console.warn('AI service failed, falling back to monolith');
  return await monolithAI.generateNote(data);
}
```

3. **Long-term**: Fix microservice, redeploy

---

## Success Criteria

### Phase 1 Success (AI Service Extracted)
- ✅ AI service handles 100% of note generation requests
- ✅ Response time < 2s (95th percentile)
- ✅ Error rate < 1%
- ✅ Zero data loss
- ✅ Cost increase < 20%

### Full Migration Success (All Services Extracted)
- ✅ 10 independent microservices deployed
- ✅ Monolith deprecated (or minimal core only)
- ✅ Team velocity improved (multiple teams ship independently)
- ✅ Service-specific scaling working
- ✅ Cost per user < $15/month

---

## Timeline Summary

| Phase | Duration | Outcome |
|-------|----------|---------|
| **Prepare Monolith** | 2 weeks | Module boundaries clarified |
| **Extract AI Service** | 3 weeks | First microservice live |
| **Extract Data Collection** | 2 weeks | High-traffic service isolated |
| **Extract Billing** | 2 weeks | Critical service isolated |
| **Extract Scheduling** | 2 weeks | Core services complete |
| **Extract Analytics** | 2 weeks | Nice-to-have services |
| **Buffer & Testing** | 2 weeks | Stabilization |
| **Total** | **15 weeks (~4 months)** | Full microservices architecture |

---

## FAQs

**Q: Do we have to migrate all services?**  
A: No! You can keep low-traffic services (Auth, Patients, Goals) in the monolith indefinitely. Only extract services that need independent scaling.

**Q: What if we want to go back to monolith?**  
A: The API client pattern makes this easy. Just replace the API call with the original function call. Your business logic didn't change.

**Q: How do we handle database transactions across services?**  
A: Use the Saga pattern or eventual consistency. Avoid distributed transactions (too complex).

**Q: What about local development?**  
A: Use Docker Compose to run all microservices locally, or mock the API calls.

---

## Next Steps

1. **Assess Current State**: Are you hitting migration triggers?
2. **Plan Extraction Order**: Which service to extract first?
3. **Allocate Resources**: 2-3 devs for 3-4 months
4. **Start with AI Service**: Lowest risk, highest value
5. **Monitor & Learn**: Use learnings to improve next extractions

---

**Questions?** Contact: architecture@wabicare.com

**See Also**:
- [MICROSERVICES.md](./MICROSERVICES.md) - Detailed service specs
- [../mvp/TECHNICAL_SPEC.md](../mvp/TECHNICAL_SPEC.md) - Monolith architecture

