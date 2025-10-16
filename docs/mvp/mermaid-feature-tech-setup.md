# MVP Feature Technical Setup

```mermaid
flowchart TD
  subgraph Data Collection
    DC_UI[GoalDataContentInner.tsx]
    DC_Hook[useOfflineSync]
    DC_DB[(Cosmos: sessions)]
    DC_API[/POST /api/sessions/trials/]
  end

  subgraph AI Progress Notes
    Note_UI[AINoteGenerator.tsx]
    Note_API[/POST /api/ai/generate-note/]
    Note_OpenAI[Azure OpenAI GPT-4]
    Note_Storage[OneDrive Save]
  end

  subgraph Smart Billing
    Billing_UI[BillingDashboard.tsx]
    Billing_API[/POST /api/ai/analyze-claim/]
    Billing_AI[AI Billing Analysis]
    Billing_DB[(Cosmos: claims)]
  end

  subgraph Predictive Scheduling
    Sched_UI[SchedulingSuggestions.tsx]
    Sched_API[/POST /api/ai/suggest-schedule/]
    Sched_AI[AI Scheduling Model]
    Sched_Graph[Microsoft Graph]
  end

  subgraph AI Co-pilot
    Copilot_UI[AICopilot.tsx]
    Copilot_API[/POST /api/ai/copilot/]
    Copilot_OpenAI[Azure OpenAI GPT-4]
    Copilot_Speech[Azure Speech]
  end

  subgraph Risk Alerts
    Alerts_UI[AlertsDashboard.tsx]
    Alerts_API[/POST /api/alerts/check/]
    Alerts_AI[Risk Scoring Logic]
    Alerts_Teams[Teams Webhook]
  end

  DC_UI --> DC_Hook --> DC_API --> DC_DB
  Note_UI --> Note_API --> Note_OpenAI --> Note_Storage
  Billing_UI --> Billing_API --> Billing_AI --> Billing_DB
  Sched_UI --> Sched_API --> Sched_AI --> Sched_Graph
  Copilot_UI --> Copilot_API --> Copilot_OpenAI
  Copilot_UI --> Copilot_API --> Copilot_Speech
  Alerts_UI --> Alerts_API --> Alerts_AI --> Alerts_Teams

  classDef storage fill:#d1fae5,stroke:#047857
  classNote_Storage,Sched_Graph,Alerts_Teams storage
```
