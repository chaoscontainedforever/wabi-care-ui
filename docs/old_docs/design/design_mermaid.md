# Wabi Care Technical Architecture - Mermaid Diagrams

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        PWA["Next.js PWA
        React + TypeScript
        Tailwind CSS"]
        Mobile["Mobile App
        Offline-First
        Touch Optimized"]
    end

    subgraph "Azure Static Web Apps"
        CDN[Global CDN]
        Auth["Authentication
        Azure AD B2C"]
    end

    subgraph "API Gateway"
        APIM["Azure API Management
        Rate Limiting
        OAuth 2.0"]
    end

    subgraph "Microservices - Azure Container Apps"
        Clinical["Clinical Service
        Patient Records
        Session Management"]
        Scheduling["Scheduling Service
        AI-Powered Optimization
        Resource Allocation"]
        Billing["Billing RCM Service
        Claims Processing
        AI Denial Prevention"]
        Analytics["Analytics Service
        Reporting
        Dashboards"]
    end

    subgraph "Azure AI Foundry Hub"
        PromptFlow["Prompt Flow
        Visual Designer
        AI Orchestration"]
        ModelCatalog["Model Catalog
        GPT-4 GPT-3.5
        Llama Mistral"]
        Evaluation["AI Evaluation
        Groundedness
        Safety Checks"]
        VectorDB["Vector Indexing
        RAG Pipeline
        Patient History"]
    end

    subgraph "Azure AI Services"
        OpenAI["Azure OpenAI
        GPT-4o GPT-4 Turbo
        Embeddings DALL-E"]
        Cognitive["Cognitive Services
        Speech Vision
        Language Translator"]
        ML["Azure ML
        Predictive Models
        MLOps"]
    end

    subgraph "Data Layer"
        Cosmos[("Azure Cosmos DB
        Patient Records
        Session Data
        Global Distribution")]
        SQL[("Azure SQL
        Billing Claims
        Scheduling
        Staff Management")]
        Blob["Azure Blob Storage
        Session Recordings
        Documents
        Assessments"]
        Search["Azure AI Search
        Semantic Search
        Vector + Keyword"]
    end

    subgraph "Real-Time Services"
        SignalR["Azure SignalR
        Real-Time Sync
        Live Updates"]
        CommSvc["Azure Communication
        Video Conferencing
        SMS Email"]
    end

    subgraph "Security & Compliance"
        KeyVault["Azure Key Vault
        Secrets Keys
        Certificates"]
        Monitor["Azure Monitor
        Application Insights
        Log Analytics"]
        Sentinel["Azure Sentinel
        SIEM
        Threat Detection"]
    end

    PWA --> CDN
    Mobile --> CDN
    CDN --> Auth
    Auth --> APIM
    APIM --> Clinical
    APIM --> Scheduling
    APIM --> Billing
    APIM --> Analytics

    Clinical --> PromptFlow
    Scheduling --> PromptFlow
    Billing --> PromptFlow
    Analytics --> ML

    PromptFlow --> ModelCatalog
    PromptFlow --> Evaluation
    PromptFlow --> VectorDB
    PromptFlow --> OpenAI
    PromptFlow --> Cognitive

    Clinical --> Cosmos
    Clinical --> Blob
    Scheduling --> SQL
    Billing --> SQL
    Analytics --> Search

    Clinical --> SignalR
    Scheduling --> CommSvc

    APIM --> KeyVault
    Clinical --> Monitor
    Scheduling --> Monitor
    Billing --> Monitor
    Analytics --> Monitor
    Monitor --> Sentinel

    style PromptFlow fill:#0078d4,color:#fff
    style OpenAI fill:#10a37f,color:#fff
    style Cosmos fill:#00bcf2,color:#fff
    style PWA fill:#61dafb,color:#000
```

---

## 2. Azure AI Foundry Core Components

```mermaid
graph LR
    subgraph "Azure AI Foundry Platform"
        subgraph "Model Management"
            Catalog["Model Catalog
            1600+ Models"]
            Versions["Version Control
            A/B Testing"]
        end

        subgraph "Prompt Engineering"
            Designer["Visual Designer
            Drag and Drop"]
            Flow["Prompt Flow
            Multi-Step Chains"]
            Templates["Template Library
            Best Practices"]
        end

        subgraph "Evaluation and Testing"
            Metrics["Quality Metrics
            Groundedness
            Relevance
            Coherence"]
            Hallucination[Hallucination Detection]
            Bias["Bias Detection
            Fairness"]
            RedTeam[Red Team Testing]
        end

        subgraph "RAG and Grounding"
            Embeddings["Vector Embeddings
            Patient History"]
            Retrieval["Semantic Retrieval
            Hybrid Search"]
            Context["Context Assembly
            Dynamic Prompts"]
        end

        subgraph "Safety and Governance"
            ContentFilter["Content Safety
            PHI Detection"]
            Guardrails["Compliance Guardrails
            HIPAA Rules"]
            Audit["Audit Logging
            All AI Decisions"]
        end
    end

    Catalog --> Flow
    Versions --> Flow
    Designer --> Flow
    Templates --> Flow
    Flow --> Metrics
    Flow --> Hallucination
    Flow --> Bias
    Flow --> RedTeam
    Flow --> Embeddings
    Embeddings --> Retrieval
    Retrieval --> Context
    Context --> Flow
    Flow --> ContentFilter
    ContentFilter --> Guardrails
    Guardrails --> Audit

    style Flow fill:#0078d4,color:#fff
    style ContentFilter fill:#d83b01,color:#fff
    style Audit fill:#107c10,color:#fff
```

---

## 3. Feature Architecture Map

```mermaid
graph TB
    subgraph "6 Core AI-First Features"
        F1["1. AI Clinical Co-Pilot
        Auto Note Generation
        Treatment Recommendations"]
        F2["2. Predictive Analytics
        Outcome Forecasting
        Revenue Prediction"]
        F3["3. Intelligent Scheduling
        AI Auto-Scheduling
        Resource Optimization"]
        F4["4. AI Billing and RCM
        Denial Prevention
        Smart Code Suggestion"]
        F5["5. Offline Data Collection
        Mobile-First
        Real-Time Sync"]
        F6["6. AI Assistant Chat
        Conversational AI
        Natural Language Search"]
    end

    subgraph "Azure AI Foundry Prompt Flows"
        PF1["Note Generation Flow
        Voice to Transcript to Note"]
        PF2["Prediction Flow
        Historical Data to ML Model to Forecast"]
        PF3["Scheduling Flow
        Constraints to Optimization to Schedule"]
        PF4["Claim Validation Flow
        Claim Data to Error Detection to Fixes"]
        PF5["Data Insight Flow
        Session Data to Pattern Analysis to Suggestions"]
        PF6["Chat Flow
        Query to RAG Retrieval to Response"]
    end

    subgraph "Data Sources"
        D1[("Patient History")]
        D2[("Session Data")]
        D3[("Billing Records")]
        D4[("Clinical Guidelines")]
    end

    F1 --> PF1
    F2 --> PF2
    F3 --> PF3
    F4 --> PF4
    F5 --> PF5
    F6 --> PF6

    PF1 --> D1
    PF1 --> D2
    PF2 --> D2
    PF2 --> D3
    PF3 --> D1
    PF3 --> D2
    PF4 --> D3
    PF4 --> D4
    PF5 --> D2
    PF6 --> D1
    PF6 --> D2
    PF6 --> D3
    PF6 --> D4

    style F1 fill:#10a37f,color:#fff
    style F2 fill:#0078d4,color:#fff
    style F3 fill:#8b5cf6,color:#fff
    style F4 fill:#f59e0b,color:#fff
    style F5 fill:#ef4444,color:#fff
    style F6 fill:#06b6d4,color:#fff
```

---

## 4. AI Clinical Co-Pilot Flow (Feature #1)

```mermaid
sequenceDiagram
    participant T as Therapist
    participant M as Mobile App
    participant API as Clinical Service
    participant PF as Prompt Flow
    participant Speech as Azure Speech
    participant GPT as GPT-4
    participant VDB as Vector DB
    participant Safety as Content Safety
    participant DB as Cosmos DB

    T->>M: Start session recording
    M->>M: Record audio (offline mode)
    T->>M: End session
    M->>API: Upload audio + session metadata
    API->>PF: Trigger note generation flow
    
    PF->>Speech: Transcribe audio (Whisper)
    Speech-->>PF: Return transcript
    
    PF->>VDB: Retrieve patient history (RAG)
    VDB-->>PF: Return relevant context
    
    PF->>GPT: Generate progress note - (transcript + context)
    GPT-->>PF: Return draft note
    
    PF->>Safety: Check for PHI leaks
    Safety-->>PF: Safety score: 0.95 ✓
    
    PF->>PF: Evaluate groundedness - Score: 0.87 ✓
    
    PF->>API: Return note + confidence
    API->>DB: Save draft note
    API->>M: Push notification
    M->>T: Review & approve note
    T->>M: Approve
    M->>API: Finalize note
    API->>DB: Save final note + audit log

    Note over T,DB: Total time: 2-3 seconds - 60% time savings vs manual
```

---

## 5. Predictive Analytics Flow (Feature #2)

```mermaid
graph TD
    Start[Analytics Service] --> Collect[Collect Historical Data - Patient outcomes - Session frequency - Treatment modalities]
    
    Collect --> Feature[Feature Engineering - Azure Synapse Analytics]
    
    Feature --> Train{Model Trained?}
    
    Train -->|No| MLOps[Azure ML Training - AutoML pipeline - Hyperparameter tuning]
    MLOps --> Register[Register Model - Azure AI Foundry Catalog]
    Register --> Train
    
    Train -->|Yes| Predict[Run Predictions - Prompt Flow + Azure ML]
    
    Predict --> Outcomes[Patient Outcome Prediction - Treatment success probability - Risk of dropout]
    
    Predict --> Revenue[Revenue Forecasting - Next 90 days projection - Payer mix analysis]
    
    Predict --> Staffing[Staffing Optimization - Workload prediction - Hiring recommendations]
    
    Outcomes --> Monitor[Azure ML Monitoring - Drift detection - Performance tracking]
    Revenue --> Monitor
    Staffing --> Monitor
    
    Monitor --> Alert{Accuracy Drop?}
    Alert -->|Yes| Retrain[Trigger Retraining]
    Retrain --> MLOps
    Alert -->|No| Dashboard[Power BI Dashboard]
    
    Dashboard --> Insights[Actionable Insights - Practice owners - Administrators]

    style Predict fill:#0078d4,color:#fff
    style Monitor fill:#107c10,color:#fff
    style Alert fill:#d83b01,color:#fff
```

---

## 6. Intelligent Scheduling Flow (Feature #3)

```mermaid
graph TB
    subgraph "Input Constraints"
        Patient[Patient Needs - Frequency, Duration - Preferred times]
        Therapist[Therapist Skills - Availability - Travel time]
        Insurance[Insurance - Authorization limits - Approved locations]
    end

    subgraph "AI Scheduling Engine - Prompt Flow"
        Parse[Parse Constraints - Extract requirements]
        Retrieve[Retrieve Historical Data - Past scheduling patterns - Success rates]
        Optimize[Optimization Algorithm - GPT-4 reasoning - Custom ML model]
        Validate[Validate Schedule - Conflict detection - Policy compliance]
    end

    subgraph "Outputs"
        Schedule[Optimized Schedule - Week view - Assignments]
        Conflicts[Conflict Alerts - Suggestions - Auto-resolve]
        Metrics[Efficiency Metrics - Utilization rate - Travel time saved]
    end

    Patient --> Parse
    Therapist --> Parse
    Insurance --> Parse
    
    Parse --> Retrieve
    Retrieve --> Optimize
    
    Optimize --> Validate
    
    Validate --> Schedule
    Validate --> Conflicts
    Validate --> Metrics
    
    Schedule --> Notify[Automated Notifications - SMS/Email via Azure Communication]
    
    Conflicts --> Human[Human Review - Admin dashboard]
    
    Human --> Adjust[Manual Adjustments]
    Adjust --> Optimize

    style Optimize fill:#8b5cf6,color:#fff
    style Schedule fill:#10a37f,color:#fff
```

---

## 7. AI Billing & RCM with Denial Prevention (Feature #4)

```mermaid
sequenceDiagram
    participant B as Biller
    participant UI as Billing UI
    participant API as Billing Service
    participant PF as Prompt Flow
    participant GPT as GPT-4
    participant Rules as Claims Database
    participant Safety as Content Safety
    participant Payer as Insurance Payer API

    B->>UI: Prepare batch claims
    UI->>API: Submit for processing
    
    loop For Each Claim
        API->>PF: Pre-submission validation flow
        
        PF->>Rules: Check authorization status
        Rules-->>PF: Authorization valid ✓
        
        PF->>GPT: Analyze claim data - Detect potential errors
        GPT-->>PF: Predicted denial risk: 15% - Issue: Missing modifier
        
        PF->>GPT: Suggest CPT codes - based on session notes
        GPT-->>PF: Recommended: 97153 - Confidence: 0.92
        
        PF->>Safety: Validate PHI handling
        Safety-->>PF: Compliant ✓
        
        PF->>PF: Calculate denial score
        
        alt Denial Risk > 50%
            PF->>API: Flag for review + fixes
            API->>UI: Show warnings
            UI->>B: Manual correction needed
            B->>UI: Apply fixes
            UI->>API: Resubmit
        else Denial Risk < 50%
            PF->>API: Auto-correct minor issues
            API->>Payer: Submit claim
            Payer-->>API: Acknowledgment
            API->>UI: Success ✓
        end
    end

    Note over B,Payer: Result: 85%+ denial prevention - 15-20% revenue increase
```

---

## 8. Offline-First Data Collection Flow (Feature #5)

```mermaid
stateDiagram-v2
    [*] --> Online: App Launch
    
    Online --> Syncing: Background Sync
    Syncing --> Online: Sync Complete
    
    Online --> Offline: Network Lost
    
    state Offline {
        [*] --> LocalCache: Use cached data
        LocalCache --> Recording: Therapist records trial
        Recording --> LocalStorage: Save to IndexedDB
        LocalStorage --> LocalCache: Ready for next trial
    }
    
    Offline --> Syncing: Network Restored
    
    state Syncing {
        [*] --> ConflictCheck: Check for conflicts
        ConflictCheck --> NoConflict: No conflicts
        ConflictCheck --> HasConflict: Conflicts detected
        
        HasConflict --> Resolve: Cosmos DB CRDT resolution - Last-write-wins
        Resolve --> Upload
        
        NoConflict --> Upload: Batch upload to Cosmos DB
        Upload --> Complete: Sync successful
        Complete --> [*]
    }
    
    Syncing --> Online: Sync Complete
    
    Online --> [*]: App Close

    note right of Offline
        PWA with Service Worker
        IndexedDB for local storage
        Queue operations
        Works 100% offline
    end note

    note right of Syncing
        Azure Cosmos DB
        Conflict-free sync
        Multi-region writes
        99.999% SLA
    end note
```

---

## 9. AI Assistant Chat Flow (Feature #6)

```mermaid
graph LR
    subgraph "User Interaction"
        User[Clinician/Admin]
        Chat[Chat Interface]
    end

    subgraph "Azure AI Foundry Chat Flow"
        Intent[Intent Detection - GPT-4 classification]
        
        subgraph "RAG Pipeline"
            Embed[Query Embedding - text-embedding-3-large]
            Search[Hybrid Search - Azure AI Search - Vector + Keyword]
            Rank[Reranking - Relevance scoring]
        end

        Compose[Context Assembly - Combine query + results]
        Generate[Response Generation - GPT-4 with context]
        Safety[Content Safety - PHI redaction - Compliance check]
    end

    subgraph "Data Sources"
        Patients[(Patient Records)]
        Sessions[(Session Data)]
        Billing[(Billing Info)]
        Docs[(Clinical Docs)]
    end

    subgraph "Actions"
        Answer[Answer Question]
        Task[Execute Task - Schedule appointment - Generate report]
        Escalate[Escalate to Human - Complex requests]
    end

    User --> Chat
    Chat --> Intent
    
    Intent --> Embed
    Embed --> Search
    
    Search --> Patients
    Search --> Sessions
    Search --> Billing
    Search --> Docs
    
    Search --> Rank
    Rank --> Compose
    
    Compose --> Generate
    Generate --> Safety
    
    Safety --> Answer
    Safety --> Task
    Safety --> Escalate
    
    Answer --> Chat
    Task --> Chat
    Escalate --> Chat

    style Intent fill:#06b6d4,color:#fff
    style Generate fill:#10a37f,color:#fff
    style Safety fill:#d83b01,color:#fff
```

---

## 10. Data Architecture & Flow

```mermaid
graph TB
    subgraph "Data Ingestion"
        Mobile[Mobile App]
        Web[Web Portal]
        API[External APIs - Insurance, Labs]
    end

    subgraph "API Layer"
        Gateway[Azure API Management - Authentication - Rate Limiting]
    end

    subgraph "Processing Layer"
        Functions[Azure Functions - Event Processing - Data Transformation]
        Stream[Azure Stream Analytics - Real-Time Processing]
    end

    subgraph "Storage Layer"
        Hot[(Hot Data - Cosmos DB - Last 90 days - Global distribution)]
        
        Warm[(Warm Data - Azure SQL - 1-2 years - Operational queries)]
        
        Cold[Cold Data - Azure Blob Storage - Archive tier - 7+ years HIPAA retention]
    end

    subgraph "Analytics Layer"
        Synapse[Azure Synapse Analytics - Data Warehouse - Big Data Processing]
        
        ML[Azure Machine Learning - Model Training - Feature Engineering]
        
        PowerBI[Power BI - Dashboards - Reports]
    end

    subgraph "Search & AI Layer"
        Embeddings[Vector Embeddings - text-embedding-3-large]
        
        VectorStore[Azure AI Search - Vector + Full-text - Hybrid search]
        
        Foundry[Azure AI Foundry - RAG Pipelines - AI Features]
    end

    Mobile --> Gateway
    Web --> Gateway
    API --> Gateway
    
    Gateway --> Functions
    Gateway --> Stream
    
    Functions --> Hot
    Stream --> Hot
    
    Hot --> Warm
    Warm --> Cold
    
    Hot --> Synapse
    Warm --> Synapse
    Cold --> Synapse
    
    Synapse --> ML
    Synapse --> PowerBI
    
    Hot --> Embeddings
    Warm --> Embeddings
    Embeddings --> VectorStore
    
    VectorStore --> Foundry
    ML --> Foundry

    style Hot fill:#00bcf2,color:#fff
    style Foundry fill:#0078d4,color:#fff
    style ML fill:#8b5cf6,color:#fff
```

---

## 11. Security & Compliance Architecture

```mermaid
graph TD
    subgraph "Identity & Access"
        AAD[Azure AD B2C - Multi-Factor Auth - Conditional Access]
        RBAC[Role-Based Access Control - Clinician, Admin, Biller]
        SSO[Single Sign-On - SAML, OAuth 2.0]
    end

    subgraph "Network Security"
        Firewall[Azure Firewall - NSG Rules]
        PrivateLink[Private Link - No Public Internet - VNet Integration]
        WAF[Web Application Firewall - DDoS Protection]
    end

    subgraph "Data Protection"
        Encryption[Encryption at Rest - AES-256 - Customer-Managed Keys]
        TLS[Encryption in Transit - TLS 1.3]
        KeyVault[Azure Key Vault - Secrets Management - Key Rotation]
    end

    subgraph "AI Safety & Governance"
        ContentSafety[Azure Content Safety - PHI Detection - Harmful Content Filter]
        AIAudit[AI Audit Logging - All AI Decisions - Explainability]
        Guardrails[Responsible AI Guardrails - Bias Detection - Fairness]
    end

    subgraph "Monitoring & Compliance"
        Monitor[Azure Monitor - Log Analytics - Alerts]
        Sentinel[Azure Sentinel - SIEM - Threat Detection]
        Policy[Azure Policy - Compliance Enforcement - HIPAA Rules]
        Audit[Audit Logs - PHI Access Tracking - 30-day retention]
    end

    subgraph "Compliance Certifications"
        HIPAA[HIPAA/HITECH - Business Associate Agreement]
        SOC2[SOC 2 Type II]
        ISO[ISO 27001]
    end

    AAD --> RBAC
    AAD --> SSO
    RBAC --> Firewall
    
    Firewall --> PrivateLink
    PrivateLink --> WAF
    
    Encryption --> KeyVault
    TLS --> KeyVault
    
    ContentSafety --> AIAudit
    AIAudit --> Guardrails
    
    Monitor --> Sentinel
    Sentinel --> Policy
    Policy --> Audit
    
    Audit --> HIPAA
    Policy --> SOC2
    Monitor --> ISO

    style HIPAA fill:#107c10,color:#fff
    style ContentSafety fill:#d83b01,color:#fff
    style KeyVault fill:#ffd700,color:#000
```

---

## 12. Deployment & DevOps Pipeline

```mermaid
graph LR
    subgraph "Development"
        Dev[Developer - Local Environment]
        Git[GitHub - Source Control - Pull Requests]
    end

    subgraph "CI Pipeline - GitHub Actions"
        Build[Build - npm install - TypeScript compile]
        Test[Automated Tests - Unit, Integration - E2E with Playwright]
        Scan[Security Scan - Snyk, SonarQube - Dependency Check]
        Quality[Quality Gates - Code Coverage > 80% - No Critical Issues]
    end

    subgraph "Azure DevOps / GitHub Actions"
        IaC[Infrastructure as Code - Azure Bicep - Terraform]
        Provision[Provision Resources - Azure Container Apps - Databases, AI Services]
    end

    subgraph "CD Pipeline"
        DevDeploy[Deploy to Dev - Azure Container Apps]
        DevTest[Smoke Tests - Health Checks]
        
        StageDeploy["Deploy to Staging
        Blue-Green Deployment"]
        StageTest["Integration Tests
        AI Evaluation Tests"]
        
        ProdApproval{Manual Approval}
        ProdDeploy["Deploy to Production
        Canary Deployment
        5% to 100%"]
        ProdTest["Production Monitoring
        Application Insights"]
    end

    subgraph "Monitoring"
        Metrics[Metrics Collection - Latency, Errors - AI Accuracy]
        Alerts[Alerts & Notifications - PagerDuty, Teams]
        Rollback[Automated Rollback - If error rate > 5%]
    end

    Dev --> Git
    Git --> Build
    Build --> Test
    Test --> Scan
    Scan --> Quality
    
    Quality --> IaC
    IaC --> Provision
    Provision --> DevDeploy
    
    DevDeploy --> DevTest
    DevTest --> StageDeploy
    StageDeploy --> StageTest
    StageTest --> ProdApproval
    
    ProdApproval -->|Approved| ProdDeploy
    ProdApproval -->|Rejected| Git
    
    ProdDeploy --> ProdTest
    ProdTest --> Metrics
    Metrics --> Alerts
    Alerts --> Rollback
    Rollback --> StageDeploy

    style Quality fill:#107c10,color:#fff
    style ProdApproval fill:#ffd700,color:#000
    style Rollback fill:#d83b01,color:#fff
```

---

## 13. User Journey - Therapist Daily Workflow

```mermaid
journey
    title Therapist Daily Workflow with Wabi Care AI
    section Morning Prep
      Login to app: 5: Therapist
      Review AI-generated schedule: 5: Therapist, AI
      Check patient alerts (AI predictions): 4: Therapist, AI
      Sync offline data from yesterday: 5: Therapist
    section Session 1
      Drive to patient home: 3: Therapist
      Start session with one tap: 5: Therapist
      Collect data offline (no connectivity): 5: Therapist
      AI suggests next trials real-time: 5: Therapist, AI
      End session: 5: Therapist
    section Documentation
      AI transcribes and generates note: 5: AI
      Review and approve note (30 seconds): 5: Therapist
      AI adds to patient graph: 5: AI
    section Session 2-5
      Repeat workflow: 5: Therapist, AI
    section End of Day
      All data auto-synced to cloud: 5: AI
      Review AI assistant chat for updates: 4: Therapist, AI
      Check tomorrow's AI-optimized schedule: 5: Therapist, AI
      Logout: 5: Therapist
```

---

## 14. Cost Optimization Strategy

```mermaid
graph TD
    subgraph "Azure AI Foundry Smart Routing"
        Query[Incoming Request]
        Classify[Intent Classification - Simple vs Complex]
        
        Simple[Simple Task - Schedule lookup - Data query]
        Complex[Complex Task - Treatment plan - Clinical reasoning]
        
        GPT35[GPT-3.5 Turbo - $0.0015/1K tokens - 10x cheaper]
        GPT4[GPT-4 Turbo - $0.015/1K tokens - Higher quality]
    end

    subgraph "Caching Strategy"
        PromptCache[Prompt Caching - 30% token reduction]
        ResponseCache[Response Caching - Common queries]
    end

    subgraph "Cost Monitoring"
        Budget[Budget Alerts - $40K/month threshold]
        Optimization[Continuous Optimization - Model A/B testing]
    end

    Query --> Classify
    Classify --> Simple
    Classify --> Complex
    
    Simple --> GPT35
    Complex --> GPT4
    
    GPT35 --> PromptCache
    GPT4 --> PromptCache
    PromptCache --> ResponseCache
    
    ResponseCache --> Budget
    Budget --> Optimization
    Optimization --> Classify

    style Classify fill:#0078d4,color:#fff
    style GPT35 fill:#107c10,color:#fff
    style Budget fill:#ffd700,color:#000
```

---

## 15. Phased Implementation Roadmap

```mermaid
gantt
    title Wabi Care Development Roadmap (18 Months)
    dateFormat YYYY-MM-DD
    
    section Phase 1 - MVP
    Azure AI Foundry Setup           :p1-1, 2025-11-01, 1w
    Core Data Models                 :p1-2, after p1-1, 2w
    Patient & Staff Management       :p1-3, after p1-2, 3w
    Offline Data Collection          :p1-4, after p1-3, 3w
    AI Note Generation (GPT-4)       :p1-5, after p1-2, 4w
    Basic Scheduling                 :p1-6, after p1-3, 3w
    MVP Launch (10 pilot practices)  :milestone, after p1-6, 0d
    
    section Phase 2 - Practice Mgmt
    Billing & Claims Module          :p2-1, after p1-6, 4w
    AI Denial Prevention             :p2-2, after p2-1, 3w
    Credentialing Management         :p2-3, after p2-1, 2w
    Parent Portal                    :p2-4, after p2-3, 3w
    Basic Reporting (Power BI)       :p2-5, after p2-4, 2w
    Scale to 100 Practices           :milestone, after p2-5, 0d
    
    section Phase 3 - Advanced AI
    Predictive Analytics Models      :p3-1, after p2-5, 4w
    Revenue Forecasting              :p3-2, after p3-1, 2w
    AI Assistant Chatbot             :p3-3, after p3-1, 4w
    Outcome Predictions              :p3-4, after p3-2, 3w
    Advanced Scheduling AI           :p3-5, after p3-3, 3w
    Scale to 500 Practices           :milestone, after p3-5, 0d
    
    section Phase 4 - Enterprise
    Multi-Tenant Architecture        :p4-1, after p3-5, 4w
    White-Label Capabilities         :p4-2, after p4-1, 3w
    Enterprise Integrations          :p4-3, after p4-1, 4w
    International Support            :p4-4, after p4-2, 3w
    API Marketplace                  :p4-5, after p4-3, 2w
    Scale to 1000+ Practices         :milestone, after p4-5, 0d
```

---

## Document Information

**File**: `design_mermaid.md`  
**Location**: `/docs/design/`  
**Version**: 1.0  
**Last Updated**: October 15, 2025  
**Purpose**: Visual technical architecture diagrams for Wabi Care AI-first ABA practice management platform

**Related Documents**:
- `architecture.md` - Detailed technical architecture document
- `../README.md` - Project overview
- `../SOFT_UI_DESIGN_RULES.md` - UI/UX design guidelines

