# Billing Components Guidance

When working on any code in this directory:

- Review the updated billing PRD at `docs/prd/billing-module.md` for product context, feature scope, and compliance requirements.
- Ensure UI flows align with the documented billing lifecycle (intake → scheduling → claim generation → clearinghouse submission → ERA → parent notification → reporting).
- Maintain authorization tracking, CPT code mapping, denial workflows, and CSV export support as defined in the PRD.
- Surface audit logging hooks and HIPAA safeguards described in the PRD whenever touching data access or mutations.
- Coordinate with Scheduling and Intake integrations before changing data contracts.

If the file you are working on affects other modules (e.g., dashboards or data hooks), also inspect the integration requirements in the PRD before proceeding.

