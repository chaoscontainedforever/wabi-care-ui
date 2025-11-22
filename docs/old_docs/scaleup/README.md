# Wabi Care Scale-up Documentation

**Architecture**: Microservices  
**Timeline**: 12-15 weeks post-MVP  
**Target**: 50+ clinics, 1000+ users  
**Cost**: $1,500-2,000/month

---

## Overview

Scale-up documentation for migrating Wabi Care from a **modular monolith** to a **microservices architecture** after successfully validating the MVP with pilot customers.

**When to Scale**: After hitting 2+ triggers (100+ users, 5+ devs, AI costs > $1k/month, clear bottlenecks)

---

## Documentation Index

### Strategic Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| **[PRD.md](./PRD.md)** | Scale-up product vision and roadmap | Product, Stakeholders |
| **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** | How to migrate from MVP to Scale-up | Engineering, DevOps |
| **[MICROSERVICES.md](./MICROSERVICES.md)** | Detailed microservices specifications | Engineering |

### Technical Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** | Microservices architecture and implementation | Engineering, Architects |
| **[FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md)** | Enhanced user workflows for scale | Product, Design |
| **[M365_INTEGRATION.md](./M365_INTEGRATION.md)** | Full Microsoft 365 integration | Engineering |

### Design Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** | UI/UX guidelines (same as MVP) | Design, Frontend |

---

## Scale-up Architecture

### 10 Microservices

```
┌──────────────────────────────────────────────┐
│           Azure API Management               │
│         (API Gateway + Rate Limiting)        │
└──────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌─────────────┐         ┌─────────────┐
│ Auth Service│         │   Patient   │
│  (Node.js)  │         │   Service   │
└─────────────┘         └─────────────┘
        │                       │
        ▼                       ▼
┌─────────────┐         ┌─────────────┐
│    Goal     │         │    Data     │
│   Service   │         │ Collection  │
└─────────────┘         └─────────────┘
        │                       │
        ▼                       ▼
┌─────────────┐         ┌─────────────┐
│ Scheduling  │         │   Billing   │
│   Service   │         │   Service   │
└─────────────┘         └─────────────┘
        │                       │
        ▼                       ▼
┌─────────────┐         ┌─────────────┐
│Notification │         │  Analytics  │
│   Service   │         │   Service   │
└─────────────┘         └─────────────┘
                │
                ▼
        ┌─────────────┐
        │ AI Service  │
        │  (Python)   │
        └─────────────┘
```

### Service Priority

**P0 (MVP - Keep in Monolith Initially)**:
- API Gateway ✓
- Auth Service ✓
- Patient Service ✓
- Goal Service ✓
- Data Collection Service ✓

**P1 (Extract First - Weeks 1-8)**:
- AI Service (expensive, variable load)
- Data Collection Service (high traffic)
- Billing Service (critical, needs isolation)

**P2 (Extract Later - Weeks 9-15)**:
- Scheduling Service
- Notification Service
- Analytics Service

---

## Key Differences: MVP vs. Scale-up

| Aspect | MVP (Monolith) | Scale-up (Microservices) |
|--------|----------------|--------------------------|
| **Timeline** | 4-6 weeks | 12-15 weeks |
| **Team** | 2-3 developers | 5-7 developers |
| **Architecture** | Single Next.js app | 10 independent services |
| **Database** | Single Cosmos DB | Cosmos DB + Azure SQL + Synapse |
| **Deployment** | 1 Static Web App | 10 Container Apps + API Management |
| **Cost** | $300-500/month | $1,500-2,000/month |
| **Complexity** | Low | High |
| **Scaling** | Vertical (scale entire app) | Horizontal (scale services independently) |
| **Development** | Fast iteration | Parallel development |

---

## Migration Timeline

### Phase 1: Preparation (Weeks 1-2)
- Audit module dependencies
- Add service boundaries to monolith
- Setup Azure infrastructure
- Plan extraction order

### Phase 2: Extract Core Services (Weeks 3-8)
- **Week 3-5**: AI Service (most expensive, easiest to isolate)
- **Week 6-7**: Data Collection Service (high traffic)
- **Week 8**: Billing Service (critical isolation)

### Phase 3: Extract Remaining Services (Weeks 9-15)
- **Week 9-10**: Scheduling Service
- **Week 11-12**: Notification Service
- **Week 13-14**: Analytics Service
- **Week 15**: Testing, stabilization, buffer

### Phase 4: Deprecate Monolith (Week 16+)
- Keep Auth/Patient/Goal in minimal monolith OR
- Extract these last if truly needed

---

## Technology Stack (Scale-up)

### Microservices Frameworks
- **Node.js Services**: Express.js + TypeScript
- **AI/ML Service**: Python + FastAPI
- **API Gateway**: Azure API Management

### Databases
- **Cosmos DB**: Clinical data (patients, goals, sessions)
- **Azure SQL**: Transactional data (billing, scheduling)
- **Synapse Analytics**: Data warehouse (analytics, reporting)
- **Azure Blob Storage**: Documents, images
- **Redis Cache**: Session cache, rate limiting

### Infrastructure
- **Azure Container Apps**: Microservices hosting (serverless Kubernetes)
- **Azure API Management**: API gateway
- **Azure Service Bus**: Asynchronous messaging
- **Azure SignalR**: Real-time updates
- **Azure Key Vault**: Secrets management
- **Azure Monitor**: Logging and tracing

### DevOps
- **GitHub Actions**: CI/CD pipelines
- **Docker**: Container images
- **Terraform**: Infrastructure as Code
- **Azure Container Registry**: Private Docker registry

---

## Cost Breakdown (Scale-up)

| Service | SKU | Monthly Cost |
|---------|-----|--------------|
| **API Management** | Developer | $50 |
| **10 Container Apps** | Consumption (avg) | $200 |
| **Cosmos DB** | 4000 RU/s autoscale | $200 |
| **Azure SQL** | General Purpose, 2 vCores | $250 |
| **Synapse Analytics** | Serverless (pay-per-query) | $100 |
| **Azure OpenAI** | GPT-4, 1000 notes/week | $500 |
| **Blob Storage** | Hot tier, 100 GB | $20 |
| **Redis Cache** | Basic, 1 GB | $15 |
| **Service Bus** | Standard | $10 |
| **SignalR** | Standard, 100 concurrent | $50 |
| **Monitor + Logs** | Standard | $100 |
| **Total** | | **$1,495/month** |

**Per-User Cost** (100 users): $15/month  
**Customer Pricing**: $99/user/month  
**Gross Margin**: 85%

---

## Benefits of Microservices

### 1. Independent Scaling
Scale AI service to 10 instances while keeping Auth service at 1 instance.

### 2. Team Velocity
5 teams work on 5 different services simultaneously without conflicts.

### 3. Technology Flexibility
- Node.js for CRUD services
- Python for AI/ML services
- Match technology to problem

### 4. Fault Isolation
If AI service crashes, billing and data collection still work.

### 5. Independent Deployment
Deploy AI service 10x/day without touching other services.

---

## Challenges of Microservices

### 1. Complexity
10 services to deploy, monitor, and debug vs. 1.

### 2. Distributed Systems Issues
- Network latency
- Partial failures
- Eventual consistency
- Distributed transactions

### 3. Operational Overhead
Need DevOps expertise, monitoring, tracing, service mesh.

### 4. Higher Costs
$1,500/month vs. $300/month for MVP.

### 5. Development Overhead
Service contracts, API versioning, backwards compatibility.

---

## When NOT to Scale Up

❌ **Don't migrate if**:
- < 50 active users (premature)
- < 3 developers (overhead not justified)
- No clear performance bottleneck
- Still validating product-market fit
- Happy with current architecture

**Rule of Thumb**: If monolith is working fine, don't fix it.

---

## Success Criteria

### Technical Success
- ✅ 10 microservices deployed and stable
- ✅ < 1% error rate per service
- ✅ < 2s response time (95th percentile)
- ✅ 99.9% uptime SLA
- ✅ Zero data loss

### Business Success
- ✅ Team velocity increased (measured by deploys/week)
- ✅ Cost per user < $15/month
- ✅ Can scale to 1000+ users
- ✅ Support 50+ clinics

### Team Success
- ✅ 5-7 developers working efficiently
- ✅ Clear service ownership
- ✅ Reduced merge conflicts
- ✅ Faster feature delivery

---

## Migration Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Service extraction breaks functionality** | Medium | High | Extensive testing, blue-green deployment |
| **Performance degradation** | Medium | Medium | Load testing, monitoring |
| **Data migration issues** | Low | High | Dual-write pattern, backfill scripts |
| **Team coordination problems** | High | Medium | Clear service ownership, API contracts |
| **Cost overrun** | Medium | Low | Budget alerts, autoscaling limits |

---

## Team Structure (Scale-up)

### 5-7 Developer Team

**Team A: Core Services** (2 devs)
- Auth Service
- Patient Service  
- Goal Service

**Team B: Data & AI** (2 devs)
- Data Collection Service
- AI Service

**Team C: Operations** (2 devs)
- Billing Service
- Scheduling Service
- Notification Service

**Team D: Analytics** (1 dev, part-time)
- Analytics Service
- Synapse pipeline

**DevOps Engineer** (1, shared)
- Infrastructure
- CI/CD
- Monitoring

---

## Getting Started

### 1. Assess Readiness
Are you hitting 2+ migration triggers?
- [ ] 100+ active users
- [ ] 5+ developers
- [ ] AI costs > $1,000/month
- [ ] Clear performance bottleneck

### 2. Read Migration Guide
**Start here**: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

### 3. Plan First Extraction
Recommended: AI Service (highest value, lowest risk)

### 4. Allocate Resources
- 2-3 developers for 3-4 months
- Budget: $1,500-2,000/month Azure costs

### 5. Execute Phased Migration
Follow the 15-week timeline, adjust based on learnings.

---

## FAQ

**Q: Should we migrate all at once or gradually?**  
A: **Gradually**. Extract one service at a time, validate, then move to next. "Strangler Fig" pattern.

**Q: What if we only need to scale one service?**  
A: Perfect! Extract only that service (e.g., AI Service). Keep rest in monolith. Hybrid architecture is valid.

**Q: How do we handle database transactions across services?**  
A: Use Saga pattern or eventual consistency. Avoid distributed transactions.

**Q: What about local development?**  
A: Docker Compose to run all services locally OR mock external service APIs.

**Q: Can we go back to monolith if needed?**  
A: Yes! The modular structure makes it reversible. Just replace API calls with function calls.

---

## Support

**Questions?** Contact:
- Architecture: architecture@wabicare.com
- DevOps: devops@wabicare.com
- Product: product@wabicare.com

**Slack Channels**:
- #scaleup-migration
- #microservices-arch
- #devops-help

---

## Related Documentation

**MVP (Starting Point)**:
- [../mvp/README.md](../mvp/README.md) - Monolith architecture

**Visual Resources**:
- [../design/design_mermaid.md](../design/design_mermaid.md) - Architecture diagrams

**Project Root**:
- [../../README.md](../../README.md) - Project overview

---

**Last Updated**: October 16, 2025  
**Version**: 1.0  
**Status**: Planning Phase

