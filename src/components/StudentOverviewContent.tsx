"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  User, 
  Search, 
  Plus, 
  MoreHorizontal,
  Calendar,
  Table,
  Users,
  CheckCircle,
  Diamond,
  Edit,
  Phone,
  Mail,
  MapPin,
  GraduationCap
} from "@/components/icons"
import { useStudents } from "@/hooks/useSupabase"
import type { Tables } from "@/lib/database.types"

function StudentOverviewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedStudentId = searchParams.get('student')
  
  const { students, loading: studentsLoading } = useStudents()
  
  const [activeTab, setActiveTab] = useState("profile")
  const [searchTerm, setSearchTerm] = useState("")

  // Get selected student
  const selectedStudent = useMemo(() => {
    if (!selectedStudentId || !students.length) return null
    return students.find(s => s.id === selectedStudentId) || null
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

  const handleBackToStudents = useCallback(() => {
    router.push('/students')
  }, [router])

  // Sample data for demonstration (matching the screenshots)
  const sampleData = {
    collaborators: [
      { name: "P Prince Jain (You)", avatar: "P", color: "bg-green-500" }
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Wabi Care</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/students" onClick={handleBackToStudents}>
                    Students
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Student Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 gap-4 p-4">
          {/* Left Sidebar - Student Directory */}
          <div className="w-80 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Caseload</CardTitle>
                    <CardDescription>Students ({students.length}) - Groups (0)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search student..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    ⌘ + k
                  </div>
                </div>

                {/* Add Student Button */}
                <Button className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>

                {/* Students List */}
                <div className="space-y-2">
                  {studentsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedStudentId === student.id 
                            ? 'bg-green-50 border border-green-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleStudentSelect(student.id)}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={student.profile_picture_url || undefined} />
                          <AvatarFallback className="text-sm bg-green-500 text-white">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {student.name}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Student Details */}
          <div className="flex-1">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Student Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={selectedStudent.profile_picture_url || undefined} />
                          <AvatarFallback className="text-xl bg-green-500 text-white">
                            {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h1>
                          <p className="text-gray-600 mt-1">Demo School1</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                          Take Data
                        </Button>
                        <Button size="sm">
                          View Data
                        </Button>
                        <Button variant="ghost" size="icon" className="ml-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-8">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="service-time">Service Time</TabsTrigger>
                    <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
                    <TabsTrigger value="attachments">Attachments</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="strength">Strength/</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Collaborators */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Collaborators</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {sampleData.collaborators.map((collaborator, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className={`text-xs ${collaborator.color} text-white`}>
                                    {collaborator.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{collaborator.name}</span>
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Service Time */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Service time</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Diamond className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">Categorize with AI</span>
                            <Button variant="ghost" size="icon" className="h-4 w-4">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {sampleData.serviceTime.value}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Student Details Grid */}
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Student Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">IEP Due Date</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.iepDueDate}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Eval Due Date</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.evalDueDate}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">IEP Service Time</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.iepServiceTime}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Site</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.site}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Grade</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.grade}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">DOB</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.dob}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teacher</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.teacher}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Room No</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.roomNo}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Case Manager</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.caseManager}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Eligibility</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{sampleData.studentDetails.eligibility}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="goals" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Goals</CardTitle>
                        <CardDescription>Student goals and objectives</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Goals content will be implemented here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notes</CardTitle>
                        <CardDescription>Student notes and observations</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Notes content will be implemented here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="service-time" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Service Time</CardTitle>
                        <CardDescription>Service time tracking and management</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Service time content will be implemented here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="accommodation" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Accommodation</CardTitle>
                        <CardDescription>Accommodations and modifications</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Accommodation content will be implemented here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="attachments" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Attachments</CardTitle>
                        <CardDescription>Documents and files</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Attachments content will be implemented here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="progress" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Progress</CardTitle>
                        <CardDescription>Student progress tracking</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Progress content will be implemented here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="strength" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Strength</CardTitle>
                        <CardDescription>Student strengths and abilities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Strength content will be implemented here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Student</h3>
                  <p className="text-gray-600">Choose a student from the directory to view their details.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default StudentOverviewContent
