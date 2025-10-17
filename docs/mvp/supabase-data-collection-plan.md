# Supabase Data Collection UI Plan

## Goals
- Keep Supabase backend intact while delivering a richer data collection experience
- Reuse shadcn design system (buttons, tabs, cards, dialogs) and subtle color palette
- Provide UI scaffolding for multi-mode data entry, prompt management, document upload, and group sessions
- Ensure existing metrics UI remains functional

## Branch
- `feature/supabase-data-collection-ui`

## Scope
- UI only (React state driven) – persist through current Supabase tables (`data_collection_sessions`, `session_data_points`, `document_uploads`)
- New data types handled in UI; unsupported write paths show "Coming soon" tooltips

## Tasks
1. Add new components for session launcher, mode tabs, prompt manager, group sessions, document upload drawer, media capture
2. Extend `GoalDataContentInner.tsx` to orchestrate these components without breaking existing features
3. Ensure design consistency with `DESIGN_SYSTEM.md`

