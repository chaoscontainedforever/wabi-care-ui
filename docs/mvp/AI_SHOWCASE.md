# Wabi Care MVP: AI Showcase

**Version**: 1.0  
**Date**: October 16, 2025  
**Purpose**: Demonstrate AI-first capabilities in MVP pilot

---

## Overview

Wabi Care MVP showcases **5 AI-powered features** that directly save therapist time and demonstrate the value of an AI-first approach to ABA practice management. Each feature is designed to be **immediately demonstrable** to pilot customers within 4-6 weeks.

**AI Philosophy**: AI should **augment**, not replace, clinical judgment. All AI outputs are reviewed by licensed clinicians before use.

---

## AI Feature #1: AI Progress Notes Generator

### Problem Solved
BCBAs and RBTs spend 15+ minutes after each 45-minute session writing progress notes. This is pure overhead that doesn't improve patient care.

### AI Solution
**Voice or Data → GPT-4 → Clinical Note** in < 30 seconds

### How It Works

```
Step 1: Therapist Completes Session
├── Records 20 trials (correct/incorrect/prompted)
├── Notes observations (optional voice recording)
└── Clicks "End Session"

Step 2: System Prepares Context
├── Session data: 18/20 correct (90% accuracy)
├── Goal: Identify Colors (Red, Blue, Green)
├── Patient history: Previous 3 sessions averaged 75%
└── Target mastery: 90% for 3 consecutive sessions

Step 3: AI Generates Note (GPT-4)
├── Input: Session data + patient context + clinical template
├── Process: GPT-4 generates structured clinical note
└── Output: Professional progress note in 15 seconds

Step 4: Therapist Reviews & Saves
├── Review generated note
├── Edit if needed (optional)
├── Click "Save" → Auto-saves to OneDrive
└── Total time: 2 minutes (vs. 15 minutes manual)
```

### Example Output

**Input Data**:
- Patient: Sarah Johnson, Age 9, Autism
- Goal: Identify 10 colors with 90% accuracy
- Session: 20 trials, 18 correct (90%), 2 partial prompts
- Duration: 45 minutes
- Therapist observation (voice): "Sarah was very engaged today. Had trouble with purple and orange."

**AI-Generated Note**:
```
PROGRESS NOTE
Date: October 16, 2024
Patient: Sarah Johnson (DOB: 03/15/2015)
Therapist: Rachel Smith, RBT
Session Duration: 45 minutes

GOALS ADDRESSED:
- Receptive Identification: Identify 10 colors with 90% accuracy

SESSION SUMMARY:
Sarah completed 20 discrete trials targeting color identification with 
90% accuracy (18/20 correct responses). This represents a 15% improvement 
from the previous session (75% accuracy).

PERFORMANCE ANALYSIS:
- Independent responses: 18/20 trials (90%)
- Partial prompts required: 2/20 trials (10%)
- Strongest performance: Primary colors (red, blue, green, yellow)
- Area for improvement: Secondary colors (purple, orange)

BEHAVIORAL OBSERVATIONS:
Sarah demonstrated high engagement throughout the session. She required 
minimal redirection and maintained attention to task. Partial prompts 
were most effective for secondary color discrimination.

MASTERY PROGRESS:
Current performance (90%) meets target mastery criteria. Patient has now 
achieved 90%+ accuracy for 1 of 3 required consecutive sessions.

RECOMMENDATIONS:
1. Continue current teaching strategy for 2 more sessions to meet mastery
2. Consider introducing secondary color discrimination as next target
3. Maintain current reinforcement schedule

Next session scheduled: Friday, October 18, 2024, 10:00 AM

Electronically signed: Rachel Smith, RBT
Supervised by: Dr. Jennifer Martinez, BCBA
```

### Technical Implementation

**Azure Services Used**:
- **Azure OpenAI Service** (GPT-4-turbo)
- **Azure Speech Service** (if voice observation)
- **Microsoft Graph API** (save to OneDrive)

**Prompt Engineering**:
```typescript
const systemPrompt = `You are an experienced BCBA writing a clinical progress note 
for an ABA therapy session. Use professional, evidence-based language. 
Be specific about performance data. Include recommendations for next session.

Format:
- Goals Addressed
- Session Summary (brief, data-driven)
- Performance Analysis (accuracy, prompting levels)
- Behavioral Observations
- Mastery Progress
- Recommendations

Do not fabricate data. Use only information provided.`;

const userPrompt = `
Session Data:
- Patient: ${patient.name}, Age ${patient.age}, ${patient.diagnosis}
- Goal: ${goal.statement}
- Trials: ${session.totalTrials}
- Correct: ${session.correctTrials}
- Accuracy: ${session.accuracy}%
- Prompt Level: ${session.promptStats}
- Duration: ${session.duration} minutes
- Therapist notes: ${session.notes}
- Previous sessions: ${previousSessions.summary}

Generate a professional progress note.`;
```

**Cost**: ~$0.03 per note (GPT-4 pricing)

### Success Metrics
- Generation time < 30 seconds
- 90%+ clinician satisfaction
- 70%+ notes used without edits
- **Time saved: 13 minutes per note**

---

## AI Feature #2: Smart Billing Assistant

### Problem Solved
Billing specialists spend 20+ minutes per week manually mapping sessions to CPT codes, calculating units, and validating claims. Errors lead to 15-20% denial rates.

### AI Solution
**Session Data → AI Analysis → Pre-validated Claim** with < 5% error rate

### How It Works

```
Step 1: Billing Specialist Opens "Unbilled Sessions"
└── Sees 50 sessions from the past week

Step 2: AI Analyzes Each Session
For each session:
├── Identifies therapist role (RBT vs. BCBA)
├── Maps to CPT code:
│   ├── RBT direct service → 97153
│   ├── BCBA direct service → 97155
│   ├── BCBA supervision → 97155
│   └── Parent training → 97156
├── Calculates units (15-min increments)
├── Validates against authorization:
│   ├── Hours remaining: 35/40
│   ├── Date range: Valid
│   └── Service limits: Within limits
└── Flags potential issues

Step 3: AI Predicts Denial Risk
├── Analyzes historical denial patterns
├── Checks common denial reasons:
│   ├── Missing authorization
│   ├── Exceeded limits
│   ├── Incorrect modifier
│   └── Documentation gaps
└── Assigns risk score: Low/Medium/High

Step 4: Export Pre-validated Claims
├── Review AI-flagged sessions
├── Fix any issues
├── Export to CSV
└── Submit to clearinghouse
```

### Example Analysis

**Session Input**:
- Therapist: Rachel Smith (RBT credential: #12345)
- Patient: Sarah Johnson (Insurance: Blue Cross, Auth: #AUTH-2024-001)
- Date: 10/16/2024
- Start: 10:00 AM, End: 10:47 AM (47 minutes)
- Service: 1:1 ABA therapy at patient's home

**AI Output**:
```json
{
  "claimAnalysis": {
    "cptCode": "97153",
    "cptDescription": "Adaptive behavior treatment by protocol, 
                       administered by a technician under the 
                       direction of a physician or other qualified 
                       health care professional, face-to-face with 
                       one patient; each 15 minutes",
    "units": 3,
    "calculation": "47 minutes ÷ 15 = 3.13 → round to 3 units",
    "billedAmount": "$112.50",
    "placeOfService": "12 (Home)",
    "modifiers": ["HM (telehealth - not applicable)"],
    
    "validationChecks": {
      "authorization": {
        "status": "✓ Valid",
        "number": "AUTH-2024-001",
        "hoursRemaining": "35/40 hours",
        "expirationDate": "12/31/2024"
      },
      "credentials": {
        "status": "✓ Valid",
        "therapist": "Rachel Smith, RBT",
        "credential": "#12345",
        "expiration": "06/30/2025"
      },
      "serviceRules": {
        "status": "✓ Valid",
        "maxUnitsPerDay": "8 (within limit)",
        "requiresSupervisor": "✓ Supervised by Dr. Martinez"
      }
    },
    
    "denialRiskScore": {
      "risk": "LOW (5%)",
      "factors": [
        "✓ Authorization valid and current",
        "✓ Service within authorized hours",
        "✓ Therapist credentials current",
        "✓ CPT code matches service type"
      ]
    },
    
    "recommendations": [
      "Claim ready for submission",
      "Consider batch with other claims for efficiency"
    ]
  }
}
```

**Flagged Issue Example**:
```json
{
  "claimAnalysis": {
    "cptCode": "97153",
    "units": 4,
    "denialRiskScore": {
      "risk": "HIGH (65%)",
      "factors": [
        "⚠ Authorization expires in 3 days (10/19/2024)",
        "⚠ Only 2 hours remaining on authorization",
        "❌ This claim (1 hour) exceeds remaining authorization"
      ]
    },
    "recommendations": [
      "⚠ UPDATE AUTHORIZATION before submitting",
      "Contact insurance to renew authorization",
      "DO NOT SUBMIT until authorization updated"
    ]
  }
}
```

### Technical Implementation

**AI Model**: GPT-4 with structured output (JSON mode)

**Prompt**:
```typescript
const billingPrompt = `Analyze this therapy session and generate billing information.

Session details:
- Therapist: ${therapist.name}, Role: ${therapist.role}
- Duration: ${session.duration} minutes
- Service type: ${session.serviceType}
- Patient insurance: ${patient.insurance}
- Authorization: ${authorization.details}

Return JSON with:
- CPT code (97153, 97155, 97156)
- Units calculated (15-min increments)
- Validation checks (authorization, credentials)
- Denial risk score (0-100)
- Recommendations

Use official ABA billing guidelines. Flag any potential issues.`;
```

**Cost**: ~$0.02 per claim analysis

### Success Metrics
- Pre-submission error rate < 5%
- Denial risk prediction accuracy > 85%
- **Time saved: 18 minutes per week per specialist**

---

## AI Feature #3: Predictive Scheduling Assistant

### Problem Solved
Practice admins spend 5+ hours per week manually scheduling appointments, often creating suboptimal schedules (therapist-patient mismatch, poor spacing, authorization conflicts).

### AI Solution
**Patient Progress + Availability → Optimal Schedule Suggestions**

### How It Works

```
Step 1: Therapist Completes Session
└── 90% accuracy (excellent progress)

Step 2: AI Analyzes Multiple Factors
├── Patient factors:
│   ├── Current progress: 90% accuracy (trending up)
│   ├── Historical data: 3-session moving average
│   ├── Mastery status: 1/3 sessions at mastery
│   └── Authorization: 32/40 hours used (8 hours remaining)
│
├── Therapist factors:
│   ├── Historical success rate with this patient: 85%
│   ├── Availability (from Outlook): Mon/Wed/Fri mornings
│   ├── Current caseload: 12 active patients
│   └── Geographic location: 5 miles from patient
│
└── Optimal timing research:
    ├── Literature: 2-3 day spacing optimal for skill retention
    ├── Practice norms: 3x/week typical for this goal type
    └── Patient preference (if known): Morning sessions

Step 3: AI Generates Recommendation
└── "Schedule next session Friday, October 18 at 10:00 AM"
    ├── Reasoning: 2-day spacing (optimal for retention)
    ├── Therapist available: Yes (Outlook calendar clear)
    ├── Patient making progress: Continue current frequency
    └── Authorization sufficient: Yes (8 hours remaining)

Step 4: One-Click Scheduling
├── Admin reviews recommendation
├── Clicks "Schedule" button
├── Creates Outlook appointment automatically
└── Sends confirmation email/SMS to parent
```

### Example Recommendations

**Scenario 1: Strong Progress**
```
Patient: Sarah Johnson
Current Status: 90% accuracy (excellent)
Last Session: 2 days ago

AI Recommendation: ✅ CONTINUE CURRENT FREQUENCY
"Schedule next session Friday, 10:00 AM (2-day spacing)
Reasoning: Patient progressing well toward mastery. 
Maintain current 3x/week frequency."

Confidence: 92%
```

**Scenario 2: Struggling Patient**
```
Patient: Michael Chen
Current Status: 55% accuracy (declining from 75%)
Last Session: 4 days ago

AI Recommendation: ⚠ INCREASE FREQUENCY
"Schedule next session TOMORROW, 2:00 PM (1-day spacing)
Reasoning: Performance declining. Increase to 4x/week to 
prevent skill regression. Consider BCBA consultation."

Confidence: 87%
Alert: This patient may be at risk of plateau
```

**Scenario 3: Authorization Alert**
```
Patient: Emma Rodriguez
Current Status: 85% accuracy (good progress)
Authorization: 38/40 hours used (2 hours remaining)

AI Recommendation: ⚠ AUTHORIZATION ACTION NEEDED
"DO NOT schedule until authorization renewed.
Contact insurance to request additional hours.
Patient showing good progress, discontinuing services 
would disrupt momentum."

Action Required: Update authorization within 3 days
```

### Technical Implementation

**AI Model**: Custom ML model (simple decision tree for MVP) + GPT-4 for reasoning

**Algorithm**:
```python
def predict_next_appointment(patient, therapist, recent_sessions):
    # Calculate progress trend
    recent_accuracy = [s.accuracy for s in recent_sessions[-5:]]
    trend = calculate_trend(recent_accuracy)
    
    # Determine optimal frequency
    if trend > 0.1:  # Improving
        frequency = "maintain"  # 3x/week
    elif trend < -0.1:  # Declining
        frequency = "increase"  # 4x/week
    else:  # Stable
        frequency = "maintain"
    
    # Check therapist availability
    available_slots = get_outlook_availability(therapist.email)
    
    # Calculate optimal spacing (2-3 days)
    days_since_last = (datetime.now() - recent_sessions[-1].date).days
    optimal_next_date = datetime.now() + timedelta(days=2)
    
    # Find best matching slot
    best_slot = find_closest_slot(optimal_next_date, available_slots)
    
    # Check authorization
    auth_check = validate_authorization(patient.authorization)
    
    # Generate reasoning with GPT-4
    reasoning = gpt4_explain_recommendation({
        "patient": patient,
        "trend": trend,
        "frequency": frequency,
        "suggested_slot": best_slot,
        "authorization": auth_check
    })
    
    return {
        "recommended_date": best_slot,
        "frequency": frequency,
        "reasoning": reasoning,
        "confidence": calculate_confidence(),
        "alerts": check_alerts(auth_check, trend)
    }
```

**Cost**: ~$0.01 per recommendation

### Success Metrics
- 80%+ of recommendations accepted
- Scheduling time reduced by 70%
- **Time saved: 4 hours per week per admin**

---

## AI Feature #4: Real-Time Session Insights

### Problem Solved
Therapists don't get immediate feedback during sessions about whether their teaching strategies are working. They rely on post-session analysis.

### AI Solution
**Real-Time Accuracy Prediction → Adjust Teaching Strategy Mid-Session**

### How It Works

```
During Session:
├── Trial 1-5: System observes baseline
│   └── 60% accuracy (3/5 correct)
│
├── Trial 6: AI Provides Insight
│   ├── "Current accuracy: 60%"
│   ├── "Trending: Stable"
│   └── "Suggestion: Patient responding well to visual prompts. 
│       Continue current strategy."
│
├── Trial 7-10: Continue teaching
│   └── 70% accuracy (7/10 correct)
│
├── Trial 11: AI Provides Alert
│   ├── "Current accuracy: 70%"
│   ├── "Trending: Improving (+10%)"
│   └── "Suggestion: Patient engaged. Consider reducing prompt 
│       level to assess independent responding."
│
└── Session End: Final Analysis
    ├── Final accuracy: 85% (17/20 correct)
    ├── "Excellent session! Patient improved 25% from baseline."
    └── "Next session: Continue fade prompts. Target 90%."
```

### Example Mid-Session Alert

**Alert Display**:
```
┌────────────────────────────────────────┐
│  📊 SESSION INSIGHT                     │
├────────────────────────────────────────┤
│  Current Progress: 7/10 (70%)          │
│  Trend: ↑ Improving (+10% from start)  │
│                                        │
│  💡 AI Suggestion:                     │
│  Patient responding well to your       │
│  teaching strategy. Consider:          │
│  • Reducing prompt level next trial    │
│  • Testing independent responding      │
│                                        │
│  Confidence: 85%                       │
│                                        │
│  [Dismiss]  [See More]                 │
└────────────────────────────────────────┘
```

### Technical Implementation

**AI Model**: Lightweight ML model (edge inference for real-time)

**Algorithm**:
```typescript
function analyzeSessionProgress(trials: Trial[], goalData: Goal) {
  // Calculate current metrics
  const currentAccuracy = calculateAccuracy(trials);
  const baseline = calculateAccuracy(trials.slice(0, 5));
  const trend = currentAccuracy - baseline;
  
  // Predict end-of-session accuracy
  const predicted = predictFinalAccuracy(trials, goalData.historicalData);
  
  // Generate insights
  if (currentAccuracy < 50 && trials.length > 10) {
    return {
      alert: "CAUTION",
      message: "Low accuracy detected. Consider adjusting strategy.",
      suggestions: [
        "Increase prompt level",
        "Check for attention/motivation",
        "Consider taking a break"
      ]
    };
  }
  
  if (trend > 0.15) {
    return {
      alert: "POSITIVE",
      message: "Great progress! Patient responding well.",
      suggestions: [
        "Consider reducing prompts",
        "Test independent responding"
      ]
    };
  }
  
  // Default: Continue current strategy
  return {
    alert: "INFO",
    message: `Current accuracy: ${currentAccuracy}%. On track for goal.`,
    suggestions: []
  };
}
```

**Cost**: $0 (edge inference, no API calls)

### Success Metrics
- 90%+ therapists find insights helpful
- Mid-session adjustments improve final accuracy by 10%+

---

## AI Feature #5: AI Co-pilot Assistant

### Problem Solved
Therapists need real-time guidance during sessions but don't have immediate access to BCBA expertise, goal strategies, or intervention techniques.

### AI Solution
**Real-Time AI Assistant → Contextual Guidance → Improved Session Quality**

### How It Works

```
During Session:
├── Therapist asks: "Patient struggling with color identification"
├── AI Co-pilot analyzes:
│   ├── Current goal: Identify 10 colors
│   ├── Recent performance: 60% accuracy (declining)
│   ├── Session context: 15 trials completed
│   └── Patient history: Strong with shapes, weak with colors
│
├── AI Provides Guidance:
│   ├── "Try visual prompts with color cards"
│   ├── "Consider errorless teaching - start with red/blue only"
│   ├── "Check motivation - offer preferred reinforcer"
│   └── "If continues struggling, consider BCBA consultation"
│
└── Therapist implements suggestions
    └── Accuracy improves from 60% to 80%
```

### Example Co-pilot Interactions

**Scenario 1: Struggling with New Skill**
```
Therapist: "Patient not responding to color identification"

AI Co-pilot Response:
┌────────────────────────────────────────┐
│  🤖 AI CO-PILOT SUGGESTIONS             │
├────────────────────────────────────────┤
│  Current Goal: Identify 10 colors       │
│  Performance: 3/10 correct (30%)        │
│                                        │
│  💡 Try These Strategies:               │
│  • Use errorless teaching - show       │
│    correct answer first                │
│  • Start with 2 colors only (red/blue) │
│  • Use visual prompts (color cards)    │
│  • Check motivation - offer favorite   │
│    toy/treat                           │
│                                        │
│  ⚠️ If no improvement after 5 trials:  │
│  Consider BCBA consultation            │
│                                        │
│  [Try Strategy] [Ask BCBA] [End Session]│
└────────────────────────────────────────┘
```

**Scenario 2: Behavior Escalation**
```
Therapist: "Patient throwing materials, refusing to work"

AI Co-pilot Response:
┌────────────────────────────────────────┐
│  🚨 BEHAVIOR SUPPORT SUGGESTIONS        │
├────────────────────────────────────────┤
│  Behavior: Throwing materials          │
│  Function: Likely escape/avoidance     │
│                                        │
│  🛠️ Immediate Actions:                 │
│  • Remove materials, clear area        │
│  • Use calm, neutral tone              │
│  • Offer break option: "Break or work?" │
│  • Redirect to preferred activity      │
│                                        │
│  📋 Prevention Strategies:              │
│  • Reduce task difficulty              │
│  • Increase reinforcement frequency    │
│  • Use first-then visual schedule      │
│                                        │
│  📞 Escalate if: Continues > 5 min     │
│                                        │
│  [Try Strategy] [Call BCBA] [End Session]│
└────────────────────────────────────────┘
```

**Scenario 3: Goal Mastery**
```
Therapist: "Patient mastered color identification!"

AI Co-pilot Response:
┌────────────────────────────────────────┐
│  🎉 MASTERY ACHIEVED!                   │
├────────────────────────────────────────┤
│  Goal: Identify 10 colors              │
│  Performance: 9/10 correct (90%)        │
│  Consecutive Sessions: 3/3 ✅           │
│                                        │
│  🎯 Next Steps:                         │
│  • Document mastery in notes           │
│  • Update goal status to "Mastered"     │
│  • Consider next skill:                 │
│    - Color mixing (red + blue = purple) │
│    - Color sorting by category         │
│    - Color naming in sentences         │
│                                        │
│  📝 BCBA Actions:                       │
│  • Review mastery data                 │
│  • Create new goal in IEP              │
│  • Update treatment plan               │
│                                        │
│  [Mark Mastered] [Create New Goal]      │
└────────────────────────────────────────┘
```

### Technical Implementation

**AI Model**: GPT-4 with clinical ABA knowledge base

**Context Window**:
```typescript
interface CoPilotContext {
  patient: {
    id: string;
    name: string;
    age: number;
    diagnosis: string[];
    preferences: string[];
    triggers: string[];
  };
  
  currentGoal: {
    statement: string;
    targets: string[];
    masteryCriteria: {
      accuracy: number;
      consecutiveSessions: number;
    };
    teachingStrategies: string[];
  };
  
  sessionData: {
    trialsCompleted: number;
    currentAccuracy: number;
    recentTrials: Trial[];
    behaviors: BehaviorEvent[];
  };
  
  therapistQuery: string;
}
```

**Prompt Engineering**:
```typescript
const coPilotPrompt = `You are an experienced BCBA providing real-time guidance to an RBT during an ABA therapy session.

Patient Context:
- Name: ${patient.name}, Age: ${patient.age}
- Diagnosis: ${patient.diagnosis.join(', ')}
- Current Goal: ${goal.statement}
- Session Progress: ${sessionData.trialsCompleted} trials, ${sessionData.currentAccuracy}% accuracy

Therapist Question: "${therapistQuery}"

Provide:
1. Immediate actionable strategies (2-3 specific techniques)
2. Prevention strategies for future sessions
3. When to escalate to BCBA
4. Positive reinforcement suggestions

Use evidence-based ABA principles. Be concise but specific. Include safety considerations for challenging behaviors.`;
```

**Real-time Integration**:
```typescript
// During session, therapist can ask questions
const askCoPilot = async (question: string) => {
  const context = await buildSessionContext();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: coPilotPrompt },
      { role: 'user', content: `${context}\n\nQuestion: ${question}` }
    ],
    temperature: 0.3, // More deterministic for clinical guidance
    max_tokens: 500
  });
  
  return response.choices[0].message?.content;
};
```

### Voice Integration (Optional)

**Voice-to-Text**: Therapist speaks question → Azure Speech Service → Text
**Text-to-Speech**: AI response → Azure Speech Service → Audio playback

```typescript
// Voice-enabled co-pilot
const voiceCoPilot = {
  async askQuestion(audioBlob: Blob) {
    // 1. Convert speech to text
    const transcript = await speechService.recognize(audioBlob);
    
    // 2. Get AI response
    const response = await askCoPilot(transcript);
    
    // 3. Convert response to speech
    const audioResponse = await speechService.synthesize(response);
    
    return { text: response, audio: audioResponse };
  }
};
```

### Success Metrics
- 85%+ therapists use co-pilot during sessions
- 70%+ find suggestions helpful
- Session quality improves (measured by goal progress)
- **Time saved: 5-10 minutes per session** (faster problem-solving)

### Cost
- **Per Query**: ~$0.01 (GPT-4 pricing)
- **Monthly Cost** (50 users, 2 queries/session, 20 sessions/month): ~$20
- **Per-User Cost**: $0.40/month

---

## AI Feature #6: Patient Risk Alerts

### Problem Solved
BCBAs don't discover struggling patients until weeks of poor progress have passed, missing early intervention opportunities.

### AI Solution
**Continuous Monitoring → Proactive Alerts → Early Intervention**

### How It Works

```
Background Process (Daily):
├── AI analyzes all recent sessions
├── Calculates risk scores for each patient
└── Sends alerts to BCBAs

Risk Factors Monitored:
├── Performance decline (accuracy drop > 10%)
├── Missed appointments (> 2 in 30 days)
├── Plateau (no progress for 2 weeks)
├── Authorization expiring (< 10 hours remaining)
└── Therapist-patient mismatch (low success rate)

Alert Delivery:
├── Microsoft Teams notification
├── Email summary
└── Dashboard flag
```

### Example Alerts

**Alert 1: Performance Decline**
```
🚨 PATIENT RISK ALERT

Patient: Michael Chen (Age 7)
Risk Level: HIGH
Risk Type: Performance Decline

Details:
- Current accuracy: 55% (down from 75% average)
- Trend: Declining for past 4 sessions
- Last improvement: 3 weeks ago

Recommended Actions:
1. Schedule BCBA observation within 48 hours
2. Review teaching procedures for effectiveness
3. Consider functional behavior assessment
4. Check for environmental factors (changes at home/school)

Assigned To: Dr. Jennifer Martinez, BCBA
Priority: Address within 24 hours

[View Patient Dashboard]  [Schedule Observation]
```

**Alert 2: At-Risk of Dropout**
```
⚠ PATIENT RISK ALERT

Patient: Emma Rodriguez (Age 5)
Risk Level: MEDIUM
Risk Type: Attendance Issues

Details:
- Missed appointments: 3 in last 30 days
- Cancellation pattern: Last-minute (< 24 hours)
- Authorization usage: 15/40 hours (low utilization)

Recommended Actions:
1. Contact guardian to discuss barriers to attendance
2. Consider alternative scheduling (time/day/location)
3. Review transportation assistance options
4. Document conversation and barriers identified

Assigned To: Practice Admin
Priority: Contact within 48 hours

[Contact Guardian]  [View History]
```

**Alert 3: Authorization Expiring**
```
⚠ ADMINISTRATIVE ALERT

Patient: Sarah Johnson (Age 9)
Alert Type: Authorization Expiring
Urgency: 7 days remaining

Details:
- Current authorization: AUTH-2024-001
- Expiration date: October 23, 2024 (7 days)
- Hours remaining: 5 of 40
- Patient status: Making excellent progress (90% accuracy)

Recommended Actions:
1. Submit authorization renewal request TODAY
2. Request same or increased hours (patient progressing)
3. Include recent progress data to support request
4. Follow up with insurance within 2 business days

Impact if not renewed:
- Services will be disrupted at critical point in treatment
- Patient is 1 session away from mastering current goal

[Submit Renewal Request]  [Generate Progress Report]
```

### Technical Implementation

**AI Model**: Rule-based system + ML risk scoring

**Algorithm**:
```python
def calculate_patient_risk(patient_id):
    sessions = get_recent_sessions(patient_id, days=30)
    
    risk_factors = {
        "performance_decline": analyze_accuracy_trend(sessions),
        "attendance_issues": analyze_missed_appointments(sessions),
        "plateau": analyze_progress_plateau(sessions),
        "authorization": check_authorization_status(patient_id),
        "therapist_match": analyze_therapist_effectiveness(sessions)
    }
    
    # Calculate weighted risk score
    risk_score = (
        risk_factors["performance_decline"] * 0.30 +
        risk_factors["attendance_issues"] * 0.25 +
        risk_factors["plateau"] * 0.20 +
        risk_factors["authorization"] * 0.15 +
        risk_factors["therapist_match"] * 0.10
    )
    
    # Generate alerts if risk > threshold
    if risk_score > 0.7:
        send_alert("HIGH", patient_id, risk_factors)
    elif risk_score > 0.4:
        send_alert("MEDIUM", patient_id, risk_factors)
    
    return risk_score
```

**Cost**: ~$0.01 per patient per day

### Success Metrics
- Identify 85%+ of at-risk patients before dropout
- BCBA intervention within 24 hours of alert
- Reduce patient dropouts by 30%

---

## AI Cost Summary (MVP)

| AI Feature | Cost per Use | Monthly Cost (50 users, 5 clinics) |
|------------|-------------|-------------------------------------|
| **Progress Notes** | $0.03/note | $300 (200 notes/week) |
| **Smart Billing** | $0.02/claim | $40 (100 claims/week) |
| **Scheduling Suggestions** | $0.01/suggestion | $20 (50 suggestions/week) |
| **Session Insights** | $0 (edge) | $0 |
| **AI Co-pilot** | $0.01/query | $20 (2 queries/session, 20 sessions/month) |
| **Risk Alerts** | $0.01/patient/day | $15 (50 patients) |
| **Total AI Cost** | | **~$395/month** |

**Per-User Cost**: $7.90/month  
**Revenue per User**: $49/month (pilot pricing)  
**Gross Margin**: 84%

---

## Demo Script for Pilot Customers

### 6-Minute AI Demo

**Minute 1: AI Progress Notes**
1. Show completed session with trial data
2. Click "Generate Note with AI"
3. Watch GPT-4 generate professional note in 15 seconds
4. "This just saved you 13 minutes of writing"

**Minute 2: Smart Billing**
1. Show list of unbilled sessions
2. Click "Analyze All"
3. Show AI-flagged issues (authorization, validation errors)
4. "AI just prevented 3 claim denials"

**Minute 3: Predictive Scheduling**
1. Show patient with strong progress
2. AI suggests next appointment: "Friday 10 AM"
3. Show reasoning: optimal spacing, therapist availability
4. Click "Schedule" → Creates Outlook appointment instantly

**Minute 4: Real-Time Insights**
1. Simulate mid-session with 10 trials recorded
2. Show AI suggestion: "Patient improving, reduce prompts"
3. "Therapist gets immediate feedback, adjusts teaching"

**Minute 5: AI Co-pilot Assistant**
1. Show therapist asking: "Patient struggling with colors"
2. AI responds with specific strategies: "Try errorless teaching, start with red/blue only"
3. Show voice integration: "Hey Wabi, what should I do?"
4. "Your BCBA expertise, available 24/7"

**Minute 6: Risk Alerts**
1. Show patient with declining accuracy
2. Show Teams alert sent to BCBA
3. Show recommended actions
4. "AI caught this early, preventing dropout"

**Close**: "Six AI features. Save 20+ hours per month. Ready in 4 weeks."

---

## Appendix: AI Ethics & Safety

### Responsible AI Practices

1. **Human-in-the-Loop**: All AI outputs reviewed by licensed clinicians
2. **Transparency**: AI reasoning explained to users
3. **No Training on PHI**: Azure OpenAI does not train on customer data
4. **Bias Monitoring**: Regular audits of AI recommendations
5. **Opt-Out**: Clinicians can choose manual workflows

### Safety Guardrails

- AI notes require BCBA approval before finalization
- Billing AI cannot submit claims without human review
- Risk alerts are suggestions, not diagnoses
- All AI decisions are auditable and logged

---

**Questions?** Contact AI Team: ai@wabicare.com

