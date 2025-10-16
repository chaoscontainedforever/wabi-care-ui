flowchart LR
  subgraph Clients["Users & Apps"]
    A1[Admin]
    A2[BCBA]
    A3[RBT]
    A4[Parent]
    UI[Web/Mobile App (Next.js)]
  end

  A1 --- UI
  A2 --- UI
  A3 --- UI
  A4 --- UI

  subgraph API["App Backend & APIs"]
    B1[GraphQL/REST API\n(Next.js API Routes or FastAPI)]
    B2[RBAC + Audit]
    B3[Webhook Ingress]
  end
  UI <-->|HTTPS| B1

  subgraph Foundry["Azure AI Foundry (multi-agent)"]
    O[Orchestrator Agent\n(route, call tools, persona memory)]
    SCHED[Scheduling Agent]
    DATA[Data Collection Agent]
    DOCS[Documentation Agent\n(SOAP/ABC/IEP/BIP writer)]
    BILL[Billing & Claims Agent]
    COMP[Compliance Agent\n(HIPAA/FERPA/Medicaid rules)]
    INSIGHT[Insights Agent\n(trends, next-goal, risk)]
    INTEG[Integration Agent\n(SIS/EMR/Carrier portals)]
  end
  B1 <-->|function calls| O

  subgraph Tools["Agent Tools (bound in Foundry)"]
    T1[(Azure SQL/Postgres)]
    T2[(Azure AI Search\n+ Vector Index)]
    T3[(Blob Storage + Video Indexer)]
    T4[Azure Speech\n(STT/TTS)]
    T5[Form Recognizer\n(OCR/Forms)]
    T6[Power BI Embedded]
    T7[API Mgmt + Logic Apps\n(Carriers, Clearinghouse)]
    T8[Event Grid / Service Bus]
    T9[Key Vault]
    T10[Monitor + App Insights]
  end

  O -->|retrieval| T2
  DATA -->|store/read| T1
  DATA -->|upload/read| T3
  DOCS -->|RAG + style guides| T2
  DOCS -->|save drafts| T1
  BILL -->|837/835/CMS1500| T7
  COMP -->|policy packs| T2
  INSIGHT -->|query + features| T1
  INSIGHT -->|dashboards| T6
  SCHED -->|read/write events| T1
  INTEG -->|SIS/EMR/Billing| T7

  B1 -->|events| T8
  subgraph HumanLoop["Human-in-the-Loop & Safety"]
    H1[Review/Upscale\napprovals]
    H2[Red teaming & evals\n(Prompt Flow)]
  end
  DOCS --> H1
  BILL --> H1
  COMP --> H1
  O --> H2

  T9 -. secrets .- Foundry
  T10 -. telemetry .- Foundry