# Wabi Care Documentation

**Welcome!** This documentation is organized into two distinct paths based on your stage of development.

---

## 🎯 Choose Your Path

### 🚀 Building MVP for Pilot Customers?

**→ Start with [MVP Documentation](./mvp/README.md)**

Perfect for:
- ✅ First 2-5 pilot clinics
- ✅ 10-50 users
- ✅ 2-3 developers
- ✅ Need to ship in 4-6 weeks
- ✅ Budget: $300-500/month

**Architecture**: Modular monolith (Next.js 14)  
**Focus**: AI-first features, fast iteration, simple deployment

**Start here**: [MVP PRD](./mvp/PRD.md) → [Technical Spec](./mvp/TECHNICAL_SPEC.md) → [AI Showcase](./mvp/AI_SHOWCASE.md)

---

### 📈 Scaling Post-Pilot?

**→ See [Scale-up Documentation](./scaleup/README.md)**

Perfect for:
- ✅ 50+ clinics, 1000+ users
- ✅ 5-7 developers
- ✅ Clear performance bottlenecks
- ✅ 3-4 months for migration
- ✅ Budget: $1,500-2,000/month

**Architecture**: 10 microservices (Azure Container Apps)  
**Focus**: Independent scaling, team velocity, enterprise-grade

**Start here**: [Migration Guide](./scaleup/MIGRATION_GUIDE.md) → [Microservices Spec](./scaleup/MICROSERVICES.md)

---

## 📚 Quick Reference

### MVP Documentation

| Doc | Purpose | Key Info |
|-----|---------|----------|
| [PRD](./mvp/PRD.md) | Product requirements | 6 AI features, pilot scope |
| [Technical Spec](./mvp/TECHNICAL_SPEC.md) | Architecture | Monolith, Cosmos DB, Next.js |
| [AI Showcase](./mvp/AI_SHOWCASE.md) | AI features | GPT-4 notes, smart billing |
| [Infrastructure](./mvp/INFRASTRUCTURE.md) | Azure setup | Static Web Apps, ~$300/mo |
| [Design System](./mvp/DESIGN_SYSTEM.md) | UI/UX | Shadcn UI, Tailwind |

### Scale-up Documentation

| Doc | Purpose | Key Info |
|-----|---------|----------|
| [PRD](./scaleup/PRD.md) | Scale vision | Enterprise roadmap |
| [Technical Spec](./scaleup/TECHNICAL_SPEC.md) | Microservices | 10 services, Container Apps |
| [Migration Guide](./scaleup/MIGRATION_GUIDE.md) | How to migrate | 15-week timeline |
| [Microservices](./scaleup/MICROSERVICES.md) | Service breakdown | Detailed specs per service |
| [M365 Integration](./scaleup/M365_INTEGRATION.md) | Microsoft 365 | Teams, Outlook, OneDrive |

### Design Resources

| Doc | Purpose |
|-----|---------|
| [Mermaid Diagrams](./design/design_mermaid.md) | Visual architecture diagrams |
| [Design System](./design/DESIGN_SYSTEM.md) | Comprehensive UI/UX guidelines |

---

## 🎨 Design System

Consistent UI/UX across both MVP and Scale-up:

- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS + Shadcn UI
- **Color Palette**: Subtle blues/purples (healthcare-friendly)
- **Typography**: Roboto (clean, professional)
- **Icons**: Lucide React

**See**: [Design System](./design/DESIGN_SYSTEM.md)

---

## 🏗️ Architecture Comparison

### MVP: Modular Monolith

```
┌──────────────────────────────────┐
│    Next.js 14 Application        │
│    (Single Deployment)           │
├──────────────────────────────────┤
│  /lib/data-collection            │
│  /lib/ai (Azure OpenAI)          │
│  /lib/billing                    │
│  /lib/scheduling                 │
└──────────────────────────────────┘
              ↓
    ┌──────────────────┐
    │  Cosmos DB       │
    │  (Single DB)     │
    └──────────────────┘
```

**Pros**: Fast, simple, cheap  
**Cons**: Limited scaling, single point of failure

---

### Scale-up: Microservices

```
┌───────────────────────────────────┐
│    Azure API Management           │
└───────────────────────────────────┘
       ↓           ↓          ↓
┌────────────┐ ┌────────────┐ ┌────────────┐
│  Patient   │ │ Data Coll  │ │ AI Service │
│  Service   │ │  Service   │ │  (Python)  │
└────────────┘ └────────────┘ └────────────┘
       ↓           ↓          ↓
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Cosmos DB  │ │ Cosmos DB  │ │ Azure SQL  │
└────────────┘ └────────────┘ └────────────┘
```

**Pros**: Independent scaling, team velocity  
**Cons**: Complex, expensive, operational overhead

---

## 🚦 Decision Guide

### Start with MVP if:
- 🟢 Pilot customers (< 50 users)
- 🟢 Small team (2-3 devs)
- 🟢 Validating product-market fit
- 🟢 Need to ship quickly (4-6 weeks)
- 🟢 Limited budget ($500/month)

### Scale to Microservices when:
- 🔴 100+ active users
- 🔴 5+ developers
- 🔴 AI costs > $1,000/month
- 🔴 Performance bottlenecks
- 🔴 Need independent service scaling

### Stay with MVP if:
- 🟡 Monolith working fine
- 🟡 No clear bottlenecks
- 🟡 Team velocity good
- 🟡 Costs under control

**Rule**: Don't premature optimize. Start simple, scale when needed.

---

## 💰 Cost Comparison

| Item | MVP | Scale-up | Delta |
|------|-----|----------|-------|
| **Infrastructure** | $150/mo | $500/mo | +233% |
| **AI/ML** | $100/mo | $500/mo | +400% |
| **Database** | $50/mo | $450/mo | +800% |
| **Monitoring** | $10/mo | $100/mo | +900% |
| **Total** | **$310/mo** | **$1,550/mo** | **+400%** |
| **Per User (50)** | **$6/user** | **$31/user** | |
| **Per User (500)** | N/A | **$3/user** | |

**Insight**: Microservices make sense at scale (500+ users). Below that, monolith is more cost-effective.

---

## ⏱️ Timeline Comparison

### MVP Development: 4-6 Weeks

```
Week 1-2: Core data collection + patient management
Week 3-4: AI integration (notes, billing, scheduling)
Week 5-6: M365 integration + polish
```

**Team**: 2-3 developers  
**Output**: Working product for pilot customers

---

### Scale-up Migration: 12-15 Weeks

```
Week 1-2:   Prepare monolith
Week 3-5:   Extract AI Service
Week 6-7:   Extract Data Collection
Week 8:     Extract Billing
Week 9-10:  Extract Scheduling
Week 11-12: Extract Notification
Week 13-14: Extract Analytics
Week 15:    Testing, stabilization
```

**Team**: 5-7 developers  
**Output**: Microservices architecture for 1000+ users

---

## 📊 Feature Comparison

| Feature | MVP | Scale-up |
|---------|-----|----------|
| **Data Collection** | ✅ Offline-first mobile | ✅ Same + Multi-region sync |
| **AI Notes** | ✅ GPT-4 generation | ✅ Same + Custom ML models |
| **Smart Billing** | ✅ Pre-validation | ✅ Same + Direct claim submission |
| **Scheduling** | ✅ AI suggestions | ✅ Same + Auto-scheduling |
| **Analytics** | ⚠️ Basic reports | ✅ Advanced predictive analytics |
| **Parent Portal** | ❌ Not in MVP | ✅ Full featured |
| **Multi-language** | ❌ English only | ✅ 5+ languages |
| **Custom ML** | ❌ Azure OpenAI only | ✅ Custom models |
| **Mobile Apps** | ⚠️ Responsive web | ✅ Native iOS/Android |

---

## 🎯 Success Metrics

### MVP Success (Pilot Phase)

| Metric | Target |
|--------|--------|
| **Time Saved** | 20+ hours/therapist/month |
| **User Engagement** | 80%+ weekly active |
| **NPS** | > 50 |
| **AI Note Quality** | 90%+ satisfaction |
| **Billing Error Rate** | < 5% |

### Scale-up Success (Growth Phase)

| Metric | Target |
|--------|--------|
| **Active Users** | 1000+ |
| **Clinics** | 50+ |
| **Uptime** | 99.9% SLA |
| **Response Time** | < 2s (95th percentile) |
| **Cost per User** | < $15/month |

---

## 🔐 Security & Compliance

Both MVP and Scale-up:

- ✅ **HIPAA Compliant** (Azure BAA signed)
- ✅ **FERPA Compliant** (school-based services)
- ✅ **SOC 2 Type II** (Azure certified)
- ✅ **Data Encryption** (at rest + in transit)
- ✅ **Audit Logs** (all data access logged)
- ✅ **RBAC** (role-based access control)
- ✅ **Azure AD SSO** (Microsoft 365 integration)

---

## 🚀 Quick Start

### For Product Managers
1. Read [MVP PRD](./mvp/PRD.md) - Understand scope
2. Review [AI Showcase](./mvp/AI_SHOWCASE.md) - Learn demo script
3. Check pilot customer criteria

### For Engineers
1. Read [MVP Technical Spec](./mvp/TECHNICAL_SPEC.md) - Architecture
2. Setup local dev environment
3. Deploy to Azure (follow [Infrastructure Guide](./mvp/INFRASTRUCTURE.md))

### For Designers
1. Review [Design System](./design/DESIGN_SYSTEM.md) - UI guidelines
2. Check [Functional Spec](./mvp/FUNCTIONAL_SPEC.md) - User workflows
3. Prototype in Figma (use Shadcn UI components)

### For Sales/Partnerships
1. Read [MVP PRD](./mvp/PRD.md) - Value proposition
2. Learn [AI Showcase](./mvp/AI_SHOWCASE.md) - 5-minute demo
3. Review [M365 Integration](./mvp/M365_INTEGRATION.md) - Competitive edge

---

## 🤝 Microsoft 365 Integration

Key competitive differentiator:

1. **Azure AD SSO** - One login for all tools
2. **Teams Notifications** - Alerts where staff work
3. **OneDrive Storage** - Auto-save notes to existing storage
4. **Outlook Calendar** - Two-way appointment sync
5. **SharePoint Docs** - Clinical templates, IEP reports

**See**: [M365 Integration Guide](./mvp/M365_INTEGRATION.md)

---

## 📝 Document History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2025-10-16 | Split into MVP and Scale-up documentation |
| 1.0 | 2025-10-10 | Initial consolidated documentation |

---

## ❓ FAQ

**Q: Which path should I start with?**  
A: Always start with **MVP**. Validate product-market fit before investing in microservices.

**Q: Can I cherry-pick features from Scale-up into MVP?**  
A: Yes! The docs are guides, not rigid requirements. Adapt to your needs.

**Q: What if I only want to scale one service (e.g., AI)?**  
A: Perfect use case! Extract only that service. Hybrid architecture is valid.

**Q: How do I know when to migrate to Scale-up?**  
A: When you hit 2+ triggers: 100+ users, 5+ devs, AI costs > $1k/month, clear bottlenecks.

**Q: What if microservices don't work out?**  
A: You can reverse the migration. The modular structure preserves business logic.

---

## 📞 Support

**Questions?** Contact:
- Product: product@wabicare.com
- Engineering: dev@wabicare.com
- Sales: sales@wabicare.com

**Slack Channels**:
- #mvp-development
- #scaleup-migration
- #product-feedback
- #engineering-help

---

## 🔗 External Resources

- [Azure Architecture Center](https://docs.microsoft.com/en-us/azure/architecture/)
- [Microservices.io Patterns](https://microservices.io/patterns/)
- [Microsoft Graph API Docs](https://docs.microsoft.com/en-us/graph/)
- [HIPAA Compliance Guide (Azure)](https://docs.microsoft.com/en-us/azure/compliance/offerings/offering-hipaa-us)

---

**🎉 Ready to build? Start with [MVP Documentation →](./mvp/README.md)**

---

Last Updated: October 16, 2025

