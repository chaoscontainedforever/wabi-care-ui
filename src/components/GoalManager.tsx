"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Search, Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle } from "@/components/icons"
import { useGoals } from "@/hooks/useSupabase"

interface GoalManagerProps {
  selectedStudent: string | null
  goalSearchTerm: string
  onGoalSearchChange: (term: string) => void
  goalFilterDomain: string
  onGoalFilterChange: (domain: string) => void
  activeGoalId: string | null
  onGoalSelect: (goalId: string) => void
  goalDetailTab: string
  onGoalDetailTabChange: (tab: string) => void
}

const GoalCard = memo(({ goal, onSelect, isActive }: { 
  goal: any, 
  onSelect: (id: string) => void,
  isActive: boolean
}) => (
  <Card 
    className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
      isActive ? 'ring-2 ring-pink-500 bg-pink-50' : ''
    }`}
    onClick={() => onSelect(goal.id)}
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
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="p-1">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="p-1 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">78%</span>
        </div>
        <Progress value={78} className="h-2" />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <CheckCircle className="h-3 w-3 text-green-600" />
          <span>On Track</span>
          <Clock className="h-3 w-3 text-blue-600 ml-2" />
          <span>Last updated: 2 days ago</span>
        </div>
      </div>
    </CardContent>
  </Card>
))

GoalCard.displayName = "GoalCard"

export const GoalManager = memo(function GoalManager({
  selectedStudent,
  goalSearchTerm,
  onGoalSearchChange,
  goalFilterDomain,
  onGoalFilterChange,
  activeGoalId,
  onGoalSelect,
  goalDetailTab,
  onGoalDetailTabChange
}: GoalManagerProps) {
  const { goals, loading: goalsLoading, error: goalsError } = useGoals(selectedStudent)

  const filteredGoals = useMemo(() => {
    if (goalsLoading) return []
    return goals.filter(goal =>
      goal.title.toLowerCase().includes(goalSearchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(goalSearchTerm.toLowerCase())
    )
  }, [goals, goalSearchTerm, goalsLoading])

  if (!selectedStudent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goals</CardTitle>
          <CardDescription>Select a student to view their goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Please select a student first</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (goalsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goals</CardTitle>
          <CardDescription>Loading goals...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (goalsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goals</CardTitle>
          <CardDescription>Error loading goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p>{goalsError}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Goals</CardTitle>
            <CardDescription>Manage student goals and objectives</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search goals..."
              value={goalSearchTerm}
              onChange={(e) => onGoalSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={goalFilterDomain} onValueChange={onGoalFilterChange}>
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
            <GoalCard
              key={goal.id}
              goal={goal}
              onSelect={onGoalSelect}
              isActive={activeGoalId === goal.id}
            />
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Found</h3>
            <p className="text-gray-600">No goals match your search criteria.</p>
          </div>
        )}

        {/* Goal Detail Tabs */}
        {activeGoalId && (
          <Tabs value={goalDetailTab} onValueChange={onGoalDetailTabChange} className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="collect">Collect Data</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="collect" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Collection</CardTitle>
                  <CardDescription>Record performance data for this goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Data collection form will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="progress" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>View progress charts and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Progress charts will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>Add observations and notes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Notes section will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>History</CardTitle>
                  <CardDescription>View all data collection history</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">History table will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
})

GoalManager.displayName = "GoalManager"
