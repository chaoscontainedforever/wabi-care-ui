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
    UI[Web/Mobile UI\nNext.js + Tailwind + shadcn]
  end
  subgraph BE["Backend"]
    API[API Routes / Node]
    AUTH[AuthN/RBAC\nNextAuth / Entra ID]
  end
  UI --> API
  API --> AUTH

  %% DATA
  subgraph DATA["Data Layer"]
    SQL[(Azure SQL/Postgres)]
    BLOB[(Azure Blob Storage\n(audio, docs, PDFs))]
    IDXB[(IndexedDB\noffline cache)]
  end
  API --> SQL
  API --> BLOB
  UI <---> IDXB

  %% AI SERVICES (single-agent copilots)
  subgraph AI["AI Services"]
    OAI[Azure OpenAI\n(Note Copilot)]
    STT[Azure Speech-to-Text]
    FR[Form Recognizer\n(OCR)]
  end
  BLOB --> STT
  API --> STT
  API --> OAI
  API --> FR

  %% ANALYTICS & SEC
  subgraph OPS["Analytics & Security"]
    PBI[Power BI Embedded]
    KV[Key Vault]
    APPINS[App Insights]
  end
  SQL --> PBI
  API -. secrets .-> KV
  API -. telemetry .-> APPINS

  %% USERS -> UI
  Admin --- UI
  BCBA --- UI
  RBT --- UI
  Parent --- UI

  %% NOTES
  %% Copilot scope: Voice -> Transcript -> Note Draft (human review)
