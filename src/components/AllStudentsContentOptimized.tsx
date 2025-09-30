"use client"

import { memo, useState, useCallback, useMemo, useEffect, lazy, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useStudents } from "@/hooks/useSupabase"
import { StudentService } from "@/lib/services"
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
  RefreshCw,
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
} from "@/components/icons"

// Lazy load heavy components
const StudentDetailDialog = lazy(() => import("./StudentDetailDialog").then(mod => ({ default: mod.StudentDetailDialog })))

// Loading skeleton component
const StudentListSkeleton = memo(() => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
))

StudentListSkeleton.displayName = "StudentListSkeleton"

function AllStudentsContent() {
  const router = useRouter()
  const { students, loading: studentsLoading, error: studentsError } = useStudents()
  
  // Consolidated state
  const [state, setState] = useState({
    searchTerm: "",
    filterGrade: "all",
    filterDisability: "all", 
    filterStatus: "all",
    viewFormat: "table" as "cards" | "list" | "table",
    selectedStudent: null as Tables<'students'> | null,
    activeCaseloadTab: "profile",
    caseloadSearch: "",
    isStudentDetailOpen: false
  })

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Memoized filtered students
  const filteredStudents = useMemo(() => {
    if (studentsLoading) return []
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                           (student.student_id || "").toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                           (student.parent_name && student.parent_name.toLowerCase().includes(state.searchTerm.toLowerCase()))
      const matchesGrade = state.filterGrade === "all" || student.grade === state.filterGrade
      const matchesDisability = state.filterDisability === "all" || student.disability === state.filterDisability
      const matchesStatus = state.filterStatus === "all" || (student.status || "active") === state.filterStatus
      return matchesSearch && matchesGrade && matchesDisability && matchesStatus
    })
  }, [students, state.searchTerm, state.filterGrade, state.filterDisability, state.filterStatus, studentsLoading])

  // Auto-select first student when filtered
  useEffect(() => {
    if (filteredStudents.length === 0) {
      updateState({ selectedStudent: null })
      return
    }

    if (!state.selectedStudent || !filteredStudents.some(student => student.id === state.selectedStudent?.id)) {
      updateState({ selectedStudent: filteredStudents[0] })
    }
  }, [filteredStudents, state.selectedStudent, updateState])

  const handleStudentClick = useCallback((student: Tables<'students'>) => {
    router.push(`/student-overview?student=${student.id}`)
  }, [router])

  const handleAddStudent = useCallback(() => {
    router.push('/students/new')
  }, [router])

  const handleExportList = useCallback(() => {
    // Export functionality
    console.log('Exporting student list...')
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }, [])

  // Memoized handlers
  const handleRefreshPictures = useCallback(async () => {
    try {
      await StudentService.shuffleAllProfilePictures()
      // Refresh the students data to show new pictures
      window.location.reload()
    } catch (error) {
      console.error('Error refreshing pictures:', error)
    }
  }, [])

  const handlers = useMemo(() => ({
    onSearchChange: (term: string) => updateState({ searchTerm: term }),
    onGradeFilterChange: (grade: string) => updateState({ filterGrade: grade }),
    onDisabilityFilterChange: (disability: string) => updateState({ filterDisability: disability }),
    onStatusFilterChange: (status: string) => updateState({ filterStatus: status }),
    onViewFormatChange: (format: "cards" | "list" | "table") => updateState({ viewFormat: format }),
    onStudentClick: handleStudentClick,
    onAddStudent: handleAddStudent,
    onExportList: handleExportList,
    onRefreshPictures: handleRefreshPictures
  }), [updateState, handleStudentClick, handleAddStudent, handleExportList, handleRefreshPictures])

  if (studentsLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <StudentListSkeleton />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (studentsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Students</h3>
            <p className="text-gray-600 mb-6">{studentsError}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">All Students</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {/* View Format Controls */}
              <div className="flex items-center border border-gray-200 rounded-lg p-1">
                <Button
                  variant={state.viewFormat === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlers.onViewFormatChange("cards")}
                  className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={state.viewFormat === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlers.onViewFormatChange("list")}
                  className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={state.viewFormat === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlers.onViewFormatChange("table")}
                  className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
                >
                  <Table className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" variant="outline" onClick={handlers.onRefreshPictures}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Pictures
              </Button>
              <Button size="sm" onClick={handlers.onExportList}>
                <FileText className="h-4 w-4 mr-2" />
                Export List
              </Button>
              <Button size="sm" onClick={handlers.onAddStudent}>
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
                    <p className="text-2xl font-bold">{students.length}</p>
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
                    <p className="text-2xl font-bold">{students.filter(s => (s.status || 'active') === 'active').length}</p>
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
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
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
                  value={state.searchTerm}
                  onChange={(e) => handlers.onSearchChange(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={state.filterGrade} onValueChange={handlers.onGradeFilterChange}>
                <SelectTrigger className="w-32">
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
              <Select value={state.filterDisability} onValueChange={handlers.onDisabilityFilterChange}>
                <SelectTrigger className="w-40">
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
              <Select value={state.filterStatus} onValueChange={handlers.onStatusFilterChange}>
                <SelectTrigger className="w-32">
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
          {state.viewFormat === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <Card 
                  key={student.id} 
                  className="hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handlers.onStudentClick(student)}
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
                        <span>General</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium uppercase tracking-wide">IEP:</span>
                      <span>Not set</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs capitalize">
                        {student.status || 'active'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/goal-data?student=${student.id}`)
                          }}
                        >
                          Collect Data
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlers.onStudentClick(student)
                          }}
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

          {state.viewFormat === "list" && (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <Card 
                  key={student.id} 
                  className="hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handlers.onStudentClick(student)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
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
                        <div>
                          <h3 className="font-semibold text-base text-gray-900">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">{student.grade} • Age {student.age} • {student.disability}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs capitalize">
                          {student.status || 'active'}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/goal-data?student=${student.id}`)
                            }}
                          >
                            Collect Data
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlers.onStudentClick(student)
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {state.viewFormat === "table" && (
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
                      onClick={() => handlers.onStudentClick(student)}
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
                            <div className="text-xs text-muted-foreground">ID: {student.student_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{student.grade}</td>
                      <td className="py-3 px-4 text-sm">{student.disability}</td>
                      <td className="py-3 px-4 text-sm">General</td>
                      <td className="py-3 px-4 text-sm">Not set</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={`text-xs ${getStatusColor(student.status || 'active')}`}>
                          {student.status || 'active'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/goal-data?student=${student.id}`)
                            }}
                          >
                            Collect Data
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1" onClick={(e) => { e.stopPropagation(); handlers.onStudentClick(student) }}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600 mb-6">No students match your current search and filter criteria.</p>
              <Button onClick={handlers.onAddStudent}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={state.isStudentDetailOpen} onOpenChange={(open) => updateState({ isStudentDetailOpen: open })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {state.selectedStudent?.profile_picture_url && (
                    <img 
                      src={state.selectedStudent.profile_picture_url} 
                      alt={state.selectedStudent.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                  )}
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: state.selectedStudent?.profile_picture_url ? 'none' : 'flex'}}>
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">
                    {state.selectedStudent?.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Student ID: {state.selectedStudent?.student_id} • Grade: {state.selectedStudent?.grade} • Status: Active
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateState({ isStudentDetailOpen: false })}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  title="Edit Student"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  title="View IEP"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {state.selectedStudent && (
            <Suspense fallback={<StudentListSkeleton />}>
              <StudentDetailDialog student={state.selectedStudent} />
            </Suspense>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default memo(AllStudentsContent)
