"use client"

import { memo, useState, useCallback, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Search, 
  Plus, 
  Grid3X3,
  List,
  Table,
  Target,
  Mic,
  RefreshCw
} from "@/components/icons"
import { useStudents, useGoals } from "@/hooks/useSupabase"
import type { Tables } from "@/lib/database.types"

type DataCollectionContentProps = {
  preselectedStudentId?: string | null
}

function DataCollectionContent({ preselectedStudentId }: DataCollectionContentProps) {
  // Consolidated state management
  const [state, setState] = useState({
    selectedStudent: preselectedStudentId ?? null,
    isPreselectionHandled: false,
    searchTerm: "",
    filterDomain: "all",
    viewFormat: "cards" as "cards" | "list" | "table",
    goalSearchTerm: "",
    goalFilterDomain: "all",
    activeGoalId: null as string | null,
    goalDetailTab: "collect",
    hasMounted: false,
    sessionDate: new Date().toISOString().split('T')[0],
    activeTab: "students",
    // Metrics collection state
    attempts: "",
    prompts: "",
    notes: ""
  })

  // State update helper
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Data hooks
  const { students, loading: studentsLoading, error: studentsError } = useStudents()
  const { goals, loading: goalsLoading, error: goalsError } = useGoals(state.selectedStudent)

  // Handle preselection
  useEffect(() => {
    if (!state.isPreselectionHandled && preselectedStudentId) {
      updateState({ 
        selectedStudent: preselectedStudentId,
        isPreselectionHandled: true 
      })
    }
  }, [preselectedStudentId, state.isPreselectionHandled, updateState])

  useEffect(() => {
    updateState({ hasMounted: true })
  }, [updateState])

  // Memoized filtered students
  const filteredStudents = useMemo(() => {
    if (studentsLoading) return []
    return students.filter(student =>
      student.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(state.searchTerm.toLowerCase())
    )
  }, [students, state.searchTerm, studentsLoading])

  // Memoized filtered goals
  const filteredGoals = useMemo(() => {
    if (goalsLoading) return []
    return goals.filter(goal =>
      goal.title.toLowerCase().includes(state.goalSearchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(state.goalSearchTerm.toLowerCase())
    )
  }, [goals, state.goalSearchTerm, goalsLoading])

  // Memoized handlers
  const handlers = useMemo(() => ({
    onStudentSelect: (studentId: string) => updateState({ selectedStudent: studentId }),
    onSearchChange: (term: string) => updateState({ searchTerm: term }),
    onFilterChange: (domain: string) => updateState({ filterDomain: domain }),
    onViewFormatChange: (format: "cards" | "list" | "table") => updateState({ viewFormat: format }),
    onGoalSearchChange: (term: string) => updateState({ goalSearchTerm: term }),
    onGoalFilterChange: (domain: string) => updateState({ goalFilterDomain: domain }),
    onGoalSelect: (goalId: string) => updateState({ activeGoalId: goalId }),
    onGoalDetailTabChange: (tab: string) => updateState({ goalDetailTab: tab }),
    onSessionDateChange: (date: string) => updateState({ sessionDate: date }),
    onTabChange: (tab: string) => updateState({ activeTab: tab }),
    // Metrics collection handlers
    onAttemptsChange: (attempts: string) => updateState({ attempts }),
    onPromptsChange: (prompts: string) => updateState({ prompts }),
    onNotesChange: (notes: string) => updateState({ notes }),
    onSaveMetrics: () => {
      // TODO: Implement save logic
      console.log("Saving metrics:", { 
        goalId: state.activeGoalId, 
        attempts: state.attempts, 
        prompts: state.prompts, 
        notes: state.notes 
      })
      // Reset form after saving
      updateState({ attempts: "", prompts: "", notes: "" })
    }
  }), [updateState, state.activeGoalId, state.attempts, state.prompts, state.notes])

  if (!state.hasMounted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Collection</CardTitle>
              <CardDescription>Collect and manage student data</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={state.activeTab} onValueChange={handlers.onTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Student</CardTitle>
                  <CardDescription>Choose a student to collect data for</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={state.searchTerm}
                    onChange={(e) => handlers.onSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={state.filterDomain} onValueChange={handlers.onFilterChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="autism">Autism</SelectItem>
                    <SelectItem value="adhd">ADHD</SelectItem>
                    <SelectItem value="learning">Learning Disability</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Format Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={state.viewFormat === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlers.onViewFormatChange("cards")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={state.viewFormat === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlers.onViewFormatChange("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={state.viewFormat === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlers.onViewFormatChange("table")}
                >
                  <Table className="h-4 w-4" />
                </Button>
              </div>

              {/* Students List */}
              {studentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading students...</p>
                </div>
              ) : studentsError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{studentsError}</p>
                </div>
              ) : (
                <>
                  {state.viewFormat === "cards" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStudents.map((student) => (
                        <Card 
                          key={student.id} 
                          className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
                            state.selectedStudent === student.id ? 'ring-2 ring-pink-500 bg-pink-50' : ''
                          }`}
                          onClick={() => handlers.onStudentSelect(student.id)}
                        >
                          <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={student.profile_picture_url || undefined} />
                                <AvatarFallback>
                                  <User className="h-6 w-6 text-blue-600" />
                                </AvatarFallback>
                              </Avatar>
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
                              <Badge variant="outline" className="text-xs">
                                Active
                              </Badge>
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
                          className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
                            state.selectedStudent === student.id ? 'ring-2 ring-pink-500 bg-pink-50' : ''
                          }`}
                          onClick={() => handlers.onStudentSelect(student.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={student.profile_picture_url || undefined} />
                                  <AvatarFallback>
                                    <User className="h-5 w-5 text-blue-600" />
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-base text-gray-900">{student.name}</h3>
                                  <p className="text-sm text-muted-foreground">{student.grade} • Age {student.age} • {student.disability}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                Active
                              </Badge>
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
                            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr 
                              key={student.id}
                              className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                state.selectedStudent === student.id ? 'bg-pink-50' : ''
                              }`}
                              onClick={() => handlers.onStudentSelect(student.id)}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={student.profile_picture_url || undefined} />
                                    <AvatarFallback>
                                      <User className="h-4 w-4 text-blue-600" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-sm">{student.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {student.student_id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm">{student.grade}</td>
                              <td className="py-3 px-4 text-sm">{student.disability}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="text-xs">
                                  Active
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                      <p className="text-gray-600">No students match your search criteria.</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Goals</CardTitle>
                  <CardDescription>
                    {state.selectedStudent ? `Goals for selected student` : 'Select a student to view their goals'}
                  </CardDescription>
                </div>
                <Button size="sm" disabled={!state.selectedStudent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!state.selectedStudent ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Please select a student first</p>
                </div>
              ) : goalsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading goals...</p>
                </div>
              ) : goalsError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{goalsError}</p>
                </div>
              ) : (
                <>
                  {/* Search and Filters */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search goals..."
                        value={state.goalSearchTerm}
                        onChange={(e) => handlers.onGoalSearchChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={state.goalFilterDomain} onValueChange={handlers.onGoalFilterChange}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Domain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Domains</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Goals List */}
                  <div className="space-y-4">
                    {filteredGoals.map((goal) => (
                      <Card 
                        key={goal.id}
                        className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
                          state.activeGoalId === goal.id ? 'ring-2 ring-pink-500 bg-pink-50' : ''
                        }`}
                        onClick={() => handlers.onGoalSelect(goal.id)}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base text-gray-900 mb-1">{goal.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">{goal.domain}</Badge>
                                <Badge variant="outline" className="text-xs">{goal.level}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Metrics Collection Section - Show when any goal is selected */}
                  {state.activeGoalId && filteredGoals.find(goal => goal.id === state.activeGoalId) && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Collect Metrics</CardTitle>
                        <CardDescription>
                          Record attempts and prompts for the selected goal
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Attempts Selection */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Attempts</label>
                          <Select value={state.attempts} onValueChange={handlers.onAttemptsChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select attempt level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="independent">Independent</SelectItem>
                              <SelectItem value="1-2-prompts">1-2 Prompts</SelectItem>
                              <SelectItem value="more-than-2-prompts">More than 2 Prompts</SelectItem>
                              <SelectItem value="no-response">No response</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Prompts Selection */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Prompts</label>
                          <Select value={state.prompts} onValueChange={handlers.onPromptsChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select prompt level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="independent">Independent</SelectItem>
                              <SelectItem value="1-2-prompts">1-2 Prompts</SelectItem>
                              <SelectItem value="more-than-2-prompts">More than 2 Prompts</SelectItem>
                              <SelectItem value="no-response">No response</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Notes */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Notes</label>
                          <Textarea
                            placeholder="Add any additional notes about the session..."
                            value={state.notes}
                            onChange={(e) => handlers.onNotesChange(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                          <Button 
                            onClick={handlers.onSaveMetrics}
                            disabled={!state.attempts || !state.prompts}
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Save Metrics
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {filteredGoals.length === 0 && (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Found</h3>
                      <p className="text-gray-600">No goals match your search criteria.</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Recorder</CardTitle>
              <CardDescription>
                {state.selectedStudent ? `Record session data for selected student` : 'Select a student to start recording'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!state.selectedStudent ? (
                <div className="text-center py-8">
                  <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Please select a student first</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Session Date</label>
                    <Input
                      type="date"
                      value={state.sessionDate}
                      onChange={(e) => handlers.onSessionDateChange(e.target.value)}
                    />
                  </div>
                  <div className="text-center py-8">
                    <p className="text-gray-600">Session recording functionality will be implemented here.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default memo(DataCollectionContent)
