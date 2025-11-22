# Wabi Care: Functional Specification

**Version**: 1.0  
**Date**: October 16, 2025  
**Owner**: Product & Design Team  
**Status**: Draft

---

## Purpose

This document describes **how Wabi Care works** from a user's perspective. It details user workflows, screen layouts, interactions, and business logic for each feature. This serves as the bridge between the [Product Requirements Document (PRD)](./PRD.md) and the [Technical Specification](./TECHNICAL_SPEC.md).

**Audience**: Product managers, designers, developers, QA engineers

---

## Table of Contents

1. [User Workflows](#user-workflows)
2. [Feature Details](#feature-details)
3. [User Interface Specifications](#user-interface-specifications)
4. [Business Rules](#business-rules)
5. [Error Handling](#error-handling)
6. [Integrations](#integrations)

---

## User Workflows

### Workflow 1: Therapist Conducting a Therapy Session (Happy Path)

**Actors**: Rachel (RBT)  
**Precondition**: Rachel is logged in, has an active patient with goals  
**Trigger**: Rachel arrives at patient's home for scheduled session

**Steps**:

1. **Open Mobile App**
   - Rachel opens Wabi Care on her iPhone
   - App loads offline (no internet required)
   - Dashboard shows today's schedule

2. **Select Patient & Start Session**
   - Rachel taps "Sarah Johnson - 2:00 PM"
   - Taps "Start Session" button
   - System starts timer, creates session record
   - Screen shows active goals for Sarah

3. **Select Goal & Target**
   - Rachel taps "Identify Colors" goal
   - Selects target "Red" from list
   - Screen shows data collection interface

4. **Record Trial Data**
   - Rachel presents red object, says "What color?"
   - Sarah responds "Red" (correct)
   - Rachel taps large green "✓" button
   - System records: Correct, Independent, Timestamp
   - Real-time accuracy updates: 1/1 (100%)

5. **Record More Trials** (repeat 19 times)
   - Mix of correct/incorrect/prompted responses
   - Quick tap interface (< 3 seconds per trial)
   - Session accuracy updates in real-time

6. **End Session & Add Notes**
   - After 45 minutes, Rachel taps "End Session"
   - System calculates session summary:
     - Duration: 45 min
     - Trials: 20
     - Accuracy: 90%
   - Rachel adds optional session notes: "Sarah was engaged today"
   - Taps "Complete Session"

7. **Sync Data**
   - Rachel's phone reconnects to WiFi
   - System auto-syncs session data to cloud
   - BCBA receives Teams notification: "New session data for Sarah"

**Alternate Flows**:
- **AF1: Incorrect Response**: Rachel taps red "✗" button, prompted level dropdown appears
- **AF2: Prompted Response**: Rachel selects "Partial Prompt" before recording response
- **AF3: Lost Connection**: Data saves locally, syncs later (no data loss)

---

### Workflow 2: BCBA Reviewing Progress & Adjusting Goals

**Actors**: Dr. Sarah (BCBA)  
**Precondition**: Therapists have collected data for 2 weeks  
**Trigger**: Weekly progress review meeting

**Steps**:

1. **View Patient Dashboard**
   - Sarah opens Wabi Care on desktop
   - Navigates to "Patients" → "Sarah Johnson"
   - Dashboard shows:
     - Active goals (5)
     - Recent sessions (10)
     - Progress chart (line graph)

2. **Analyze Goal Progress**
   - Sarah clicks "Identify Colors" goal
   - Sees detailed progress:
     - Current accuracy: 90% (target: 90%)
     - Consecutive sessions at 90%: 3 (target: 3)
     - Trend: Improving
   - System shows mastery alert: "Goal meets mastery criteria"

3. **Update Goal Status**
   - Sarah clicks "Mark as Mastered"
   - System prompts: "Add to next target or discontinue?"
   - Sarah selects "Add next target: Blue"
   - System creates new target with same mastery criteria

4. **Review At-Risk Alert** (AI-powered)
   - System shows alert: "Target 'Shapes' showing plateau"
   - Sarah clicks alert, sees:
     - Last 5 sessions: 60%, 58%, 62%, 59%, 61% (no progress)
     - Recommendation: "Consider changing prompt strategy or target complexity"
   - Sarah adds note: "Will use physical prompts next session"

5. **Generate Progress Report**
   - Sarah clicks "Generate Report" button
   - Selects date range: Last 30 days
   - System generates PDF report:
     - Patient demographics
     - Goals worked on (5)
     - Accuracy trends (charts)
     - Session attendance (95%)
   - Sarah downloads to OneDrive
   - Shares with parents via email

**Business Value**: BCBA spends 15 min (vs. 2 hours manually) on weekly reviews

---

### Workflow 3: Practice Admin Scheduling Therapist Sessions

**Actors**: Mike (Practice Administrator)  
**Precondition**: Practice has 10 therapists, 50 patients  
**Trigger**: Weekly scheduling for next week

**Steps**:

1. **Open Scheduling View**
   - Mike opens Wabi Care desktop app
   - Navigates to "Schedule" → "Week View"
   - Sees calendar with existing appointments

2. **Create New Appointment**
   - Mike clicks "New Appointment"
   - Fills form:
     - Patient: Sarah Johnson
     - Therapist: Rachel (RBT)
     - Date/Time: Monday 2:00 PM - 2:45 PM
     - Location: Home (auto-filled from patient record)
     - Goal: Identify Colors
   - System checks for conflicts:
     - ✅ Rachel available
     - ✅ No double-booking
   - Mike clicks "Save"

3. **AI Suggests Optimal Schedule** (Phase 2)
   - Mike clicks "Auto-Schedule Week" button
   - System considers:
     - Therapist availability (from Outlook calendar)
     - Patient needs (hours authorized)
     - Travel time between locations
     - Therapist-patient historical success rate
   - System generates proposed schedule
   - Mike reviews, makes adjustments
   - Clicks "Confirm Schedule"

4. **Send Notifications**
   - System sends:
     - Rachel: Teams message + Outlook calendar invite
     - Sarah's parents: Email reminder + SMS (24 hours before)
   - Outlook calendar synced automatically

5. **Handle Last-Minute Cancellation**
   - Parent calls: Sarah sick, cancel Monday session
   - Mike opens appointment, clicks "Cancel"
   - System:
     - Marks Rachel's slot as available
     - Suggests patients with open hours needing sessions
     - Mike re-assigns slot to different patient

**Business Value**: Reduce scheduling time from 10 hours → 2 hours per week

---

### Workflow 4: Billing Specialist Submitting Claims

**Actors**: Jennifer (Billing Specialist)  
**Precondition**: Therapists completed 50 sessions last week  
**Trigger**: Weekly claim submission day (Friday)

**Steps**:

1. **View Unbilled Sessions**
   - Jennifer opens "Billing" → "Unbilled Sessions"
   - Sees list of 50 sessions ready for billing
   - System shows validation status:
     - ✅ 45 sessions ready
     - ⚠️ 3 sessions missing signatures
     - ❌ 2 sessions exceed authorization hours

2. **Review Claim Validation**
   - Jennifer clicks warning session
   - System shows issue: "Guardian signature missing"
   - Jennifer contacts therapist, requests signature
   - Therapist uploads signed form via mobile app
   - Status updates to ✅ Ready

3. **Generate Claims**
   - Jennifer selects all 48 ready sessions
   - Clicks "Generate Claims"
   - System:
     - Maps session data → CPT codes (97153 for RBT session)
     - Validates insurance authorization
     - Checks for duplicate claims
     - Generates 837 EDI file

4. **Submit Claims Electronically**
   - Jennifer clicks "Submit to Clearinghouse"
   - System sends claims to Office Ally
   - Receives confirmation: 48 claims submitted

5. **Track Claim Status**
   - Jennifer monitors "Claims Dashboard"
   - Sees status updates:
     - 40 claims: Accepted
     - 5 claims: Pending
     - 3 claims: Denied (reason: Authorization expired)
   - System sends Jennifer Teams notification for denials

6. **Handle Denial** (AI-assisted)
   - Jennifer clicks denied claim
   - System shows:
     - Reason: "Authorization expired 10/01"
     - Recommendation: "Update authorization, resubmit"
   - Jennifer updates patient authorization
   - Clicks "Resubmit Claim"

**Business Value**: 
- Clean claim rate: 95% (vs. industry avg 80%)
- Reduce days in A/R from 45 → 28 days

---

## Feature Details

### Feature 1: Smart Data Collection

#### 1.1 Trial Recording Interface (Mobile)

**Screen Layout**:

```
┌─────────────────────────────────┐
│  [<] Sarah Johnson   [⏸️ Pause]  │
├─────────────────────────────────┤
│  Goal: Identify Colors          │
│  Target: Red                    │
│  Accuracy: 18/20 (90%)  [⏱️ 42m] │
├─────────────────────────────────┤
│                                 │
│     [Prompt Level Selector]     │
│     ○ Independent               │
│     ○ Partial Prompt            │
│     ○ Full Prompt               │
│                                 │
│         ┌───────────┐           │
│         │     ✓     │           │
│         │  Correct  │           │
│         └───────────┘           │
│                                 │
│         ┌───────────┐           │
│         │     ✗     │           │
│         │ Incorrect │           │
│         └───────────┘           │
│                                 │
│  [📝 Add Note]  [🎤 Voice Note]  │
└─────────────────────────────────┘
```

**Interactions**:

1. **Quick Correct Response** (most common):
   - Tap large green "✓" button
   - System records: Correct, Independent prompt, Timestamp
   - Button flashes green, haptic feedback
   - Counter updates: 19/21 (90%)

2. **Prompted Response**:
   - First select prompt level radio button
   - Then tap "✓" or "✗"
   - System records response + prompt level

3. **Add Note to Trial**:
   - Tap "📝 Add Note" button
   - Text input appears
   - Type note (e.g., "Used physical prompt")
   - Note saves with trial

4. **Voice Note** (Phase 3):
   - Tap "🎤 Voice Note" button
   - Speak note (up to 60 seconds)
   - System transcribes via Azure Speech-to-Text
   - Attached to trial

**Business Rules**:

- Trial recorded with server timestamp (not device time)
- Cannot record trial without active session
- Cannot modify trial after 24 hours (audit compliance)
- Offline trials sync automatically when online

---

#### 1.2 Offline Data Sync

**How It Works**:

1. **Offline Detection**:
   - App checks connectivity every 30 seconds
   - Shows offline indicator (yellow banner): "Offline - data will sync later"

2. **Local Storage**:
   - All trials, sessions, notes saved to device local database (IndexedDB)
   - Encrypted with device-specific key
   - Max offline storage: 50 sessions or 7 days

3. **Sync on Reconnection**:
   - App detects WiFi/cellular connection
   - Shows sync indicator: "Syncing 3 sessions..."
   - Uploads data in chronological order
   - Server validates and accepts/rejects
   - App receives confirmation, deletes local copy

4. **Conflict Resolution**:
   - If session already exists on server (rare):
     - Compare timestamps
     - Keep most recent version
     - Flag for admin review

**Edge Cases**:
- **Device runs out of storage**: App prevents new session start, prompts to sync
- **Sync fails after 3 retries**: App alerts user, saves data for manual upload
- **Device lost/stolen**: Data encrypted, auto-deletes after 7 days offline

---

### Feature 2: Patient Management

#### 2.1 Patient Profile Screen

**Screen Layout** (Desktop):

```
┌────────────────────────────────────────────────────┐
│  Patients > Sarah Johnson                    [Edit]│
├────────────────────────────────────────────────────┤
│  ┌─────────────┐                                   │
│  │   Photo     │  Sarah Johnson                    │
│  │   (avatar)  │  DOB: 03/15/2015 (Age: 10)       │
│  └─────────────┘  Diagnosis: Autism Spectrum       │
│                   Status: Active ✅                 │
│                                                     │
│  ┌─── Tabs ────────────────────────────────────┐  │
│  │ Overview | Goals | Sessions | Documents |   │  │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  📊 Progress Summary (Last 30 Days)                │
│  ├─ Sessions Completed: 20                         │
│  ├─ Average Accuracy: 85%                          │
│  ├─ Goals Mastered: 2                              │
│  └─ Next Session: Mon 10/20 at 2:00 PM            │
│                                                     │
│  👨‍👩‍👧 Guardians                                      │
│  ├─ Jane Johnson (Mother)                          │
│  │  📧 jane@example.com  📱 555-0123               │
│  └─ Mark Johnson (Father)                          │
│     📧 mark@example.com  📱 555-0124               │
│                                                     │
│  🏥 Insurance                                       │
│  ├─ Provider: Blue Cross Blue Shield               │
│  ├─ Member ID: 123456789                           │
│  ├─ Authorization: #AUTH-2024-001                  │
│  └─ Hours Authorized: 40/month (35 used)           │
│                                                     │
│  [📄 View Documents]  [📅 Schedule Session]        │
└────────────────────────────────────────────────────┘
```

**Interactions**:

1. **Search Patients**:
   - Type in search bar: "Sarah"
   - System searches: Name, ID, diagnosis
   - Results appear as you type (debounced 300ms)

2. **Edit Patient Info**:
   - Click "Edit" button
   - Form fields become editable
   - Click "Save" or "Cancel"
   - System validates required fields

3. **View Progress Charts**:
   - Click "Goals" tab
   - Shows line chart of accuracy over time
   - Filter by goal, date range
   - Export to Excel/PDF

---

### Feature 3: Goal & Target Management

#### 3.1 Create Goal from Template

**User Flow**:

1. Navigate to Patient → Goals → "+ New Goal"
2. System shows modal: "Create from Template or Custom?"
3. User selects "Template"
4. Template library appears (searchable):
   - Communication Goals (50)
   - Social Skills (30)
   - Self-Care (20)
   - Academic Skills (40)
5. User selects "Identify 10 Colors"
6. System pre-fills:
   - Goal statement: "Sarah will identify 10 colors with 90% accuracy"
   - Targets: Red, Blue, Green, Yellow, Orange, Purple, Pink, Brown, Black, White
   - Prompt levels: Full, Partial, Independent
   - Mastery criteria: 90% accuracy for 3 consecutive sessions
7. User customizes:
   - Change target colors
   - Adjust mastery to 85%
8. Click "Create Goal"
9. System saves, shows confirmation

**Business Rules**:

- Must have at least 1 target
- Mastery accuracy must be 50-100%
- Consecutive sessions must be 1-10
- Cannot create duplicate goals for same patient

---

### Feature 4: Session Management

#### 4.1 Session Summary Screen (Post-Session)

**Screen Layout** (Mobile):

```
┌─────────────────────────────────┐
│  Session Complete! ✅            │
├─────────────────────────────────┤
│  Sarah Johnson                  │
│  Monday, Oct 20, 2024           │
│  2:00 PM - 2:45 PM (45 min)     │
├─────────────────────────────────┤
│  Goals Worked On:               │
│  ✓ Identify Colors (90%)        │
│  ✓ Match Shapes (75%)           │
├─────────────────────────────────┤
│  Total Trials: 30               │
│  Correct: 25                    │
│  Incorrect: 5                   │
│  Accuracy: 83%                  │
├─────────────────────────────────┤
│  Session Notes (Optional)       │
│  ┌─────────────────────────┐   │
│  │ Sarah was very engaged  │   │
│  │ today. Used physical    │   │
│  │ prompts for shapes.     │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  [ Request Guardian Signature ] │
│  [ Complete Session ]           │
└─────────────────────────────────┘
```

**Guardian Signature Flow** (Optional):

1. Therapist taps "Request Guardian Signature"
2. System shows signature pad
3. Guardian signs with finger
4. System captures signature as image
5. Saves with session record
6. Sends email receipt to guardian with session summary

---

## User Interface Specifications

### Design System

> **Full Design System Documentation**: See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for comprehensive design guidelines.

**Quick Reference**:

**Color Palette**:
- **Background**: Soft grey (96%) - Professional, easy on eyes
- **Cards**: White - Content hierarchy and focus
- **Primary Gradient**: Pink (#ec4899) to Purple (#9333ea) - Main actions
- **Text**: Near-black (3.9%) - High contrast readability
- **Borders**: Subtle grey (89.8%) - Soft visual separation

**Typography**:
- **Font**: Roboto (Light 300, Regular 400, Medium 500, Bold 700)
- **Headings**: Bold weight with tight letter spacing
- **Body**: Regular weight, 1.5 line height
- **Sizes**: 12px (caption) → 16px (body) → 36px (H1)

**Component Highlights**:
- **Buttons**: Gradient backgrounds with scale hover effects
- **Cards**: White with pink/purple glow on hover
- **Inputs**: White background, subtle borders
- **Icons**: Lucide React (consistent, modern)
- **Shadows**: Subtle on static, dramatic on hover

**Interaction Patterns**:
- **Hover**: Scale transforms + shadow increases
- **Focus**: Visible ring indicators (accessibility)
- **Transitions**: 200-300ms smooth animations
- **Loading**: Pulse animations, skeleton states

### Responsive Design

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md#responsive-design) for complete breakpoint guidelines.

**Breakpoints**:
- **Mobile**: < 640px (single column, stacked layout)
- **Tablet**: 640px - 1024px (2 columns, optimized touch)
- **Desktop**: > 1024px (3 columns, full sidebar)

**Mobile-First Approach**:
```tsx
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive cards */}
</div>
```

---

## Business Rules

### Data Collection Rules

1. **Session Duration**:
   - Minimum: 15 minutes
   - Maximum: 4 hours
   - Warning if < 15 min: "Session unusually short. Confirm?"

2. **Trial Recording**:
   - Cannot record trial outside active session
   - Cannot backdate trials > 7 days
   - Cannot modify trial after session marked complete (audit log only)

3. **Accuracy Calculation**:
   ```
   Accuracy = (Correct Trials / Total Trials) × 100
   Prompted Trials = Trials with Prompt Level ≠ Independent
   Independent Accuracy = (Independent Correct / Total Independent) × 100
   ```

### Goal Mastery Rules

1. **Mastery Criteria Met**:
   - When accuracy ≥ target for N consecutive sessions
   - System auto-flags goal as "Mastery Achieved"
   - BCBA must manually mark as "Mastered" (final approval)

2. **Plateau Detection** (AI):
   - If accuracy variance < 5% for last 5 sessions AND below target
   - System flags as "Plateau - Review Needed"
   - Sends notification to BCBA

### Billing Rules

1. **CPT Code Mapping**:
   - Session with RBT (< 30 min): 97153 (×1)
   - Session with RBT (30-60 min): 97153 (×2)
   - Session with BCBA: 97155
   - Group session: 97154

2. **Authorization Validation**:
   - Check hours remaining before claim generation
   - Block claim if authorization expired
   - Alert if < 10 hours remaining

---

## Error Handling

### User-Facing Errors

| Error Code | Scenario | Message | Action |
|------------|----------|---------|--------|
| `E001` | Patient not found | "Patient not found. Please check ID." | Return to search |
| `E002` | Session already active | "You have an active session. End it first." | Show active session |
| `E003` | Offline sync failed | "Unable to sync data. Will retry automatically." | Store locally |
| `E004` | Authorization expired | "Authorization expired. Update before billing." | Link to patient |
| `E005` | No internet (session end) | "No connection. Session saved offline." | Show sync status |

### System Errors

| Error Code | Scenario | Logging | Recovery |
|------------|----------|---------|----------|
| `S001` | Database write failure | Error + stack trace | Retry 3x, then alert admin |
| `S002` | Azure service timeout | Warning + latency | Fallback to cached data |
| `S003` | Authentication token expired | Info | Auto-refresh token |

---

## Integrations

### Microsoft 365 Integration Workflows

#### Integration 1: Teams Notification on Session Complete

**Trigger**: Therapist completes session  
**Flow**:

1. System detects session status change: `in_progress` → `completed`
2. Looks up BCBA assigned to patient
3. Calls Microsoft Graph API:
   ```
   POST /teams/{teamId}/channels/{channelId}/messages
   ```
4. Sends adaptive card:
   ```json
   {
     "type": "AdaptiveCard",
     "body": [
       {
         "type": "TextBlock",
         "text": "New Session Data",
         "weight": "bolder"
       },
       {
         "type": "FactSet",
         "facts": [
           { "title": "Patient", "value": "Sarah Johnson" },
           { "title": "Therapist", "value": "Rachel Smith" },
           { "title": "Accuracy", "value": "90%" },
           { "title": "Duration", "value": "45 min" }
         ]
       }
     ],
     "actions": [
       {
         "type": "Action.OpenUrl",
         "title": "View Details",
         "url": "https://app.wabicare.com/sessions/12345"
       }
     ]
   }
   ```

#### Integration 2: Outlook Calendar Two-Way Sync

**Scenario**: Admin schedules session in Wabi Care

**Flow**:

1. Admin creates appointment in Wabi Care
2. System calls Microsoft Graph API:
   ```
   POST /users/{therapistEmail}/calendar/events
   ```
3. Creates Outlook event:
   - Subject: "ABA Session: Sarah Johnson"
   - Start/End: From Wabi Care appointment
   - Location: Patient's address
   - Body: Link to session page in Wabi Care
   - Attendees: Therapist + parent (optional)
4. Outlook sends email invite to therapist
5. If therapist accepts/declines in Outlook:
   - Webhook notifies Wabi Care
   - Wabi Care updates appointment status

**Conflict Detection**:
- Before creating appointment, Wabi Care queries:
  ```
  GET /users/{therapistEmail}/calendar/calendarView
    ?startDateTime={appointmentStart}
    &endDateTime={appointmentEnd}
  ```
- If events exist, show warning: "Therapist has 2 conflicts. Continue?"

---

## Appendix: Screen Mockups

*(Link to Figma/design files)*

- [Mobile Data Collection Flow](https://figma.com/...)
- [Desktop Patient Dashboard](https://figma.com/...)
- [Scheduling Calendar View](https://figma.com/...)

---

**Document History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-10-12 | Design Team | Initial draft |
| 1.0 | 2025-10-16 | Product Team | Added Microsoft 365 workflows |

