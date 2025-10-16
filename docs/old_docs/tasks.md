# Wabi Care - Data Collection Component Development Tasks

## Project Overview
Develop a comprehensive data collection component for Wabi Care that allows teachers to collect student data using IEP goals, upload Excel/Word documents, and integrate with OneDrive. The component should support voice notes and real-time data synchronization with Supabase.

## Supabase Connection
- **Project**: wabi-care
- **Token**: sbp_916186f23b0a128f1f68f7ea3344b65c28bce591
- **Database**: PostgreSQL with real-time capabilities

## Phase 1: Database Schema Setup

### 1.1 Create Supabase Tables
- [ ] **Students Table**
  - id (uuid, primary key)
  - name (text)
  - student_id (text, unique)
  - grade (text)
  - disability (text)
  - age (integer)
  - school (text)
  - teacher_id (uuid, foreign key)
  - profile_picture_url (text)
  - created_at (timestamp)
  - updated_at (timestamp)

- [ ] **Teachers Table**
  - id (uuid, primary key)
  - name (text)
  - email (text, unique)
  - school (text)
  - created_at (timestamp)
  - updated_at (timestamp)

- [ ] **IEP Goals Table**
  - id (uuid, primary key)
  - student_id (uuid, foreign key)
  - title (text)
  - description (text)
  - domain (text)
  - level (text)
  - type (text)
  - objectives (jsonb)
  - measurement (text)
  - accommodations (text)
  - target_percentage (decimal)
  - current_progress (decimal)
  - status (text)
  - created_at (timestamp)
  - updated_at (timestamp)

- [ ] **Data Collection Sessions Table**
  - id (uuid, primary key)
  - student_id (uuid, foreign key)
  - teacher_id (uuid, foreign key)
  - session_date (date)
  - session_type (text) // 'manual', 'document_upload', 'voice_notes'
  - notes (text)
  - voice_recording_url (text)
  - transcription (text)
  - created_at (timestamp)
  - updated_at (timestamp)

- [ ] **Session Data Points Table**
  - id (uuid, primary key)
  - session_id (uuid, foreign key)
  - goal_id (uuid, foreign key)
  - performance_level (text) // 'mastered', 'partial', 'not-met'
  - score (decimal)
  - max_score (decimal)
  - notes (text)
  - created_at (timestamp)

- [ ] **Document Uploads Table**
  - id (uuid, primary key)
  - student_id (uuid, foreign key)
  - teacher_id (uuid, foreign key)
  - file_name (text)
  - file_type (text) // 'excel', 'word', 'pdf'
  - file_url (text)
  - file_size (bigint)
  - upload_source (text) // 'local', 'onedrive'
  - processing_status (text) // 'pending', 'processing', 'completed', 'failed'
  - extracted_data (jsonb)
  - created_at (timestamp)
  - updated_at (timestamp)

- [ ] **AFLS Assessments Table**
  - id (uuid, primary key)
  - student_id (uuid, foreign key)
  - assessor_id (uuid, foreign key)
  - assessment_type (text) // 'AFLS', 'ABLLS', 'VBMAPP'
  - domain (text)
  - skill (text)
  - score (decimal)
  - max_score (decimal)
  - notes (text)
  - assessment_date (date)
  - status (text)
  - created_at (timestamp)
  - updated_at (timestamp)

### 1.2 Set up Row Level Security (RLS)
- [ ] Create RLS policies for all tables
- [ ] Implement teacher-student access control
- [ ] Set up admin access policies
- [ ] Test security policies

### 1.3 Create Database Functions
- [ ] Function to calculate student progress
- [ ] Function to generate assessment reports
- [ ] Function to sync OneDrive documents
- [ ] Function to process uploaded documents

## Phase 2: Supabase Integration

### 2.1 Install and Configure Supabase
- [ ] Install @supabase/supabase-js
- [ ] Create Supabase client configuration
- [ ] Set up environment variables
- [ ] Create TypeScript types for database models

### 2.2 Authentication Setup
- [ ] Implement Supabase Auth
- [ ] Create login/signup components
- [ ] Set up user roles (teacher, admin)
- [ ] Implement session management

### 2.3 Real-time Subscriptions
- [ ] Set up real-time data sync for sessions
- [ ] Implement live updates for data collection
- [ ] Handle connection states
- [ ] Optimize subscription performance

## Phase 3: Document Processing System

### 3.1 File Upload Component
- [ ] Create drag-and-drop file upload interface
- [ ] Support Excel (.xlsx, .xls) and Word (.docx, .doc) files
- [ ] Implement file validation and size limits
- [ ] Add progress indicators for uploads

### 3.2 Document Parser
- [ ] Install and configure document parsing libraries
  - For Excel: xlsx, exceljs
  - For Word: mammoth, docx
- [ ] Create parser service to extract structured data
- [ ] Implement data mapping to IEP goals
- [ ] Handle different document formats and layouts

### 3.3 OneDrive Integration
- [ ] Set up Microsoft Graph API integration
- [ ] Implement OneDrive authentication flow
- [ ] Create OneDrive file browser component
- [ ] Sync selected documents to local database
- [ ] Handle OneDrive API rate limits

### 3.4 Data Extraction and Mapping
- [ ] Create intelligent data extraction algorithms
- [ ] Map extracted data to existing IEP goals
- [ ] Create new goals from document data if needed
- [ ] Implement data validation and error handling
- [ ] Generate preview of extracted data before saving

## Phase 4: Voice Notes System

### 4.1 Voice Recording Component
- [ ] Implement browser MediaRecorder API
- [ ] Create recording controls (start, pause, stop)
- [ ] Add recording timer and status indicators
- [ ] Handle microphone permissions

### 4.2 Audio Processing
- [ ] Integrate speech-to-text service (OpenAI Whisper API or similar)
- [ ] Implement audio file upload to Supabase Storage
- [ ] Create transcription processing pipeline
- [ ] Handle transcription errors and retries

### 4.3 Voice Notes Integration
- [ ] Allow voice notes to be attached to specific goals
- [ ] Implement voice note playback
- [ ] Create voice note management interface
- [ ] Add voice note search and filtering

## Phase 5: Enhanced Data Collection UI

### 5.1 Session Data Collection Interface
- [ ] Redesign data collection cards for better UX
- [ ] Implement real-time data saving
- [ ] Add data validation and error handling
- [ ] Create bulk data entry capabilities

### 5.2 Progress Tracking Dashboard
- [ ] Create visual progress charts
- [ ] Implement goal completion tracking
- [ ] Add trend analysis and reporting
- [ ] Create exportable progress reports

### 5.3 Document Management
- [ ] Create document library interface
- [ ] Implement document search and filtering
- [ ] Add document versioning
- [ ] Create document sharing capabilities

## Phase 6: Advanced Features

### 6.1 AI-Powered Data Analysis
- [ ] Implement AI suggestions for goal adjustments
- [ ] Create predictive analytics for student progress
- [ ] Add automated report generation
- [ ] Implement smart data validation

### 6.2 Collaboration Features
- [ ] Add multi-teacher access to student data
- [ ] Implement data sharing between teachers
- [ ] Create comment and annotation system
- [ ] Add notification system for updates

### 6.3 Mobile Optimization
- [ ] Optimize for mobile devices
- [ ] Implement offline data collection
- [ ] Add mobile-specific features
- [ ] Create PWA capabilities

## Phase 7: Testing and Quality Assurance

### 7.1 Unit Testing
- [ ] Write unit tests for all components
- [ ] Test database functions and triggers
- [ ] Test API endpoints
- [ ] Test document parsing functions

### 7.2 Integration Testing
- [ ] Test Supabase integration
- [ ] Test OneDrive integration
- [ ] Test voice recording and transcription
- [ ] Test document upload and processing

### 7.3 User Acceptance Testing
- [ ] Test with real teachers and students
- [ ] Gather feedback and iterate
- [ ] Performance testing with large datasets
- [ ] Security testing and penetration testing

## Phase 8: Deployment and Monitoring

### 8.1 Production Deployment
- [ ] Set up production Supabase instance
- [ ] Configure production environment variables
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production environment

### 8.2 Monitoring and Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Implement usage analytics
- [ ] Set up performance monitoring
- [ ] Create admin dashboard for system health

### 8.3 Documentation
- [ ] Create user documentation
- [ ] Write API documentation
- [ ] Create developer documentation
- [ ] Record training videos

## Technical Requirements

### Frontend Technologies
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- React Hook Form
- Zustand for state management

### Backend Technologies
- Supabase (PostgreSQL + Auth + Storage)
- Microsoft Graph API (OneDrive)
- OpenAI Whisper API (Speech-to-text)
- Vercel (Deployment)

### Key Libraries
- @supabase/supabase-js
- xlsx (Excel parsing)
- mammoth (Word parsing)
- @microsoft/microsoft-graph-client
- react-dropzone
- react-audio-visualize

## Success Metrics
- [ ] Teachers can upload Excel/Word documents and extract data automatically
- [ ] Voice notes are transcribed accurately and attached to goals
- [ ] OneDrive integration allows seamless document access
- [ ] Real-time data sync works across multiple devices
- [ ] System handles large datasets efficiently
- [ ] User interface is intuitive and requires minimal training

## Timeline Estimate
- **Phase 1-2**: 2 weeks (Database + Supabase setup)
- **Phase 3**: 3 weeks (Document processing)
- **Phase 4**: 2 weeks (Voice notes)
- **Phase 5**: 2 weeks (Enhanced UI)
- **Phase 6**: 3 weeks (Advanced features)
- **Phase 7**: 2 weeks (Testing)
- **Phase 8**: 1 week (Deployment)

**Total Estimated Time**: 15 weeks

## Risk Mitigation
- [ ] Backup data parsing strategies for different document formats
- [ ] Fallback options for voice transcription failures
- [ ] Rate limiting and error handling for OneDrive API
- [ ] Data validation to prevent corrupted data entry
- [ ] Regular database backups and disaster recovery plan
