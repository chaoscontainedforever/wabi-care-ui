# Phase 1 — Core + Copilots (MVP)

```mermaid
flowchart LR
  %% USERS
  subgraph U["Users"]
    Admin[Admin]
    BCBA[BCBA]
    RBT[RBT]
    Parent[Parent]
  end

  %% APP & BACKEND
  subgraph APP["App Layer (Next.js PWA)"]
    UI[Web/Mobile UI - Next.js + Tailwind + shadcn]
  end
  subgraph BE["Backend"]
    API[API Routes / Node]
    AUTH[AuthN / RBAC - NextAuth / Entra ID]
  end
  UI --> API
  API --> AUTH

  %% DATA
  subgraph DATA["Data Layer"]
    SQL[[Azure SQL / Postgres]]
    BLOB[[Azure Blob Storage - audio, docs, PDFs]]
    IDXB[[IndexedDB - offline cache]]
  end
  API --> SQL
  API --> BLOB
  UI <---> IDXB

  %% AI SERVICES (single-agent copilots)
  subgraph AI["AI Services"]
    OAI[[Azure OpenAI - Note Copilot]]
    STT[[Azure Speech to Text]]
    FR[[Form Recognizer - OCR]]
  end
  BLOB --> STT
  API --> STT
  API --> OAI
  API --> FR

  %% ANALYTICS & SECURITY
  subgraph OPS["Analytics & Security"]
    PBI[[Power BI Embedded]]
    KV[[Key Vault]]
    APPINS[[App Insights]]
  end
  SQL --> PBI
  API -. secrets .-> KV
  API -. telemetry .-> APPINS

  %% USERS
  Admin --- UI
  BCBA --- UI
  RBT --- UI
  Parent --- UI
