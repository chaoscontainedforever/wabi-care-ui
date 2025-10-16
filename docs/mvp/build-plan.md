# MVP Development Plan from Existing Codebase

## Current State Analysis

The `wabi-care-softui` folder already has significant MVP foundation:

**What Exists (Keep & Enhance)**:

- Next.js 14 app with App Router ✓
- Shadcn UI components fully integrated ✓
- Student/Goal/Session data models ✓
- Data collection UI (`GoalDataContentInner.tsx`) ✓
- Dashboard and navigation (`app-sidebar.tsx`) ✓
- Patient management pages ✓
- Responsive design with Tailwind CSS ✓

**What Needs Changing (Migration Required)**:

- **Auth**: Supabase Auth → Azure AD B2C + NextAuth.js
- **Database**: Supabase → Azure Cosmos DB
- **Add**: 6 AI features (none exist currently)
- **Add**: Microsoft 365 integration (OneDrive, Outlook, Teams)
- **Add**: Offline-first data collection (IndexedDB sync)

## Migration Strategy: Incremental, Not Rewrite

Instead of rewriting, we'll **enhance** the existing codebase:

1. Keep UI components (98% ready)
2. Replace data layer (Supabase → Azure)
3. Add AI features as new modules
4. Maintain existing folder structure

---

## Developer Assignment & Branch Strategy

### Week 0: Foundation (Both Developers, 2 days)

**Branch**: `feature/azure-foundation`

**What to do together**:

1. Replace Supabase with Azure services
2. Setup shared infrastructure
3. Define API contracts

**Changes**:

#### 1. Replace `src/lib/supabase.ts` with `src/lib/azure/cosmos.ts`

```typescript
// src/lib/azure/cosmos.ts
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.AZURE_COSMOS_ENDPOINT!,
  key: process.env.AZURE_COSMOS_KEY!
});

export const database = client.database('wabicare-mvp');
export const containers = {
  users: database.container('users'),
  patients: database.container('patients'),
  goals: database.container('goals'),
  sessions: database.container('sessions'),
  claims: database.container('claims')
};
```

#### 2. Replace `src/contexts/AuthContext.tsx` with NextAuth.js

```typescript
// src/lib/auth/nextauth.ts
import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],
});
```

#### 3. Create Azure OpenAI client

```typescript
// src/lib/ai/openai.ts
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

export const openaiClient = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY!)
);
```

#### 4. Update `src/lib/services.ts` to use Cosmos DB

Replace all Supabase queries with Cosmos DB queries:

```typescript
// Before (Supabase)
const { data } = await supabase.from('students').select('*');

// After (Cosmos DB)
const { resources } = await containers.patients.items
  .query('SELECT * FROM c WHERE c.practiceId = @practiceId')
  .fetchAll();
```

**Merge to develop**: Tuesday EOD

---

### Week 1: Parallel Development (Days 3-5)

### Developer A: Data Collection + Offline Sync

**Branch**: `feature/offline-data-collection`

**What to build**:

- IndexedDB for offline storage
- Sync mechanism when online
- Enhanced data collection UI

**Files to modify**:

```
src/components/GoalDataContentInner.tsx (already exists, enhance)
src/lib/offline/
  ├── db.ts (new - IndexedDB setup)
  ├── sync.ts (new - sync logic)
src/hooks/useOfflineSync.ts (new)
```

**Key enhancement to `GoalDataContentInner.tsx`**:

```typescript
// Add offline sync hook
import { useOfflineSync } from '@/hooks/useOfflineSync';

function GoalDataContentInner() {
  // Existing state...
  const { saveOffline, syncPending } = useOfflineSync();
  
  const handleRecordTrial = async (trialData) => {
    // Save to IndexedDB first (instant)
    await saveOffline(trialData);
    
    // Sync to Cosmos DB when online
    if (navigator.onLine) {
      await syncToCloud(trialData);
    }
  };
}
```

**PR Friday**: Create PR with offline functionality

---

### Developer B: Smart Billing Foundation

**Branch**: `feature/smart-billing`

**What to build**:

- Billing dashboard page
- Claims data model
- CPT code mapping
- Basic claim generation (no AI yet)

**Files to create**:

```
src/app/billing/
  ├── page.tsx (new)
  ├── claims/
      └── page.tsx (new)
src/components/
  ├── BillingDashboard.tsx (new)
  ├── ClaimsList.tsx (new)
  ├── ClaimDetails.tsx (new)
src/lib/billing/
  ├── cpt-codes.ts (new - mapping logic)
  ├── claim-generator.ts (new)
  ├── validation.ts (new)
```

**No conflicts**: Developer A works in `GoalDataContentInner.tsx`, Developer B creates new billing files.

**PR Friday**: Create PR with basic billing

---

### Week 2: AI Integration (Days 6-10)

### Developer A: AI Progress Notes

**Branch**: `feature/ai-notes`

**What to build**:

- AI note generation from session data
- Integration with Azure OpenAI
- OneDrive auto-save (optional MVP feature)

**Files to create**:

```
src/lib/ai/
  ├── note-generation.ts (new)
  ├── prompts.ts (new - prompt templates)
src/components/
  ├── AINoteGenerator.tsx (new)
  ├── NotePreview.tsx (new)
src/app/api/ai/
  └── generate-note/
      └── route.ts (new - API endpoint)
```

**Integration point**: Add "Generate Note" button to data collection page

```typescript
// src/components/GoalDataContentInner.tsx
import { AINoteGenerator } from './AINoteGenerator';

// Inside component
{selectedGoal && (
  <AINoteGenerator 
    sessionData={{
      patientId: localSelectedStudentId,
      goalId: selectedGoal,
      trials: /* trial data */
    }}
  />
)}
```

**PR Friday**: Create PR with AI notes

---

### Developer B: AI Billing + Scheduling

**Branch**: `feature/ai-billing-scheduling`

**What to build**:

- Smart billing with AI validation
- Predictive scheduling suggestions
- Outlook calendar integration (basic)

**Files to create**:

```
src/lib/ai/
  ├── billing-analysis.ts (new)
  ├── scheduling.ts (new)
src/lib/m365/
  ├── graph-client.ts (new - Microsoft Graph setup)
  ├── calendar.ts (new)
src/app/scheduling/
  └── page.tsx (new)
src/components/
  ├── SchedulingSuggestions.tsx (new)
  ├── BillingAIAssistant.tsx (new)
src/app/api/ai/
  ├── analyze-claim/
  │   └── route.ts (new)
  └── suggest-schedule/
      └── route.ts (new)
```

**Integration to billing page**:

```typescript
// src/components/BillingDashboard.tsx
<BillingAIAssistant onAnalyze={handleAnalyzeClaims} />
```

**PR Friday**: Create PR with AI billing + scheduling

---

### Week 3: Advanced AI Features (Days 11-15)

### Developer A: AI Co-pilot

**Branch**: `feature/ai-copilot`

**What to build**:

- Real-time AI assistant during sessions
- Voice integration (optional for MVP)
- Context-aware suggestions

**Files to create**:

```
src/lib/ai/
  ├── copilot.ts (new)
src/components/
  ├── AICopilot.tsx (new - floating assistant)
  ├── CopilotChat.tsx (new)
src/app/api/ai/
  └── copilot/
      └── route.ts (new)
```

**Integration to data collection**:

```typescript
// src/components/GoalDataContentInner.tsx
import { AICopilot } from './AICopilot';

// Inside component
<AICopilot 
  sessionContext={{
    patient,
    goal,
    recentTrials
  }}
/>
```

**PR Friday**: Create PR with AI Co-pilot

---

### Developer B: Risk Alerts + Teams Integration

**Branch**: `feature/risk-alerts`

**What to build**:

- Patient risk detection
- Teams notifications
- Alert dashboard

**Files to create**:

```
src/lib/ai/
  ├── risk-alerts.ts (new)
src/lib/m365/
  ├── teams.ts (new - Teams webhook)
src/components/
  ├── RiskAlertCard.tsx (new)
  ├── AlertsDashboard.tsx (new)
src/app/alerts/
  └── page.tsx (new)
src/app/api/alerts/
  └── check/
      └── route.ts (new - background job)
```

**Integration to dashboard**:

```typescript
// src/components/DashboardContent.tsx
import { AlertsDashboard } from './AlertsDashboard';

// Add alerts widget
<AlertsDashboard />
```

**PR Friday**: Create PR with risk alerts

---

### Week 4: Integration & Polish (Days 16-20)

**Both Developers Together**:

1. **Monday-Tuesday**: Merge all features, resolve conflicts
2. **Wednesday**: End-to-end testing
3. **Thursday**: Bug fixes, UI polish
4. **Friday**: Deploy to Azure, pilot demo prep

**Final integration checklist**:

- [ ] All 6 AI features working
- [ ] Offline sync tested thoroughly
- [ ] M365 integration (Teams, OneDrive, Outlook) functional
- [ ] Azure AD login working
- [ ] Data flows: Collection → Notes → Billing → Scheduling
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Build passes
- [ ] Deploy to Azure Static Web Apps

---

## File Ownership Matrix (Avoid Conflicts)

### Developer A Owns:

- `src/components/GoalDataContentInner.tsx` ✓
- `src/components/DataCollection*.tsx`
- `src/lib/ai/note-generation.ts`
- `src/lib/ai/copilot.ts`
- `src/lib/offline/*`
- `src/hooks/useOfflineSync.ts`

### Developer B Owns:

- `src/app/billing/*`
- `src/app/scheduling/*`
- `src/app/alerts/*`
- `src/components/Billing*.tsx`
- `src/components/Scheduling*.tsx`
- `src/lib/billing/*`
- `src/lib/ai/billing-analysis.ts`
- `src/lib/ai/scheduling.ts`
- `src/lib/ai/risk-alerts.ts`
- `src/lib/m365/*`

### Shared (Coordinate First):

- `src/lib/ai/openai.ts` (setup in Week 0)
- `src/lib/azure/cosmos.ts` (setup in Week 0)
- `src/components/ui/*` (rarely changed)
- `src/app/dashboard/page.tsx` (integration point)

---

## What to Keep from Existing Codebase

**Don't rewrite these (98% ready)**:

1. **UI Components** (`src/components/ui/*`)

   - Button, Card, Input, Select, Tabs, Dialog, etc.
   - All Shadcn components configured ✓

2. **Page Layouts**

   - `src/components/PageLayout.tsx` ✓
   - `src/components/app-sidebar.tsx` ✓
   - Navigation structure ✓

3. **Student/Goal UI**

   - `src/components/AllStudentsContent.tsx` ✓
   - `src/components/StudentSelector.tsx` ✓
   - Student management pages ✓

4. **Data Collection UI Core**

   - `src/components/GoalDataContentInner.tsx` (enhance, don't rewrite)
   - Trial recording interface ✓
   - Interactive metrics collection (already built!) ✓

5. **Styling**

   - `src/app/globals.css` ✓
   - Tailwind config ✓
   - Color scheme ✓

**Total reuse**: ~70% of existing codebase

---

## What to Replace/Add

**Replace (30%)**:

1. **Data Layer**:

   - `src/lib/supabase.ts` → `src/lib/azure/cosmos.ts`
   - `src/lib/services.ts` (rewrite queries for Cosmos DB)
   - `src/hooks/useSupabase.ts` → `src/hooks/useAzureData.ts`

2. **Auth**:

   - `src/contexts/AuthContext.tsx` (rewrite for NextAuth)
   - `src/app/login/page.tsx` (Azure AD login button)

**Add (new features)**:

3. **AI Modules** (all new):

   - `src/lib/ai/*` (6 AI features)
   - `src/app/api/ai/*` (API routes)

4. **M365 Integration** (new):

   - `src/lib/m365/*`

5. **Offline Support** (new):

   - `src/lib/offline/*`

---

## Environment Variables Setup

Create `.env.local`:

```bash
# Azure Cosmos DB
AZURE_COSMOS_ENDPOINT=https://wabicare-mvp.documents.azure.com:443/
AZURE_COSMOS_KEY=your-cosmos-key

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://wabicare-openai.openai.azure.com/
AZURE_OPENAI_KEY=your-openai-key

# Azure AD (NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-secret
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# Microsoft Graph (M365)
GRAPH_CLIENT_ID=your-graph-client-id
GRAPH_CLIENT_SECRET=your-graph-secret

# Azure Speech (optional for voice)
AZURE_SPEECH_KEY=your-speech-key
AZURE_SPEECH_REGION=eastus
```

---

## Dependencies to Add

Update `package.json`:

```bash
# Remove Supabase
npm uninstall @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr

# Add Azure
npm install @azure/cosmos @azure/openai @azure/communication-email
npm install next-auth @auth/core
npm install dexie (IndexedDB)
npm install @microsoft/microsoft-graph-client

# Keep existing
# - next, react, typescript, tailwindcss, shadcn components
```

---

## Git Workflow (Same as Previous Plan)

### Daily Workflow:

```bash
# Start day
git checkout develop
git pull origin develop
git checkout feature/your-branch
git rebase origin/develop

# Work on feature
git add .
git commit -m "feat(feature): descriptive message"
git push origin feature/your-branch

# End day
git push origin feature/your-branch
```

### Weekly Merges:

**Friday EOD**:

1. Create PR: `feature/x` → `develop`
2. Request review from other dev
3. Address feedback
4. Squash and merge

**Monday Morning**:

1. Both devs pull latest `develop`
2. Test integration
3. Fix any conflicts
4. Continue next features

---

## Testing Strategy

### Week 1 Testing:

- [ ] Offline data collection works without internet
- [ ] Data syncs when internet restored
- [ ] Claims generate correctly
- [ ] CPT codes map correctly

### Week 2 Testing:

- [ ] AI notes generated in < 30 seconds
- [ ] Notes are clinically accurate
- [ ] Billing AI flags issues
- [ ] Scheduling suggestions reasonable

### Week 3 Testing:

- [ ] Co-pilot provides helpful suggestions
- [ ] Risk alerts trigger correctly
- [ ] Teams notifications sent
- [ ] Voice input works (if implemented)

### Week 4 Testing:

- [ ] Full workflow: Data → Notes → Billing → Schedule
- [ ] M365 integration (OneDrive, Outlook, Teams)
- [ ] Mobile responsive
- [ ] Azure AD login
- [ ] Performance < 2s page loads

---

## Success Criteria

**MVP Complete When**:

- ✅ 6 AI features functional
- ✅ Azure AD authentication working
- ✅ Cosmos DB storing data
- ✅ M365 integration (Teams, OneDrive, Outlook)
- ✅ Offline data collection working
- ✅ Deployed to Azure Static Web Apps
- ✅ 2 developers can demo to pilot customers

**Not Required for MVP**:

- ❌ Native mobile apps (responsive web is fine)
- ❌ Direct claim submission (CSV export is enough)
- ❌ Parent portal
- ❌ Advanced analytics dashboard
- ❌ Multi-language support

---

## Quick Start Commands

```bash
# Week 0: Both devs
cd wabi-care-softui
git checkout -b develop
git checkout -b feature/azure-foundation

# Install new dependencies
npm uninstall @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @azure/cosmos @azure/openai next-auth dexie

# Setup env vars
cp .env.example .env.local
# Edit .env.local with Azure credentials

# Test build
npm run dev

# Week 1+: Individual features
git checkout develop
git pull
git checkout -b feature/your-feature
# Work on feature
```

---

## Rollback Plan

If Azure migration causes issues:

1. **Keep Supabase running temporarily**: Don't delete Supabase instance
2. **Feature flags**: Enable/disable Azure features via env vars
3. **Parallel run**: Run both Supabase and Azure for 1 week
4. **Gradual cutover**: Migrate one feature at a time

```typescript
// Feature flag example
const useAzure = process.env.USE_AZURE === 'true';

async function fetchPatients() {
  if (useAzure) {
    return await cosmosDb.patients.query().fetchAll();
  } else {
    return await supabase.from('students').select('*');
  }
}
```

---

## Summary: Why This Plan Works

1. **Leverage Existing Work**: 70% of UI/UX is ready
2. **Clear Ownership**: Developers work on separate features
3. **Incremental Migration**: Replace data layer, keep UI
4. **Parallel Development**: Week 0 together, then parallel
5. **Weekly Integration**: Merge every Friday, test Monday
6. **4-Week Timeline**: Realistic given existing foundation

**Key Insight**: Don't rebuild what's already built. The existing `wabi-care-softui` is a strong foundation - we're enhancing it with Azure + AI, not rewriting from scratch.
