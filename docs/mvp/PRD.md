# Wabi Care MVP: Product Requirements Document

**Version**: 1.0  
**Date**: October 16, 2025  
**Owner**: Product Team  
**Status**: Active Development  
**Target Launch**: 4-6 weeks from kickoff

---

## Executive Summary

Wabi Care MVP is a **modular monolith** designed to validate our core value proposition with 2-5 pilot clinics: **"Record once, automate everything."** By interconnecting data collection, AI-powered note generation, smart billing, and intelligent scheduling, we save therapists 20+ hours per month while demonstrating the power of AI-first healthcare software.

**North Star Metric**: Save 20+ hours per therapist per month

**MVP Timeline**: 4-6 weeks  
**MVP Architecture**: Next.js modular monolith  
**MVP Cost**: $300-500/month (Azure)

---

## Problem Statement

### Current Pain Points

ABA therapists face a crushing administrative burden:

1. **Documentation Overhead** (40% of work time)
   - Write session notes after every 45-minute session (15 min each)
   - Manually create billing claims from session data (20 min/week)
   - Duplicate data entry across scheduling, notes, and billing

2. **Disconnected Workflows**
   - Data collection tools don't connect to billing systems
   - Notes written separately from session data
   - Scheduling doesn't consider session outcomes

3. **Lost Revenue**
   - Billing errors lead to 15-20% claim denials
   - Missing billable sessions (poor tracking)
   - Delayed claim submissions

### Market Opportunity

- **Target Market**: 50,000+ ABA practices in US
- **Initial Target**: 2-5 pilot clinics (10-50 therapists)
- **Average Practice**: 5-20 therapists, 30-100 patients
- **Problem Scope**: 85% of clinics lack integrated data collection + billing

---

## Product Vision

### Core Value Proposition

> **"One data entry, three automated workflows"**

```
Therapist Records Session
         ↓
   [AI Magic Happens]
         ↓
    ┌────┴────┬─────────┐
    ↓         ↓         ↓
AI Notes   Billing   Scheduling
 (auto)    (auto)    (smart)
```

**The Promise**:
1. Record trial-by-trial data once (5 min)
2. AI generates clinical note automatically (saves 15 min)
3. Billing claim auto-created with CPT codes (saves 20 min)
4. Next appointment intelligently suggested (saves 30 min/week)

**Result**: Save 20+ hours per therapist per month

---

## Target Users & Pilot Criteria

### Primary Persona: Rachel - RBT (Frontline Therapist)

**Demographics**:
- Age: 25-35
- Role: Registered Behavior Technician
- Experience: 1-5 years in ABA
- Tech Comfort: Moderate (uses smartphone apps daily)

**Pain Points**:
- Spends 1-2 hours daily on paperwork
- Struggles with spotty WiFi at patient homes
- Forgets session details if notes delayed

**Goals**:
- Record data quickly during sessions
- Spend more time teaching, less on admin
- Get home on time

**MVP Success**: Rachel records session data in < 5 minutes, goes home 30 min earlier

---

### Secondary Persona: Dr. Sarah - BCBA (Clinical Supervisor)

**Demographics**:
- Age: 30-45
- Role: Board Certified Behavior Analyst
- Experience: 5-15 years, supervises 3-10 RBTs
- Tech Comfort: High (power user)

**Pain Points**:
- Reviews 20+ session notes daily
- Writes IEP reports monthly (4+ hours each)
- Billing errors cause revenue loss

**Goals**:
- Quickly review session quality
- Identify struggling patients early
- Ensure billing accuracy

**MVP Success**: Sarah reviews sessions in 10 min (vs. 45 min), billing errors drop to < 5%

---

### Pilot Customer Criteria

**Ideal Pilot Clinic**:
- ✅ 5-20 therapists
- ✅ 30-100 active patients
- ✅ Uses Microsoft 365 (Teams, Outlook, OneDrive)
- ✅ Frustrated with current software (high NPS opportunity)
- ✅ Willing to provide weekly feedback
- ✅ Can commit 2-3 therapists as power users

**Red Flags**:
- ❌ < 5 therapists (too small to validate workflow)
- ❌ > 50 therapists (scale complexity too early)
- ❌ Recently switched software (change fatigue)
- ❌ No Microsoft 365 (can't showcase integration)

---

## Core Features (MVP Scope)

### Phase 1: Core Workflow (Weeks 1-4)

#### Feature 1: Smart Data Collection & Document OCR

**User Story**: As an RBT, I want to record trial data quickly on my phone so I spend more time teaching.

**Requirements**:
- [ ] Mobile-responsive data collection interface
- [ ] Upload PDF/Doc/Excel for ingestion
- [ ] Offline-first (works without internet)
- [ ] One-tap correct/incorrect/prompted recording
- [ ] Voice note option (dictate observations)
- [ ] Real-time accuracy calculation
- [ ] Auto-save every 10 seconds
- [ ] Session timer with reminders

**Success Metrics**:
- Data entry time < 5 seconds per trial
- Document processing < 2 minutes per file
- 95%+ offline reliability
- Zero data loss

**AI Enhancement**: Voice notes auto-transcribed via Azure Speech Service

**Document OCR Pipeline**:
- Azure Blob Storage for uploads
- Azure AI Document Intelligence for OCR & table extraction
- Supabase (MVP) for structured results
- Azure Cosmos DB (Phase 2) once migrated
- Optional Azure OpenAI summarization

---

#### Feature 2: AI Progress Notes

**User Story**: As a BCBA, I want AI to generate session notes from data so I save 15 min per session.

**Requirements**:
- [ ] One-click "Generate Note" button
- [ ] AI analyzes session data (trials, accuracy, duration)
- [ ] Generates clinical note with:
  - Session summary
  - Goals worked on
  - Performance analysis
  - Recommendations for next session
- [ ] Editable before saving
- [ ] Save to OneDrive automatically

**Success Metrics**:
- Note generation time < 30 seconds
- 90%+ clinician satisfaction with note quality
- 70%+ of notes used without edits

**AI Stack**:
- Azure OpenAI GPT-4 (note generation)
- Azure Speech Service (voice-to-text if dictated)
- Custom prompt templates (clinical language)

**Example Workflow**:
```
1. Therapist clicks "End Session"
2. System shows session summary:
   - 20 trials completed
   - 90% accuracy (18/20 correct)
   - Goal: Identify Colors
3. Therapist clicks "Generate Note with AI"
4. GPT-4 generates:
   "Sarah completed 20 discrete trials targeting color identification.
    She demonstrated 90% accuracy with 18 correct responses.
    Performance was strongest with primary colors (red, blue).
    Recommend increasing difficulty to secondary colors next session."
5. Therapist reviews, optionally edits, saves
6. Note auto-saves to OneDrive in patient folder
```

---

#### Feature 3: Smart Billing Preparation

**User Story**: As a billing specialist, I want the system to auto-create claims from session data so I reduce errors and speed up submissions.

**Requirements**:
- [ ] Auto-extract billing data from completed sessions
- [ ] Map session type → CPT code (97153, 97155, etc.)
- [ ] Calculate units (30 min = 1 unit)
- [ ] Pre-validate against insurance authorization
- [ ] Flag potential errors before submission
- [ ] Export to CSV for manual submission (MVP - no direct payer integration yet)

**Success Metrics**:
- Claim creation time < 2 min per session
- Pre-submission error rate < 5%
- 95%+ claims pass validation

**AI Enhancement**: AI flags claims likely to be denied based on patterns

**Example Workflow**:
```
1. Week ends, billing specialist opens "Unbilled Sessions"
2. Sees 50 sessions ready for billing
3. Clicks "Generate Claims"
4. System:
   - Maps RBT sessions → CPT 97153
   - Calculates units (45 min session = 2 units)
   - Validates against authorization (35/40 hours used)
   - Flags 2 sessions: "Authorization hours low"
5. Billing specialist reviews, exports CSV
6. Submits to clearinghouse
```

---

#### Feature 4: Intelligent Scheduling Suggestions

**User Story**: As a practice admin, I want AI to suggest optimal appointment times so I save 5+ hours per week on scheduling.

**Requirements**:
- [ ] Analyze session outcomes (accuracy, engagement)
- [ ] Consider therapist availability (from Outlook calendar)
- [ ] Suggest next appointment time based on:
  - Patient progress (more frequent if struggling)
  - Therapist-patient success rate
  - Authorization hours remaining
  - Optimal spacing (2-3 days between sessions)
- [ ] One-click schedule suggested appointment

**Success Metrics**:
- 80%+ of suggestions accepted
- Scheduling time reduced by 70%

**AI Enhancement**: ML model learns optimal scheduling patterns per patient

**Example Workflow**:
```
1. Therapist ends session with 95% accuracy
2. System analyzes:
   - Patient: Sarah Johnson
   - Progress: Excellent (3 consecutive 90%+ sessions)
   - Authorization: 32/40 hours used
   - Therapist (Rachel) availability: Mon/Wed/Fri mornings
3. AI suggests: "Schedule next session Friday 10 AM" (3-day spacing)
4. Admin clicks "Schedule" → Creates Outlook appointment
5. Parent receives email/SMS confirmation
```

---

### Phase 2: Enhanced Features (Weeks 5-6 - if time permits)

#### Feature 5: AI Co-pilot Assistant

**User Story**: As an RBT, I want real-time AI guidance during sessions so I can handle challenging situations without waiting for BCBA support.

**Requirements**:
- [ ] Voice or text query interface during sessions
- [ ] AI analyzes current session context (patient, goal, performance)
- [ ] Provides specific, actionable strategies:
  - Teaching technique suggestions
  - Behavior management strategies
  - When to escalate to BCBA
  - Reinforcement recommendations
- [ ] Voice integration (optional): "Hey Wabi, what should I do?"
- [ ] Context-aware responses based on:
  - Patient history and preferences
  - Current goal and mastery criteria
  - Recent session performance
  - Therapist experience level

**Success Metrics**:
- 85%+ therapists use co-pilot during sessions
- 70%+ find suggestions helpful
- Session quality improves (measured by goal progress)
- **Time saved: 5-10 minutes per session** (faster problem-solving)

**AI Enhancement**: GPT-4 with clinical ABA knowledge base, voice-to-text integration

**Example Workflow**:
```
1. Therapist notices patient struggling with color identification
2. Asks AI: "Patient not responding to colors, what should I try?"
3. AI analyzes:
   - Current performance: 3/10 correct (30%)
   - Patient history: Strong with shapes, weak with colors
   - Goal: Identify 10 colors with 90% accuracy
4. AI responds: "Try errorless teaching - show correct answer first.
   Start with just 2 colors (red/blue). Use visual prompts.
   Check motivation - offer favorite toy."
5. Therapist implements suggestions
6. Performance improves to 7/10 correct (70%)
```

#### Feature 6: Risk Alerts

**User Story**: As a BCBA, I want to be alerted when a patient is at risk so I can intervene early.

**Requirements**:
- [ ] AI analyzes session trends
- [ ] Flags patients showing:
  - Declining accuracy (> 10% drop over 3 sessions)
  - Missed appointments (> 2 in a month)
  - Plateau (no progress for 2 weeks)
- [ ] Sends Teams notification to BCBA
- [ ] Suggests interventions

**Success Metrics**:
- Identify 80%+ of at-risk patients before dropout
- BCBA intervention time < 24 hours after alert

---

## Non-Functional Requirements

### Performance

- Page load time < 2 seconds
- Offline data sync < 10 seconds after reconnection
- AI note generation < 30 seconds
- Support 50 concurrent users (5 clinics × 10 therapists)

### Security & Compliance

- HIPAA compliant (encryption at rest and in transit)
- FERPA compliant (for school-based services)
- Azure AD authentication (Microsoft 365 SSO)
- Audit logs for all data access
- No PHI in AI training data

### Reliability

- 99.5% uptime (allowed downtime: 3.6 hours/month)
- Automated backups every 6 hours
- Point-in-time recovery (7 days)

---

## Microsoft 365 Integration (Competitive Moat)

### Phase 1 Integrations (MVP)

| Integration | Value Proposition | Implementation |
|-------------|------------------|----------------|
| **Azure AD SSO** | One login for all tools | NextAuth.js + Azure AD B2C |
| **Teams Notifications** | Alerts where staff already work | Webhook to Teams channel |
| **OneDrive Document Storage** | Auto-save notes to existing storage | Microsoft Graph API |
| **Outlook Calendar Sync** | Appointments appear in Outlook | Graph Calendar API |

---

## Success Metrics (Pilot)

### Primary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time Saved** | 20+ hours/therapist/month | Time tracking survey (before/after) |
| **Note Generation Time** | < 30 seconds | System logs |
| **Billing Error Rate** | < 5% | Claim validation errors |
| **User Satisfaction** | NPS > 50 | Weekly survey |
| **Weekly Active Users** | 80%+ of licensed users | Login analytics |

### Secondary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Data Entry Speed** | < 5 sec/trial | System logs |
| **AI Note Acceptance** | 70%+ used without edits | Edit tracking |
| **Scheduling Time** | 70% reduction | Admin time tracking |

---

## Out of Scope (MVP)

Explicitly **NOT** included to keep MVP focused:

❌ **Parent Portal** - Admin/clinician only for MVP  
❌ **Predictive Analytics Dashboard** - Basic reports only  
❌ **Direct Claim Submission** - Export CSV, manual submission  
❌ **Mobile Native Apps** - Responsive web app sufficient  
❌ **Multi-language Support** - English only  
❌ **Custom ML Models** - Use Azure OpenAI out-of-box  
❌ **Advanced Scheduling** - Smart suggestions only, no auto-scheduling  
❌ **Payroll/HR Features** - Clinical operations only  

---

## Competitive Differentiation (MVP)

### What Makes Wabi Care MVP Unique?

| Feature | CentralReach | Motivity | Wabi Care MVP |
|---------|--------------|----------|---------------|
| **AI Note Generation** | ❌ Manual | ❌ Manual | ✅ GPT-4 powered |
| **Smart Billing** | ⚠️ Manual mapping | ⚠️ Basic | ✅ AI-assisted validation |
| **M365 Integration** | ⚠️ Limited | ❌ None | ✅ Deep (Teams, Outlook, OneDrive) |
| **Offline Mobile** | ⚠️ Limited | ✅ Good | ✅ Excellent |
| **Time to Value** | 6-12 weeks onboarding | 4-8 weeks | ✅ 1 week (pilot) |

**Key Differentiator**: "Works inside Microsoft Teams, generates notes with AI, ready in days not months."

---

## Go-to-Market (Pilot Phase)

### Pilot Pricing

**MVP Pilot Pricing** (special rate):
- **$49/user/month** (50% discount from standard $99)
- Minimum 5 users
- 3-month pilot commitment
- Includes:
  - Unlimited data collection
  - AI note generation (500 notes/month)
  - Basic billing preparation
  - Microsoft 365 integration
  - Email support

**Standard Pricing** (post-pilot):
- **$99/user/month** or **$79/user/month** (annual)

### Pilot Customer Acquisition

**Channels**:
1. **LinkedIn Direct Outreach** - Target BCBA practice owners
2. **ABAI Conference** - Demo at booth
3. **Referral Program** - $500 credit per referred clinic
4. **Microsoft Partner Network** - Co-marketing with Microsoft

**Pilot Success Criteria**:
- 2-5 clinics signed (10-50 total users)
- 80%+ Weekly Active Users (WAU)
- NPS > 50
- 2+ case studies/testimonials
- 70%+ convert to paid after pilot

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **AI notes not clinically accurate** | Medium | High | Manual review required; BCBA approval workflow |
| **Offline sync data loss** | Low | High | Extensive testing; local backup; retry logic |
| **Pilot customers don't engage** | Medium | Medium | Weekly check-ins; onboarding support; incentives |
| **Azure OpenAI costs exceed budget** | Medium | Low | Usage caps; fallback to templates if over budget |
| **Microsoft 365 integration issues** | Low | Medium | Extensive testing; fallback to manual export |

---

## Timeline & Milestones

### 4-Week MVP Timeline

**Week 1: Core Data Collection**
- Patient management (CRUD)
- Goal creation (templates)
- Mobile data collection UI
- Offline sync foundation

**Week 2: AI Integration**
- Azure OpenAI setup
- Note generation workflow
- Voice transcription
- OneDrive integration

**Week 3: Billing & Scheduling**
- Billing claim generation
- CPT code mapping
- Scheduling suggestions
- Outlook calendar sync

**Week 4: Polish & Pilot Prep**
- Teams notifications
- Bug fixes
- Mobile testing
- Pilot onboarding materials

**Week 5-6: Buffer & Enhancement** (optional)
- Risk alerts
- Advanced scheduling
- Performance optimization

---

## Open Questions

1. **Which AI model for notes?**
   - GPT-4 (better quality, $0.03/1K tokens) ✅ **Recommended**
   - GPT-3.5 (faster, cheaper, $0.001/1K tokens)

2. **Billing integration approach?**
   - CSV export for manual submission ✅ **MVP**
   - API integration with clearinghouses (post-MVP)

3. **Mobile app strategy?**
   - Responsive web app (PWA) ✅ **MVP**
   - Native apps (iOS/Android) - post-MVP

---

## Appendix: Reference Documents

- [Technical Specification](./TECHNICAL_SPEC.md) - Architecture & implementation
- [Features Specification](./FEATURES.md) - Detailed feature requirements
- [AI Showcase](./AI_SHOWCASE.md) - AI capabilities deep dive
- [Infrastructure Guide](./INFRASTRUCTURE.md) - Azure setup
- [Design System](./DESIGN_SYSTEM.md) - UI/UX guidelines

---

**Document History**:

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-16 | Product Team | Initial MVP PRD for pilot phase |

