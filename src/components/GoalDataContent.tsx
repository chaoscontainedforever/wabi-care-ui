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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  Search, 
  Plus, 
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Undo,
  Minus,
  CheckCircle,
  Clock,
  FileText,
  Bookmark
} from "@/components/icons"
import { useStudents, useGoals } from "@/hooks/useSupabase"
import { RightNavigation } from "@/components/RightNavigation"
import type { Tables } from "@/lib/database.types"

function GoalDataContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedStudentId = searchParams.get('student')
  const selectedGoalId = searchParams.get('goal')
  
  const { students, loading: studentsLoading } = useStudents()
  const { goals, loading: goalsLoading } = useGoals(selectedStudentId)
  
  const [activeTab, setActiveTab] = useState("capture")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTrial, setCurrentTrial] = useState(1)
  const [dataValue, setDataValue] = useState(0)
  const [localSelectedStudentId, setLocalSelectedStudentId] = useState<string | null>(selectedStudentId)
  const [notes, setNotes] = useState("")
  const [accommodations, setAccommodations] = useState("Accommodations")
  const [servicesTracked, setServicesTracked] = useState("Services Not Tracked")
  const [isRightNavOpen, setIsRightNavOpen] = useState(false)

  // Get selected student
  const selectedStudent = useMemo(() => {
    const studentId = localSelectedStudentId || selectedStudentId
    if (!studentId || !students.length) return null
    return students.find(s => s.id === studentId) || null
  }, [localSelectedStudentId, selectedStudentId, students])

  // Get selected goal
  const selectedGoal = useMemo(() => {
    if (!selectedGoalId || !goals.length) return null
    return goals.find(g => g.id === selectedGoalId) || null
  }, [selectedGoalId, goals])

  // Filter students for sidebar
  const filteredStudents = useMemo(() => {
    if (studentsLoading) return []
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [students, searchTerm, studentsLoading])

  const handleStudentSelect = useCallback((studentId: string) => {
    router.push(`/goal-data?student=${studentId}`)
  }, [router])

  const handleGoalSelect = useCallback((goalId: string) => {
    router.push(`/goal-data?student=${selectedStudentId}&goal=${goalId}`)
  }, [router, selectedStudentId])

  const handleBackToStudents = useCallback(() => {
    router.push('/students')
  }, [router])

  const handleIncrement = useCallback(() => {
    setDataValue(prev => prev + 1)
  }, [])

  const handleDecrement = useCallback(() => {
    setDataValue(prev => Math.max(0, prev - 1))
  }, [])

  const handleReset = useCallback(() => {
    setDataValue(0)
  }, [])

  const handleUndo = useCallback(() => {
    // Implement undo functionality
    console.log('Undo last action')
  }, [])

  // Sample goals data matching the screenshot
  const sampleGoals = [
    {
      id: "1",
      title: "Social Studies",
      description: "Demo Student1 will take 5 bites, from a handheld snack, such as a cheese stick in 4 out of 5 opportunities.",
      completed: true,
      number: 1
    },
    {
      id: "2", 
      title: "Writing",
      description: "Demo Student1 will write his name legibly with all letters in the correct spatial order and distance with...",
      completed: false,
      number: 2
    },
    {
      id: "3",
      title: "Math", 
      description: "Demo Student1 will be at 70% proficiency at the 1st-grade level as measured by the MFF-1D assessment",
      completed: false,
      number: 3
    },
    {
      id: "4",
      title: "Reading",
      description: "Demo Student1 will answer \"Wh\" questions (who, what, when, where) by referring to key details...",
      completed: false,
      number: 4
    },
    {
      id: "5",
      title: "Toileting",
      description: "Demo Student1 will independently use the restroom...",
      completed: false,
      number: 5
    }
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Header */}
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
                  <BreadcrumbPage>Goal Data</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Second Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackToStudents}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sep 29, 11:05 PM - 11:35 PM</span>
              <FileText className="h-4 w-4" />
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={accommodations} onValueChange={setAccommodations}>
              <SelectTrigger className="w-40">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Accommodations">Accommodations</SelectItem>
                <SelectItem value="No Accommodations">No Accommodations</SelectItem>
              </SelectContent>
            </Select>
            <Select value={servicesTracked} onValueChange={setServicesTracked}>
              <SelectTrigger className="w-40">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Services Not Tracked">Services Not Tracked</SelectItem>
                <SelectItem value="Services Tracked">Services Tracked</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 gap-4 p-4">
          {/* Left Sidebar - Student & Goals */}
          <div className="w-80 space-y-4">
            {/* Student Information */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedStudent ? (
                      <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-800">
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarImage 
                            src={selectedStudent.profile_picture_url} 
                            alt={selectedStudent.name}
                          />
                          <AvatarFallback className="text-xs bg-blue-500 text-white">
                            {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {selectedStudent.name}
                      </Badge>
                    ) : (
                      <Select value={localSelectedStudentId || ""} onValueChange={setLocalSelectedStudentId}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select a student..." />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-4 h-4">
                                  <AvatarImage 
                                    src={student.profile_picture_url} 
                                    alt={student.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                {student.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {selectedStudent && (
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Goals Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Goals (7/7)</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      Add Goal
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedGoalId === goal.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => handleGoalSelect(goal.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">{goal.number}.</span>
                        {goal.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1 text-sm">{goal.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{goal.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Data Capture */}
          <div className="flex-1 flex flex-col">
            {selectedGoal ? (
              <div className="space-y-6">
                {/* Trial Navigation */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setCurrentTrial(prev => Math.max(1, prev - 1))}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">Trial {currentTrial}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setCurrentTrial(prev => prev + 1)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Phase
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          C Reset
                          <RefreshCw className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* View Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="capture">Capture</TabsTrigger>
                    <TabsTrigger value="graph">Graph</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                  </TabsList>

                  <TabsContent value="capture" className="mt-6">
                    {/* Data Capture Interface */}
                    <Card>
                      <CardContent className="p-8">
                        <div className="flex justify-end mb-4">
                          <Button variant="outline" size="sm" onClick={handleUndo}>
                            <Undo className="h-4 w-4 mr-2" />
                            Undo
                          </Button>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-8 text-center">
                          <div className="bg-white rounded-lg p-8 mb-6">
                            <div className="text-6xl font-bold text-gray-900 mb-4">
                              {dataValue}
                            </div>
                            <div className="flex justify-center gap-4">
                              <Button 
                                size="lg" 
                                variant="outline"
                                onClick={handleDecrement}
                                className="w-16 h-16 rounded-full"
                              >
                                <Minus className="h-8 w-8" />
                              </Button>
                              <Button 
                                size="lg" 
                                onClick={handleIncrement}
                                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-8 w-8 text-white" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="graph" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Graph View</CardTitle>
                        <CardDescription>Visual representation of data collection</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Graph visualization will be implemented here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="stats" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                        <CardDescription>Statistical analysis of collected data</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Statistics will be implemented here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Notes Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Notes (0)</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Load Last Note
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Enter your notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-32"
                    />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full">
                <CardContent className="p-12 text-center h-full flex flex-col justify-center">
                  <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Goal</h3>
                  <p className="text-gray-600">Choose a goal from the sidebar to start data collection.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
      
      {/* Right Navigation Chat */}
      <RightNavigation
        isOpen={isRightNavOpen}
        onToggle={() => setIsRightNavOpen(!isRightNavOpen)}
        currentStudent={selectedStudent}
        currentGoal={selectedGoal}
      />
    </SidebarProvider>
  )
}

export default GoalDataContent
