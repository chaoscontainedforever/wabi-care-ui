"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Target, 
  User, 
  Save,
  FileText,
  GraduationCap,
  Brain,
  Heart,
  MessageSquare,
  Activity,
  Users,
  Trash2,
  CheckCircle,
  Clock,
  Upload,
  FileSpreadsheet,
  File,
  Link,
  Sparkles,
  Wand2,
  RefreshCw,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Calendar,
  Folder,
  FileText as DocumentIcon,
  Image,
  FileSpreadsheet as SpreadsheetIcon,
  ExternalLink,
  Download as DownloadIcon,
  Settings,
  LogOut,
  User as UserIcon,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

// Type definitions
interface Student {
  id: string
  name: string
  studentId: string
  grade: string
  age: string
  disability: string
  teacher: string
  lastIEP: string
  status: string
  profilePicture?: string
}

interface StudentDocument {
  id: string
  title: string
  type: 'assessment' | 'report' | 'evaluation' | 'progress' | 'other'
  fileType: 'pdf' | 'docx' | 'xlsx' | 'image' | 'txt'
  uploadDate: string
  uploadedBy: string
  description?: string
  size: string
  url?: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'BCBA' | 'Teacher' | 'Administrator' | 'Parent'
  avatar?: string
  school?: string
  department?: string
  lastLogin: string
}

interface Goal {
  id: string
  title: string
  description: string
  domain: string
  level: string
  type: string
  objectives: string[]
  measurement: string
  accommodations: string
  customDescription?: string
  customObjectives?: string[]
  customMeasurement?: string
  customAccommodations?: string
  targetDate?: string
  progress?: number
}

interface IEPData {
  student: Student | null
  goals: Goal[]
  presentLevels: string
  accommodations: string
  modifications: string
  services: string
  placement: string
  startDate: string
  endDate: string
  reviewDate: string
  teamMembers: string[]
  // Traditional IEP sections
  studentInfo: {
    studentName: string
    studentId: string
    dateOfBirth: string
    grade: string
    school: string
    parentGuardian: string
    parentPhone: string
    parentEmail: string
  }
  plaaFP: {
    academicAchievement: string
    functionalPerformance: string
    strengths: string
    needs: string
    parentConcerns: string
    assessmentResults: string
  }
  specialFactors: {
    behavior: string
    limitedEnglish: string
    blindness: string
    deafness: string
    assistiveTechnology: string
    communication: string
  }
  measurableGoals: {
    academicGoals: Goal[]
    functionalGoals: Goal[]
    behavioralGoals: Goal[]
    transitionGoals: Goal[]
  }
  servicesAndSupports: {
    specialEducation: string[]
    relatedServices: string[]
    supplementaryAids: string[]
    programModifications: string[]
    supportsForPersonnel: string[]
  }
  placement: {
    placementType: string
    location: string
    justification: string
    timeInGeneralEducation: string
  }
  transitionServices: {
    postSecondaryGoals: string
    transitionServices: string[]
    courseOfStudy: string
    agencyResponsibilities: string
  }
  evaluationSchedule: {
    nextEvaluationDate: string
    evaluationType: string
    evaluationAreas: string[]
  }
}

interface UploadedDocument {
  id: string
  name: string
  type: 'excel' | 'word' | 'google-drive' | 'onedrive'
  url?: string
  file?: File
  status: 'uploading' | 'processing' | 'completed' | 'error'
  extractedGoals?: Goal[]
  uploadedAt: Date
}

interface AIRecommendation {
  id: string
  title: string
  description: string
  domain: string
  confidence: number
  reasoning: string
  basedOn: string[]
  source: 'document' | 'student-profile' | 'curriculum' | 'best-practices'
}

// Mock data for students
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Emma Johnson",
    studentId: "EJ001",
    grade: "3rd Grade",
    age: "8 years old",
    disability: "Autism Spectrum Disorder",
    teacher: "Ms. Sarah Wilson",
    lastIEP: "2024-01-15",
    status: "Active",
    profilePicture: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2",
    name: "Michael Chen",
    studentId: "MC002",
    grade: "2nd Grade",
    age: "7 years old",
    disability: "ADHD",
    teacher: "Mr. David Rodriguez",
    lastIEP: "2024-01-10",
    status: "Active",
    profilePicture: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Sarah Williams",
    studentId: "SW003",
    grade: "4th Grade",
    age: "9 years old",
    disability: "Learning Disability",
    teacher: "Ms. Jennifer Smith",
    lastIEP: "2023-12-20",
    status: "Active",
    profilePicture: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "4",
    name: "David Rodriguez",
    studentId: "DR004",
    grade: "1st Grade",
    age: "6 years old",
    disability: "Speech and Language Impairment",
    teacher: "Ms. Lisa Brown",
    lastIEP: "2024-01-05",
    status: "Active",
    profilePicture: "https://i.pravatar.cc/150?img=4"
  }
]

// Mock current user data
const currentUser: User = {
  id: "user1",
  name: "Dr. Sarah Wilson",
  email: "sarah.wilson@school.edu",
  role: "BCBA",
  avatar: "/avatars/sarah-wilson.jpg",
  school: "Riverside Elementary School",
  department: "Special Education",
  lastLogin: "2024-01-15T09:30:00Z"
}

// Mock document data for students
const mockStudentDocuments: Record<string, StudentDocument[]> = {
  "1": [ // Emma Johnson
    {
      id: "doc1",
      title: "VB-MAPP Assessment Results",
      type: "assessment",
      fileType: "pdf",
      uploadDate: "2024-01-10",
      uploadedBy: "Ms. Sarah Wilson",
      description: "Comprehensive VB-MAPP assessment showing current skill levels across all domains",
      size: "2.3 MB"
    },
    {
      id: "doc2",
      title: "Behavioral Observation Report",
      type: "report",
      fileType: "docx",
      uploadDate: "2024-01-08",
      uploadedBy: "Ms. Sarah Wilson",
      description: "Detailed behavioral observations from classroom and playground settings",
      size: "1.1 MB"
    },
    {
      id: "doc3",
      title: "Speech Therapy Progress Notes",
      type: "progress",
      fileType: "pdf",
      uploadDate: "2024-01-05",
      uploadedBy: "Ms. Jennifer Adams",
      description: "Monthly progress notes from speech therapy sessions",
      size: "856 KB"
    },
    {
      id: "doc4",
      title: "Parent Input Form",
      type: "other",
      fileType: "pdf",
      uploadDate: "2024-01-03",
      uploadedBy: "Mrs. Johnson",
      description: "Parent concerns and input for IEP development",
      size: "445 KB"
    }
  ],
  "2": [ // Michael Chen
    {
      id: "doc5",
      title: "ADHD Evaluation Report",
      type: "evaluation",
      fileType: "pdf",
      uploadDate: "2024-01-12",
      uploadedBy: "Dr. Robert Kim",
      description: "Comprehensive ADHD evaluation with recommendations",
      size: "3.2 MB"
    },
    {
      id: "doc6",
      title: "Academic Performance Data",
      type: "assessment",
      fileType: "xlsx",
      uploadDate: "2024-01-09",
      uploadedBy: "Mr. David Rodriguez",
      description: "Quarterly academic assessments and progress tracking",
      size: "1.8 MB"
    },
    {
      id: "doc7",
      title: "Occupational Therapy Report",
      type: "report",
      fileType: "pdf",
      uploadDate: "2024-01-07",
      uploadedBy: "Ms. Maria Garcia",
      description: "OT assessment and intervention recommendations",
      size: "1.5 MB"
    }
  ],
  "3": [ // Sarah Williams
    {
      id: "doc8",
      title: "Learning Disability Assessment",
      type: "evaluation",
      fileType: "pdf",
      uploadDate: "2024-01-11",
      uploadedBy: "Dr. Lisa Thompson",
      description: "Comprehensive LD evaluation with specific learning profile",
      size: "4.1 MB"
    },
    {
      id: "doc9",
      title: "Reading Intervention Progress",
      type: "progress",
      fileType: "docx",
      uploadDate: "2024-01-06",
      uploadedBy: "Ms. Jennifer Smith",
      description: "Weekly progress tracking for reading intervention program",
      size: "2.2 MB"
    },
    {
      id: "doc10",
      title: "Math Assessment Results",
      type: "assessment",
      fileType: "pdf",
      uploadDate: "2024-01-04",
      uploadedBy: "Ms. Jennifer Smith",
      description: "Standardized math assessment with detailed analysis",
      size: "1.7 MB"
    }
  ],
  "4": [ // David Rodriguez
    {
      id: "doc11",
      title: "Speech and Language Evaluation",
      type: "evaluation",
      fileType: "pdf",
      uploadDate: "2024-01-13",
      uploadedBy: "Ms. Patricia Lee",
      description: "Comprehensive SLP evaluation with communication goals",
      size: "2.8 MB"
    },
    {
      id: "doc12",
      title: "Early Intervention Report",
      type: "report",
      fileType: "pdf",
      uploadDate: "2024-01-02",
      uploadedBy: "Ms. Lisa Brown",
      description: "Early intervention services and family support plan",
      size: "1.9 MB"
    },
    {
      id: "doc13",
      title: "Social Skills Assessment",
      type: "assessment",
      fileType: "docx",
      uploadDate: "2023-12-28",
      uploadedBy: "Ms. Lisa Brown",
      description: "Social skills evaluation and peer interaction observations",
      size: "1.3 MB"
    }
  ]
}

// Goal Bank data (same as in Goal Bank)
const goalBank: Goal[] = [
  {
    id: "1",
    title: "Reading Comprehension - Main Idea",
    description: "Student will identify the main idea in a grade-level text with 80% accuracy across 3 consecutive sessions",
    domain: "academic",
    level: "Elementary",
    type: "Annual Goal",
    objectives: [
      "Identify key details in text",
      "Distinguish between main idea and supporting details",
      "Summarize text in own words"
    ],
    measurement: "Teacher-created assessments, standardized tests",
    accommodations: "Extended time, visual supports, audio support"
  },
  {
    id: "2",
    title: "Social Interaction - Peer Engagement",
    description: "Student will initiate and maintain appropriate social interactions with peers during structured activities",
    domain: "social",
    level: "Elementary",
    type: "Annual Goal",
    objectives: [
      "Initiate conversations with peers",
      "Maintain eye contact during interactions",
      "Use appropriate social skills in group settings"
    ],
    measurement: "Daily observations, peer feedback, social skills checklist",
    accommodations: "Social stories, peer modeling, visual cues"
  },
  {
    id: "3",
    title: "Math Problem Solving - Two-Step Problems",
    description: "Student will solve two-step word problems involving addition and subtraction with 85% accuracy",
    domain: "academic",
    level: "Elementary",
    type: "Annual Goal",
    objectives: [
      "Identify key information in word problems",
      "Choose appropriate operations",
      "Show work clearly and check answers"
    ],
    measurement: "Weekly math assessments, teacher observations",
    accommodations: "Calculator, visual aids, step-by-step guides"
  },
  {
    id: "4",
    title: "Behavioral Regulation - Coping Strategies",
    description: "Student will use appropriate coping strategies when frustrated or overwhelmed",
    domain: "behavioral",
    level: "Elementary",
    type: "Annual Goal",
    objectives: [
      "Identify emotional triggers",
      "Use deep breathing techniques",
      "Request breaks when needed"
    ],
    measurement: "Daily behavior tracking, teacher reports, self-monitoring",
    accommodations: "Calm down corner, sensory tools, visual reminders"
  },
  {
    id: "5",
    title: "Communication - Expressive Language",
    description: "Student will use 3-4 word phrases to express wants and needs",
    domain: "communication",
    level: "Preschool",
    type: "Annual Goal",
    objectives: [
      "Use single words to request items",
      "Combine 2-3 words in phrases",
      "Use appropriate grammar structures"
    ],
    measurement: "Language samples, communication logs, standardized assessments",
    accommodations: "AAC device, visual supports, modeling"
  }
]

const goalDomains = [
  { id: "academic", name: "Academic", icon: GraduationCap, color: "bg-blue-100 text-blue-800" },
  { id: "behavioral", name: "Behavioral", icon: Brain, color: "bg-red-100 text-red-800" },
  { id: "social", name: "Social", icon: Heart, color: "bg-green-100 text-green-800" },
  { id: "communication", name: "Communication", icon: MessageSquare, color: "bg-purple-100 text-purple-800" },
  { id: "motor", name: "Motor Skills", icon: Activity, color: "bg-orange-100 text-orange-800" },
  { id: "adaptive", name: "Adaptive", icon: Users, color: "bg-indigo-100 text-indigo-800" }
]

export function IEPBuilderContent() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("All")
  const [activeTab, setActiveTab] = useState("student")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  const [iepData, setIepData] = useState<IEPData>({
    student: null,
    goals: [],
    presentLevels: "",
    accommodations: "",
    modifications: "",
    services: "",
    placement: "",
    startDate: "",
    endDate: "",
    reviewDate: "",
    teamMembers: [],
    studentInfo: {
      studentName: "",
      studentId: "",
      dateOfBirth: "",
      grade: "",
      school: "",
      parentGuardian: "",
      parentPhone: "",
      parentEmail: ""
    },
    plaaFP: {
      academicAchievement: "",
      functionalPerformance: "",
      strengths: "",
      needs: "",
      parentConcerns: "",
      assessmentResults: ""
    },
    specialFactors: {
      behavior: "",
      limitedEnglish: "",
      blindness: "",
      deafness: "",
      assistiveTechnology: "",
      communication: ""
    },
    measurableGoals: {
      academicGoals: [],
      functionalGoals: [],
      behavioralGoals: [],
      transitionGoals: []
    },
    servicesAndSupports: {
      specialEducation: [],
      relatedServices: [],
      supplementaryAids: [],
      programModifications: [],
      supportsForPersonnel: []
    },
    placement: {
      placementType: "",
      location: "",
      justification: "",
      timeInGeneralEducation: ""
    },
    transitionServices: {
      postSecondaryGoals: "",
      transitionServices: [],
      courseOfStudy: "",
      agencyResponsibilities: ""
    },
    evaluationSchedule: {
      nextEvaluationDate: "",
      evaluationType: "",
      evaluationAreas: []
    }
  })

  const filteredGoals = goalBank.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDomain = selectedDomain === "All" || goal.domain === selectedDomain
    return matchesSearch && matchesDomain
  })

  const getDomainInfo = (domainId: string) => {
    return goalDomains.find(d => d.id === domainId) || goalDomains[0]
  }

  const getDomainIcon = (domainId: string) => {
    const domain = getDomainInfo(domainId)
    const Icon = domain.icon
    return <Icon className="h-4 w-4" />
  }


  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student)
    setIepData(prev => ({ ...prev, student }))
    setActiveTab("goals")
  }

  const handleGoalSelect = (goal: Goal) => {
    if (!selectedGoals.find(g => g.id === goal.id)) {
      const newGoal: Goal = {
        ...goal,
        customDescription: goal.description,
        customObjectives: [...goal.objectives],
        customMeasurement: goal.measurement,
        customAccommodations: goal.accommodations,
        targetDate: "",
        progress: 0
      }
      setSelectedGoals([...selectedGoals, newGoal])
      setIepData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }))
    }
  }

  const handleGoalRemove = (goalId: string) => {
    setSelectedGoals(selectedGoals.filter(g => g.id !== goalId))
    setIepData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== goalId) }))
  }

  const handleGoalUpdate = (goalId: string, field: keyof Goal, value: string | number | string[]) => {
    const updatedGoals = selectedGoals.map(goal => 
      goal.id === goalId ? { ...goal, [field]: value } : goal
    )
    setSelectedGoals(updatedGoals)
    setIepData(prev => ({ ...prev, goals: updatedGoals }))
  }

  const handleSaveIEP = () => {
    console.log("Saving IEP:", iepData)
    // Here you would implement the actual save functionality
    alert("IEP saved successfully!")
  }

  // Document upload handlers
  const handleFileUpload = async (file: File, type: 'excel' | 'word') => {
    const documentId = `doc_${Date.now()}`
    const newDocument: UploadedDocument = {
      id: documentId,
      name: file.name,
      type,
      file,
      status: 'uploading',
      uploadedAt: new Date()
    }

    setUploadedDocuments(prev => [...prev, newDocument])

    // Simulate file processing
    setTimeout(() => {
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'processing' }
            : doc
        )
      )
    }, 1000)

    // Simulate goal extraction
    setTimeout(() => {
      const extractedGoals: Goal[] = [
        {
          id: `extracted_${Date.now()}_1`,
          title: "Reading Comprehension - Extracted from Document",
          description: "Student will demonstrate reading comprehension skills as outlined in uploaded assessment",
          domain: "academic",
          level: "Elementary",
          type: "Annual Goal",
          objectives: ["Demonstrate understanding of text", "Answer comprehension questions"],
          measurement: "Assessment results from uploaded document",
          accommodations: "Extended time, visual supports"
        }
      ]

      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'completed', extractedGoals }
            : doc
        )
      )
    }, 3000)
  }

  const handleCloudLink = (url: string, type: 'google-drive' | 'onedrive') => {
    const documentId = `cloud_${Date.now()}`
    const newDocument: UploadedDocument = {
      id: documentId,
      name: `Cloud Document - ${type}`,
      type,
      url,
      status: 'processing',
      uploadedAt: new Date()
    }

    setUploadedDocuments(prev => [...prev, newDocument])

    // Simulate cloud document processing
    setTimeout(() => {
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'completed', extractedGoals: [] }
            : doc
        )
      )
    }, 2000)
  }

  // AI recommendation handlers
  const generateAIRecommendations = async () => {
    if (!selectedStudent) return

    setIsGeneratingRecommendations(true)

    // Simulate AI processing
    setTimeout(() => {
      const recommendations: AIRecommendation[] = [
        {
          id: `ai_rec_${Date.now()}_1`,
          title: "Social Communication - Peer Interaction",
          description: "Based on student's autism diagnosis and grade level, recommend focusing on peer interaction skills",
          domain: "social",
          confidence: 0.92,
          reasoning: "Student shows difficulty with peer interactions based on assessment data. This goal aligns with evidence-based practices for students with ASD.",
          basedOn: ["Student disability profile", "Grade level standards", "Assessment results"],
          source: "student-profile"
        },
        {
          id: `ai_rec_${Date.now()}_2`,
          title: "Academic - Math Problem Solving",
          description: "Recommend math problem-solving goals based on grade-level expectations and student's current abilities",
          domain: "academic",
          confidence: 0.87,
          reasoning: "Student is in 3rd grade and needs support with multi-step math problems. This aligns with grade-level standards.",
          basedOn: ["Grade level", "Academic assessment", "Curriculum standards"],
          source: "curriculum"
        },
        {
          id: `ai_rec_${Date.now()}_3`,
          title: "Behavioral - Self-Regulation",
          description: "Self-regulation strategies for managing frustration and maintaining focus during academic tasks",
          domain: "behavioral",
          confidence: 0.89,
          reasoning: "Students with ADHD often benefit from explicit self-regulation training. This is a high-impact intervention.",
          basedOn: ["Student disability", "Behavioral observations", "Best practices"],
          source: "best-practices"
        }
      ]

      setAiRecommendations(recommendations)
      setIsGeneratingRecommendations(false)
    }, 3000)
  }

  const acceptRecommendation = (recommendation: AIRecommendation) => {
    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      title: recommendation.title,
      description: recommendation.description,
      domain: recommendation.domain,
      level: selectedStudent?.grade || "Elementary",
      type: "Annual Goal",
      objectives: ["Objective 1", "Objective 2", "Objective 3"],
      measurement: "Teacher observations and assessments",
      accommodations: "As needed per student profile"
    }

    setSelectedGoals(prev => [...prev, newGoal])
    setIepData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }))
  }

  const rejectRecommendation = (recommendationId: string) => {
    setAiRecommendations(prev => prev.filter(rec => rec.id !== recommendationId))
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
      {/* Student Selection Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-full lg:w-72'} flex-shrink-0 transition-all duration-300`}>
        <Card className="sticky top-4" noHover>
          {!isSidebarCollapsed ? (
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Select Student</CardTitle>
                  <CardDescription>Choose a student to create an IEP for</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarCollapsed(false)}
                className="h-8 w-8 p-0 mb-4"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="flex flex-col items-center space-y-3">
                {mockStudents.slice(0, 3).map((student) => (
                  <div
                    key={student.id}
                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={() => {
                      setSelectedStudent(student)
                      setIsSidebarCollapsed(false)
                    }}
                    title={student.name}
                  >
                    <img 
                      src={student.profilePicture} 
                      alt={student.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: 'none'}}>
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                ))}
                {mockStudents.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium">
                    +{mockStudents.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
          {!isSidebarCollapsed && (
            <CardContent className="p-0">
            <div className="space-y-1">
              {mockStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-3 cursor-pointer transition-all hover:bg-gray-50 border-l-4 ${
                    selectedStudent?.id === student.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={student.profilePicture} 
                        alt={student.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling.style.display = 'flex'
                        }}
                      />
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: 'none'}}>
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate leading-tight">{student.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">ID: {student.studentId}</p>
                      <p className="text-xs text-muted-foreground truncate">{student.grade} • {student.disability}</p>
                    </div>
                    {selectedStudent?.id === student.id && (
                      <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-4 lg:space-y-6">
        {/* Header - Traditional IEP Style */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Individualized Education Program (IEP)</h1>
            <p className="text-sm text-gray-600 mt-1">Complete all sections below to create a comprehensive IEP</p>
        </div>
        <div className="flex items-center gap-2">
            {/* AI Help */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateAIRecommendations}
              disabled={!selectedStudent || isGeneratingRecommendations}
            >
              {isGeneratingRecommendations ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              AI Help
          </Button>
            
            {/* Save IEP */}
            <Button onClick={handleSaveIEP} disabled={!selectedStudent} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save IEP
          </Button>
        </div>
        </div>
        
        {/* Student Overview Header */}
        {selectedStudent && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center space-x-6">
              {/* Student Photo */}
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={selectedStudent.profilePicture} 
                  alt={selectedStudent.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', e.currentTarget.src)
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'flex'
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', selectedStudent.profilePicture)
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center" style={{display: 'none'}}>
                  <User className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              
              {/* Student Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedStudent.name}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>ID: {selectedStudent.studentId}</span>
                  <span>•</span>
                  <span>{selectedStudent.grade}</span>
                  <span>•</span>
                  <span>{selectedStudent.age}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{selectedStudent.disability}</p>
                  <p>Teacher: {selectedStudent.teacher}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export IEP
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Documents
                </Button>
                <Button onClick={() => setIsDocumentDialogOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* IEP Header Information */}
        {selectedStudent ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Student Name</label>
              <p className="text-sm font-medium text-gray-900">{selectedStudent.name}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Student ID</label>
              <p className="text-sm font-medium text-gray-900">{selectedStudent.studentId}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Grade</label>
              <p className="text-sm font-medium text-gray-900">{selectedStudent.grade}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Disability</label>
              <p className="text-sm font-medium text-gray-900">{selectedStudent.disability}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Please select a student</strong> to begin creating their IEP. Use the Student Selection tab below.
            </p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-2 ${selectedStudent ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedStudent ? 'bg-green-100' : 'bg-gray-100'}`}>
            {selectedStudent ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          </div>
          <span className="text-sm font-medium">Select Student</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-200"></div>
        <div className={`flex items-center space-x-2 ${selectedGoals.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedGoals.length > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
            {selectedGoals.length > 0 ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          </div>
          <span className="text-sm font-medium">Select Goals</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-200"></div>
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Customize & Save</span>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto sm:h-10 bg-gray-50">
          <TabsTrigger value="student" className="text-xs py-2 sm:py-1">1. Student Info</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs py-2 sm:py-1">2. Documents</TabsTrigger>
          <TabsTrigger value="plaaFP" className="text-xs py-2 sm:py-1">3. PLAAFP</TabsTrigger>
          <TabsTrigger value="goals" className="text-xs py-2 sm:py-1">4. Goals</TabsTrigger>
          <TabsTrigger value="services" className="text-xs py-2 sm:py-1">5. Services</TabsTrigger>
          <TabsTrigger value="placement" className="text-xs py-2 sm:py-1">6. Placement</TabsTrigger>
          <TabsTrigger value="review" className="text-xs py-2 sm:py-1">7. Review</TabsTrigger>
        </TabsList>

        {/* Student Information Tab */}
        <TabsContent value="student" className="space-y-6">
          {selectedStudent ? (
          <Card>
            <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          {selectedStudent.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          Student ID: {selectedStudent.studentId} • Grade: {selectedStudent.grade} • Disability: {selectedStudent.disability}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    </div>
            </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="studentName">Student Name *</Label>
                          <Input 
                            id="studentName" 
                            value={iepData.studentInfo.studentName || selectedStudent.name}
                            onChange={(e) => setIepData(prev => ({ 
                              ...prev, 
                              studentInfo: { ...prev.studentInfo, studentName: e.target.value }
                            }))}
                          />
                          </div>
                          <div>
                          <Label htmlFor="studentId">Student ID *</Label>
                          <Input 
                            id="studentId" 
                            value={iepData.studentInfo.studentId || selectedStudent.studentId}
                            onChange={(e) => setIepData(prev => ({ 
                              ...prev, 
                              studentInfo: { ...prev.studentInfo, studentId: e.target.value }
                            }))}
                          />
                          </div>
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input 
                            id="dateOfBirth" 
                            type="date"
                            value={iepData.studentInfo.dateOfBirth}
                            onChange={(e) => setIepData(prev => ({ 
                              ...prev, 
                              studentInfo: { ...prev.studentInfo, dateOfBirth: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="grade">Grade *</Label>
                          <Input 
                            id="grade" 
                            value={iepData.studentInfo.grade || selectedStudent.grade}
                            onChange={(e) => setIepData(prev => ({ 
                              ...prev, 
                              studentInfo: { ...prev.studentInfo, grade: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="school">School *</Label>
                          <Input 
                            id="school" 
                            value={iepData.studentInfo.school}
                            onChange={(e) => setIepData(prev => ({ 
                              ...prev, 
                              studentInfo: { ...prev.studentInfo, school: e.target.value }
                            }))}
                            placeholder="Enter school name"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Parent/Guardian Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Parent/Guardian Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="parentGuardian">Parent/Guardian Name *</Label>
                          <Input 
                            id="parentGuardian" 
                            value={iepData.studentInfo.parentGuardian}
                            onChange={(e) => setIepData(prev => ({ 
                              ...prev, 
                              studentInfo: { ...prev.studentInfo, parentGuardian: e.target.value }
                            }))}
                            placeholder="Enter parent/guardian name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="parentPhone">Phone Number *</Label>
                          <Input 
                            id="parentPhone" 
                            value={iepData.studentInfo.parentPhone}
                            onChange={(e) => setIepData(prev => ({ 
                              ...prev, 
                              studentInfo: { ...prev.studentInfo, parentPhone: e.target.value }
                            }))}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="parentEmail">Email Address</Label>
                          <Input 
                            id="parentEmail" 
                            type="email"
                            value={iepData.studentInfo.parentEmail}
                            onChange={(e) => setIepData(prev => ({ 
                              ...prev, 
                              studentInfo: { ...prev.studentInfo, parentEmail: e.target.value }
                            }))}
                            placeholder="parent@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* IEP Meeting Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        IEP Meeting Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="startDate">IEP Start Date *</Label>
                          <Input 
                            id="startDate" 
                            type="date"
                            value={iepData.startDate}
                            onChange={(e) => setIepData(prev => ({ ...prev, startDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">IEP End Date *</Label>
                          <Input 
                            id="endDate" 
                            type="date"
                            value={iepData.endDate}
                            onChange={(e) => setIepData(prev => ({ ...prev, endDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="reviewDate">Next Review Date *</Label>
                          <Input 
                            id="reviewDate" 
                            type="date"
                            value={iepData.reviewDate}
                            onChange={(e) => setIepData(prev => ({ ...prev, reviewDate: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Student Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Additional Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Current Disability Classification</Label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium">{selectedStudent.disability}</p>
                          </div>
                        </div>
                        <div>
                          <Label>Current Grade Level</Label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium">{selectedStudent.grade}</p>
                          </div>
                        </div>
                        <div>
                          <Label>Current Teacher</Label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium">{selectedStudent.teacher}</p>
                          </div>
                        </div>
                        <div>
                          <Label>Student Status</Label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <Badge variant={selectedStudent.status === 'Active' ? 'default' : 'secondary'}>
                              {selectedStudent.status}
                        </Badge>
                      </div>
                      </div>
                        <div className="md:col-span-2">
                          <Label>Previous IEP Information</Label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Last IEP: {selectedStudent.lastIEP || 'No previous IEP found'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Age: {selectedStudent.age} years old
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    </CardContent>
                  </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Please select a student from the sidebar to view and edit their information.
                </p>
            </CardContent>
          </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {selectedStudent ? (
            <div className="space-y-6">
              {/* Documents Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <Folder className="h-6 w-6" />
                        Student Documents - {selectedStudent.name}
                      </CardTitle>
                      <CardDescription>
                        Review and manage all documents for {selectedStudent.name} (ID: {selectedStudent.studentId})
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                      <Button variant="outline" size="sm">
                        <Folder className="h-4 w-4 mr-2" />
                        Organize
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockStudentDocuments[selectedStudent.id]?.length > 0 ? (
                  mockStudentDocuments[selectedStudent.id].map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <CardContent className="p-5">
                        {/* Header with icon and title */}
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="flex-shrink-0 mt-1">
                            {doc.fileType === 'pdf' ? (
                              <DocumentIcon className="h-8 w-8 text-red-600" />
                            ) : doc.fileType === 'docx' ? (
                              <DocumentIcon className="h-8 w-8 text-blue-600" />
                            ) : doc.fileType === 'xlsx' ? (
                              <SpreadsheetIcon className="h-8 w-8 text-green-600" />
                            ) : doc.fileType === 'image' ? (
                              <Image className="h-8 w-8 text-purple-600" />
                            ) : (
                              <DocumentIcon className="h-8 w-8 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base leading-tight mb-2">{doc.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {doc.description}
                        </p>
                        
                        {/* Metadata */}
                        <div className="space-y-1.5 mb-4 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Uploaded by:</span>
                            <span className="font-medium text-gray-700">{doc.uploadedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium text-gray-700">{doc.uploadDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span className="font-medium text-gray-700">{doc.size}</span>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="flex-1 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="px-2">
                            <DownloadIcon className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="px-2">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <Folder className="h-16 w-16 text-muted-foreground mb-6" />
                        <h3 className="text-xl font-semibold mb-4">No Documents Found</h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-md">
                          No documents have been uploaded for {selectedStudent.name} yet. 
                          Upload assessments, reports, and other important documents to get started.
                        </p>
                        <div className="flex items-center gap-3">
                          <Button>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload First Document
                          </Button>
                          <Button variant="outline">
                            <Folder className="h-4 w-4 mr-2" />
                            Browse Templates
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Document Statistics */}
              {mockStudentDocuments[selectedStudent.id]?.length > 0 && (
              <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Document Summary</CardTitle>
                    <CardDescription>Overview of documents for {selectedStudent.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <DocumentIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">
                          {mockStudentDocuments[selectedStudent.id].filter(d => d.type === 'assessment').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Assessments</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <DocumentIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {mockStudentDocuments[selectedStudent.id].filter(d => d.type === 'report').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Reports</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <DocumentIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600">
                          {mockStudentDocuments[selectedStudent.id].filter(d => d.type === 'evaluation').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Evaluations</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <DocumentIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-600">
                          {mockStudentDocuments[selectedStudent.id].filter(d => d.type === 'progress').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Progress Notes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Folder className="h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold mb-4">Select a Student</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Please select a student from the Student Info tab to view their documents.
                </p>
                <Button onClick={() => setActiveTab('student')}>
                  <User className="h-4 w-4 mr-2" />
                  Go to Student Info
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* PLAAFP Tab */}
        <TabsContent value="plaaFP" className="space-y-6">
          {selectedStudent ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Present Levels of Academic Achievement and Functional Performance (PLAAFP)</CardTitle>
                  <CardDescription>Describe the student's current academic and functional performance levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="academicAchievement">Academic Achievement *</Label>
                      <Textarea 
                        id="academicAchievement" 
                        rows={4}
                        value={iepData.plaaFP.academicAchievement}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          plaaFP: { ...prev.plaaFP, academicAchievement: e.target.value }
                        }))}
                        placeholder="Describe the student's current academic performance levels, including strengths and areas of need..."
                        />
                      </div>
                    
                    <div>
                      <Label htmlFor="functionalPerformance">Functional Performance *</Label>
                      <Textarea 
                        id="functionalPerformance" 
                        rows={4}
                        value={iepData.plaaFP.functionalPerformance}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          plaaFP: { ...prev.plaaFP, functionalPerformance: e.target.value }
                        }))}
                        placeholder="Describe the student's functional performance in daily living skills, social skills, communication, etc..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="strengths">Student Strengths *</Label>
                      <Textarea 
                        id="strengths" 
                        rows={3}
                        value={iepData.plaaFP.strengths}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          plaaFP: { ...prev.plaaFP, strengths: e.target.value }
                        }))}
                        placeholder="List the student's strengths, interests, and positive attributes..."
                      />
                            </div>
                    
                    <div>
                      <Label htmlFor="needs">Areas of Need *</Label>
                      <Textarea 
                        id="needs" 
                        rows={3}
                        value={iepData.plaaFP.needs}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          plaaFP: { ...prev.plaaFP, needs: e.target.value }
                        }))}
                        placeholder="Identify specific areas where the student needs support and intervention..."
                      />
                  </div>

                    <div>
                      <Label htmlFor="parentConcerns">Parent Concerns</Label>
                      <Textarea 
                        id="parentConcerns" 
                        rows={3}
                        value={iepData.plaaFP.parentConcerns}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          plaaFP: { ...prev.plaaFP, parentConcerns: e.target.value }
                        }))}
                        placeholder="Document any concerns or priorities expressed by the parent/guardian..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="assessmentResults">Assessment Results</Label>
                      <Textarea 
                        id="assessmentResults" 
                        rows={4}
                        value={iepData.plaaFP.assessmentResults}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          plaaFP: { ...prev.plaaFP, assessmentResults: e.target.value }
                        }))}
                        placeholder="Include relevant assessment data, test scores, and evaluation results..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Special Factors</CardTitle>
                  <CardDescription>Consider special factors that may affect the student's education</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="behavior">Behavioral Concerns</Label>
                      <Textarea 
                        id="behavior" 
                        rows={3}
                        value={iepData.specialFactors.behavior}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          specialFactors: { ...prev.specialFactors, behavior: e.target.value }
                        }))}
                        placeholder="Describe any behavioral concerns and interventions..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="communication">Communication Needs</Label>
                      <Textarea 
                        id="communication" 
                        rows={3}
                        value={iepData.specialFactors.communication}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          specialFactors: { ...prev.specialFactors, communication: e.target.value }
                        }))}
                        placeholder="Describe communication needs and supports..."
                      />
                                </div>
                    
                                <div>
                      <Label htmlFor="assistiveTechnology">Assistive Technology</Label>
                      <Textarea 
                        id="assistiveTechnology" 
                        rows={3}
                        value={iepData.specialFactors.assistiveTechnology}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          specialFactors: { ...prev.specialFactors, assistiveTechnology: e.target.value }
                        }))}
                        placeholder="List any assistive technology devices or services needed..."
                      />
                                  </div>
                    
                    <div>
                      <Label htmlFor="limitedEnglish">Limited English Proficiency</Label>
                      <Textarea 
                        id="limitedEnglish" 
                        rows={3}
                        value={iepData.specialFactors.limitedEnglish}
                        onChange={(e) => setIepData(prev => ({ 
                          ...prev, 
                          specialFactors: { ...prev.specialFactors, limitedEnglish: e.target.value }
                        }))}
                        placeholder="Describe English language learning needs..."
                      />
                                </div>
                              </div>
                </CardContent>
              </Card>
                            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Please select a student first to complete the PLAAFP section
                </p>
                <Button onClick={() => setActiveTab("student")}>
                  Select Student
                </Button>
                          </CardContent>
                        </Card>
          )}
        </TabsContent>


        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          {selectedStudent ? (
            <div className="space-y-6">
              {/* AI Recommendations Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI-Powered Goal Recommendations</CardTitle>
                  <CardDescription>Get intelligent goal suggestions based on {selectedStudent.name}'s profile and assessment data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Sparkles className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Smart Recommendations</h3>
                        <p className="text-sm text-muted-foreground">
                          AI analyzes student data to suggest evidence-based goals
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={generateAIRecommendations}
                      disabled={isGeneratingRecommendations}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isGeneratingRecommendations ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4 mr-2" />
                      )}
                      {isGeneratingRecommendations ? "Analyzing..." : "Generate Recommendations"}
                    </Button>
                  </div>

                  {/* AI Recommendations List */}
                  {aiRecommendations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Recommended Goals ({aiRecommendations.length})</h4>
                      {aiRecommendations.map((recommendation) => {
                        const domainInfo = getDomainInfo(recommendation.domain)
                        return (
                          <div key={recommendation.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className={`p-2 rounded-lg ${domainInfo.color}`}>
                                  {getDomainIcon(recommendation.domain)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h5 className="font-medium">{recommendation.title}</h5>
                                    <Badge variant="outline" className="text-green-600 text-xs">
                                      {Math.round(recommendation.confidence * 100)}% confidence
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
                                  <p className="text-xs text-gray-600">{recommendation.reasoning}</p>
                                </div>
                              </div>
                              <div className="flex flex-col space-y-1 ml-4">
                                <Button 
                                  size="sm" 
                                  onClick={() => acceptRecommendation(recommendation)}
                                  className="bg-green-600 hover:bg-green-700 text-xs"
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => rejectRecommendation(recommendation.id)}
                                  className="text-red-600 hover:text-red-700 text-xs"
                                >
                                  <ThumbsDown className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                      )
                    })}
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Measurable Goals Section */}
                <Card>
                  <CardHeader>
                  <CardTitle className="text-lg">Measurable Annual Goals</CardTitle>
                  <CardDescription>Define specific, measurable goals for {selectedStudent.name}</CardDescription>
                  </CardHeader>
                <CardContent className="space-y-6">
                  {/* Academic Goals */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                      Academic Goals
                    </h4>
                    <div className="space-y-3">
                      {selectedGoals.filter(g => g.domain === 'academic').map((goal) => (
                        <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium">{goal.title}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                              <div className="mt-2">
                                <Label className="text-xs font-medium">Measurement:</Label>
                                <p className="text-sm">{goal.measurement}</p>
                                </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleGoalRemove(goal.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab("goals")}
                        className="w-full border-dashed"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Academic Goal
                      </Button>
                    </div>
                  </div>

                  {/* Functional Goals */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-green-600" />
                      Functional Goals
                    </h4>
                    <div className="space-y-3">
                      {selectedGoals.filter(g => g.domain === 'adaptive' || g.domain === 'motor').map((goal) => (
                        <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                                <div className="flex-1">
                              <h5 className="font-medium">{goal.title}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                              <div className="mt-2">
                                <Label className="text-xs font-medium">Measurement:</Label>
                                <p className="text-sm">{goal.measurement}</p>
                                  </div>
                                </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleGoalRemove(goal.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                              </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-dashed"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Functional Goal
                      </Button>
                    </div>
                  </div>

                  {/* Behavioral Goals */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-red-600" />
                      Behavioral Goals
                    </h4>
                    <div className="space-y-3">
                      {selectedGoals.filter(g => g.domain === 'behavioral').map((goal) => (
                        <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium">{goal.title}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                              <div className="mt-2">
                                <Label className="text-xs font-medium">Measurement:</Label>
                                <p className="text-sm">{goal.measurement}</p>
                              </div>
                            </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleGoalRemove(goal.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-dashed"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Behavioral Goal
                      </Button>
                    </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Please select a student first to create goals
                </p>
                <Button onClick={() => setActiveTab("student")}>
                  Select Student
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          {selectedStudent ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Special Education and Related Services</CardTitle>
                  <CardDescription>Define the services and supports {selectedStudent.name} will receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="specialEducation">Special Education Services *</Label>
                      <Textarea 
                        id="specialEducation" 
                        rows={4}
                        placeholder="Describe the special education services the student will receive (e.g., resource room, self-contained classroom, inclusion support)..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="relatedServices">Related Services *</Label>
                      <Textarea 
                        id="relatedServices" 
                        rows={4}
                        placeholder="List related services (e.g., speech therapy, occupational therapy, physical therapy, counseling)..."
                      />
                    </div>
                    
                  <div>
                      <Label htmlFor="supplementaryAids">Supplementary Aids and Services</Label>
                    <Textarea 
                        id="supplementaryAids" 
                        rows={3}
                        placeholder="List supplementary aids and services (e.g., assistive technology, visual supports, peer tutoring)..."
                    />
                  </div>
                    
                  <div>
                      <Label htmlFor="programModifications">Program Modifications</Label>
                    <Textarea 
                        id="programModifications" 
                      rows={3}
                        placeholder="Describe any modifications to the general education curriculum..."
                    />
                  </div>
                    
                  <div>
                      <Label htmlFor="supportsForPersonnel">Supports for School Personnel</Label>
                    <Textarea 
                        id="supportsForPersonnel" 
                      rows={3}
                        placeholder="Describe supports needed for teachers and other school personnel..."
                    />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Please select a student first to define services
                </p>
                <Button onClick={() => setActiveTab("student")}>
                  Select Student
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Placement Tab */}
        <TabsContent value="placement" className="space-y-6">
          {selectedStudent ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Educational Placement</CardTitle>
                  <CardDescription>Determine the least restrictive environment for {selectedStudent.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                                <div>
                      <Label htmlFor="placementType">Placement Type *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select placement type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general-education">General Education Classroom</SelectItem>
                          <SelectItem value="resource-room">Resource Room</SelectItem>
                          <SelectItem value="self-contained">Self-Contained Classroom</SelectItem>
                          <SelectItem value="separate-school">Separate School</SelectItem>
                          <SelectItem value="residential">Residential Facility</SelectItem>
                          <SelectItem value="homebound">Homebound Instruction</SelectItem>
                        </SelectContent>
                      </Select>
                            </div>
                            
                            <div>
                      <Label htmlFor="placementLocation">Location *</Label>
                      <Input 
                        id="placementLocation" 
                        placeholder="Enter specific location (e.g., Room 205, Main Building)"
                              />
                            </div>
                            
                            <div>
                      <Label htmlFor="timeInGeneralEducation">Time in General Education</Label>
                      <Input 
                        id="timeInGeneralEducation" 
                        placeholder="e.g., 80% general education, 20% special education"
                              />
                            </div>
                            
                            <div>
                      <Label htmlFor="placementJustification">Justification for Placement *</Label>
                              <Textarea 
                        id="placementJustification" 
                        rows={4}
                        placeholder="Explain why this placement is the least restrictive environment and appropriate for the student..."
                              />
                            </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Please select a student first to determine placement
                </p>
                  <Button onClick={() => setActiveTab("student")}>
                    Select Student
                  </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="space-y-6">
          {selectedStudent ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">IEP Review and Finalization</CardTitle>
                  <CardDescription>Review all sections before finalizing {selectedStudent.name}'s IEP</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Student Information Summary */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Student Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{selectedStudent.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Student ID:</span>
                        <span className="ml-2 font-medium">{selectedStudent.studentId}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Grade:</span>
                        <span className="ml-2 font-medium">{selectedStudent.grade}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Disability:</span>
                        <span className="ml-2 font-medium">{selectedStudent.disability}</span>
                      </div>
                    </div>
                  </div>

                  {/* Goals Summary */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Measurable Annual Goals ({selectedGoals.length})</h4>
                    {selectedGoals.length > 0 ? (
                      <div className="space-y-2">
                        {selectedGoals.map((goal) => (
                          <div key={goal.id} className="text-sm p-2 bg-gray-50 rounded">
                            <span className="font-medium">{goal.title}</span>
                            <span className="text-gray-600 ml-2">- {goal.description}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No goals added yet</p>
                    )}
                  </div>

                  {/* Services Summary */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Services and Supports</h4>
                    <p className="text-sm text-gray-500 italic">Services section needs to be completed</p>
                  </div>

                  {/* Placement Summary */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Educational Placement</h4>
                    <p className="text-sm text-gray-500 italic">Placement section needs to be completed</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <p>Review all sections before saving the IEP</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button onClick={handleSaveIEP}>
                        <Save className="h-4 w-4 mr-2" />
                        Save IEP
                  </Button>
                    </div>
                </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Please select a student first to review the IEP
                </p>
                <Button onClick={() => setActiveTab("student")}>
                  Select Student
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
