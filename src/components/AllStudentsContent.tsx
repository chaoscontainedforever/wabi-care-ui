"use client"

import { memo, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Card as DetailCard, CardContent as DetailCardContent, CardHeader as DetailCardHeader, CardTitle as DetailCardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStudents } from "@/hooks/useSupabase"
import type { Tables } from "@/lib/database.types"
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Grid3X3,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Table,
  User,
  Users,
  X,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  GraduationCap
} from "lucide-react"

function AllStudentsContent() {
  const router = useRouter()
  const { students, loading: studentsLoading, error: studentsError } = useStudents()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGrade, setFilterGrade] = useState<string>("all")
  const [filterDisability, setFilterDisability] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewFormat, setViewFormat] = useState<"cards" | "list" | "table">("table")
  const [selectedStudent, setSelectedStudent] = useState<Tables<'students'> | null>(null)
  const [activeCaseloadTab, setActiveCaseloadTab] = useState("profile")
  const [caseloadSearch, setCaseloadSearch] = useState("")
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false)

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.student_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.parent_name && student.parent_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesGrade = filterGrade === "all" || student.grade === filterGrade
    const matchesDisability = filterDisability === "all" || student.disability === filterDisability
    const matchesStatus = filterStatus === "all" || (student.status || "active") === filterStatus
    return matchesSearch && matchesGrade && matchesDisability && matchesStatus
  })

  useEffect(() => {
    if (filteredStudents.length === 0) {
      setSelectedStudent(null)
      return
    }

    if (!selectedStudent || !filteredStudents.some(student => student.id === selectedStudent.id)) {
      setSelectedStudent(filteredStudents[0])
    }
  }, [filteredStudents, selectedStudent])

  const caseloadStudentList = useMemo(() => {
    const query = caseloadSearch.trim().toLowerCase()
    if (!query) return filteredStudents
    return filteredStudents.filter(student =>
      student.name.toLowerCase().includes(query) ||
      (student.student_id || "").toLowerCase().includes(query)
    )
  }, [filteredStudents, caseloadSearch])

  const caseloadTabs = useMemo(() => [
    { value: "profile", label: "Profile" },
    { value: "goals", label: "Goals" },
    { value: "notes", label: "Notes" },
    { value: "service", label: "Service Time" },
    { value: "accommodations", label: "Accommodation" },
    { value: "attachments", label: "Attachments" },
    { value: "progress", label: "Progress" },
    { value: "strengths", label: "Strengths & Needs" }
  ], [])

  const caseloadDetails = useMemo(() => {
    if (!selectedStudent) return null

    const coalesce = (value: any, fallback: string) => {
      if (value === 0) return "0"
      if (typeof value === "number") return value.toString()
      if (typeof value === "string" && value.trim().length > 0) return value
      return fallback
    }

    const profile = [
      { label: "Student ID", value: coalesce(selectedStudent.student_id, "RS-204") },
      { label: "Grade", value: coalesce(selectedStudent.grade, "3rd Grade") },
      { label: "Primary Disability", value: coalesce(selectedStudent.disability, "Autism Spectrum Disorder") },
      { label: "School", value: coalesce(selectedStudent.school, "Watson Institute") },
      { label: "Assigned Teacher", value: "Sarah Wilson" },
      { label: "Status", value: "Active" }
    ]

    const supportTeam = [
      {
        name: "Priya Sharma",
        role: "Parent / Guardian",
        contact: "(412) 555-0194"
      },
      {
        name: "Jordan Lee",
        role: "Case Manager",
        contact: "j.lee@wabi-care.org"
      }
    ]

    const goals = [
      {
        title: "Functional Communication",
        description: "Request help using full sentences during classroom activities.",
        progress: 78,
        status: "On Track"
      },
      {
        title: "Daily Living Skills",
        description: "Follow two-step morning routine with visual supports.",
        progress: 64,
        status: "Emerging"
      },
      {
        title: "Peer Interaction",
        description: "Initiate conversation with peers during small group lessons.",
        progress: 52,
        status: "Needs Practice"
      }
    ]

    const notes = [
      {
        title: "Morning routine",
        date: "Sep 5, 2024",
        summary: "Used picture schedule independently for arrival. Needed one prompt for backpack storage."
      },
      {
        title: "Speech session",
        date: "Sep 3, 2024",
        summary: "Practiced requesting items with two-word phrases. Responded well to visual sentence starters."
      },
      {
        title: "Social skills group",
        date: "Aug 29, 2024",
        summary: "Participated in role-play greetings. Required modeling for reciprocal questions."
      }
    ]

    const service = {
      sessionsThisWeek: 2,
      totalHours: "5h 30m",
      lastSession: "Tue • 10:30 AM",
      upcomingSession: "Thu • 9:00 AM with speech therapy"
    }

    const attachments = [
      { name: "IEP Summary.pdf", updated: "Updated Aug 22, 2024", size: "1.2 MB" },
      { name: "Behavior Plan.docx", updated: "Updated Jul 18, 2024", size: "860 KB" }
    ]

    const progress = [
      { label: "Communication", value: 72 },
      { label: "Daily Living", value: 64 },
      { label: "Social Skills", value: 58 },
      { label: "Vocational", value: 45 }
    ]

    const strengths = {
      strengths: [
        "Responds well to visual schedules",
        "Engages peers during guided activities",
        "Uses self-calming strategies when prompted"
      ],
      focus: [
        "Independent transitions between classes",
        "Generalizing communication goals to lunchroom",
        "Maintaining engagement during longer group lessons"
      ]
    }

    return {
      profile,
      supportTeam,
      goals,
      notes,
      service,
      attachments,
      progress,
      strengths
    }
  }, [selectedStudent])

  const handleStudentClick = (student: Tables<'students'>) => {
    setSelectedStudent(student)
    setActiveCaseloadTab("profile")
    setIsStudentDetailOpen(true)
  }

  const handleAddStudent = () => {
    router.push('/students/new')
  }

  const handleExportList = () => {
    // Create CSV content
    const headers = ['Name', 'Student ID', 'Grade', 'Age', 'Disability', 'School', 'Parent Name', 'Parent Phone', 'Status']
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        student.name,
        student.student_id,
        student.grade,
        student.age,
        student.disability,
        student.school,
        student.parent_name || '',
        student.parent_phone || '',
        student.status || 'active'
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEditStudent = (student: any) => {
    // Navigate to edit student page with student ID
    router.push(`/students/edit/${student.id}`)
  }

  const handleViewIEP = (student: any) => {
    // Navigate to IEP builder with selected student
    router.push(`/iep-builder?student=${student.id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "inactive":
        return "text-gray-600 bg-gray-50"
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "inactive":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  // List View Component
  const ListView = () => (
    <div className="space-y-2">
      {filteredStudents.map((student) => (
        <div 
          key={student.id}
          className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 ${selectedStudent?.id === student.id ? 'ring-2 ring-pink-200 bg-pink-50/40' : ''}`}
        >
          <button
            type="button"
            onClick={() => handleStudentClick(student)}
            className="flex items-center gap-4 flex-1 text-left"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              {student.profile_picture_url && (
                <img 
                  src={student.profile_picture_url} 
                  alt={student.name}
                className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
              )}
              <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: student.profile_picture_url ? 'none' : 'flex'}}>
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)_minmax(0,1fr)] gap-6 md:gap-8 items-start">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{student.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="uppercase tracking-wide font-medium">ID:</span>
                  <span>{student.student_id}</span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{student.grade}</span>
                  {student.age && <span className="text-xs text-muted-foreground">• Age {student.age}</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                  <span>{student.disability}</span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span>{student.group || 'General'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>{student.iepDate ? `IEP: ${student.iepDate}` : 'IEP: Not set'}</span>
                </div>
              </div>
            </div>
          </button>
          <div className="flex items-center gap-3 pl-4">
            {getStatusIcon(student.status)}
            <Badge variant="outline" className={`text-xs ${getStatusColor(student.status)}`}>
              {student.status}
            </Badge>
            <Button 
              size="sm" 
              className="px-3 text-xs"
              onClick={() => router.push(`/data-collection?student=${student.id}`)}
            >
              Collect Data
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )

  // Table View Component
  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Student</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Grade</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Disability</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Group</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">IEP Date</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Status</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr 
              key={student.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleStudentClick(student)}
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {student.profile_picture_url && (
                      <img 
                        src={student.profile_picture_url} 
                        alt={student.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                    )}
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: student.profile_picture_url ? 'none' : 'flex'}}>
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{student.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {student.student_id || student.studentId}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{student.grade}</td>
              <td className="py-3 px-4 text-sm">{student.disability}</td>
              <td className="py-3 px-4 text-sm">{student.group}</td>
              <td className="py-3 px-4 text-sm">{student.iepDate}</td>
              <td className="py-3 px-4">
                <Badge variant="outline" className={`text-xs ${getStatusColor(student.status)}`}>
                  {student.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/data-collection?student=${student.id}`)
                    }}
                  >
                    Collect Data
                  </Button>
                  <Button size="sm" variant="ghost" className="p-1" onClick={(e) => { e.stopPropagation(); handleStudentClick(student) }}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Students</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* View Format Controls */}
            <div className="flex items-center border border-gray-200 rounded-lg p-1">
              <Button
                variant={viewFormat === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewFormat("cards")}
                className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewFormat === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewFormat("list")}
                className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewFormat === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewFormat("table")}
                className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" onClick={handleExportList}>
              <FileText className="h-4 w-4 mr-2" />
              Export List
            </Button>
            <Button size="sm" onClick={handleAddStudent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:scale-105 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{studentsLoading ? "..." : students.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <p className="text-2xl font-bold">{studentsLoading ? "..." : students.filter(s => (s.status || 'active') === 'active').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IEP Reviews Due</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assessment Pending</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <Card noHover>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>Search and filter students by various criteria</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-32" suppressHydrationWarning>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="1st Grade">1st Grade</SelectItem>
                  <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                  <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                  <SelectItem value="4th Grade">4th Grade</SelectItem>
                  <SelectItem value="5th Grade">5th Grade</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDisability} onValueChange={setFilterDisability}>
                <SelectTrigger className="w-40" suppressHydrationWarning>
                  <SelectValue placeholder="Disability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disabilities</SelectItem>
                  <SelectItem value="Autism Spectrum Disorder">Autism</SelectItem>
                  <SelectItem value="ADHD">ADHD</SelectItem>
                  <SelectItem value="Learning Disability">Learning Disability</SelectItem>
                  <SelectItem value="Speech and Language Impairment">Speech/Language</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32" suppressHydrationWarning>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading students...</p>
            </div>
          ) : studentsError ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Students</h3>
              <p className="text-gray-600 mb-6">{studentsError}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : viewFormat === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <Card 
                  key={student.id} 
                  className="hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        {student.profile_picture_url && (
                          <img 
                            src={student.profile_picture_url} 
                            alt={student.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement
                              if (fallback) fallback.style.display = 'flex'
                            }}
                          />
                        )}
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: student.profile_picture_url ? 'none' : 'flex'}}>
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-gray-900">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.grade} • Age {student.age}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Disability:</span>
                        <span>{student.disability}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Group:</span>
                        <span>{student.group || 'General'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium uppercase tracking-wide">IEP:</span>
                      <span>{student.iepDate || 'Not set'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs capitalize">
                        {student.status}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="text-xs"
                          onClick={() => router.push(`/data-collection?student=${student.id}`)}
                        >
                          Collect Data
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => handleStudentClick(student)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewFormat === "list" && <ListView />}
          {viewFormat === "table" && <TableView />}
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600 mb-6">No students match your current search and filter criteria.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student Intake
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={isStudentDetailOpen} onOpenChange={setIsStudentDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {selectedStudent?.profile_picture_url && (
                    <img 
                      src={selectedStudent.profile_picture_url} 
                      alt={selectedStudent.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                  )}
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: selectedStudent?.profile_picture_url ? 'none' : 'flex'}}>
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">
                    {selectedStudent?.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Student ID: {selectedStudent?.student_id} • Grade: {selectedStudent?.grade} • Status: Active
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsStudentDetailOpen(false)}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditStudent(selectedStudent!)}
                  title="Edit Student"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleViewIEP(selectedStudent!)}
                  title="View IEP"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Student ID</Label>
                      <p className="text-sm text-muted-foreground">{selectedStudent.student_id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Grade & Age</Label>
                      <p className="text-sm text-muted-foreground">{selectedStudent.grade} • Age {selectedStudent.age}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Disability</Label>
                      <p className="text-sm text-muted-foreground">{selectedStudent.disability}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">School</Label>
                      <p className="text-sm text-muted-foreground">{selectedStudent.school}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Teacher</Label>
                      <p className="text-sm text-muted-foreground">Sarah Wilson</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parent/Guardian Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Parent Name</Label>
                      <p className="text-sm text-muted-foreground">Priya Sharma</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        (412) 555-0194
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        priya.sharma@email.com
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        123 Oak Street, Pittsburgh, PA 15213
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* IEP and Assessment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">IEP Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">IEP Date</Label>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        March 15, 2024
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Next Review</Label>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        March 15, 2025
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Group</Label>
                      <p className="text-sm text-muted-foreground">General Education</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Assessment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Last Assessment</Label>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        August 20, 2024
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Assessment Type</Label>
                      <p className="text-sm text-muted-foreground">VB-MAPP</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Notes</Label>
                      <p className="text-sm text-muted-foreground">Student shows strong progress in communication skills</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default memo(AllStudentsContent)
