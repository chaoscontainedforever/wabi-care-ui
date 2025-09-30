"use client"

import { memo, useState, useCallback, useMemo, useEffect, lazy, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "@/components/icons"

// Lazy load heavy components
const StudentSelector = lazy(() => import("./StudentSelector").then(mod => ({ default: mod.StudentSelector })))
const GoalManager = lazy(() => import("./GoalManager").then(mod => ({ default: mod.GoalManager })))
const SessionRecorder = lazy(() => import("./SessionRecorder").then(mod => ({ default: mod.SessionRecorder })))

// Loading skeleton component
const ComponentSkeleton = memo(() => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
))

ComponentSkeleton.displayName = "ComponentSkeleton"

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
    sortBy: "date",
    isAssessmentDialogOpen: false,
    viewFormat: "cards" as "cards" | "list" | "table",
    isSidebarCollapsed: true,
    goalSearchTerm: "",
    goalFilterDomain: "all",
    activeGoalId: null as string | null,
    goalDetailTab: "collect",
    hasMounted: false,
    sessionDate: new Date().toISOString().split('T')[0],
    activeTab: "session-data"
  })

  // State update helper
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

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

  // Memoized handlers to prevent unnecessary re-renders
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
    onTabChange: (tab: string) => updateState({ activeTab: tab })
  }), [updateState])

  if (!state.hasMounted) {
    return (
      <div className="space-y-6">
        <ComponentSkeleton />
        <ComponentSkeleton />
        <ComponentSkeleton />
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
          <Suspense fallback={<ComponentSkeleton />}>
            <StudentSelector
              selectedStudent={state.selectedStudent}
              onStudentSelect={handlers.onStudentSelect}
              searchTerm={state.searchTerm}
              onSearchChange={handlers.onSearchChange}
              filterDomain={state.filterDomain}
              onFilterChange={handlers.onFilterChange}
              viewFormat={state.viewFormat}
              onViewFormatChange={handlers.onViewFormatChange}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <Suspense fallback={<ComponentSkeleton />}>
            <GoalManager
              selectedStudent={state.selectedStudent}
              goalSearchTerm={state.goalSearchTerm}
              onGoalSearchChange={handlers.onGoalSearchChange}
              goalFilterDomain={state.goalFilterDomain}
              onGoalFilterChange={handlers.onGoalFilterChange}
              activeGoalId={state.activeGoalId}
              onGoalSelect={handlers.onGoalSelect}
              goalDetailTab={state.goalDetailTab}
              onGoalDetailTabChange={handlers.onGoalDetailTabChange}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="session" className="mt-6">
          <Suspense fallback={<ComponentSkeleton />}>
            <SessionRecorder
              selectedStudent={state.selectedStudent}
              sessionDate={state.sessionDate}
              onSessionDateChange={handlers.onSessionDateChange}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default memo(DataCollectionContent)
