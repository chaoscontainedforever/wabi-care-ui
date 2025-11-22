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
type BillingServiceRow = Tables<'billing_services'>
type BillingClaimRow = Tables<'billing_claims'>
type BillingClaimUpdate = TablesUpdate<'billing_claims'>
type BillingAuthorizationRow = Tables<'billing_authorizations'>
type BillingClaimStatusEventRow = Tables<'billing_claim_status_events'>

type StudentInsert = TablesInsert<'students'>
type TeacherInsert = TablesInsert<'teachers'>
type IEPGoalInsert = TablesInsert<'iep_goals'>
type SessionInsert = TablesInsert<'data_collection_sessions'>
type SessionDataPointInsert = TablesInsert<'session_data_points'>
type DocumentUploadInsert = TablesInsert<'document_uploads'>
type AFLSAssessmentInsert = TablesInsert<'afls_assessments'>
type VBMapMilestoneInsert = TablesInsert<'vb_mapp_milestones'>
type BillingClaimInsert = TablesInsert<'billing_claims'>
type BillingAuthorizationInsert = TablesInsert<'billing_authorizations'>
type BillingAuthorizationUpdate = TablesUpdate<'billing_authorizations'>

export type BillingServiceDefinition = BillingServiceRow
export type BillingClaimRecord = BillingClaimRow
export type BillingAuthorizationRecord = BillingAuthorizationRow

type BillingAuthorizationWithRelations = BillingAuthorizationRow & {
  student?: {
    id: string
    name: string
    student_id: string
  } | null
  service?: {
    service_key: string
    label: string
    default_cpt_code: string
  } | null
}

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

type BillingClaimWithRelations = BillingClaimRow & {
  session: {
    session_date: string
    session_type: string | null
    duration_minutes: number | null
  } | null
  student: {
    name: string
    student_id: string
  } | null
  service: {
    service_key: string
    label: string
    default_cpt_code: string
    default_duration_minutes: number
    unit_increment_minutes: number
    base_rate: number
  } | null
  status_events: BillingClaimStatusEventRow[] | null
}

const BILLING_SYNC_TTL = 1000 * 60 * 5 // 5 minutes
let lastBillingSync = 0
let billingSyncInFlight: Promise<void> | null = null

export class BillingClaimService {
  static async listClaims(options: { limit?: number } = {}): Promise<BillingClaimWithRelations[]> {
    const { limit = 100 } = options

    const { data, error } = await supabase
      .from('billing_claims')
      .select(
        `id,
         student_id,
         session_id,
         service_type,
         cpt_code,
         units,
         rate,
         amount,
         amount_paid,
         status,
         notes,
         payer_id,
         payer_name,
         payer_reference,
         location,
         submitted_at,
         processed_at,
         paid_at,
         denied_at,
         billed_at,
         last_status_change,
         status_reason,
         followup_required,
         created_at,
         updated_at,
         session:data_collection_sessions!billing_claims_session_id_fkey (
           session_date,
           session_type,
           duration_minutes
         ),
         student:students!billing_claims_student_id_fkey (
           name,
           student_id
         ),
         service:billing_services!billing_claims_service_type_fkey (
           service_key,
           label,
           default_cpt_code,
           default_duration_minutes,
           unit_increment_minutes,
           base_rate
        ),
        status_events:billing_claim_status_events!billing_claim_status_events_claim_id_fkey (
          id,
          status,
          event_type,
          notes,
          metadata,
          created_at,
          created_by
        )`
      )
      .order('created_at', { ascending: false })
      .order('created_at', { ascending: false, foreignTable: 'billing_claim_status_events' })
      .limit(limit)

    if (error) throw error
    return (data ?? []) as BillingClaimWithRelations[]
  }

  static async syncDrafts(force = false): Promise<void> {
    const now = Date.now()
    if (!force && billingSyncInFlight) {
      await billingSyncInFlight
      return
    }

    if (!force && now - lastBillingSync < BILLING_SYNC_TTL) {
      return
    }

    billingSyncInFlight = (async () => {
      const { data: services, error: servicesError } = await supabase
        .from('billing_services')
        .select('*')

      if (servicesError) throw servicesError

      const servicesMap = new Map<string, BillingServiceRow>()
      for (const service of services ?? []) {
        servicesMap.set(service.service_key, service)
      }

      const { data: sessions, error: sessionsError } = await supabase
        .from('data_collection_sessions')
        .select('id, student_id, service_type, duration_minutes')

      if (sessionsError) throw sessionsError

      const drafts: BillingClaimInsert[] = []

      for (const session of sessions ?? []) {
        if (!session.student_id) continue

        const serviceKey = session.service_type ?? 'aba_direct'
        const service = servicesMap.get(serviceKey) ?? servicesMap.get('aba_direct')
        if (!service) continue

        const duration = session.duration_minutes ?? service.default_duration_minutes ?? 60
        const increment = service.unit_increment_minutes ?? 30
        const units = Math.max(1, Math.ceil(duration / increment))
        const rate = Number(service.base_rate ?? 0)
        const amount = Number((units * rate).toFixed(2))

        drafts.push({
          session_id: session.id,
          student_id: session.student_id,
          service_type: service.service_key,
          cpt_code: service.default_cpt_code,
          units,
          rate,
          amount
        })
      }

      if (drafts.length === 0) {
        lastBillingSync = Date.now()
        return
      }

      const { error: upsertError } = await supabase
        .from('billing_claims')
        .upsert(drafts, { onConflict: 'session_id' })

      if (upsertError) throw upsertError
      lastBillingSync = Date.now()
    })()

    try {
      await billingSyncInFlight
    } finally {
      billingSyncInFlight = null
    }
  }

  static async listServices(): Promise<BillingServiceRow[]> {
    const { data, error } = await supabase
      .from('billing_services')
      .select('*')
      .order('label')

    if (error) throw error
    return data ?? []
  }

  static async getClaimById(id: string): Promise<BillingClaimRow | null> {
    const { data, error } = await supabase
      .from('billing_claims')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data ?? null
  }

  static async createClaim(payload: BillingClaimInsert): Promise<BillingClaimRow> {
    const { data, error } = await supabase
      .from('billing_claims')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateClaim(id: string, updates: BillingClaimUpdate): Promise<BillingClaimRow> {
    const { data, error } = await supabase
      .from('billing_claims')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export class AuthorizationService {
  static async listAuthorizations(): Promise<BillingAuthorizationWithRelations[]> {
    const { data, error } = await supabase
      .from('billing_authorizations')
      .select(`
        *,
        student:students!billing_authorizations_student_id_fkey (
          id,
          name,
          student_id
        ),
        service:billing_services!billing_authorizations_service_type_fkey (
          service_key,
          label,
          default_cpt_code
        )
      `)
      .order('expires_on', { ascending: true })

    if (error) throw error
    return (data ?? []) as BillingAuthorizationWithRelations[]
  }

  static async createAuthorization(payload: BillingAuthorizationInsert): Promise<BillingAuthorizationRow> {
    const { data, error } = await supabase
      .from('billing_authorizations')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateAuthorization(id: string, updates: BillingAuthorizationUpdate): Promise<BillingAuthorizationRow> {
    const { data, error } = await supabase
      .from('billing_authorizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
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
