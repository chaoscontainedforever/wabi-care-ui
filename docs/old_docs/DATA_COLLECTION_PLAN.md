# Wabi Care - Data Collection Component Development Plan

## Project Overview
Develop a comprehensive data collection component for Wabi Care that allows teachers to collect student data using IEP goals, upload Excel/Word documents, and integrate with OneDrive. The component should support voice notes and real-time data synchronization with Supabase.

## Current Status
✅ **Completed:**
- Created `.cursorrules` with design system guidelines
- Set up Supabase MCP server configuration for Cursor
- Installed Supabase client libraries
- Created comprehensive database schema
- Created TypeScript types for database models
- Created detailed task breakdown in `tasks.md`

## Architecture Overview

### Frontend Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material Design 3
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form
- **File Upload**: React Dropzone

### Backend Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Document Processing**: Server-side parsing
- **Voice Processing**: OpenAI Whisper API

### External Integrations
- **OneDrive**: Microsoft Graph API
- **Speech-to-Text**: OpenAI Whisper API
- **Document Parsing**: xlsx, mammoth libraries

## Core Features Implementation Plan

### 1. Document Upload & Processing System

#### 1.1 File Upload Component
```typescript
// Components to create:
- DocumentUploadZone.tsx
- FilePreview.tsx
- UploadProgress.tsx
- OneDriveBrowser.tsx
```

**Features:**
- Drag-and-drop file upload interface
- Support for Excel (.xlsx, .xls) and Word (.docx, .doc) files
- File validation and size limits (max 10MB)
- Progress indicators for uploads
- OneDrive integration for direct file selection

#### 1.2 Document Parser Service
```typescript
// Services to create:
- DocumentParserService.ts
- ExcelParser.ts
- WordParser.ts
- DataMapper.ts
```

**Parsing Logic:**
- Extract structured data from Excel spreadsheets
- Parse Word documents for assessment data
- Map extracted data to existing IEP goals
- Create new goals from document data if needed
- Validate and clean extracted data

#### 1.3 OneDrive Integration
```typescript
// Components to create:
- OneDriveAuth.tsx
- OneDriveFileBrowser.tsx
- OneDriveSync.tsx
```

**Implementation:**
- Microsoft Graph API integration
- OAuth 2.0 authentication flow
- File browser component
- Automatic sync of selected documents
- Handle API rate limits and errors

### 2. Voice Notes System

#### 2.1 Voice Recording Component
```typescript
// Components to create:
- VoiceRecorder.tsx
- RecordingControls.tsx
- AudioPlayer.tsx
- TranscriptionViewer.tsx
```

**Features:**
- Browser MediaRecorder API implementation
- Recording controls (start, pause, stop, resume)
- Recording timer and status indicators
- Microphone permission handling
- Audio file upload to Supabase Storage

#### 2.2 Speech-to-Text Integration
```typescript
// Services to create:
- SpeechToTextService.ts
- TranscriptionProcessor.ts
- AudioUploadService.ts
```

**Implementation:**
- OpenAI Whisper API integration
- Audio file processing pipeline
- Transcription error handling and retries
- Automatic transcription of voice notes
- Integration with session data collection

### 3. Enhanced Data Collection Interface

#### 3.1 Session Data Collection
```typescript
// Components to create:
- SessionDataCollection.tsx
- GoalDataCard.tsx
- PerformanceSelector.tsx
- NotesInput.tsx
- BulkDataEntry.tsx
```

**Features:**
- Real-time data saving
- Performance level selection (mastered, partial, not-met)
- Rich text notes with voice note integration
- Bulk data entry capabilities
- Data validation and error handling

#### 3.2 Progress Tracking Dashboard
```typescript
// Components to create:
- ProgressDashboard.tsx
- ProgressChart.tsx
- GoalCompletionTracker.tsx
- TrendAnalysis.tsx
- ReportGenerator.tsx
```

**Features:**
- Visual progress charts using Recharts
- Goal completion tracking
- Trend analysis and reporting
- Exportable progress reports
- Real-time progress updates

### 4. Database Integration

#### 4.1 Supabase Client Setup
```typescript
// Files created:
- src/lib/supabase.ts (✅ Completed)
- src/lib/database.types.ts
- src/hooks/useSupabase.ts
```

#### 4.2 Data Services
```typescript
// Services to create:
- StudentService.ts
- GoalService.ts
- SessionService.ts
- AssessmentService.ts
- DocumentService.ts
```

**Features:**
- CRUD operations for all entities
- Real-time subscriptions
- Optimistic updates
- Error handling and retries
- Data caching strategies

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Supabase project and run database schema
- [ ] Create basic Supabase client configuration
- [ ] Implement authentication system
- [ ] Create basic data collection interface
- [ ] Set up file upload infrastructure

### Phase 2: Document Processing (Week 3-5)
- [ ] Implement Excel document parsing
- [ ] Implement Word document parsing
- [ ] Create data mapping algorithms
- [ ] Build document upload interface
- [ ] Implement OneDrive integration

### Phase 3: Voice Notes (Week 6-7)
- [ ] Implement voice recording component
- [ ] Integrate speech-to-text service
- [ ] Create transcription processing pipeline
- [ ] Build voice notes management interface
- [ ] Integrate with session data collection

### Phase 4: Enhanced UI (Week 8-9)
- [ ] Redesign data collection interface
- [ ] Implement real-time data sync
- [ ] Create progress tracking dashboard
- [ ] Add bulk data entry capabilities
- [ ] Implement advanced filtering and search

### Phase 5: Advanced Features (Week 10-12)
- [ ] Implement AI-powered data analysis
- [ ] Create automated report generation
- [ ] Add collaboration features
- [ ] Implement mobile optimization
- [ ] Create PWA capabilities

### Phase 6: Testing & Deployment (Week 13-15)
- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Security testing
- [ ] User acceptance testing
- [ ] Production deployment

## Technical Implementation Details

### Database Schema Highlights
- **Students Table**: Core student information with teacher relationships
- **IEP Goals Table**: Goal definitions with progress tracking
- **Data Collection Sessions**: Session metadata and voice recordings
- **Session Data Points**: Individual goal performance data
- **Document Uploads**: File metadata and processing status
- **AFLS Assessments**: Assessment results and scoring

### Security Implementation
- Row Level Security (RLS) policies for data isolation
- Teacher-student access control
- Secure file upload with validation
- API rate limiting and error handling
- Data encryption for sensitive information

### Performance Optimizations
- Database indexing for common queries
- Real-time subscriptions with selective updates
- File upload chunking for large files
- Client-side caching strategies
- Lazy loading for heavy components

## Success Metrics
- [ ] Teachers can upload Excel/Word documents and extract data automatically
- [ ] Voice notes are transcribed accurately and attached to goals
- [ ] OneDrive integration allows seamless document access
- [ ] Real-time data sync works across multiple devices
- [ ] System handles large datasets efficiently
- [ ] User interface is intuitive and requires minimal training

## Risk Mitigation
- [ ] Backup data parsing strategies for different document formats
- [ ] Fallback options for voice transcription failures
- [ ] Rate limiting and error handling for OneDrive API
- [ ] Data validation to prevent corrupted data entry
- [ ] Regular database backups and disaster recovery plan

## Next Steps
1. **Set up Supabase project** with the provided token
2. **Run database schema** to create all necessary tables
3. **Configure environment variables** for Supabase connection
4. **Start with Phase 1** implementation
5. **Test MCP integration** with Cursor for database operations

## Resources
- [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp#cursor)
- [Material Design 3 Guidelines](https://m3.material.io/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Supabase TypeScript Guide](https://supabase.com/docs/guides/api/generating-types)
- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)

---

**Note**: This plan is designed to be iterative and flexible. Each phase builds upon the previous one, allowing for continuous testing and refinement throughout the development process.



