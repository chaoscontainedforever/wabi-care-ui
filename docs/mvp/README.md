# Wabi Care MVP Documentation

**Architecture**: Modular Monolith  
**Timeline**: 4-6 weeks  
**Target**: 2-5 pilot clinics  
**Cost**: $300-500/month

---

## Quick Start

**Building the MVP?** Start here:

1. **[PRD.md](./PRD.md)** - Product requirements and scope
2. **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** - Architecture and tech stack
3. **[AI_SHOWCASE.md](./AI_SHOWCASE.md)** - 5 AI features to demonstrate

---

## Documentation Index

### Product Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| **[PRD.md](./PRD.md)** | Product requirements, features, success metrics | Product, Sales, Stakeholders |
| **[AI_SHOWCASE.md](./AI_SHOWCASE.md)** | AI features deep dive and demo script | Product, Sales, Engineering |
| **[FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md)** | User workflows and UI specifications | Design, Product, QA |
| **[FEATURES.md](./FEATURES.md)** | Detailed feature specifications | Engineering, QA |

### Technical Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** | System architecture, database, APIs | Engineering, DevOps |
| **[INFRASTRUCTURE.md](./INFRASTRUCTURE.md)** | Azure setup and deployment | DevOps, Engineering |
| **[M365_INTEGRATION.md](./M365_INTEGRATION.md)** | Microsoft 365 integration guide | Engineering |

### Design Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** | UI/UX guidelines and components | Design, Frontend |

---

## MVP Overview

### Core Value Proposition

> **"One data entry, three automated workflows"**

```
Therapist Records Session
         ↓
   [AI Processing]
         ↓
    ┌────┴────┬────────┐
    ↓         ↓        ↓
AI Notes   Billing   Schedule
 (auto)    (auto)    (smart)
```

**Result**: Save 20+ hours per therapist per month

---

### 6 AI Features (MVP)

1. **AI Progress Notes** - Voice → GPT-4 → Clinical note (saves 13 min/note)
2. **Smart Billing** - Session data → AI validates → Pre-approved claim (< 5% errors)
3. **Predictive Scheduling** - AI suggests optimal next appointment
4. **Real-Time Insights** - Mid-session feedback to therapists
5. **AI Co-pilot Assistant** - Real-time BCBA guidance during sessions
6. **Risk Alerts** - Early warning for at-risk patients

See [AI_SHOWCASE.md](./AI_SHOWCASE.md) for details.

---

### Technology Stack

**Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Shadcn UI  
**Backend**: Next.js API Routes  
**Database**: Azure Cosmos DB (single instance)  
**AI**: Azure OpenAI (GPT-4), Azure Speech Service  
**Auth**: NextAuth.js + Azure AD B2C  
**M365**: Microsoft Graph API (Teams, Outlook, OneDrive)  
**Hosting**: Azure Static Web Apps

---

### Architecture: Modular Monolith

```
Next.js 14 Application
├── Frontend (React components)
├── API Routes (/api/*)
├── Business Logic Modules:
│   ├── /lib/data-collection
│   ├── /lib/ai
│   ├── /lib/scheduling
│   ├── /lib/billing
│   └── /lib/m365
└── Single Database (Cosmos DB)
```

**Why Monolith?**
- ✅ 4-6 week development (vs. 10-12 for microservices)
- ✅ Simple deployment (one build, one deploy)
- ✅ Easy debugging (all code in one place)
- ✅ Low cost ($300-500/month)
- ✅ Clear migration path to microservices later

---

### MVP Scope (4-6 Weeks)

#### Week 1-2: Core Data Collection
- Patient management
- Goal creation (templates)
- Mobile data collection
- Offline sync (IndexedDB)

#### Week 3-4: AI Features
- Azure OpenAI setup
- AI note generation
- Smart billing prep
- Scheduling suggestions

#### Week 5-6: Polish & Integration
- Microsoft 365 integration
- Teams notifications
- Bug fixes, testing
- Pilot onboarding materials

---

### Success Metrics (Pilot)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time Saved** | 20+ hours/therapist/month | Survey |
| **AI Note Quality** | 90%+ satisfaction | User feedback |
| **Billing Error Rate** | < 5% | Claim validation |
| **User Engagement** | 80%+ weekly active | Analytics |
| **NPS** | > 50 | Quarterly survey |

---

## Getting Started

### For Product Managers
1. Read [PRD.md](./PRD.md) - Understand scope and priorities
2. Review [AI_SHOWCASE.md](./AI_SHOWCASE.md) - Learn demo script
3. Check [FEATURES.md](./FEATURES.md) - Detailed requirements

### For Engineers
1. Read [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) - Architecture overview
2. Follow [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) - Setup Azure
3. Clone repo and run `npm install`

### For Designers
1. Review [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - UI guidelines
2. Check [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md) - User workflows

### For Sales/Partnerships
1. Read [PRD.md](./PRD.md) - Value proposition
2. Review [AI_SHOWCASE.md](./AI_SHOWCASE.md) - 5-minute demo script
3. Check [M365_INTEGRATION.md](./M365_INTEGRATION.md) - Competitive advantage

---

## Cost Summary

### Development Cost (4-6 Weeks)

**Team**: 2-3 developers  
**Effort**: 240-360 developer hours  
**Timeline**: 6 weeks (with buffer)

### Monthly Operating Cost

| Service | Cost |
|---------|------|
| Azure Static Web Apps | $9 |
| Azure Cosmos DB (400 RU/s) | $25-50 |
| Azure OpenAI (GPT-4) | $100-150 |
| Azure Storage | $5 |
| Azure Monitor | $10 |
| **Total** | **$150-225/month** |

**Per-User Cost**: $3-5/month (50 pilot users)  
**Pilot Pricing**: $49/user/month  
**Gross Margin**: 90%+

---

## Pilot Customer Profile

**Ideal Pilot Clinic**:
- ✅ 5-20 therapists
- ✅ 30-100 active patients
- ✅ Uses Microsoft 365 (Teams, Outlook)
- ✅ Frustrated with current software
- ✅ Willing to provide weekly feedback
- ✅ Can commit 2-3 power users

**Pilot Success Criteria**:
- 80%+ weekly active users
- NPS > 50
- 2+ testimonials
- 70%+ convert to paid

---

## Migration to Microservices

**When to Consider Scale-up**:
- 100+ active users
- 5+ developers
- AI costs > $1,000/month
- Specific bottleneck identified

**How**: See [../scaleup/MIGRATION_GUIDE.md](../scaleup/MIGRATION_GUIDE.md)

Each `/lib` module (data-collection, ai, billing, etc.) can be extracted to an independent microservice without rewriting application logic.

---

## Competitive Advantages (MVP)

### vs. CentralReach, Motivity, SpectrumAI

| Feature | Competitors | Wabi Care MVP |
|---------|-------------|---------------|
| **Time to Value** | 6-12 weeks onboarding | 1 week |
| **AI Note Generation** | ❌ Manual | ✅ GPT-4 powered |
| **Smart Billing** | ⚠️ Manual | ✅ AI-validated |
| **M365 Integration** | ⚠️ Limited | ✅ Deep (Teams, Outlook, OneDrive) |
| **Offline Mobile** | ⚠️ Limited | ✅ Excellent |
| **Cost (pilot)** | $99-150/user | **$49/user** |

**Key Differentiator**: "AI-first, works inside Microsoft Teams, ready in days not months"

---

## FAQ

**Q: Why monolith instead of microservices?**  
A: For 2-5 pilot clinics, microservices add complexity without benefits. Monolith is faster to build, easier to debug, and costs 5x less. We can migrate to microservices post-validation.

**Q: What if we need to scale quickly?**  
A: The modular structure makes extraction easy. Each `/lib` module becomes a microservice. See Scale-up docs for migration path.

**Q: How much will AI cost?**  
A: ~$3-5 per user per month for GPT-4 notes + billing analysis. Well within pricing margins.

**Q: What about HIPAA compliance?**  
A: Azure services are HIPAA-compliant with signed BAA. All data encrypted at rest and in transit. Audit logs for all access.

**Q: Can we white-label for different practices?**  
A: Not in MVP (adds complexity). Post-pilot feature if demand exists.

---

## Support

**Questions?** Contact:
- Product: product@wabicare.com
- Engineering: dev@wabicare.com
- Sales: sales@wabicare.com

**Slack Channels**:
- #mvp-development
- #pilot-customers
- #product-feedback

---

## Related Documentation

**Scale-up (Post-Pilot)**:
- [../scaleup/README.md](../scaleup/README.md) - Microservices architecture

**Design Resources**:
- [../design/design_mermaid.md](../design/design_mermaid.md) - Visual diagrams

**Project Root**:
- [../../README.md](../../README.md) - Project overview

---

**Last Updated**: October 16, 2025  
**Version**: 1.0  
**Status**: Active Development

