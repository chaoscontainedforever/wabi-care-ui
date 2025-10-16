# 🧭 WabiCare – Phased Architecture & Rollout Roadmap

This document outlines the **3-phase architecture plan** for WabiCare’s hybrid build:
**Legacy reliability first, AI copilots second, full agentic orchestration last.**

---

## 1️⃣ Overview Roadmap

| Phase | Goal | Features to Ship | Delivery Artifacts | Exit Criteria |
|---|---|---|---|---|
| **Phase 1 – Core + Copilots (MVP)** | Win first pilots with reliable rails | Scheduling, Client / Goals, **Data Collection (offline)**, **Note Copilot (voice → draft)**, Auth tracker, CMS-1500 draft, basic dashboards | Running Azure env, CI/CD, PRDs, prompts, sample data, 1-click demo | 3 live pilots (≥ 2 clinics + 1 school), 60–75 % note-time reduction, < 1 % data loss |
| **Phase 2 – Guarded Orchestration (Toggle ON for selected flows)** | Prove end-to-end value & trust | **Orchestrated flow:** Session → Data rollup → Note → Compliance → Claim draft; Parent summaries; Compliance Copilot; Denial/Appeal Copilot | Feature flags (org / role / workflow), human-review queues, telemetry dashboards | First-pass claim ↑ ≥ 3–5 %, compliance misses ↓ ≥ 50 %, fallback ≤ 10 % |
| **Phase 3 – Scale & Optimize** | Capacity & insight automation | Scheduling optimizer suggestions, mastery prediction, SIS / EMR / payer integrations, cross-site analytics | Playbooks, SLAs, cost / perf guardrails, multi-tenant ops | Utilization ↑ ≥ 10–15 %, churn < 3 %, margin ↑ via ops savings |

---

## 2️⃣ Azure Components by Phase

| Layer | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|
| **App** | Next.js (App Router), API Routes / Node, Tailwind / shadcn | Split read/write; API Mgmt front door | Horizontal scale, CDN, background workers (Functions / Container Apps) |
| **Data** | Azure SQL (Postgres), Blob Storage, IndexedDB (offline) | Event Grid / Service Bus, caching | Partitioning, read replicas, data lake for analytics |
| **AI** | Azure OpenAI (note copilot), Speech to Text, Form Recognizer | **Azure AI Foundry (Orchestrator)** + Prompt Flow evals, AI Search (RAG) | Azure ML (prediction), prompt / version governance |
| **Integration** | — | Logic Apps (837 / 835 / eligibility), API Mgmt (SIS / EMR) | Advanced payers + SIS adapters, retry queues |
| **Analytics** | Power BI Embedded (basics) | KPI boards (note time, claim errors, fallback rate) | Executive dashboards (utilization, outcomes, revenue) |
| **Security / Compliance** | Entra ID / NextAuth, Key Vault, Defender, App Insights | PII tokenization, DLP on Blob, policy packs in RAG | SOC2 readiness, audits, runbooks |

---

## 3️⃣ Agents & Activation Timeline

| Agent | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|
| **Documentation Copilot** (SOAP / ABC) | ✅ Single-agent draft + review | ✅ Orchestrated in flow | ✅ Enhanced templates / state variants |
| **Compliance Agent** | Draft checks manual | ✅ Auto in flow (review gate) | ✅ State-by-state packs, alerts |
| **Billing & Claims Agent** | Appeals letter drafts | ✅ Claim draft in flow (flagged) | ✅ Denial pattern mining |
| **Data Collection Agent** | Summarize rollups → note | ✅ Orchestrated rollup step | ✅ Outlier detection |
| **Insights Agent** | — | Parent summaries | ✅ Mastery prediction, risk alerts |
| **Scheduling Agent** | — | — | ✅ Optimizer suggest & apply |

---

## 4️⃣ Feature Flags & Orchestration Toggles

| Scope | Example | Default |
|---|---|---|
| **Org-level** | `workflow.session_to_claim = legacy | agentic | mixed` | `legacy` |
| **Role-level** | BCBAs → agentic allowed; RBTs → legacy | per role |
| **Workflow-level** | Enable agentic for Note Draft only | `agentic` |
| **SLO guard** | Agentic timeout 8 s → fallback | On |
| **Kill switch** | Disable orchestrator globally | Off (default) |

---

## 5️⃣ Milestones & KPIs

| Milestone | Metric | Target / Promotion Gate |
|---|---|---|
| **MVP Ready** | E2E demo; pilots signed | ≥ 3 live pilots |
| **Copilot Value** | Minutes saved per note | ≥ 60 % |
| **Claims Quality** | First-pass approvals | + 3–5 % vs baseline |
| **Compliance Safety** | Missing fields / late items | − 50 % |
| **Agent Stability** | Fallback rate, SLO hits | ≤ 10 % fallback  ≥ 95 % SLO |
| **Scale Readiness** | Uptime, cost / user | ≥ 99.9 % uptime, cost ↓ trend |

---

## 6️⃣ Ten-Week Gantt Overview

```mermaid
gantt
    title WabiCare Phased Rollout (10 Weeks)
    dateFormat  YYYY-MM-DD
    section Phase 1 – Core + Copilots
    Core Rails (Sched / Data / Auth / Billing):active, p1a, 2025-10-15, 21d
    Note Copilot (STT → Draft): p1b, 2025-10-22, 14d
    Pilot Onboarding (3 sites): p1c, 2025-11-01, 14d
    section Phase 2 – Guarded Orchestration
    Foundry Orchestrator + Toggle: p2a, 2025-11-12, 10d
    Flow (Session → Note → Compliance → Claim): p2b, 2025-11-18, 10d
    Telemetry & Gates (SLO / Fallback): p2c, 2025-11-18, 10d
    section Phase 3 – Scale & Optimize
    Insights + Parent Summaries: p3a, 2025-11-28, 14d
    Scheduling Optimizer (Suggest): p3b, 2025-12-02, 10d
    Integrations (SIS / EMR / Payers): p3c, 2025-12-06, 14d
