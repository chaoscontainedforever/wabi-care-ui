# UI Audit: Smart Data Collection (Supabase)

## Existing Components
- `GoalDataContentInner.tsx` – main middle panel, tabs, metrics
- `GoalDataContent.tsx` – wrapper for PageLayout
- `DataCollectionContent*` – legacy variants (Fixed/Optimized)
- `useSupabase.ts` – data retrieval hooks

## Supabase Tables
- `data_collection_sessions`
- `session_data_points`
- `document_uploads`
- `students`, `teachers`, `iep_goals`

## Gaps vs. Target Feature Set
- Multiple data modes (task analysis, duration, ABC) not implemented
- Prompt weight management absent
- Document uploads exist in DB but UI missing
- Group session UI not present
- Offline sync limited to current discrete trial state

## Design Constraints
- Use shadcn components from `src/components/ui`
- Follow palette from `globals.css` / `DESIGN_SYSTEM.md`
- Maintain tab layout: Capture / Graph / Stats (can expand)

