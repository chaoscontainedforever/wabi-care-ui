"use client"

import { useState, memo, useCallback, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import * as XLSX from 'xlsx'
// Lazy load icons to reduce initial bundle size
import { 
  User, 
  Search, 
  Plus, 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Filter,
  SortAsc,
  BarChart3,
  Target,
  BookOpen,
  Users,
  Activity,
  Grid3X3,
  List,
  Table,
  FileSpreadsheet,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  RefreshCw
} from "lucide-react"

import { aflsDomains } from "@/data/mockDataCollection"
import { useStudents, useGoals, useAssessments, useSessionData, useVBMapMilestones, useDocumentUploads } from "@/hooks/useSupabase"
import { VBMapMilestoneService, DocumentService, StudentService } from "@/lib/services"

// Mock data for goals
const mockGoals = [
  {
    id: "1",
    studentId: "1",
    title: "Reading Comprehension",
    description: "Student will identify main idea in grade-level texts",
    domain: "Academic",
    level: "Elementary",
    type: "Annual",
    objectives: ["Identify main idea", "Answer comprehension questions"],
    measurement: "80% accuracy across 3 consecutive sessions",
    accommodations: "Extended time, visual supports"
  },
  {
    id: "2", 
    studentId: "1",
    title: "Social Communication",
    description: "Student will initiate conversations with peers",
    domain: "Social",
    level: "Elementary", 
    type: "Annual",
    objectives: ["Initiate greetings", "Ask questions to peers"],
    measurement: "3 times per day across 5 consecutive days",
    accommodations: "Social scripts, peer modeling"
  },
  {
    id: "3",
    studentId: "2", 
    title: "Attention and Focus",
    description: "Student will maintain attention during structured activities",
    domain: "Behavioral",
    level: "Elementary",
    type: "Annual", 
    objectives: ["Stay on task for 15 minutes", "Follow multi-step directions"],
    measurement: "80% of opportunities across 3 consecutive sessions",
    accommodations: "Movement breaks, visual timers"
  },
  {
    id: "4",
    studentId: "2",
    title: "Math Problem Solving", 
    description: "Student will solve single-step word problems",
    domain: "Academic",
    level: "Elementary",
    type: "Annual",
    objectives: ["Identify key information", "Choose correct operation"],
    measurement: "75% accuracy across 4 consecutive sessions", 
    accommodations: "Manipulatives, visual representations"
  },
  {
    id: "5",
    studentId: "3",
    title: "Written Expression",
    description: "Student will write complete sentences with proper grammar",
    domain: "Academic", 
    level: "Elementary",
    type: "Annual",
    objectives: ["Write complete sentences", "Use proper punctuation"],
    measurement: "80% accuracy across 3 consecutive sessions",
    accommodations: "Graphic organizers, word banks"
  },
  {
    id: "6",
    studentId: "4",
    title: "Speech Articulation",
    description: "Student will produce /r/ sound correctly in conversation",
    domain: "Communication",
    level: "Elementary", 
    type: "Annual",
    objectives: ["Produce /r/ in isolation", "Use /r/ in words"],
    measurement: "90% accuracy across 3 consecutive sessions",
    accommodations: "Visual cues, modeling"
  }
]

// Mock assessment data
const mockAssessments = [
  {
    id: "1",
    studentId: "EJ001",
    studentName: "Emma Johnson",
    assessmentType: "AFLS",
    domain: "Basic Living Skills",
    skill: "Dressing",
    date: "2024-01-15",
    score: 8,
    maxScore: 10,
    notes: "Shows good progress with buttoning and zipping. Needs work on shoe tying.",
    assessor: "Ms. Sarah Wilson",
    status: "completed"
  },
  {
    id: "2",
    studentId: "EJ001", 
    studentName: "Emma Johnson",
    assessmentType: "AFLS",
    domain: "Home Skills",
    skill: "Cleaning",
    date: "2024-01-12",
    score: 6,
    maxScore: 10,
    notes: "Can wipe surfaces and organize toys. Struggles with vacuuming.",
    assessor: "Ms. Sarah Wilson",
    status: "completed"
  },
  {
    id: "3",
    studentId: "MC002",
    studentName: "Michael Chen",
    assessmentType: "AFLS", 
    domain: "School Skills",
    skill: "Following Directions",
    date: "2024-01-10",
    score: 7,
    maxScore: 10,
    notes: "Follows 2-step directions consistently. Working on 3-step sequences.",
    assessor: "Ms. Sarah Wilson",
    status: "completed"
  }
]

interface AssessmentForm {
  studentId: string
  domain: string
  skill: string
  score: number
  maxScore: number
  notes: string
  date: string
}

type DataCollectionContentProps = {
  preselectedStudentId?: string | null
}

function DataCollectionContent({ preselectedStudentId }: DataCollectionContentProps) {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(preselectedStudentId ?? null)
  const [isPreselectionHandled, setIsPreselectionHandled] = useState(false)
  
  // Supabase data hooks
  const { students, loading: studentsLoading, error: studentsError } = useStudents()
  const { goals, loading: goalsLoading, error: goalsError } = useGoals(selectedStudent)
  const { assessments, loading: assessmentsLoading, error: assessmentsError, createAssessment } = useAssessments()
  const { sessions, loading: sessionsLoading, error: sessionsError, createSession, createDataPoint } = useSessionData(selectedStudent)
  const { milestones, loading: milestonesLoading, error: milestonesError, refetch: refetchMilestones } = useVBMapMilestones(selectedStudent || undefined)
  const { uploads, loading: uploadsLoading, error: uploadsError, refetch: refetchUploads } = useDocumentUploads(selectedStudent || undefined)
  const { refetch: refetchStudents } = useStudents()

  const currentStudent = useMemo(() => {
    if (!selectedStudent) return null
    return students.find((student) => student.id === selectedStudent) || null
  }, [selectedStudent, students])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!isPreselectionHandled && preselectedStudentId) {
      setSelectedStudent(preselectedStudentId)
      setIsPreselectionHandled(true)
    }
  }, [preselectedStudentId, isPreselectionHandled])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDomain, setFilterDomain] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)
  const [viewFormat, setViewFormat] = useState<"cards" | "list" | "table">("cards")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [goalSearchTerm, setGoalSearchTerm] = useState("")
  const [goalFilterDomain, setGoalFilterDomain] = useState("all")
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null)
  const [goalDetailTab, setGoalDetailTab] = useState("collect")
  const [hasMounted, setHasMounted] = useState(false)
  const [assessmentForm, setAssessmentForm] = useState<AssessmentForm>({
    studentId: "",
    domain: "",
    skill: "",
    score: 0,
    maxScore: 10,
    notes: "",
    date: new Date().toISOString().split('T')[0]
  })

  // Session Data Collection State
  const [sessionData, setSessionData] = useState<{[goalId: string]: {
    performance: 'mastered' | 'partial' | 'not-met' | null,
    notes: string,
    date: string
  }}>({})
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0])
  
  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcription, setTranscription] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingChunks, setRecordingChunks] = useState<Blob[]>([])
  
  // Active Tab State
  const [activeTab, setActiveTab] = useState("session-data")
  
  // Upload State
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadSessionDate, setUploadSessionDate] = useState(new Date().toISOString().split('T')[0])
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  // Assessment Type State
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>('afls')


  const filteredStudents = useMemo(() => {
    if (studentsLoading) return []
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [students, searchTerm, studentsLoading])

  const filteredAssessments = useMemo(() => {
    if (assessmentsLoading) return []
    return assessments.filter(assessment => {
      const matchesDomain = filterDomain === "all" || assessment.domain === filterDomain
      const matchesStudent = !selectedStudent || assessment.student_id === selectedStudent
      return matchesDomain && matchesStudent
    })
  }, [assessments, filterDomain, selectedStudent, assessmentsLoading])

  // Filter goals based on selected assessment type
  const filteredGoals = useMemo(() => {
    if (goalsLoading) return []
    const domainFiltered = selectedAssessmentType === 'vb_mapp'
      ? goals.filter(goal => goal.domain.startsWith('VB-MAPP'))
      : goals
    return domainFiltered.filter(goal =>
      goal.title.toLowerCase().includes(goalSearchTerm.toLowerCase()) &&
      (goalFilterDomain === 'all' || goal.domain === goalFilterDomain)
    )
  }, [goals, selectedAssessmentType, goalsLoading, goalFilterDomain, goalSearchTerm])

  const activeGoal = useMemo(() => {
    if (!filteredGoals.length) return null
    const goal = filteredGoals.find(goal => goal.id === activeGoalId)
    return goal || filteredGoals[0]
  }, [filteredGoals, activeGoalId])


  const handleStudentSelect = useCallback((studentId: string) => {
    setSelectedStudent(studentId === selectedStudent ? null : studentId)
  }, [selectedStudent])

  const handleRefreshProfilePicture = useCallback(async (studentId: string, event?: React.MouseEvent) => {
    event?.stopPropagation()
    try {
      await StudentService.updateProfilePicture(studentId)
      refetchStudents() // Refresh the students list
    } catch (error) {
      console.error('Failed to refresh profile picture:', error)
    }
  }, [refetchStudents])

  const handleExportStudentData = useCallback((studentId: string) => {
    console.log('Exporting data for student', studentId)
    // TODO: implement export functionality
  }, [])

  const saveTranscription = useCallback(async () => {
    if (!transcription || !selectedStudent) return
    
    try {
      // Create a session with the transcription
      const session = await createSession({
        student_id: selectedStudent,
        session_date: sessionDate,
        session_type: 'voice_recording',
        assessment_type: selectedAssessmentType,
        notes: transcription,
        transcription: transcription
      })
      
      // Clear the transcription after saving
      setTranscription('')
      alert('Transcription saved successfully!')
    } catch (error) {
      console.error('Failed to save transcription:', error)
      alert('Failed to save transcription. Please try again.')
    }
  }, [transcription, selectedStudent, sessionDate, selectedAssessmentType, createSession])

  const handleAssessmentSubmit = async () => {
    try {
      await createAssessment({
        student_id: assessmentForm.studentId,
        assessor_id: "1d4a8e61-26b6-4860-8dc4-93564aae651f", // TODO: Get from auth context
        assessment_type: "AFLS",
        domain: assessmentForm.domain,
        skill: assessmentForm.skill,
        score: assessmentForm.score,
        max_score: assessmentForm.maxScore,
        notes: assessmentForm.notes,
        assessment_date: assessmentForm.date,
        status: "completed"
      })
      
    setIsAssessmentDialogOpen(false)
    setAssessmentForm({
      studentId: "",
      domain: "",
      skill: "",
      score: 0,
      maxScore: 10,
      notes: "",
      date: new Date().toISOString().split('T')[0]
    })
    } catch (error) {
      console.error("Failed to create assessment:", error)
      alert("Failed to save assessment. Please try again.")
    }
  }


  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-green-600 bg-green-50"
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  // Session Data Collection Handlers
  const handlePerformanceSelect = (goalId: string, performance: 'mastered' | 'partial' | 'not-met') => {
    setSessionData(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        performance,
        date: sessionDate
      }
    }))
  }

  const handleNotesChange = (goalId: string, notes: string) => {
    setSessionData(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        notes,
        date: sessionDate
      }
    }))
  }

  const handleSaveSessionData = async (goalId: string) => {
    const data = sessionData[goalId]
    if (data && data.performance && selectedStudent) {
      try {
        // Create session if it doesn't exist for this date
        const existingSession = sessions.find(s => 
          s.student_id === selectedStudent && 
          s.session_date === data.date
        )
        
        let sessionId: string
        if (existingSession) {
          sessionId = existingSession.id
        } else {
          const newSession = await createSession({
            student_id: selectedStudent,
            teacher_id: "1d4a8e61-26b6-4860-8dc4-93564aae651f", // TODO: Get from auth context
            session_date: data.date,
            session_type: "manual",
            notes: data.notes
          })
          sessionId = newSession.id
        }
        
        // Create data point
        await createDataPoint({
          session_id: sessionId,
          goal_id: goalId,
          performance_level: data.performance,
          notes: data.notes
        })
        
      alert('Session data saved successfully!')
      } catch (error) {
        console.error("Failed to save session data:", error)
        alert('Failed to save session data. Please try again.')
      }
    } else {
      alert('Please select a performance level before saving.')
    }
  }

  // Voice Recording Functions
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        setRecordingChunks(chunks)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      setRecordingChunks([])

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      // Store timer reference for cleanup
      ;(recorder as any).timer = timer

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }, [])

  const pauseRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      setIsPaused(true)
      clearInterval((mediaRecorder as any).timer)
    }
  }, [mediaRecorder])

  const resumeRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      setIsPaused(false)
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      ;(mediaRecorder as any).timer = timer
    }
  }, [mediaRecorder])

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsPaused(false)
      clearInterval((mediaRecorder as any).timer)
      setMediaRecorder(null)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const transcribeAudio = async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    try {
      // Simulate transcription API call
      // In a real implementation, you would call a speech-to-text service
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock transcription result
      const mockTranscription = `Student showed good progress during today's session. Emma demonstrated improved focus during the reading comprehension activity. She was able to identify the main idea in 3 out of 4 passages. Some challenges with attention during transitions, but overall behavior was positive. Recommend continuing with current intervention strategies.`
      
      setTranscription(mockTranscription)
    } catch (error) {
      console.error('Transcription error:', error)
      alert('Transcription failed. Please try again.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const clearRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription("")
    setRecordingTime(0)
    setRecordingChunks([])
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
  }

  const applyTranscriptionToNotes = (goalId: string) => {
    if (transcription) {
      setSessionData(prev => ({
        ...prev,
        [goalId]: {
          ...prev[goalId],
          notes: prev[goalId]?.notes ? `${prev[goalId].notes}\n\n${transcription}` : transcription,
          date: sessionDate
        }
      }))
    }
  }

  // File upload handlers
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc
    ]
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid Excel (.xlsx, .xls) or Word (.docx, .doc) file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB')
      return
    }

    setUploadedFile(file)
    setUploadError(null)
  }, [])

  const processExcelFile = useCallback(async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          if (!data) {
            reject(new Error('Failed to read file'))
            return
          }

          console.log('Reading Excel file...')
          const workbook = XLSX.read(data, { type: 'binary' })
          console.log('Workbook sheets:', workbook.SheetNames)
          
          // Check if there's a VB-MAPP milestones tab
          const vbMappTab = workbook.SheetNames.find(name => 
            name.toLowerCase().includes('vb') && 
            (name.toLowerCase().includes('milestone') || name.toLowerCase().includes('mapp'))
          )
          
          if (vbMappTab && selectedAssessmentType === 'vb_mapp') {
            console.log('Processing VB-MAPP milestones from tab:', vbMappTab)
            const worksheet = workbook.Sheets[vbMappTab]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            console.log('Raw VB-MAPP data:', jsonData)
            
            // Process VB-MAPP milestones data
            const milestonesData = jsonData.slice(1).map((row: any, index: number) => {
              console.log(`Processing VB-MAPP row ${index + 1}:`, row)
              return {
                level: row[0] || '',
                domain: row[1] || '',
                milestone_number: parseInt(row[2]) || 0,
                milestone_description: row[3] || '',
                score: parseFloat(row[4]) || 0,
                max_score: parseFloat(row[5]) || 1,
                notes: row[6] || '',
                tester_name: row[7] || '',
                test_date: row[8] || uploadSessionDate
              }
            }).filter(row => row.level && row.domain && row.milestone_number > 0)
            
            console.log('Processed VB-MAPP milestones:', milestonesData)
            resolve(milestonesData)
            return
          }
          
          // Default processing for other assessment types
          const sheetName = workbook.SheetNames[0]
          if (!sheetName) {
            reject(new Error('No worksheets found in the Excel file'))
            return
          }
          
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          console.log('Raw Excel data:', jsonData)

          // Process the data - expect format: [Goal, Performance, Notes, Date]
          const sessionData = jsonData.slice(1).map((row: any, index: number) => {
            console.log(`Processing row ${index + 1}:`, row)
            return {
              goal: row[0] || '',
              performance: row[1] || '',
              notes: row[2] || '',
              date: row[3] || uploadSessionDate
            }
          }).filter(row => row.goal && row.performance)

          console.log('Processed session data:', sessionData)
          resolve(sessionData)
        } catch (error) {
          console.error('Error processing Excel file:', error)
          reject(error)
        }
      }

      reader.onerror = () => {
        console.error('FileReader error')
        reject(new Error('Failed to read file'))
      }
      
      console.log('Starting file read...')
      reader.readAsBinaryString(file)
    })
  }, [selectedAssessmentType, uploadSessionDate])

  const handleUploadData = useCallback(async () => {
    if (!uploadedFile || !selectedStudent) {
      setUploadError('Please select a file and ensure a student is selected')
      return
    }

    setIsProcessingFile(true)
    setUploadError(null)

    try {
      console.log('Starting upload process...', { uploadedFile: uploadedFile.name, selectedStudent, uploadSessionDate })
      
      const processedData = await processExcelFile(uploadedFile) as any[]
      console.log('Excel file processed successfully:', processedData)
      
      // Create document upload record
      console.log('Creating document upload record...')
      const documentUpload = await DocumentService.create({
        file_name: uploadedFile.name,
        file_type: 'excel', // Use the constrained value
        file_size: uploadedFile.size,
        file_url: `temp://${uploadedFile.name}`, // Temporary placeholder URL
        upload_source: 'local', // Use the constrained value
        student_id: selectedStudent,
        teacher_id: "1d4a8e61-26b6-4860-8dc4-93564aae651f", // TODO: Get from auth context
        processing_status: 'completed',
        extracted_data: processedData
      })
      console.log('Document upload record created:', documentUpload)
      
      // Create a session
      console.log('Creating session...')
      const session = await createSession({
        student_id: selectedStudent,
        session_date: uploadSessionDate,
        session_type: 'document_upload',
        assessment_type: selectedAssessmentType,
        notes: `Data imported from ${uploadedFile.name}`
      })
      console.log('Session created:', session)

      let createdCount = 0

      // Handle VB-MAPP milestones
      if (selectedAssessmentType === 'vb_mapp' && processedData[0]?.level) {
        console.log('Creating VB-MAPP milestones...')
        const milestonesToCreate = processedData.map((milestone: any) => ({
          student_id: selectedStudent,
          session_id: session.id,
          document_upload_id: documentUpload.id,
          level: milestone.level,
          domain: milestone.domain,
          milestone_number: milestone.milestone_number,
          milestone_description: milestone.milestone_description,
          score: milestone.score,
          max_score: milestone.max_score,
          notes: milestone.notes,
          tester_name: milestone.tester_name,
          test_date: milestone.test_date
        }))

        try {
          const createdMilestones = await VBMapMilestoneService.bulkCreate(milestonesToCreate)
          createdCount = createdMilestones.length
          console.log('VB-MAPP milestones created successfully:', createdMilestones.length)
        } catch (milestoneError) {
          console.error('Error creating VB-MAPP milestones:', milestoneError)
          throw milestoneError
        }
      } else {
        // Handle regular session data points
        console.log('Creating data points...')
        for (const data of processedData) {
          console.log('Processing data row:', data)
          
          // Find matching goal
          const goal = goals.find(g => 
            g.title.toLowerCase().includes(data.goal.toLowerCase()) ||
            data.goal.toLowerCase().includes(g.title.toLowerCase())
          )
          console.log('Found goal:', goal)

          if (goal) {
            try {
              await createDataPoint({
                session_id: session.id,
                goal_id: goal.id,
                performance_level: data.performance.toLowerCase().replace(' ', '_'),
                notes: data.notes,
                score: 1,
                max_score: 1
              })
              createdCount++
              console.log('Data point created successfully')
            } catch (dataPointError) {
              console.error('Error creating data point:', dataPointError)
              throw dataPointError
            }
          } else {
            console.warn('No matching goal found for:', data.goal)
          }
        }
      }

      // Reset form and close dialog
      setUploadedFile(null)
      setUploadSessionDate(new Date().toISOString().split('T')[0])
      setIsUploadDialogOpen(false)
      
      // Refresh milestones if VB-MAPP data was uploaded
      if (selectedAssessmentType === 'vb_mapp') {
        refetchMilestones()
      }
      
      // Always refresh uploads to show the uploaded file
      refetchUploads()
      
      alert(`Successfully imported ${createdCount} ${selectedAssessmentType === 'vb_mapp' ? 'VB-MAPP milestones' : 'data points'}!`)
    } catch (error) {
      console.error('Upload error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      
      // Provide more specific error messages
      let errorMessage = 'Failed to process file'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase errors
        if ('message' in error) {
          errorMessage = String(error.message)
        } else if ('error' in error) {
          errorMessage = String(error.error)
        }
      }
      
      setUploadError(errorMessage)
    } finally {
      setIsProcessingFile(false)
    }
  }, [uploadedFile, selectedStudent, uploadSessionDate, processExcelFile, createSession, createDataPoint, goals])

  return (
    <div className="space-y-4">
      {/* Student Selection Ribbon */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.history.back()}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                {currentStudent?.profile_picture_url ? (
                  <img 
                    src={currentStudent.profile_picture_url} 
                    alt={currentStudent.name}
                      className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collecting data for</p>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentStudent ? currentStudent.name : 'Select a student'}
                </h2>
            </div>
                      </div>
                    </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasMounted ? (
              <Select value={selectedStudent || ''} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-48" disabled={studentsLoading}>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} · {student.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="w-48 h-9 bg-gray-100 rounded-md animate-pulse" />
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                if (!currentStudent) return
                const syntheticEvent = {
                  ...e,
                  preventDefault: () => {},
                  stopPropagation: () => {},
                } as unknown as React.MouseEvent
                handleRefreshProfilePicture(currentStudent.id, syntheticEvent)
              }}
              disabled={!currentStudent}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Photo
                  </Button>
            <Button variant="outline" size="sm" onClick={() => currentStudent && setIsAssessmentDialogOpen(true)} disabled={!currentStudent}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Assessment
                  </Button>
            <Button size="sm" onClick={() => currentStudent && handleExportStudentData(currentStudent.id)} disabled={!currentStudent}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
                </div>
            </CardContent>
        </Card>

      <div className="flex-1 space-y-4 lg:space-y-6">
        {selectedStudent ? (
          <>
            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10" suppressHydrationWarning>
                <TabsTrigger value="assessments" suppressHydrationWarning className="text-xs sm:text-sm py-2 sm:py-1">Assessments</TabsTrigger>
                <TabsTrigger value="session-data" suppressHydrationWarning className="text-xs sm:text-sm py-2 sm:py-1">Session Data Collection</TabsTrigger>
                <TabsTrigger value="progress" suppressHydrationWarning className="text-xs sm:text-sm py-2 sm:py-1">Progress Tracking</TabsTrigger>
              </TabsList>

              {/* AFLS Assessments Tab */}
              <TabsContent value="assessments" className="space-y-6" suppressHydrationWarning>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Assessment Results</CardTitle>
                        <CardDescription>View and manage assessment data for {selectedAssessmentType.toUpperCase()}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={filterDomain} onValueChange={setFilterDomain}>
                          <SelectTrigger className="w-48" suppressHydrationWarning>
                            <SelectValue placeholder="Filter by domain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Domains</SelectItem>
                            {aflsDomains.map((domain) => (
                              <SelectItem key={domain.id} value={domain.name}>
                                {domain.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-32" suppressHydrationWarning>
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="score">Score</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
              <div className="space-y-4">
                {filteredAssessments.map((assessment) => (
                  <Card key={assessment.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(assessment.status)}
                              <h3 className="font-semibold">{assessment.studentName}</h3>
                              <Badge variant="outline" className="text-xs">
                                {assessment.domain}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Skill Assessed</p>
                              <p className="font-medium">{assessment.skill}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Assessment Date</p>
                              <p className="font-medium">{assessment.date}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Assessor</p>
                              <p className="font-medium">{assessment.assessor}</p>
                            </div>
                          </div>

                          {assessment.notes && (
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground">Notes:</p>
                              <p className="text-sm">{assessment.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(assessment.score, assessment.maxScore)}`}>
                            {assessment.score}/{assessment.maxScore}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* VB-MAPP Milestones Section */}
          {selectedAssessmentType === 'vb_mapp' && selectedStudent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>VB-MAPP Milestones</CardTitle>
                    <CardDescription>Track VB-MAPP milestone progress by level and domain</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={filterDomain} onValueChange={setFilterDomain}>
                      <SelectTrigger className="w-48" suppressHydrationWarning>
                        <SelectValue placeholder="Filter by domain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Domains</SelectItem>
                        <SelectItem value="Mand">Mand</SelectItem>
                        <SelectItem value="Tact">Tact</SelectItem>
                        <SelectItem value="Listener">Listener</SelectItem>
                        <SelectItem value="VP/MTS">VP/MTS</SelectItem>
                        <SelectItem value="Play">Play</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Reading">Reading</SelectItem>
                        <SelectItem value="Writing">Writing</SelectItem>
                        <SelectItem value="LRFFC">LRFFC</SelectItem>
                        <SelectItem value="IV">IV</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                        <SelectItem value="Ling">Ling</SelectItem>
                        <SelectItem value="Math">Math</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {milestonesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <span className="ml-2">Loading milestones...</span>
                  </div>
                ) : milestonesError ? (
                  <div className="text-center py-8 text-red-500">
                    Error loading milestones: {milestonesError}
                  </div>
                ) : milestones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No VB-MAPP milestones found for this student. Upload an Excel file with VB-MAPP data to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Group milestones by level */}
                    {['LEVEL 1', 'LEVEL 2', 'LEVEL 3'].map(level => {
                      const levelMilestones = milestones.filter(m => m.level === level)
                      const filteredLevelMilestones = filterDomain === 'all' 
                        ? levelMilestones 
                        : levelMilestones.filter(m => m.domain === filterDomain)
                      
                      if (filteredLevelMilestones.length === 0) return null
                      
                      return (
                        <div key={level} className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                            {level}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredLevelMilestones.map((milestone) => (
                              <Card key={milestone.id} className="hover:shadow-md transition-all">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">
                                          {milestone.domain}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          #{milestone.milestone_number}
                                        </span>
                                      </div>
                                      <h4 className="font-medium text-sm mb-2">
                                        {milestone.milestone_description || `Milestone ${milestone.milestone_number}`}
                                      </h4>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      milestone.score && milestone.max_score 
                                        ? milestone.score >= milestone.max_score 
                                          ? 'text-green-600 bg-green-50' 
                                          : milestone.score > 0 
                                            ? 'text-yellow-600 bg-yellow-50'
                                            : 'text-red-600 bg-red-50'
                                        : 'text-gray-600 bg-gray-50'
                                    }`}>
                                      {milestone.score !== null && milestone.max_score !== null 
                                        ? `${milestone.score}/${milestone.max_score}` 
                                        : 'Not scored'}
                                    </div>
                                  </div>
                                  
                                  {milestone.notes && (
                                    <p className="text-xs text-muted-foreground mb-2">
                                      {milestone.notes}
                                    </p>
                                  )}
                                  
                                  {milestone.tester_name && (
                                    <p className="text-xs text-muted-foreground">
                                      Tester: {milestone.tester_name}
                                    </p>
                                  )}
                                  
                                  {milestone.test_date && (
                                    <p className="text-xs text-muted-foreground">
                                      Date: {new Date(milestone.test_date).toLocaleDateString()}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Document Uploads Section */}
          {selectedStudent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Uploaded Documents</CardTitle>
                    <CardDescription>View and manage uploaded assessment documents</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {uploadsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <span className="ml-2">Loading documents...</span>
                  </div>
                ) : uploadsError ? (
                  <div className="text-center py-8 text-red-500">
                    Error loading documents: {uploadsError}
                  </div>
                ) : uploads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No documents uploaded yet. Use the "Upload Session Data" button to upload Excel files.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uploads.map((upload) => (
                      <Card key={upload.id} className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{upload.file_name}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{upload.file_type}</span>
                                  <span>{(upload.file_size / 1024).toFixed(1)} KB</span>
                                  <span>{new Date(upload.created_at!).toLocaleDateString()}</span>
                                  <span className="capitalize">{upload.upload_source}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={upload.processing_status === 'completed' ? 'default' : 'secondary'}>
                                {upload.processing_status || 'Processing'}
                              </Badge>
                              <Button size="sm" variant="outline" asChild>
                                <a href={upload.file_url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          </div>
                          {upload.extracted_data && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Extracted Data:</p>
                              <pre className="text-xs text-gray-600 overflow-x-auto">
                                {JSON.stringify(upload.extracted_data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Session Data Collection Tab */}
        <TabsContent value="session-data" className="space-y-6" suppressHydrationWarning>
          <Card noHover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Session Data Collection</CardTitle>
                </div>
                
                {/* Assessment Type Selection */}
                <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Label htmlFor="assessment-type" className="text-sm font-medium">Assessment Type:</Label>
                    <Select value={selectedAssessmentType} onValueChange={setSelectedAssessmentType}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select assessment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="afls">AFLS</SelectItem>
                        <SelectItem value="ablls">ABLLS-R</SelectItem>
                        <SelectItem value="vb_mapp">VB-MAPP</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog open={isUploadDialogOpen} onOpenChange={(open) => {
                    if (open && !selectedStudent) {
                      alert('Please select a student first before uploading session data.')
                      return
                    }
                    setIsUploadDialogOpen(open)
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Session Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Upload Session Data</DialogTitle>
                        <DialogDescription>
                          Upload Excel or Word documents containing session data
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* File Upload Area */}
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                          <p className="text-xs text-gray-500">Excel (.xlsx, .xls) or Word (.docx, .doc) files</p>
                          {uploadedFile && (
                            <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                              <p className="text-sm text-green-800 font-medium">{uploadedFile.name}</p>
                              <p className="text-xs text-green-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                          )}
                          <input 
                            id="file-upload"
                            type="file" 
                            className="hidden" 
                            accept=".xlsx,.xls,.docx,.doc" 
                            onChange={handleFileSelect}
                          />
                        </div>

                        {/* Error Message */}
                        {uploadError && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-800">{uploadError}</p>
                          </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-4">
                          {/* Assessment Type Selection */}
                          <div>
                            <Label>Assessment Type *</Label>
                            <Select value={selectedAssessmentType} onValueChange={setSelectedAssessmentType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assessment type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="afls">AFLS (Assessment of Functional Living Skills)</SelectItem>
                                <SelectItem value="ablls">ABLLS-R (Assessment of Basic Language and Learning Skills)</SelectItem>
                                <SelectItem value="vb_mapp">VB-MAPP (Verbal Behavior Milestones Assessment)</SelectItem>
                                <SelectItem value="custom">Custom Assessment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Selected Student Display */}
                          <div>
                            <Label>Selected Student</Label>
                            <div className="p-3 bg-gray-50 border rounded-lg">
                              {selectedStudent ? (
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    {students.find(s => s.id === selectedStudent)?.profile_picture_url && (
                                      <img 
                                        src={students.find(s => s.id === selectedStudent)?.profile_picture_url} 
                                        alt={students.find(s => s.id === selectedStudent)?.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none'
                                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                                          if (nextElement) {
                                            nextElement.style.display = 'flex'
                                          }
                                        }}
                                      />
                                    )}
                                    <div 
                                      className="w-full h-full bg-blue-100 flex items-center justify-center" 
                                      style={{display: students.find(s => s.id === selectedStudent)?.profile_picture_url ? 'none' : 'flex'}}
                                    >
                                      <User className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                                  <div>
                                    <p className="font-medium text-sm">{students.find(s => s.id === selectedStudent)?.name}</p>
                                    <p className="text-xs text-gray-500">ID: {students.find(s => s.id === selectedStudent)?.student_id}</p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No student selected. Please select a student from the sidebar.</p>
                              )}
                            </div>
                          </div>

                          {/* Session Date */}
                          <div>
                            <Label>Session Date *</Label>
                            <Input 
                              type="date" 
                              value={uploadSessionDate}
                              onChange={(e) => setUploadSessionDate(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">Excel File Format</h4>
                          <p className="text-xs text-blue-700 mb-2">
                            Your Excel file should have columns: Goal, Performance, Notes, Date (optional)
                          </p>
                          <p className="text-xs text-blue-700">
                            <strong>Assessment Type:</strong> {selectedAssessmentType.toUpperCase()} - Data will be collected using {selectedAssessmentType === 'afls' ? 'Assessment of Functional Living Skills' : selectedAssessmentType === 'ablls' ? 'Assessment of Basic Language and Learning Skills' : selectedAssessmentType === 'vb_mapp' ? 'Verbal Behavior Milestones Assessment' : 'Custom Assessment'} framework.
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsUploadDialogOpen(false)}
                            disabled={isProcessingFile}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleUploadData}
                            disabled={!uploadedFile || !selectedStudent || isProcessingFile}
                          >
                            {isProcessingFile ? 'Processing...' : 'Upload Data'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>New Session Data Collection</DialogTitle>
                        <DialogDescription>
                          Record voice notes or manually enter session data for {students.find(s => s.id === selectedStudent)?.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Voice Recording Section */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Mic className="h-5 w-5" />
                              Voice Recording
                            </CardTitle>
                            <CardDescription>Record voice notes that will be transcribed to text</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Recording Controls */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                              {!isRecording ? (
                                <Button onClick={startRecording} className="flex items-center gap-2 w-full sm:w-auto">
                                  <Mic className="h-4 w-4" />
                                  Start Recording
                                </Button>
                              ) : (
                                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                                  {isPaused ? (
                                    <Button onClick={resumeRecording} variant="outline" className="w-full sm:w-auto">
                                      <Play className="h-4 w-4 mr-2" />
                                      Resume
                                    </Button>
                                  ) : (
                                    <Button onClick={pauseRecording} variant="outline" className="w-full sm:w-auto">
                                      <Pause className="h-4 w-4 mr-2" />
                                      Pause
                                    </Button>
                                  )}
                                  <Button onClick={stopRecording} variant="destructive" className="w-full sm:w-auto">
                                    <Square className="h-4 w-4 mr-2" />
                                    Stop
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Recording Status */}
                            {isRecording && (
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                  <span className="text-sm font-medium">
                                    {isPaused ? 'Recording Paused' : 'Recording...'}
                                  </span>
                                </div>
                                <div className="text-2xl font-mono text-gray-600">
                                  {formatTime(recordingTime)}
                                </div>
                              </div>
                            )}

                            {/* Audio Playback */}
                            {audioUrl && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">Recorded Audio:</span>
                                  <audio controls src={audioUrl} className="flex-1" />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={transcribeAudio} disabled={isTranscribing}>
                                    {isTranscribing ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Transcribing...
                                      </>
                                    ) : (
                                      <>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Transcribe Audio
                                      </>
                                    )}
                                  </Button>
                                  <Button onClick={clearRecording} variant="outline">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Transcription Result */}
                            {transcription && (
                              <div className="space-y-2">
                                <Label htmlFor="transcription">Transcribed Text:</Label>
                                <Textarea
                                  id="transcription"
                                  value={transcription}
                                  onChange={(e) => setTranscription(e.target.value)}
                                  rows={4}
                                  placeholder="Transcribed text will appear here..."
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Session Goals Selection */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Apply to Session Goals</CardTitle>
                            <CardDescription>Select which goals this session data applies to</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {goals.map(goal => (
                                <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex-1">
                                    <h4 className="font-medium">{goal.title}</h4>
                                    <p className="text-sm text-gray-600">{goal.domain}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => applyTranscriptionToNotes(goal.id)}
                                      disabled={!transcription}
                                    >
                                      Apply Notes
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* IEP Goals Data Collection */}
                {selectedStudent ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                      <Label className="text-base font-medium">IEP Goals Data Collection</Label>
                        {selectedAssessmentType === 'vb_mapp' && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            VB-MAPP Goals
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="date" 
                          className="w-40" 
                          value={sessionDate}
                          onChange={(e) => setSessionDate(e.target.value)}
                        />
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Set Session Date
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-6">
                      <Card className="border border-gray-200 shadow-sm h-full" noHover>
                          <CardHeader className="pb-3">
                          <CardTitle className="text-base">Goals</CardTitle>
                          <CardDescription>
                            Select a goal to record session data
                          </CardDescription>
                          <div className="mt-3">
                            <Input
                              placeholder="Search goals..."
                              value={goalSearchTerm}
                              onChange={(e) => setGoalSearchTerm(e.target.value)}
                            />
                          </div>
                          <div className="mt-3">
                            <Select value={goalFilterDomain} onValueChange={setGoalFilterDomain}>
                              <SelectTrigger>
                                <SelectValue placeholder="All domains" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All domains</SelectItem>
                                {Array.from(new Set(filteredGoals.map(goal => goal.domain))).map(domain => (
                                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          {goalsLoading ? (
                            <div className="p-4 text-sm text-gray-500">Loading goals...</div>
                          ) : goalsError ? (
                            <div className="p-4 text-sm text-red-500">Error loading goals: {goalsError}</div>
                          ) : filteredGoals.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500">No goals found</div>
                          ) : (
                            <div className="max-h-[400px] overflow-y-auto">
                              {filteredGoals.map((goal) => (
                                <button
                                  key={goal.id}
                                  onClick={() => setActiveGoalId(goal.id)}
                                  className={`w-full text-left px-4 py-3 border-l-4 transition-colors hover:bg-gray-50 ${
                                    activeGoalId === goal.id ? 'border-pink-500 bg-pink-50/60' : 'border-transparent'
                                  }`}
                                >
                                  <p className="text-sm font-medium text-gray-900 truncate">{goal.title}</p>
                                  <p className="text-xs text-muted-foreground truncate mt-1">{goal.domain}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-muted-foreground">Progress:</span>
                                    <span className="text-xs font-semibold text-pink-600">{goal.current_progress || 0}%</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        <Card className="border border-gray-200 shadow-sm min-h-[340px]">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{activeGoal?.title || 'Select a goal'}</CardTitle>
                                {activeGoal && (
                                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">{activeGoal.domain}</Badge>
                                    <span>Level {activeGoal.level}</span>
                                    <span>Target {activeGoal.target_percentage || 0}%</span>
                              </div>
                                )}
                              </div>
                              {activeGoal && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  Current {activeGoal.current_progress || 0}%
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            {activeGoal ? (
                              <Tabs value={goalDetailTab} onValueChange={setGoalDetailTab}>
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="collect">Collect Data</TabsTrigger>
                                  <TabsTrigger value="charts">Charts</TabsTrigger>
                                  <TabsTrigger value="stats">Stats</TabsTrigger>
                                </TabsList>
                                <TabsContent value="collect" className="space-y-4">
                              <div>
                                    <Label className="text-sm font-medium mb-2 block">Today's Performance</Label>
                                    <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                        variant={sessionData[activeGoal.id]?.performance === 'mastered' ? 'default' : 'outline'}
                                        className="flex-1 text-xs"
                                        onClick={() => handlePerformanceSelect(activeGoal.id, 'mastered')}
                                      >
                                        ✓ Met
                                  </Button>
                                  <Button 
                                    size="sm" 
                                        variant={sessionData[activeGoal.id]?.performance === 'partial' ? 'default' : 'outline'}
                                        className="flex-1 text-xs"
                                        onClick={() => handlePerformanceSelect(activeGoal.id, 'partial')}
                                  >
                                    ◐ Partial
                                  </Button>
                                  <Button 
                                    size="sm" 
                                        variant={sessionData[activeGoal.id]?.performance === 'not-met' ? 'default' : 'outline'}
                                        className="flex-1 text-xs"
                                        onClick={() => handlePerformanceSelect(activeGoal.id, 'not-met')}
                                  >
                                    ✗ Not Met
                                  </Button>
                                </div>
                              </div>
                              
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Label className="text-sm font-medium">Quick Notes</Label>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      if (!isRecording) {
                                        startRecording()
                                      } else {
                                        stopRecording()
                                        setTimeout(() => {
                                          transcribeAudio()
                                          setTimeout(() => {
                                                applyTranscriptionToNotes(activeGoal.id)
                                          }, 2500)
                                        }, 500)
                                      }
                                    }}
                                    title={isRecording ? "Stop recording" : "Record voice note"}
                                  >
                                    {isRecording ? (
                                      <MicOff className="h-3 w-3 text-red-500" />
                                    ) : (
                                      <Mic className="h-3 w-3 text-blue-500" />
                                    )}
                                  </Button>
                                </div>
                                <Textarea 
                                      placeholder="Add notes..."
                                      className="text-sm"
                                      rows={3}
                                      value={sessionData[activeGoal.id]?.notes || ''}
                                      onChange={(e) => handleNotesChange(activeGoal.id, e.target.value)}
                                />
                              </div>
                              
                                <Button 
                                  size="sm" 
                                    className="w-full"
                                    onClick={() => handleSaveSessionData(activeGoal.id)}
                                    disabled={!sessionData[activeGoal.id]?.performance}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Save Progress
                                </Button>
                                </TabsContent>
                                <TabsContent value="charts">
                                  <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
                                    Goal charts coming soon
                              </div>
                                </TabsContent>
                                <TabsContent value="stats">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Card noHover>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Logged</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-2xl font-semibold text-gray-900">8</p>
                                      </CardContent>
                                    </Card>
                                    <Card noHover>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Performance</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-2xl font-semibold text-gray-900">72%</p>
                                      </CardContent>
                                    </Card>
                            </div>
                                </TabsContent>
                              </Tabs>
                            ) : (
                              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                                Select a goal to begin collecting data.
                              </div>
                            )}
                          </CardContent>
                        </Card>
                    </div>
                    </div>
                    
                    {/* Voice Recording Section - Show when VB-MAPP is selected */}
                    {selectedAssessmentType === 'vb_mapp' && (
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Mic className="h-5 w-5" />
                            Voice Recording for VB-MAPP Assessment
                          </CardTitle>
                          <CardDescription>
                            Record voice notes during VB-MAPP assessment sessions
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Recording Controls */}
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {!isRecording ? (
                              <Button onClick={startRecording} className="flex items-center gap-2 w-full sm:w-auto">
                                <Mic className="h-4 w-4" />
                                Start Recording
                              </Button>
                            ) : (
                              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                                {isPaused ? (
                                  <Button onClick={resumeRecording} variant="outline" className="w-full sm:w-auto">
                                    <Play className="h-4 w-4 mr-2" />
                                    Resume
                                  </Button>
                                ) : (
                                  <Button onClick={pauseRecording} variant="outline" className="w-full sm:w-auto">
                                    <Pause className="h-4 w-4 mr-2" />
                                    Pause
                                  </Button>
                                )}
                                <Button onClick={stopRecording} variant="destructive" className="w-full sm:w-auto">
                                  <Square className="h-4 w-4 mr-2" />
                                  Stop
                                </Button>
                              </div>
                            )}
                            </div>

                          {/* Recording Status */}
                          {isRecording && (
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">
                                  {isPaused ? 'Recording Paused' : 'Recording...'}
                                </span>
                              </div>
                              <div className="text-2xl font-mono text-gray-600">
                                {formatTime(recordingTime)}
                              </div>
                            </div>
                          )}

                          {/* Audio Playback */}
                          {audioUrl && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Recorded Audio:</span>
                                <audio controls src={audioUrl} className="flex-1" />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={transcribeAudio} disabled={isTranscribing}>
                                  {isTranscribing ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Transcribing...
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Transcribe Audio
                                    </>
                                  )}
                                </Button>
                                <Button onClick={clearRecording} variant="outline">
                                  Clear Recording
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Transcription Results */}
                          {transcription && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Transcription:</Label>
                              <Textarea 
                                value={transcription}
                                onChange={(e) => setTranscription(e.target.value)}
                                placeholder="Transcribed text will appear here..."
                                rows={4}
                                className="w-full"
                              />
                              <div className="flex gap-2">
                                <Button onClick={saveTranscription}>
                                  Save Transcription
                                </Button>
                                <Button onClick={() => setTranscription('')} variant="outline">
                                  Clear
                                </Button>
                              </div>
                            </div>
                          )}
                          </CardContent>
                        </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Selected</h3>
                    <p className="text-gray-600 mb-4">Please select a student from the sidebar to begin collecting session data.</p>
                    <div className="text-sm text-gray-500">
                      <p>Once you select a student, you&apos;ll be able to:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Track performance on IEP goals</li>
                        <li>• Add session notes</li>
                        <li>• Save data for each goal</li>
                        <li>• Upload session documents</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-6" suppressHydrationWarning>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Assessment Overview
                </CardTitle>
                <CardDescription>Summary of assessment progress across domains</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aflsDomains.map((domain) => {
                    const domainAssessments = mockAssessments.filter(a => a.domain === domain.name)
                    const avgScore = domainAssessments.length > 0 
                      ? domainAssessments.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / domainAssessments.length
                      : 0
                    
                    return (
                      <div key={domain.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{domain.name}</h4>
                          <p className="text-xs text-muted-foreground">{domainAssessments.length} assessments</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {Math.round(avgScore * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Average</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest assessment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAssessments.slice(0, 5).map((assessment) => (
                    <div key={assessment.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{assessment.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {assessment.skill} - {assessment.date}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(assessment.score, assessment.maxScore)}`}>
                        {assessment.score}/{assessment.maxScore}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
          </>
        ) : (
          <div className="flex-1 space-y-6">
            {/* Header - Simplified */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">Data Collection</h1>
                <p className="text-sm text-gray-600 mt-1">Select a student to begin tracking progress</p>
              </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="assessments" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3" suppressHydrationWarning>
                <TabsTrigger value="assessments" suppressHydrationWarning>AFLS Assessments</TabsTrigger>
                <TabsTrigger value="session-data" suppressHydrationWarning>Session Data Collection</TabsTrigger>
                <TabsTrigger value="progress" suppressHydrationWarning>Progress Tracking</TabsTrigger>
              </TabsList>

              {/* AFLS Assessments Tab */}
              <TabsContent value="assessments" className="space-y-6" suppressHydrationWarning>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Please select a student from the sidebar to view and edit their information.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Session Data Collection Tab */}
              <TabsContent value="session-data" className="space-y-6" suppressHydrationWarning>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Please select a student from the sidebar to view and edit their information.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Progress Tracking Tab */}
              <TabsContent value="progress" className="space-y-6" suppressHydrationWarning>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Please select a student from the sidebar to view and edit their information.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

      {/* New Assessment Dialog */}
      <Dialog open={isAssessmentDialogOpen} onOpenChange={setIsAssessmentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New AFLS Assessment</DialogTitle>
            <DialogDescription>
              Record a new assessment for a student
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student">Student</Label>
                <Select value={assessmentForm.studentId} onValueChange={(value) => setAssessmentForm(prev => ({ ...prev, studentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.student_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Assessment Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={assessmentForm.date}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Select value={assessmentForm.domain} onValueChange={(value) => setAssessmentForm(prev => ({ ...prev, domain: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {aflsDomains.map((domain) => (
                      <SelectItem key={domain.id} value={domain.name}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="skill">Skill</Label>
                <Input
                  id="skill"
                  value={assessmentForm.skill}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, skill: e.target.value }))}
                  placeholder="Enter skill being assessed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="score">Score</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max={assessmentForm.maxScore}
                  value={assessmentForm.score}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div>
                <Label htmlFor="maxScore">Maximum Score</Label>
                <Input
                  id="maxScore"
                  type="number"
                  value={assessmentForm.maxScore}
                  onChange={(e) => setAssessmentForm(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 10 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={assessmentForm.notes}
                onChange={(e) => setAssessmentForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add assessment notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAssessmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssessmentSubmit}>
                Save Assessment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

export default memo(DataCollectionContent)

