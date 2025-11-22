# Wabi Care: Product Requirements Document (PRD)

**Version**: 1.0  
**Date**: October 16, 2025  
**Owner**: Product Team  
**Status**: Draft

---

## Executive Summary

Wabi Care is an AI-first ABA (Applied Behavior Analysis) practice management platform built on Microsoft Azure. Our mission is to reduce clinician documentation burden by 60%, improve patient outcomes through predictive analytics, and provide a modern, intuitive experience that integrates seamlessly with Microsoft 365 tools already used by clinics and schools.

**Target Launch**: Q2 2025 (MVP)  
**Target Market**: ABA therapy clinics, school districts, and behavioral health practices  
**Primary Users**: BCBAs, RBTs, practice administrators, billing staff, parents

---

## Problem Statement

### Current Pain Points in ABA Practice Management

1. **Documentation Overhead** (40% of clinician time)
   - Manual session note writing after every therapy session
   - Duplicate data entry across multiple systems
   - Time-consuming IEP report generation

2. **Limited Insights & Analytics**
   - Reactive, not predictive
   - Hard to identify at-risk patients
   - No revenue forecasting capabilities

3. **Inefficient Scheduling**
   - Manual scheduling wastes 10+ hours/week
   - Frequent conflicts and no-shows
   - Poor therapist-patient matching

4. **Billing Complexity**
   - Claims denial rates average 15-20%
   - Manual RCM workflows
   - No proactive claim issue detection

5. **Disconnected Tools**
   - Clinics use 5+ separate tools (EMR, scheduling, billing, communication)
   - No integration with Microsoft 365 ecosystem
   - Poor mobile experience for therapists

### Market Opportunity

- **Market Size**: $2.5B ABA practice management software market
- **Growth Rate**: 12% CAGR (2024-2030)
- **Target Customers**: 50,000+ ABA practices in US
- **Underserved Segment**: Clinics using Microsoft 365 (85% of practices)

---

## Competitive Landscape

### Current Market Leaders

| Competitor | Strengths | Weaknesses | Market Position |
|------------|-----------|------------|-----------------|
| **CentralReach** | Comprehensive platform, mature billing | Complex UI, no AI, expensive | Enterprise-focused |
| **Motivity** | AI scheduling, real-time data collection | Limited AI beyond scheduling | Mid-market |
| **SpectrumAI** | Modern interface, cloud-based | Limited integrations | Emerging player |
| **Ai-Measures** | Strong assessment tools | Not full practice management | Niche (research) |
| **3Y Health** | Telehealth integration | Basic reporting, no AI | Small to mid-market |

### Market Gaps & Wabi Care Differentiation

| Gap | Competitor Capability | Wabi Care Solution |
|-----|----------------------|-------------------|
| **AI-Powered Documentation** | ❌ Manual notes only | ✅ Auto-generated notes from voice |
| **Predictive Analytics** | ⚠️ Descriptive only | ✅ Outcome predictions, revenue forecasting |
| **Microsoft 365 Integration** | ⚠️ Basic or none | ✅ Native Teams, Outlook, OneDrive integration |
| **Conversational AI Assistant** | ❌ Not available | ✅ RAG-powered chat assistant |
| **Proactive Risk Detection** | ❌ Reactive only | ✅ AI identifies at-risk patients, claims |
| **Modern UX** | ⚠️ Outdated interfaces | ✅ Modern, intuitive design |

**Key Insight**: No competitor offers deep Microsoft 365 integration + AI-first approach. This is our strategic moat.

---

## Product Vision

### North Star Metric
**Save clinicians 20+ hours per month** through AI-powered automation while improving patient outcomes by 15%.

### Product Principles

1. **AI-First, Not AI-Added**: AI is core to every feature, not a bolt-on
2. **Works Where They Work**: Deep integration with Microsoft 365 (Teams, Outlook, OneDrive)
3. **Mobile-First Data Collection**: Therapists work offline in the field
4. **Privacy & Security by Design**: HIPAA, FERPA compliance from day one
5. **Beautiful UX**: Modern, intuitive design that doesn't require training

---

## Target Users & Personas

### Persona 1: Rachel - RBT (Registered Behavior Technician)
- **Role**: Frontline therapist delivering ABA therapy
- **Pain Points**: Spends 1-2 hours daily on paperwork, struggles with mobile apps
- **Goals**: Collect data quickly during sessions, spend more time with patients
- **Tech Savvy**: Moderate (comfortable with phone apps)
- **Key Need**: Fast, offline mobile data collection

### Persona 2: Dr. Sarah - BCBA (Board Certified Behavior Analyst)
- **Role**: Clinical supervisor, writes treatment plans
- **Pain Points**: Reviews 20+ session notes daily, writes IEP reports, schedules team
- **Goals**: Reduce admin time, identify struggling patients early, improve outcomes
- **Tech Savvy**: High (power user)
- **Key Need**: AI-powered insights, auto-generated reports

### Persona 3: Mike - Practice Administrator
- **Role**: Manages operations, scheduling, billing
- **Pain Points**: Manual scheduling conflicts, claims denials, revenue unpredictability
- **Goals**: Optimize therapist utilization, reduce billing errors, forecast revenue
- **Tech Savvy**: High (Excel power user, IT-friendly)
- **Key Need**: Predictive analytics, automated workflows

### Persona 4: Jennifer - Billing Specialist
- **Role**: Submits claims, tracks payments
- **Pain Points**: High denial rate, manual claim fixes, slow payer responses
- **Goals**: Increase clean claim rate, reduce days in A/R
- **Tech Savvy**: Moderate (familiar with payer portals)
- **Key Need**: Automated claim validation, denial prediction

### Persona 5: Parent/Guardian
- **Role**: Consumes progress reports, schedules appointments
- **Pain Points**: Hard to understand progress, poor communication from clinic
- **Goals**: See child's progress, easy appointment booking
- **Tech Savvy**: Low to Moderate
- **Key Need**: Simple parent portal, clear visualizations

---

## Core Features (MVP - Phase 1)

### 1. Smart Data Collection
**User Story**: As an RBT, I want to quickly record trial data during therapy sessions so I spend more time teaching and less time on paperwork.

**Requirements**:
- [ ] Mobile-first trial-by-trial data collection
- [ ] Offline-first with auto-sync when online
- [ ] One-tap correct/incorrect/prompted recording
- [ ] Voice-activated data entry (optional)
- [ ] Real-time accuracy calculation
- [ ] Support for multiple target types (discrete trials, duration, frequency)
- [ ] Session timer with automatic reminders
- [ ] Photo/video attachment to trials

**Success Metrics**:
- Data entry time < 5 seconds per trial
- 95%+ offline reliability
- Zero data loss during sync

---

### 2. Patient Management
**User Story**: As a practice admin, I want to manage all patient information in one place so I don't duplicate work across systems.

**Requirements**:
- [ ] Patient demographics (name, DOB, diagnosis, insurance)
- [ ] Guardian/parent contact information
- [ ] Active/inactive status tracking
- [ ] Insurance authorization tracking
- [ ] Document storage (assessments, IEPs, consents)
- [ ] Patient search and filtering
- [ ] Custom fields for practice-specific needs

**Success Metrics**:
- Patient lookup time < 3 seconds
- Zero duplicate patient records
- 100% document retention

---

### 3. Goal & Target Management
**User Story**: As a BCBA, I want to create therapy goals with targets and mastery criteria so I can track patient progress systematically.

**Requirements**:
- [ ] Goal creation with multiple targets
- [ ] Prompt level definitions (full, partial, independent)
- [ ] Mastery criteria (accuracy %, consecutive sessions)
- [ ] Goal bank/template library (pre-built common goals)
- [ ] Goal status tracking (active, mastered, discontinued)
- [ ] Goal cloning for similar patients
- [ ] Phase/program grouping

**Success Metrics**:
- Goal creation time < 2 minutes
- 80%+ of goals use templates (reduce custom work)

---

### 4. Session Management
**User Story**: As an RBT, I want to start/end therapy sessions and record session notes so I document my work accurately.

**Requirements**:
- [ ] Session start/end with automatic duration tracking
- [ ] Session type selection (1:1, group, parent training)
- [ ] Automatic trial association with goals
- [ ] Session notes (structured + free text)
- [ ] Real-time accuracy display during session
- [ ] Session summary (trials completed, accuracy, duration)
- [ ] Guardian signature capture (optional)

**Success Metrics**:
- Session start time < 10 seconds
- 100% session completion rate (no abandoned sessions)

---

### 5. Authentication & Authorization
**User Story**: As a practice admin, I want to control who has access to patient data so we stay HIPAA compliant.

**Requirements**:
- [ ] Azure AD SSO (single sign-on with Microsoft 365)
- [ ] Role-based access control (Admin, BCBA, RBT, Biller, Parent)
- [ ] Multi-factor authentication (MFA)
- [ ] Session timeout after inactivity
- [ ] Audit logs for all data access
- [ ] Password reset workflow (if not using SSO)

**Success Metrics**:
- 100% of practices use SSO
- Zero unauthorized data access incidents

---

## Future Features (Phase 2 - Operational)

### 6. Intelligent Scheduling
**User Story**: As a practice admin, I want the system to auto-schedule therapist sessions so I save 10+ hours per week.

**Requirements**:
- [ ] Two-way Outlook calendar sync
- [ ] AI-powered auto-scheduling (considers skills, location, availability)
- [ ] Recurring appointment support
- [ ] Conflict detection and resolution suggestions
- [ ] Parent self-scheduling portal (via Microsoft Bookings)
- [ ] Automated email/SMS reminders
- [ ] No-show tracking and predictive alerts

**Success Metrics**:
- Reduce scheduling time by 80%
- Reduce no-show rate by 30%

---

### 7. Billing & Revenue Cycle Management (RCM)
**User Story**: As a billing specialist, I want the system to auto-generate claims from session data so I reduce errors and speed up payments.

**Requirements**:
- [ ] Automatic claim creation from session data
- [ ] CPT code mapping (97151, 97152, 97153, 97155, 97156, 97158)
- [ ] Pre-submission claim validation (catch errors before submission)
- [ ] Electronic claim submission to payers
- [ ] Claim status tracking
- [ ] Denial management workflow
- [ ] Payment posting
- [ ] Revenue reporting dashboard

**Success Metrics**:
- Clean claim rate > 95% (industry avg: 80%)
- Days in A/R < 30 (industry avg: 45)

---

### 8. Notification System
**User Story**: As a BCBA, I want to receive alerts about important events so I stay informed without constantly checking the system.

**Requirements**:
- [ ] Email notifications (via Microsoft 365 or SendGrid)
- [ ] SMS notifications (via Azure Communication Services)
- [ ] Push notifications (mobile app)
- [ ] Microsoft Teams channel notifications
- [ ] Notification preferences per user
- [ ] Alert types: session reminders, claim denials, authorization expiring, patient at-risk

**Success Metrics**:
- Notification delivery rate > 98%
- User engagement with notifications > 60%

---

## Future Features (Phase 3 - Advanced)

### 9. AI Clinical Co-Pilot
**User Story**: As a BCBA, I want AI to generate progress notes from my voice recordings so I save 10+ hours per week on documentation.

**Requirements**:
- [ ] Voice-to-text transcription (Azure Speech Service)
- [ ] AI-generated session notes (Azure OpenAI GPT-4)
- [ ] Treatment recommendation engine
- [ ] IEP goal suggestions based on patient history
- [ ] Conversational AI assistant (RAG-powered)
- [ ] Content safety filtering (no PHI leaks)

**Success Metrics**:
- Reduce note-writing time by 70%
- 90%+ clinician satisfaction with AI notes

---

### 10. Predictive Analytics & Dashboards
**User Story**: As a practice owner, I want to forecast revenue and identify at-risk patients so I make data-driven decisions.

**Requirements**:
- [ ] Patient outcome predictions (ML models)
- [ ] Revenue forecasting (90%+ accuracy)
- [ ] Staffing optimization recommendations
- [ ] Risk identification (dropout, plateau detection)
- [ ] Power BI embedded dashboards
- [ ] Custom report builder
- [ ] Excel export for pivot tables

**Success Metrics**:
- Revenue forecast accuracy > 90%
- Identify 80%+ of at-risk patients before dropout

---

## Microsoft 365 Integration Strategy

### Why Microsoft 365 Integration is Critical

**Market Insight**: 85% of ABA clinics and school districts already use Microsoft 365. Deep integration eliminates adoption friction and procurement barriers.

### Phase 1 Integrations (MVP)

| Integration | User Benefit | Technical Approach |
|-------------|--------------|-------------------|
| **Azure AD SSO** | One login for all tools | Azure AD B2C + OAuth 2.0 |
| **Teams Notifications** | Alerts where they already work | Teams webhooks + adaptive cards |
| **OneDrive Storage** | Store documents in familiar location | Microsoft Graph API |

### Phase 2 Integrations (Operational)

| Integration | User Benefit | Technical Approach |
|-------------|--------------|-------------------|
| **Outlook Calendar Sync** | Unified scheduling | Microsoft Graph Calendar API |
| **SharePoint Document Workflows** | Organize patient files automatically | Microsoft Graph Drive API |
| **Microsoft Bookings** | Parent self-scheduling | Bookings API integration |

### Phase 3 Integrations (Advanced)

| Integration | User Benefit | Technical Approach |
|-------------|--------------|-------------------|
| **Power BI Embedded** | Custom dashboards in familiar tool | Power BI Embedded API |
| **Microsoft Planner** | Task management for therapists | Planner API |
| **Microsoft 365 Copilot** | "Ask Copilot about patient progress" | Microsoft Graph Connectors |

---

## Non-Functional Requirements

### Performance
- [ ] Page load time < 2 seconds (desktop)
- [ ] Mobile app launch time < 3 seconds
- [ ] Offline data sync within 10 seconds of reconnection
- [ ] Support 1000+ concurrent users per clinic

### Security & Compliance
- [ ] HIPAA compliant (Business Associate Agreement ready)
- [ ] FERPA compliant (for school districts)
- [ ] SOC 2 Type II certified (within 12 months)
- [ ] Data encryption at rest (Azure Storage encryption)
- [ ] Data encryption in transit (TLS 1.3)
- [ ] Audit logs for all PHI access
- [ ] Role-based access control (RBAC)
- [ ] Multi-factor authentication (MFA) required

### Availability & Reliability
- [ ] 99.9% uptime SLA
- [ ] Automated backups every 4 hours
- [ ] Point-in-time recovery (30 days)
- [ ] Multi-region redundancy (Azure paired regions)
- [ ] Disaster recovery plan (RTO < 4 hours, RPO < 1 hour)

### Scalability
- [ ] Support up to 10,000 patients per clinic
- [ ] Support up to 500 therapists per clinic
- [ ] Handle 1 million+ data points per day
- [ ] Auto-scaling for peak usage times

### Usability
- [ ] Mobile-first design (iOS + Android)
- [ ] Responsive web app (tablet, desktop)
- [ ] Accessibility (WCAG 2.1 AA compliant)
- [ ] Support for 10+ languages (initially English only)
- [ ] No training required for basic data collection

---

## Success Metrics (KPIs)

### User Adoption
- **Target**: 80% weekly active users (WAU) within 3 months
- **Measure**: % of licensed users who log in weekly

### Time Savings
- **Target**: 20 hours saved per clinician per month
- **Measure**: Survey + usage analytics (before/after)

### Data Quality
- **Target**: 95%+ data accuracy (no missing trials)
- **Measure**: Audit sample of 100 sessions/month

### Customer Satisfaction
- **Target**: NPS > 50 (industry avg: 30)
- **Measure**: Quarterly NPS survey

### Revenue Impact (for clinics)
- **Target**: Increase clean claim rate from 80% → 95%
- **Measure**: Pre/post billing metrics from customers

### Patient Outcomes
- **Target**: 15% faster goal mastery vs. industry avg
- **Measure**: Time-to-mastery analysis across cohorts

---

## Go-to-Market Strategy

### Pricing Model

**Tiered SaaS Pricing:**

| Plan | Target | Price/User/Month | Key Features |
|------|--------|------------------|--------------|
| **Starter** | Small clinics (5-10 users) | $79 | Data collection, patient management, basic reporting |
| **Professional** | Mid-market (10-50 users) | $129 | + Scheduling, billing, Microsoft 365 integration |
| **Enterprise** | Large clinics/districts (50+ users) | $199 | + AI features, predictive analytics, dedicated support |

**Add-Ons:**
- Microsoft 365 Integration Suite: +$30/user/month
- AI Clinical Co-Pilot: +$50/user/month
- Custom integrations: Custom pricing

### Launch Phases

**Phase 1: MVP (Weeks 1-4)**
- Core data collection + patient management
- Target: 3 beta customers (50 users total)
- Goal: Validate product-market fit

**Phase 2: Operational Features (Weeks 5-8)**
- Add scheduling, billing, notifications
- Target: 10 paying customers (200 users)
- Goal: Prove operational completeness

**Phase 3: Advanced Features (Weeks 9-12)**
- Add AI and analytics
- Target: 25 customers (500 users)
- Goal: Establish competitive differentiation

### Sales Channels

1. **Direct Sales** (primary)
   - Target: Enterprise clinics and school districts
   - Sales cycle: 30-60 days

2. **Azure Marketplace** (secondary)
   - Target: Microsoft-heavy organizations
   - Benefit: Easier procurement (existing Microsoft invoice)

3. **Partner Network** (future)
   - BCBA training programs
   - ABA consultants and implementation partners

### Marketing Strategy

**Key Messages:**
1. "The ABA platform that works inside Microsoft Teams"
2. "Save 20+ hours per month with AI-powered documentation"
3. "Built on Azure - the cloud your IT team trusts"

**Channels:**
- LinkedIn ads targeting BCBAs and practice owners
- ABAI conference sponsorship
- Content marketing (blog, case studies)
- Referral program (existing customers)

---

## Out of Scope (V1)

The following features are explicitly **not** included in MVP/Phase 1:

❌ Mobile native apps (iOS/Android) - using responsive web app instead  
❌ Parent portal - admin/clinician-facing only  
❌ Telehealth/video conferencing - use existing tools  
❌ Payroll management - focus on clinical operations  
❌ HR/credentialing tracking - future enhancement  
❌ Multi-language support - English only initially  
❌ White-label/reseller capabilities  
❌ Custom branding per clinic  
❌ API for third-party integrations - closed system initially  

---

## Open Questions

1. **Billing Integration**: Should we build payer integrations ourselves or partner with existing clearinghouses?
   - **Recommendation**: Partner initially (e.g., Office Ally, Waystar), build direct later

2. **Mobile Strategy**: Native apps or progressive web app (PWA)?
   - **Recommendation**: PWA for MVP, native apps Phase 3+

3. **AI Model Training**: Do we train custom models or use Azure OpenAI out-of-the-box?
   - **Recommendation**: Use GPT-4 + fine-tuning with customer data (opt-in)

4. **Data Residency**: Do we support multi-region deployments for international customers?
   - **Recommendation**: US-only for MVP, expand later

5. **Parent Portal Priority**: Should parent features be Phase 2 instead of Phase 3?
   - **Recommendation**: Survey beta customers to decide

---

## Appendix: Reference Documents

- [Functional Specification](./FUNCTIONAL_SPEC.md) - Detailed feature workflows
- [Technical Specification](./TECHNICAL_SPEC.md) - System architecture and tech stack
- [Microsoft 365 Integration Plan](./M365_INTEGRATION.md) - Deep dive on integrations
- [Design System](./DESIGN_SYSTEM.md) - UI/UX guidelines
- [Data Model](./DATA_MODEL.md) - Database schemas

---

**Document History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-10-10 | Product Team | Initial draft |
| 1.0 | 2025-10-16 | Product Team | Added Microsoft 365 integration strategy |

