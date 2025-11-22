# Wabi Care: Design Documentation Index

**Last Updated**: October 16, 2025  
**Owner**: Product & Engineering Team  
**Version**: 2.0

---

## 📚 Overview

This folder contains comprehensive product and technical documentation for **Wabi Care**, an AI-first ABA practice management platform built on Microsoft Azure with deep Microsoft 365 integration.

**Key Differentiator**: Deep Microsoft 365 integration makes Wabi Care the obvious choice for 85% of ABA clinics and schools already using Microsoft 365.

---

## 📖 Document Hierarchy

```
docs/design/
│
├── PRD.md                    ← Start here (Product)
├── FUNCTIONAL_SPEC.md        ← For designers/PMs
├── TECHNICAL_SPEC.md         ← For engineers
├── M365_INTEGRATION.md       ← Our competitive moat
├── DESIGN_SYSTEM.md          ← UI/UX guidelines (NEW)
├── design_mermaid.md         ← Visual diagrams
└── architecture.md           ← **DEPRECATED** (see note below)
```

---

## 🎯 Quick Reference: Which Document Should I Read?

| Your Role | Start Here | Also Review |
|-----------|------------|-------------|
| **Product Manager** | [PRD.md](./PRD.md) | FUNCTIONAL_SPEC.md |
| **Designer / UX** | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | FUNCTIONAL_SPEC.md, PRD.md |
| **Frontend Developer** | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | TECHNICAL_SPEC.md |
| **Backend Engineer** | [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) | design_mermaid.md |
| **Sales / Partnerships** | [M365_INTEGRATION.md](./M365_INTEGRATION.md) | PRD.md |
| **DevOps / Infrastructure** | [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) | design_mermaid.md |
| **Security / Compliance** | [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) (Security section) | PRD.md (Compliance) |

---

## 📄 Core Documents

### 1. [PRD.md](./PRD.md) - Product Requirements Document

**Purpose**: Defines WHAT we're building and WHY

**Key Sections**:
- Problem Statement & Market Opportunity
- Competitive Landscape (CentralReach, Motivity, etc.)
- Target Users & Personas
- Core Features (MVP, Phase 2, Phase 3)
- Microsoft 365 Integration Strategy
- Success Metrics (KPIs)
- Go-to-Market Strategy & Pricing

**Audience**: Product managers, stakeholders, sales team  
**Length**: ~800 lines  
**Status**: ✅ Complete (v1.0)

**Key Takeaway**: We save clinicians 20+ hours/month through AI automation + Microsoft 365 integration.

---

### 2. [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md) - Functional Specification

**Purpose**: Defines HOW features work from user perspective

**Key Sections**:
- User Workflows (therapist, BCBA, admin, biller)
- Feature Details (data collection, scheduling, billing)
- UI Specifications (screen layouts, interactions)
- Business Rules (accuracy calculation, mastery criteria)
- Error Handling & Recovery
- Microsoft 365 Integration Workflows

**Audience**: Designers, product managers, QA engineers  
**Length**: ~650 lines  
**Status**: ✅ Complete (v1.0)

**Key Takeaway**: Mobile-first, offline-capable, one-tap data collection.

---

### 3. [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) - Technical Specification

**Purpose**: Defines HOW we build the system

**Key Sections**:
- System Architecture (microservices, API gateway)
- Technology Stack (Next.js, Node.js, Python, Azure)
- Microservices Design (10 services with complete specs)
  - API Gateway, Auth, Patient, Goal, Data Collection
  - Scheduling, Billing, Notification, Analytics, AI
- Database Design (Cosmos DB, Azure SQL, Synapse)
- API Specifications (REST, OpenAPI)
- Infrastructure & Deployment (CI/CD, monitoring)
- Security & Compliance (HIPAA, encryption, audit)

**Audience**: Software engineers, DevOps, architects  
**Length**: ~1200 lines  
**Status**: ✅ Complete (v1.0)

**Key Takeaway**: Cloud-native microservices on Azure with 99.9% uptime SLA.

---

### 4. [M365_INTEGRATION.md](./M365_INTEGRATION.md) - Microsoft 365 Integration Guide

**Purpose**: Deep dive on our #1 competitive differentiator

**Key Sections**:
- Strategic Value (why M365 integration matters)
- Teams Integration (notifications, bot, adaptive cards)
- Outlook Calendar (two-way sync, conflict detection)
- OneDrive & SharePoint (document storage, organization)
- Azure AD SSO (single sign-on, auto-provisioning)
- Power BI Embedded (custom dashboards)
- Implementation Plan (3-phase roadmap)
- Pricing & Packaging ($0 basic, $30 pro, $50 enterprise)

**Audience**: Sales team, partners, technical architects  
**Length**: ~900 lines  
**Status**: ✅ Complete (v1.0)

**Key Takeaway**: "Works inside Teams where your staff already are" - zero adoption friction.

---

### 5. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Design System

**Purpose**: Complete UI/UX design guidelines based on actual implementation

**Key Sections**:
- ✅ **Color System**: Subtle grey palette with pink/purple gradients
- ✅ **Typography**: Roboto font family (300-700 weights)
- ✅ **Spacing & Layout**: 4px-based spacing scale
- ✅ **Components**: Shadcn UI with custom styling
  - Gradient buttons with hover scale effects
  - White cards with pink/purple hover glow
  - Inputs, badges, tabs, avatars, dialogs
- ✅ **Interactions & Animations**: Smooth transitions, hover effects
- ✅ **Icons**: Lucide React icon library
- ✅ **Responsive Design**: Mobile-first breakpoints
- ✅ **Accessibility**: WCAG 2.1 AA compliance

**Audience**: Designers, frontend developers, UX engineers  
**Length**: ~650 lines  
**Status**: ✅ Complete (v1.0)

**Key Insight**: "Subtle grey background + white cards + vibrant gradients = professional, modern aesthetic"

---

### 6. [design_mermaid.md](./design_mermaid.md) - Visual Architecture Diagrams

**Purpose**: Visualize system architecture and workflows

**Contains 15 Diagrams**:
1. High-Level System Architecture
2. Azure AI Foundry Core Components
3. Feature Architecture Map
4. AI Clinical Co-Pilot Flow
5. Predictive Analytics Flow
6. Intelligent Scheduling Flow
7. AI Billing & RCM Flow
8. Offline Data Collection Flow
9. AI Assistant Chat Flow
10. Data Architecture & Flow
11. Security & Compliance Architecture
12. Deployment & DevOps Pipeline
13. User Journey (Therapist Daily Workflow)
14. Cost Optimization Strategy
15. Phased Implementation Roadmap

**Audience**: All technical stakeholders  
**Length**: ~970 lines (15 diagrams)  
**Status**: ✅ Complete (v1.0)

**How to View**:
- **GitHub**: Push to repo, diagrams render automatically
- **VS Code**: Install "Markdown Preview Mermaid Support" extension
- **Online**: Copy/paste into [Mermaid Live Editor](https://mermaid.live)

---

### 7. ~~architecture.md~~ - **DEPRECATED** ⚠️

**Status**: This file is deprecated as of October 16, 2025

**Why deprecated?**  
The original `architecture.md` (1767 lines) mixed product, functional, and technical concerns, making it hard to maintain and navigate.

**Where did content go?**
- **Product aspects** → [PRD.md](./PRD.md)
- **Functional aspects** → [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md)
- **Technical aspects** → [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)
- **Microsoft 365** → [M365_INTEGRATION.md](./M365_INTEGRATION.md)
- **Design system** → [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

**Action**: Use the new focused documents. `architecture.md` will be archived/deleted in the future.

---

## 🚀 Getting Started

### For New Team Members

**Week 1: Product Understanding**
1. Read [PRD.md](./PRD.md) - Understand the market, users, and vision
2. Read [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md) - Learn user workflows
3. Skim [M365_INTEGRATION.md](./M365_INTEGRATION.md) - Understand competitive advantage

**Week 2: Technical Onboarding**
1. Read [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) - Understand architecture
2. Review [design_mermaid.md](./design_mermaid.md) - Visualize system flows
3. Set up local development (see TECHNICAL_SPEC.md "Development Workflow")

---

### For Feature Development

**Before starting:**
1. ✅ Check [PRD.md](./PRD.md) - Is feature prioritized?
2. ✅ Read [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md) - What's the expected behavior?
3. ✅ Review [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) - Which services are affected?

**During development:**
- Reference [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) for API contracts, DB schemas
- Reference [M365_INTEGRATION.md](./M365_INTEGRATION.md) if integrating with M365

**After development:**
- Update docs if behavior or architecture changes

---

## 🎨 Key Technologies

### Frontend
- **Framework**: Next.js 14 (React 18, TypeScript 5)
- **Styling**: Tailwind CSS + Shadcn UI
- **State**: Zustand / React Context
- **Offline**: IndexedDB (Dexie.js)
- **Real-time**: SignalR Client

### Backend
- **Runtime**: Node.js 20 LTS (TypeScript)
- **Framework**: Express.js
- **AI/ML**: Python 3.11+ (FastAPI)
- **API Gateway**: Azure API Management

### Databases
- **Clinical Data**: Azure Cosmos DB (NoSQL)
- **Transactional**: Azure SQL Database
- **Analytics**: Azure Synapse Analytics
- **Documents**: Azure Blob Storage
- **Search**: Azure AI Search
- **Cache**: Azure Redis

### AI/ML
- **Orchestration**: Azure AI Foundry
- **Models**: Azure OpenAI (GPT-4, GPT-3.5, Embeddings)
- **Speech**: Azure Cognitive Services (Whisper)
- **ML Training**: Azure Machine Learning

### Infrastructure
- **Hosting**: Azure Container Apps (serverless)
- **Frontend**: Azure Static Web Apps
- **CI/CD**: GitHub Actions
- **Monitoring**: Azure Monitor + Application Insights
- **Secrets**: Azure Key Vault

---

## 💼 For Customer Demos

### Competitive Differentiation Talking Points

**1. Microsoft 365 Integration** (from [M365_INTEGRATION.md](./M365_INTEGRATION.md))
> "Wabi Care works inside Microsoft Teams where your staff already are. No duplicate data entry - appointments sync with Outlook calendar automatically. Documents save to your OneDrive - no extra storage costs."

**2. AI-First Features** (from [PRD.md](./PRD.md))
> "AI generates progress notes from voice recordings - save 10+ hours per week. Predict patient outcomes and identify at-risk patients early. Chat assistant answers questions about patients, schedules, and billing."

**3. Modern UX** (from [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md))
> "Mobile-first offline data collection - therapists work without WiFi. One-tap trial recording - fastest in the industry. Real-time accuracy updates during sessions."

**4. Built on Azure** (from [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md))
> "Runs on Microsoft Azure - the same cloud as your Office 365. Your IT team already trusts it. HIPAA compliant, 99.9% uptime SLA, enterprise-grade security."

---

## 📊 Service Priorities & Timeline

### **Phase 1: MVP (Weeks 1-4)** - P0 Services
✅ API Gateway  
✅ Auth Service  
✅ Patient Service  
✅ Goal Service  
✅ Data Collection Service

**Deliverable**: Core data collection workflow

---

### **Phase 2: Operational (Weeks 5-8)** - P1 Services
🚧 Scheduling Service  
🚧 Billing Service  
🚧 Notification Service

**Deliverable**: Complete operational platform (schedule, bill, notify)

---

### **Phase 3: Advanced (Weeks 9-12)** - P2 Services
🔮 Analytics Service  
🔮 AI Service

**Deliverable**: AI-powered insights and automation

---

## 🔄 Document Maintenance

### Versioning

All documents follow **semantic versioning**:
- **Major** (1.0 → 2.0): Breaking changes, architecture shifts
- **Minor** (1.0 → 1.1): New features, significant updates
- **Patch** (1.0.0 → 1.0.1): Bug fixes, clarifications

### Review Schedule

| Document | Review Frequency | Owner |
|----------|------------------|-------|
| PRD.md | Quarterly | Product Manager |
| FUNCTIONAL_SPEC.md | After each feature release | Product + Design |
| TECHNICAL_SPEC.md | Monthly or after arch changes | Tech Lead |
| M365_INTEGRATION.md | Quarterly or when MS releases new features | Integration Engineer |
| design_mermaid.md | As needed | Tech Lead |

### Contributing

**To update documentation:**
1. Create feature branch: `docs/update-xxx`
2. Make changes
3. Create PR with description
4. Request review from document owner
5. Update version number and document history
6. Merge after approval

---

## 📞 Support Channels

**Questions about documentation?**
- **Product questions**: Slack #product-questions
- **Technical questions**: Slack #engineering
- **M365 integration**: Slack #integrations

**Found an error or outdated info?**
- Create GitHub issue with label `documentation`
- Or submit PR directly

---

## 🔗 Related Documentation

### In Parent `/docs` Folder:
- [../README.md](../README.md) - Project overview
- [../DATA_COLLECTION_PLAN.md](../DATA_COLLECTION_PLAN.md) - Data collection feature plan
- [../SOFT_UI_DESIGN_RULES.md](../SOFT_UI_DESIGN_RULES.md) - UI design guidelines
- [../CHAT_ASSISTANT_README.md](../CHAT_ASSISTANT_README.md) - AI chat assistant guide

### External Links:
- [Azure Documentation](https://docs.microsoft.com/azure/)
- [Microsoft Graph API](https://learn.microsoft.com/graph/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Azure AI Foundry](https://learn.microsoft.com/azure/ai-studio/)

---

## 📈 Quick Stats

- **Total Lines of Documentation**: ~5,200 lines
- **Number of Core Documents**: 6 (PRD, Functional Spec, Technical Spec, M365 Integration, Design System, Diagrams)
- **Number of Diagrams**: 15 (Mermaid)
- **Number of Microservices**: 10
- **Estimated MVP Timeline**: 4 weeks (5 developers)
- **Target Market**: 50,000+ ABA practices in US
- **Estimated Monthly Azure Cost**: $1,500-2,000

---

## 🎯 Key Takeaways

1. **Product**: Save clinicians 20+ hours/month with AI + M365 integration
2. **Market**: 85% of clinics use M365 - this is our moat
3. **Architecture**: Cloud-native microservices on Azure
4. **Timeline**: 12 weeks to full platform (MVP in 4 weeks)
5. **Differentiation**: "Works inside Teams" - zero adoption friction

---

**Thank you for contributing to Wabi Care!** 🚀

For questions, contact the product or engineering team on Slack.

---

**Document History**:

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-15 | Initial version with architecture.md + design_mermaid.md |
| 2.0 | 2025-10-16 | Split into PRD, FUNCTIONAL_SPEC, TECHNICAL_SPEC, M365_INTEGRATION; deprecated architecture.md |
| 2.1 | 2025-10-16 | Added DESIGN_SYSTEM.md based on actual wabi-care-softui implementation |
