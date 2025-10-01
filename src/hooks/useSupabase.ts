import { useState, useEffect, useCallback } from 'react'
import { StudentService, TeacherService, GoalService, SessionService, AssessmentService, VBMapMilestoneService, DocumentService } from '@/lib/services'
import type { Database, Tables } from '@/lib/database.types'

// Type aliases for easier use
type Student = Tables<'students'>
type Teacher = Tables<'teachers'>
type IEPGoal = Tables<'iep_goals'>
type Session = Tables<'data_collection_sessions'>
type SessionDataPoint = Tables<'session_data_points'>
type AFLSAssessment = Tables<'afls_assessments'>
type VBMapMilestone = Tables<'vb_mapp_milestones'>
type DocumentUpload = Tables<'document_uploads'>

// Custom hook for students
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await StudentService.getAll()
      setStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const createStudent = useCallback(async (studentData: any) => {
    try {
      const newStudent = await StudentService.create(studentData)
      setStudents(prev => [...prev, newStudent])
      return newStudent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student')
      throw err
    }
  }, [])

  const updateStudent = useCallback(async (id: string, updates: any) => {
    try {
      const updatedStudent = await StudentService.update(id, updates)
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s))
      return updatedStudent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student')
      throw err
    }
  }, [])

  const deleteStudent = useCallback(async (id: string) => {
    try {
      await StudentService.delete(id)
      setStudents(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student')
      throw err
    }
  }, [])

  return {
    students,
    loading,
    error,
    refetch: fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent
  }
}

// Custom hook for teachers
export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TeacherService.getAll()
      setTeachers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teachers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  return {
    teachers,
    loading,
    error,
    refetch: fetchTeachers
  }
}

// Custom hook for IEP goals
export function useGoals(studentId: string | null) {
  const [goals, setGoals] = useState<IEPGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = useCallback(async () => {
    if (!studentId) {
      setGoals([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await GoalService.getByStudentId(studentId)
      setGoals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const createGoal = useCallback(async (goalData: any) => {
    try {
      const newGoal = await GoalService.create(goalData)
      setGoals(prev => [...prev, newGoal])
      return newGoal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal')
      throw err
    }
  }, [])

  const updateGoal = useCallback(async (id: string, updates: any) => {
    try {
      const updatedGoal = await GoalService.update(id, updates)
      setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g))
      return updatedGoal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal')
      throw err
    }
  }, [])

  return {
    goals,
    loading,
    error,
    refetch: fetchGoals,
    createGoal,
    updateGoal
  }
}

// Custom hook for assessments
export function useAssessments() {
  const [assessments, setAssessments] = useState<AFLSAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await AssessmentService.getAll()
      setAssessments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assessments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAssessments()
  }, [fetchAssessments])

  const createAssessment = useCallback(async (assessmentData: any) => {
    try {
      const newAssessment = await AssessmentService.create(assessmentData)
      setAssessments(prev => [...prev, newAssessment])
      return newAssessment
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assessment')
      throw err
    }
  }, [])

  const updateAssessment = useCallback(async (id: string, updates: any) => {
    try {
      const updatedAssessment = await AssessmentService.update(id, updates)
      setAssessments(prev => prev.map(a => a.id === id ? updatedAssessment : a))
      return updatedAssessment
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assessment')
      throw err
    }
  }, [])

  const deleteAssessment = useCallback(async (id: string) => {
    try {
      await AssessmentService.delete(id)
      setAssessments(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assessment')
      throw err
    }
  }, [])

  return {
    assessments,
    loading,
    error,
    refetch: fetchAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment
  }
}

// Custom hook for session data
export function useSessionData(studentId: string | null) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    if (!studentId) {
      setSessions([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await SessionService.getByStudentId(studentId)
      setSessions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const createSession = useCallback(async (sessionData: any) => {
    try {
      const newSession = await SessionService.create(sessionData)
      setSessions(prev => [newSession, ...prev])
      return newSession
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session')
      throw err
    }
  }, [])

  const createDataPoint = useCallback(async (dataPointData: any) => {
    try {
      const newDataPoint = await SessionService.createDataPoint(dataPointData)
      return newDataPoint
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create data point')
      throw err
    }
  }, [])

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
    createSession,
    createDataPoint
  }
}

// Custom hook for VB-MAPP milestones
export function useVBMapMilestones(studentId?: string) {
  const [milestones, setMilestones] = useState<VBMapMilestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMilestones = useCallback(async () => {
    if (!studentId) {
      setMilestones([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await VBMapMilestoneService.getByStudentId(studentId)
      setMilestones(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch VB-MAPP milestones')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    fetchMilestones()
  }, [fetchMilestones])

  const createMilestone = useCallback(async (milestoneData: any) => {
    try {
      const newMilestone = await VBMapMilestoneService.create(milestoneData)
      setMilestones(prev => [...prev, newMilestone])
      return newMilestone
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create milestone')
      throw err
    }
  }, [])

  const updateMilestone = useCallback(async (id: string, updates: any) => {
    try {
      const updatedMilestone = await VBMapMilestoneService.update(id, updates)
      setMilestones(prev => prev.map(m => m.id === id ? updatedMilestone : m))
      return updatedMilestone
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update milestone')
      throw err
    }
  }, [])

  const deleteMilestone = useCallback(async (id: string) => {
    try {
      await VBMapMilestoneService.delete(id)
      setMilestones(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete milestone')
      throw err
    }
  }, [])

  return {
    milestones,
    loading,
    error,
    refetch: fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone
  }
}

// Custom hook for document uploads
export function useDocumentUploads(studentId?: string) {
  const [uploads, setUploads] = useState<DocumentUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUploads = useCallback(async () => {
    if (!studentId) {
      setUploads([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await DocumentService.getByStudentId(studentId)
      setUploads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document uploads')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    fetchUploads()
  }, [fetchUploads])

  const createUpload = useCallback(async (uploadData: any) => {
    try {
      const newUpload = await DocumentService.create(uploadData)
      setUploads(prev => [...prev, newUpload])
      return newUpload
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create upload')
      throw err
    }
  }, [])

  const updateUpload = useCallback(async (id: string, updates: any) => {
    try {
      const updatedUpload = await DocumentService.update(id, updates)
      setUploads(prev => prev.map(u => u.id === id ? updatedUpload : u))
      return updatedUpload
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update upload')
      throw err
    }
  }, [])

  return {
    uploads,
    loading,
    error,
    refetch: fetchUploads,
    createUpload,
    updateUpload
  }
}
