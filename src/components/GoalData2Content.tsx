"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageLayout } from "@/components/PageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Target,
  ClipboardList,
  BarChart3,
  Activity,
  User
} from "lucide-react"
import { useStudents } from "@/hooks/useSupabase"
import { TreatmentPlanTab } from "./goal-data-2/TreatmentPlanTab"
import { DataCollectionTab } from "./goal-data-2/DataCollectionTab"
import { ReportingTab } from "./goal-data-2/ReportingTab"

function GoalData2Content() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedStudentId = searchParams.get('student')
  
  const { students, loading: studentsLoading } = useStudents()
  const [activeTab, setActiveTab] = useState("treatment-plan")

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId || studentsLoading) return null
    return students.find(s => s.id === selectedStudentId)
  }, [selectedStudentId, students])

  // Filter students for dropdown
  const filteredStudents = useMemo(() => {
    if (studentsLoading) return []
    return students
  }, [students, studentsLoading])

  const handleStudentSelect = useCallback((studentId: string) => {
    router.push(`/goal-data-2?student=${studentId}`)
  }, [router])

  const handleAddStudent = useCallback(() => {
    router.push('/students/new')
  }, [router])

  if (studentsLoading) {
    return (
      <PageLayout
        breadcrumbs={[
          { label: "Data Collection", href: "/goal-data" },
          { label: "Goal Data 2" }
        ]}
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Data Collection", href: "/goal-data" },
        { label: "Goal Data 2" }
      ]}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Two Cards Side by Side */}
          <div className="flex gap-4">
            {/* Card 1: Student Selection - Matches Goals card width */}
            <Card className="w-80 flex-shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Select Student</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <Select 
                  value={selectedStudentId || ""} 
                  onValueChange={handleStudentSelect}
                >
                  <SelectTrigger className="w-full">
                    {selectedStudent ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={selectedStudent.profile_picture_url || undefined} alt={selectedStudent.name} />
                          <AvatarFallback className="text-xs">{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <SelectValue className="text-sm">
                          {selectedStudent.name}
                        </SelectValue>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a student" className="text-sm">
                        Select a student
                      </SelectValue>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={student.profile_picture_url || undefined} alt={student.name} />
                            <AvatarFallback className="text-xs">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-xs text-muted-foreground">{student.grade}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Card 2: Student Summary - Takes remaining space */}
            <Card className="flex-1">
              <CardContent className="p-4">
                {selectedStudent ? (
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedStudent.profile_picture_url || undefined} alt={selectedStudent.name} />
                      <AvatarFallback className="text-xl">{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{selectedStudent.name}</CardTitle>
                      <CardDescription className="text-sm">{selectedStudent.grade} • {selectedStudent.school}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddStudent}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Student
                      </Button>
                      <Badge variant="secondary">Active Sessions</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-xl">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardDescription>Select a student to view summary</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddStudent}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Data Collection Tabs - Only show when student is selected */}
          {selectedStudent ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="treatment-plan" className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Treatment Plan & Targets
                </TabsTrigger>
                <TabsTrigger value="data-collection" className="gap-2">
                  <Activity className="h-4 w-4" />
                  Data Collection
                </TabsTrigger>
                <TabsTrigger value="reporting" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Reporting
                </TabsTrigger>
              </TabsList>

              <TabsContent value="treatment-plan" className="mt-4">
                <TreatmentPlanTab studentId={selectedStudent.id} studentName={selectedStudent.name} />
              </TabsContent>

              <TabsContent value="data-collection" className="mt-4">
                <DataCollectionTab studentId={selectedStudent.id} studentName={selectedStudent.name} />
              </TabsContent>

              <TabsContent value="reporting" className="mt-4">
                <ReportingTab studentId={selectedStudent.id} studentName={selectedStudent.name} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="flex items-center justify-center py-12">
              <CardContent className="text-center">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-2xl mb-2">Select a Student</CardTitle>
                <CardDescription>Choose a student from the dropdown above to view their treatment plan and collect data.</CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default GoalData2Content

