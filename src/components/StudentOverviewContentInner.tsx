"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Plus, 
  Calendar,
  Clock,
  User,
  BookOpen,
  Target,
  TrendingUp,
  FileText,
  Settings,
  MoreHorizontal,
  Diamond,
  Edit
} from "lucide-react"
import { useStudents } from "@/hooks/useSupabase"
import { useChatAssistant } from "@/components/ChatAssistantProvider"

function StudentOverviewContentInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedStudentId = searchParams.get('student')
  
  const { students, loading: studentsLoading } = useStudents()
  const { isExpanded: isChatExpanded } = useChatAssistant()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId || studentsLoading) return null
    return students.find(s => s.id === selectedStudentId)
  }, [selectedStudentId, students])

  // Filter students for sidebar
  const filteredStudents = useMemo(() => {
    if (studentsLoading) return []
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [students, searchTerm, studentsLoading])

  const handleStudentSelect = useCallback((studentId: string) => {
    router.push(`/student-overview?student=${studentId}`)
  }, [router])

  const handleAddStudent = useCallback(() => {
    router.push('/students/new')
  }, [router])

  const handleTakeData = useCallback(() => {
    if (selectedStudentId) {
      router.push(`/goal-data?student=${selectedStudentId}`)
    }
  }, [router, selectedStudentId])

  // Sample data for demonstration
  const sampleData = {
    collaborators: [
      { name: "P Prince Jain (You)", avatar: "P", color: "bg-green-500", role: "Case Manager" }
    ],
    serviceTime: {
      value: 30,
      aiCategorized: true
    },
    studentDetails: {
      iepDueDate: "03/25/2023",
      evalDueDate: "03/24/2023",
      iepServiceTime: "30",
      site: "-",
      grade: "Preschool",
      dob: "12/31/2015",
      teacher: "Catherine",
      roomNo: "5",
      caseManager: "-",
      eligibility: ""
    }
  }

  if (studentsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar for Student List */}
      <Card className={`${isChatExpanded ? 'w-16' : 'w-80'} flex-shrink-0 overflow-y-auto mr-4 transition-all duration-300`} noHover>
        {isChatExpanded ? (
          // Collapsed view - just avatars
          <CardContent className="p-2">
            <div className="space-y-2">
              {filteredStudents.map(student => (
                <div
                  key={student.id}
                  className={`flex items-center justify-center p-1 rounded-md cursor-pointer transition-colors hover:bg-muted ${
                    selectedStudentId === student.id ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => handleStudentSelect(student.id)}
                  title={`${student.name} (${student.grade})`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.profile_picture_url || undefined} alt={student.name} />
                    <AvatarFallback className="text-sm">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </CardContent>
        ) : (
          // Expanded view - full caseload
          <>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Caseload</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Students ({filteredStudents.length}) - Groups (0)</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search student..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute right-2 top-2.5 text-xs text-muted-foreground">⌘K</span>
              </div>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow hover:shadow-lg hover:scale-105 transform mb-4">
                <Plus className="mr-2 h-4 w-4" /> Add Student
              </Button>
              <div className="space-y-2">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors hover:bg-muted ${
                      selectedStudentId === student.id ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.profile_picture_url || undefined} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.grade}</p>
                      </div>
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Main Content Area for Student Details */}
      <div className="flex-1 overflow-y-auto">
        {!selectedStudent ? (
          <Card className="h-full flex items-center justify-center" noHover>
            <CardContent className="text-center">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-2xl mb-2">Select a Student</CardTitle>
              <CardDescription>Choose a student from the caseload to view their details.</CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Student Header Card */}
            <Card className="flex items-center p-4" noHover>
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={selectedStudent.profile_picture_url || undefined} alt={selectedStudent.name} />
                <AvatarFallback className="text-xl">{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{selectedStudent.name}</CardTitle>
                <CardDescription>{selectedStudent.school}</CardDescription>
              </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleTakeData}>Take Data</Button>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow hover:shadow-lg hover:scale-105 transform">View Data</Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
            </Card>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="service-time">Service Time</TabsTrigger>
                <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="strength">Strength/Needs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Collaborators Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Collaborators</CardTitle>
                      <Button variant="outline" size="sm">+ Add New</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-500 text-white">P</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">P Prince Jain (You)</p>
                          <p className="text-xs text-muted-foreground">Case Manager</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Time Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Service time</CardTitle>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>Categorize with AI</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">30</p>
                    </CardContent>
                  </Card>

                  {/* Student Details Card */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Student Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">IEP DUE DATE</p>
                          <p className="font-medium">03/25/2023</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">EVAL DUE DATE</p>
                          <p className="font-medium">03/24/2023</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">IEP SERVICE TIME</p>
                          <p className="font-medium">30</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">SITE</p>
                          <p className="font-medium">-</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">GRADE</p>
                          <p className="font-medium">{selectedStudent.grade}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">DOB</p>
                          <p className="font-medium">12/31/2015</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">TEACHER</p>
                          <p className="font-medium">Catherine</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ROOM NO</p>
                          <p className="font-medium">5</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CASE MANAGER</p>
                          <p className="font-medium">-</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ELIGIBILITY</p>
                          <p className="font-medium">-</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="goals" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Goals for {selectedStudent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Goal content will go here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notes for {selectedStudent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Notes content will go here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="service-time" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Time for {selectedStudent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Service time content will go here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="accommodation" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Accommodations for {selectedStudent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Accommodations content will go here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="attachments" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Attachments for {selectedStudent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Attachments content will go here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="progress" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Progress for {selectedStudent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Progress content will go here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="strength" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Strengths/Needs for {selectedStudent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Strengths/Needs content will go here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentOverviewContentInner
