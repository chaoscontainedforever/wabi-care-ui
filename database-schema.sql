-- Wabi Care Database Schema
-- This file contains the SQL schema for the Wabi Care data collection system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create teachers table
CREATE TABLE teachers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    school TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    student_id TEXT UNIQUE NOT NULL,
    grade TEXT NOT NULL,
    disability TEXT NOT NULL,
    age INTEGER NOT NULL,
    school TEXT NOT NULL,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    profile_picture_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create IEP goals table
CREATE TABLE iep_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    domain TEXT NOT NULL,
    level TEXT NOT NULL,
    type TEXT NOT NULL,
    objectives JSONB NOT NULL DEFAULT '[]',
    measurement TEXT NOT NULL,
    accommodations TEXT NOT NULL,
    target_percentage DECIMAL(5,2) NOT NULL,
    current_progress DECIMAL(5,2) DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create data collection sessions table
CREATE TABLE data_collection_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    session_type TEXT NOT NULL CHECK (session_type IN ('manual', 'document_upload', 'voice_notes')),
    notes TEXT,
    voice_recording_url TEXT,
    transcription TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session data points table
CREATE TABLE session_data_points (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES data_collection_sessions(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES iep_goals(id) ON DELETE CASCADE,
    performance_level TEXT NOT NULL CHECK (performance_level IN ('mastered', 'partial', 'not-met')),
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document uploads table
CREATE TABLE document_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('excel', 'word', 'pdf')),
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    upload_source TEXT NOT NULL CHECK (upload_source IN ('local', 'onedrive')),
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    extracted_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AFLS assessments table
CREATE TABLE afls_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    assessor_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN ('AFLS', 'ABLLS', 'VBMAPP')),
    domain TEXT NOT NULL,
    skill TEXT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL,
    notes TEXT,
    assessment_date DATE NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_teacher_id ON students(teacher_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_iep_goals_student_id ON iep_goals(student_id);
CREATE INDEX idx_data_collection_sessions_student_id ON data_collection_sessions(student_id);
CREATE INDEX idx_data_collection_sessions_date ON data_collection_sessions(session_date);
CREATE INDEX idx_session_data_points_session_id ON session_data_points(session_id);
CREATE INDEX idx_session_data_points_goal_id ON session_data_points(goal_id);
CREATE INDEX idx_document_uploads_student_id ON document_uploads(student_id);
CREATE INDEX idx_document_uploads_status ON document_uploads(processing_status);
CREATE INDEX idx_afls_assessments_student_id ON afls_assessments(student_id);
CREATE INDEX idx_afls_assessments_date ON afls_assessments(assessment_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_iep_goals_updated_at BEFORE UPDATE ON iep_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_data_collection_sessions_updated_at BEFORE UPDATE ON data_collection_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_uploads_updated_at BEFORE UPDATE ON document_uploads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_afls_assessments_updated_at BEFORE UPDATE ON afls_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE iep_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_collection_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE afls_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Teachers can only see their own data
CREATE POLICY "Teachers can view own data" ON teachers FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Teachers can update own data" ON teachers FOR UPDATE USING (auth.uid()::text = id::text);

-- Teachers can see students assigned to them
CREATE POLICY "Teachers can view assigned students" ON students FOR SELECT USING (teacher_id::text = auth.uid()::text);
CREATE POLICY "Teachers can update assigned students" ON students FOR UPDATE USING (teacher_id::text = auth.uid()::text);
CREATE POLICY "Teachers can insert students" ON students FOR INSERT WITH CHECK (teacher_id::text = auth.uid()::text);

-- Teachers can see IEP goals for their students
CREATE POLICY "Teachers can view student goals" ON iep_goals FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Teachers can update student goals" ON iep_goals FOR UPDATE USING (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Teachers can insert student goals" ON iep_goals FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);

-- Teachers can see sessions for their students
CREATE POLICY "Teachers can view student sessions" ON data_collection_sessions FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Teachers can update student sessions" ON data_collection_sessions FOR UPDATE USING (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Teachers can insert student sessions" ON data_collection_sessions FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);

-- Teachers can see session data points for their sessions
CREATE POLICY "Teachers can view session data points" ON session_data_points FOR SELECT USING (
    session_id IN (
        SELECT id FROM data_collection_sessions 
        WHERE student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
    )
);
CREATE POLICY "Teachers can update session data points" ON session_data_points FOR UPDATE USING (
    session_id IN (
        SELECT id FROM data_collection_sessions 
        WHERE student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
    )
);
CREATE POLICY "Teachers can insert session data points" ON session_data_points FOR INSERT WITH CHECK (
    session_id IN (
        SELECT id FROM data_collection_sessions 
        WHERE student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
    )
);

-- Teachers can see document uploads for their students
CREATE POLICY "Teachers can view student documents" ON document_uploads FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Teachers can update student documents" ON document_uploads FOR UPDATE USING (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Teachers can insert student documents" ON document_uploads FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);

-- Teachers can see assessments for their students
CREATE POLICY "Teachers can view student assessments" ON afls_assessments FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Teachers can update student assessments" ON afls_assessments FOR UPDATE USING (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Teachers can insert student assessments" ON afls_assessments FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION calculate_student_progress(student_uuid UUID)
RETURNS TABLE (
    goal_id UUID,
    goal_title TEXT,
    target_percentage DECIMAL,
    current_progress DECIMAL,
    sessions_count BIGINT,
    last_session_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ig.id,
        ig.title,
        ig.target_percentage,
        ig.current_progress,
        COUNT(sdp.id) as sessions_count,
        MAX(dcs.session_date) as last_session_date
    FROM iep_goals ig
    LEFT JOIN session_data_points sdp ON ig.id = sdp.goal_id
    LEFT JOIN data_collection_sessions dcs ON sdp.session_id = dcs.id
    WHERE ig.student_id = student_uuid
    GROUP BY ig.id, ig.title, ig.target_percentage, ig.current_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get student assessment summary
CREATE OR REPLACE FUNCTION get_student_assessment_summary(student_uuid UUID)
RETURNS TABLE (
    domain TEXT,
    avg_score DECIMAL,
    total_assessments BIGINT,
    last_assessment_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        aa.domain,
        AVG(aa.score / aa.max_score * 100) as avg_score,
        COUNT(aa.id) as total_assessments,
        MAX(aa.assessment_date) as last_assessment_date
    FROM afls_assessments aa
    WHERE aa.student_id = student_uuid
    GROUP BY aa.domain;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



