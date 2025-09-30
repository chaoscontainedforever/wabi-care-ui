import { supabase } from '@/lib/supabase'
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/lib/database.types'

// Type aliases for easier use
type Student = Tables<'students'>
type Teacher = Tables<'teachers'>
type IEPGoal = Tables<'iep_goals'>
type Session = Tables<'data_collection_sessions'>
type SessionDataPoint = Tables<'session_data_points'>
type DocumentUpload = Tables<'document_uploads'>
type AFLSAssessment = Tables<'afls_assessments'>
type VBMapMilestone = Tables<'vb_mapp_milestones'>

type StudentInsert = TablesInsert<'students'>
type TeacherInsert = TablesInsert<'teachers'>
type IEPGoalInsert = TablesInsert<'iep_goals'>
type SessionInsert = TablesInsert<'data_collection_sessions'>
type SessionDataPointInsert = TablesInsert<'session_data_points'>
type DocumentUploadInsert = TablesInsert<'document_uploads'>
type AFLSAssessmentInsert = TablesInsert<'afls_assessments'>
type VBMapMilestoneInsert = TablesInsert<'vb_mapp_milestones'>

const PROFILE_PICTURE_POOL = [
  // Diverse children and students - real photos
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1517467139951-f5a925cbd8c7?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1499465685963-94f2f25d2fcd?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1532910404211-1bcedd692953?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1495555961986-6d4c1ecb417a?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1520981825232-ece5fae45120?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces'
]

// Helper function to get a random profile picture for kids (avoiding duplicates)
const getRandomProfilePicture = () => {
  return PROFILE_PICTURE_POOL[Math.floor(Math.random() * PROFILE_PICTURE_POOL.length)]
}

// Helper function to get a unique profile picture (checks existing students)
const getUniqueProfilePicture = async (): Promise<string> => {
  try {
    // Get all existing profile pictures
    const { data: students } = await supabase
      .from('students')
      .select('profile_picture_url')
      .not('profile_picture_url', 'is', null)
    
    const usedPictures = new Set(students?.map(s => s.profile_picture_url) || [])
    
    const allPictures = PROFILE_PICTURE_POOL
    
    // Find unused pictures
    const availablePictures = allPictures.filter(pic => !usedPictures.has(pic))
    
    // Return an unused picture if available, otherwise return a random one
    if (availablePictures.length > 0) {
      return availablePictures[Math.floor(Math.random() * availablePictures.length)]
    }
    
    // Fallback to random if all pictures are used
    return getRandomProfilePicture()
  } catch (error) {
    console.error('Error getting unique profile picture:', error)
    return getRandomProfilePicture()
  }
}

export class StudentService {
  static async getAll(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  }

  static async getById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(student: StudentInsert): Promise<Student> {
    // Add a unique profile picture if none is provided
    const studentWithPicture = {
      ...student,
      profile_picture_url: student.profile_picture_url || await getUniqueProfilePicture()
    }
    
    const { data, error } = await supabase
      .from('students')
      .insert(studentWithPicture)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async update(id: string, updates: TablesUpdate<'students'>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async updateProfilePicture(id: string): Promise<Student> {
    const newPicture = await getUniqueProfilePicture()
    return this.update(id, { profile_picture_url: newPicture })
  }

  static async shuffleAllProfilePictures(): Promise<void> {
    try {
      const { data: students } = await supabase
        .from('students')
        .select('id')
      
      if (!students) return
      
      const shuffledPictures = [...PROFILE_PICTURE_POOL].sort(() => Math.random() - 0.5)
      
      // Assign unique pictures to each student
      for (let i = 0; i < students.length; i++) {
        const pictureIndex = i % shuffledPictures.length
        await this.update(students[i].id, { 
          profile_picture_url: shuffledPictures[pictureIndex] 
        })
      }
    } catch (error) {
      console.error('Error shuffling profile pictures:', error)
      throw error
    }
  }
}

export class TeacherService {
  static async getAll(): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  }

  static async getById(id: string): Promise<Teacher | null> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(teacher: TeacherInsert): Promise<Teacher> {
    const { data, error } = await supabase
      .from('teachers')
      .insert(teacher)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export class GoalService {
  static async getByStudentId(studentId: string): Promise<IEPGoal[]> {
    const { data, error } = await supabase
      .from('iep_goals')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async create(goal: IEPGoalInsert): Promise<IEPGoal> {
    const { data, error } = await supabase
      .from('iep_goals')
      .insert(goal)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async update(id: string, updates: TablesUpdate<'iep_goals'>): Promise<IEPGoal> {
    const { data, error } = await supabase
      .from('iep_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('iep_goals')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export class SessionService {
  static async create(session: SessionInsert): Promise<Session> {
    const { data, error } = await supabase
      .from('data_collection_sessions')
      .insert(session)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getByStudentId(studentId: string): Promise<Session[]> {
    const { data, error } = await supabase
      .from('data_collection_sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('session_date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async createDataPoint(dataPoint: SessionDataPointInsert): Promise<SessionDataPoint> {
    const { data, error } = await supabase
      .from('session_data_points')
      .insert(dataPoint)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getDataPointsBySessionId(sessionId: string): Promise<SessionDataPoint[]> {
    const { data, error } = await supabase
      .from('session_data_points')
      .select('*')
      .eq('session_id', sessionId)
    
    if (error) throw error
    return data || []
  }
}

export class DocumentService {
  static async create(document: DocumentUploadInsert): Promise<DocumentUpload> {
    const { data, error } = await supabase
      .from('document_uploads')
      .insert(document)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getByStudentId(studentId: string): Promise<DocumentUpload[]> {
    const { data, error } = await supabase
      .from('document_uploads')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async update(id: string, updates: TablesUpdate<'document_uploads'>): Promise<DocumentUpload> {
    const { data, error } = await supabase
      .from('document_uploads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export class AssessmentService {
  static async create(assessment: AFLSAssessmentInsert): Promise<AFLSAssessment> {
    const { data, error } = await supabase
      .from('afls_assessments')
      .insert(assessment)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getByStudentId(studentId: string): Promise<AFLSAssessment[]> {
    const { data, error } = await supabase
      .from('afls_assessments')
      .select('*')
      .eq('student_id', studentId)
      .order('assessment_date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getAll(): Promise<AFLSAssessment[]> {
    const { data, error } = await supabase
      .from('afls_assessments')
      .select(`
        *,
        students!inner(name, student_id),
        teachers!inner(name)
      `)
      .order('assessment_date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async update(id: string, updates: TablesUpdate<'afls_assessments'>): Promise<AFLSAssessment> {
    const { data, error } = await supabase
      .from('afls_assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('afls_assessments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Helper function to get student progress using the database function
export async function getStudentProgress(studentId: string) {
  const { data, error } = await supabase
    .rpc('calculate_student_progress', { student_uuid: studentId })
  
  if (error) throw error
  return data || []
}

// Helper function to get assessment summary using the database function
export async function getAssessmentSummary(studentId: string) {
  const { data, error } = await supabase
    .rpc('get_student_assessment_summary', { student_uuid: studentId })
  
  if (error) throw error
  return data || []
}

export class VBMapMilestoneService {
  static async create(milestone: VBMapMilestoneInsert): Promise<VBMapMilestone> {
    const { data, error } = await supabase
      .from('vb_mapp_milestones')
      .insert(milestone)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getByStudentId(studentId: string): Promise<VBMapMilestone[]> {
    const { data, error } = await supabase
      .from('vb_mapp_milestones')
      .select('*')
      .eq('student_id', studentId)
      .order('level', { ascending: true })
      .order('domain', { ascending: true })
      .order('milestone_number', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async getByStudentIdAndLevel(studentId: string, level: string): Promise<VBMapMilestone[]> {
    const { data, error } = await supabase
      .from('vb_mapp_milestones')
      .select('*')
      .eq('student_id', studentId)
      .eq('level', level)
      .order('domain', { ascending: true })
      .order('milestone_number', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async getByStudentIdAndDomain(studentId: string, domain: string): Promise<VBMapMilestone[]> {
    const { data, error } = await supabase
      .from('vb_mapp_milestones')
      .select('*')
      .eq('student_id', studentId)
      .eq('domain', domain)
      .order('level', { ascending: true })
      .order('milestone_number', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async update(id: string, updates: TablesUpdate<'vb_mapp_milestones'>): Promise<VBMapMilestone> {
    const { data, error } = await supabase
      .from('vb_mapp_milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('vb_mapp_milestones')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async bulkCreate(milestones: VBMapMilestoneInsert[]): Promise<VBMapMilestone[]> {
    const { data, error } = await supabase
      .from('vb_mapp_milestones')
      .insert(milestones)
      .select()
    
    if (error) throw error
    return data || []
  }
}
