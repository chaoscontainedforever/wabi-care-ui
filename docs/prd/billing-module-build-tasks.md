# Billing Module Build Tasks

This build plan translates the billing PRD into an incremental roadmap. Ship one feature at a time, validate it against design system guidelines, and run regression checks before moving forward.

## Working Agreements

- Follow the Soft UI design system rules in `.cursorrules` for spacing, color, typography, and component usage.
- Reference the billing PRD (`docs/prd/billing-module.md`) for context, compliance constraints, and integrations.
- Complete the "Build → Test → Review" loop for each feature before starting the next item.
- Capture learnings or blockers in issue tracking so subsequent phases remain informed.

## Feature-by-Feature Tasks

### 1. Automated Claim Drafting (Billing Admin Story)
- **Goal:** Convert completed sessions into claim drafts with correct CPT codes and units.
- **Implementation Steps:**
  - Extend Supabase/data mocks with claim entities and link to session records.
  - Enhance `useBilling` to generate drafts post-session completion, respecting unit calculations.
  - Update billing dashboard cards to reflect draft counts and totals.
- **Testing:**
  - Unit test CPT code mapping and unit math (30 minutes = 1 unit).
  - UI regression test on `BillingPageClient` for new metrics using design tokens.
  - Manual QA: mark sample session complete → verify draft appears with accurate totals.

### 2. Authorization Tracking (Billing Coordinator Story)
- **Goal:** Track units used, remaining capacity, and upcoming expirations per payer/client.
- **Implementation Steps:**
  - Define authorization schema/types (`authorization_id`, `payer`, `total_units`, `units_remaining`, `expires_on`).
  - Surface authorization widgets/cards in billing dashboard and session scheduling surfaces.
  - Add warning badges when remaining units < threshold or expiration < 30 days.
- **Testing:**
  - Unit test calculations for remaining units after claim draft creation.
  - Visual regression on alert badges (verify Material spacing, color contrast per `.cursorrules`).
  - Manual QA: create mock authorization nearing expiration; confirm warning surfaces in UI and logs.

### 3. Billing Status Dashboard (Clinic Admin Story)
- **Goal:** Provide an overview of claim lifecycle stages (submitted, rejected, paid) with filters.
- **Implementation Steps:**
  - Extend data models with status enums and timeline events.
  - Add filterable table/chart components using existing soft UI primitives (`Card`, `Tabs`, `Badge`).
  - Implement status chips, trend chart, and summary metrics.
- **Testing:**
  - Integration test filters (e.g., by payer, timeframe).
  - Snapshot test for dashboard layout to catch design regressions.
  - Manual QA across breakpoints (mobile, tablet, desktop) for responsive adherence.

### 4. Parent Statements & Copay Notifications (Parent Story)
- **Goal:** Generate clear, accessible statements and notify caregivers of balances.
- **Implementation Steps:**
  - Create parent-facing invoice component adhering to design typography and contrast.
  - Hook into notification service (email/mock) for copay reminders.
  - Provide export (PDF/CSV) for statements within MVP scope.
- **Testing:**
  - Unit test statement amount calculations and formatting (currency, due dates).
  - Accessibility audit (contrast, focus states, screen reader labels).
  - Manual QA: trigger copay workflow, confirm notifications and downloadable statement.

### 5. Scheduling CPT Assignments (BCBA Story)
- **Goal:** Allow BCBAs to tag CPT codes during scheduling for smoother billing handoff.
- **Implementation Steps:**
  - Enhance scheduling forms with CPT selectors referencing PRD code lists.
  - Sync selections to billing hook so drafts inherit the correct codes.
  - Provide inline tooltips/help text using design system tooltip components.
- **Testing:**
  - Unit test mapping pipeline from scheduling to billing draft.
  - UI regression on scheduling modal for spacing/typography compliance.
  - Manual QA: schedule session with specific CPT → confirm billing draft uses same code.

### 6. Authorization Renewal Alerts (Insurance Coordinator Story)
- **Goal:** Alert coordinators before authorizations expire and allow quick follow-up.
- **Implementation Steps:**
  - Add background job or cron integration (or mock) to evaluate expirations nightly.
  - Surface alerts in billing dashboard and optionally notifications panel.
  - Provide quick actions (e.g., mark renewal requested) with audit logging.
- **Testing:**
  - Unit test alert generation given various expiration windows.
  - Manual QA with mocked current date to simulate upcoming expirations.
  - Audit log verification for actions taken on alerts.

## Definition of Done Checklist (apply per feature)

- [ ] Acceptance criteria met from corresponding user story.
- [ ] UI validated against design system spacing, color, typography.
- [ ] Unit/integration tests added or updated; coverage reviewed.
- [ ] Manual QA notes captured; regression pass completed.
- [ ] Documentation (PRD annotations, changelog) updated.
- [ ] Feature toggles or migration scripts (if any) documented.

## References

- Product Requirements: `docs/prd/billing-module.md`
- Design System: `.cursorrules`
- Scheduling Integration: `src/hooks/useScheduling.ts`
- Billing Hooks & UI: `src/hooks/useBilling.ts`, `src/components/billing/`


