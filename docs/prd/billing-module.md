# WabiCare Billing Module PRD

## 1. Overview

The Billing Module is a cornerstone of the WabiCare platform. It manages every phase of the revenue cycle for autism care clinics, from intake through reimbursement. The module integrates tightly with Patient Intake, Scheduling, Data Collection, and future EMR components to ensure accurate claims submission, timely reimbursement, and payer compliance across Medicaid, commercial insurance, and other payers.

## 2. Goals

- Automate claims generation and submission from appointment, session, and treatment data.
- Reduce claim errors and rejections through validation, payer-specific formatting, and proactive alerts.
- Provide real-time connectivity with Scheduling and Intake modules for up-to-date client and authorization data.
- Track authorizations, remaining units, balances, and expiration dates to prevent denials.
- Deliver actionable billing and reimbursement reporting for finance and administrative stakeholders.

## 3. Target Users

- Billing coordinators and clinic administrators
- BCBAs and clinical directors (for CPT code assignment)
- Parents and caregivers (invoice and statement transparency)
- Insurance coordinators and authorization specialists

## 4. Key Features

- Automated claim draft generation based on completed sessions and attendance status
- Embedded CPT code management (97151, 97153, 97155, 97156, 97158, etc.)
- Authorization tracking (units used, units remaining, expiration dates, payer limits)
- Payer-specific rule sets and file formats (Medicaid, TRICARE, commercial payers)
- Eligibility verification and denial management workflows
- Configurable billing rules for service type, place of service, and supervision requirements
- Real-time billing dashboard with filters by payer, status, time period, and location
- Batch claim submission, rebilling, and secondary/tertiary claim support
- Parent-facing invoices, copay tracking, payment reminders, and statement history
- Integrated audit trail and compliance logging that is HIPAA and HITECH ready
- CSV export for manual submission during MVP before direct clearinghouse integration

## 5. Integration Requirements

- **Patient Intake Module:** Import demographics, insurance data, consent forms, and guardianship details.
- **Scheduling Module:** Synchronize session details, CPT codes, attendance, and place-of-service information.
- **Data Collection Module:** Surface clinical notes and goal progress to justify services and support audits.
- **EMR/Clinical Notes Module (future):** Provide full documentation packages for payer audits.
- **Clearinghouse API:** Submit 837P claims, receive 835 ERA files, and manage acknowledgements.

## 6. User Stories

- As a billing admin, I want to generate claims automatically from completed sessions so I can reduce manual entry.
- As a billing coordinator, I want to track authorizations by payer and client so I do not exceed allowed units.
- As a clinic admin, I want dashboards of claim status (submitted, rejected, paid) to monitor revenue.
- As a parent, I want billing statements and copay notifications so I understand financial responsibility.
- As a BCBA, I want to tag the correct CPT code during scheduling so billing remains accurate.
- As an insurance coordinator, I want alerts when authorizations near expiration so I can renew them early.

## 7. UI and UX Requirements

- Provide an intuitive admin dashboard with summary cards (total claims, collected, outstanding, denial rate) and dynamic filters (payer, location, status, time period).
- Offer a guided claim review and correction wizard for denials or secondary submissions.
- Ensure parent-facing billing pages are mobile-friendly, accessible, and written in plain language.
- Surface authorization warnings within Scheduling and during claim review.
- Expose audit trails with timestamped events, user actions, and payload previews.

## 8. Non-Functional Requirements

- HIPAA and HITECH compliance for data handling and access logging.
- Minimum 99.9% uptime for billing services.
- Immutable audit logs for all claim edits and submissions.
- Encryption of PHI/PII at rest and in transit.
- Performance benchmark: generate a claim draft in fewer than two seconds per session under normal load.

## 9. Metrics for Success

- ≥95% of claims generated automatically without manual edits.
- Reduce claim denials by ≥50% within the first three months of deployment.
- ≥75% of authorizations tracked proactively with renewal alerts sent before expiration.
- Decrease reimbursement cycle time by ≥25%.
- Achieve ≥80% satisfaction rating from parent billing surveys.

## 10. Feature Prioritization (MoSCoW)

**Must Have**
- Automated claim generation from completed sessions
- Embedded CPT code management
- Authorization tracking (usage, remaining units, expiration)
- Real-time sync with Scheduling and Intake modules
- HIPAA-compliant audit trail and data handling

**Should Have**
- Eligibility verification and denial management workflows
- Parent-facing invoices and copay tracking
- Payer-specific rule sets and templates
- Clearinghouse integration for electronic submission and ERA ingestion

**Could Have**
- Secondary and tertiary claim support
- Real-time clearinghouse status updates
- Dedicated batch submission dashboard for large clinics

**Will Not Have (Initial Release)**
- Multi-language parent billing interface
- Predictive denial risk scoring powered by machine learning

## 11. Clearinghouse Integration and Compliance

- Support ANSI X12 837P claim submissions and 835 ERA ingestion.
- Maintain full logs for clearinghouse submissions, acknowledgements, rejections, and remittances.
- Encrypt PHI/PII in transit (TLS 1.2+) and at rest.
- Enforce role-based access controls and least-privilege permissions.
- Retain submitted claims, remittances, and audit logs for seven years.
- Provide data export for compliance audits (CSV, JSON, encrypted archives).

## 12. Billing Lifecycle Workflow

The billing lifecycle spans intake through monthly financial reporting. The current workflow is:

1. Collect insurance and demographic information.
2. Verify whether intake is complete; loop until requirements are fulfilled.
3. Schedule appointments with CPT codes, place of service, and attendance expectations.
4. Generate claim drafts automatically from completed sessions.
5. Submit claims via the clearinghouse and track acknowledgements.
6. Receive ERAs, apply payments, and flag denials for follow-up.
7. Notify parents or caregivers of copay and balance responsibilities.
8. Produce monthly billing and revenue reports for finance and administration teams.

> The sequence above corresponds to the visual flow shared by stakeholders. Future iterations may embed this diagram directly once stored in the repository.

## 13. Technical Dependencies and Open Questions

- Confirm preferred clearinghouse partner(s) and required certification steps.
- Determine timeline for EMR integration and supporting documentation APIs.
- Validate Supabase schema coverage for billing entities (claims, authorizations, payers).
- Assess need for background job processing (e.g., claim batching, ERA parsing) and queue selection.
- Align audit trail storage with existing observability stack (e.g., Logflare, Datadog).

## 14. Roadmap Considerations

- Phase 1 (MVP): automated drafts, authorization tracking, CSV export, mock clearinghouse integration.
- Phase 2: production clearinghouse integration, parent billing portal, denial workflows.
- Phase 3: secondary claims, predictive analytics, finance system exports (QuickBooks, NetSuite).


