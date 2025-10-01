"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  Plus, 
  Target,
  CheckCircle,
  Circle,
  Bookmark,
  AlertCircle,
  Info
} from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  domain: string
  level: string
  target: number
  source: 'iep' | 'manual' | 'bank'
}

interface AssignGoalsData {
  assignedGoals: Goal[]
}

interface StudentInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  school: string
  studentId: string
  parentName: string
  parentEmail: string
  parentPhone: string
  iepDocument?: File
  iepData?: any
}

interface AssignGoalsStepProps {
  data: AssignGoalsData
  studentInfo: StudentInfo
  onUpdate: (data: AssignGoalsData) => void
}

// Mock goal bank data
const GOAL_BANK = [
  {
    id: 'gb-1',
    title: 'Reading Comprehension',
    description: 'Student will read and comprehend grade-level texts with 80% accuracy',
    domain: 'Reading',
    level: 'Level 2',
    target: 80
  },
  {
    id: 'gb-2',
    title: 'Math Problem Solving',
    description: 'Student will solve single-step word problems with 75% accuracy',
    domain: 'Math',
    level: 'Level 1',
    target: 75
  },
  {
    id: 'gb-3',
    title: 'Writing Skills',
    description: 'Student will write complete sentences with proper grammar',
    domain: 'Writing',
    level: 'Level 2',
    target: 70
  },
  {
    id: 'gb-4',
    title: 'Social Skills',
    description: 'Student will initiate and maintain conversations with peers',
    domain: 'Social',
    level: 'Level 3',
    target: 85
  },
  {
    id: 'gb-5',
    title: 'Fine Motor Skills',
    description: 'Student will improve handwriting legibility and speed',
    domain: 'Motor',
    level: 'Level 1',
    target: 60
  }
]

export default function AssignGoalsStep({ data, studentInfo, onUpdate }: AssignGoalsStepProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [showGoalBank, setShowGoalBank] = useState(false)

  // Get goals from IEP data
  const iepGoals = useMemo(() => {
    if (!studentInfo.iepData?.goals) return []
    return studentInfo.iepData.goals.map((goal: any, index: number) => ({
      id: `iep-${index}`,
      title: goal.title,
      description: goal.description,
      domain: goal.domain,
      level: goal.level,
      target: 80, // Default target
      source: 'iep' as const
    }))
  }, [studentInfo.iepData])

  // Filter goal bank based on search
  const filteredGoalBank = useMemo(() => {
    return GOAL_BANK.filter(goal =>
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.domain.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const addSelectedGoals = () => {
    const goalsToAdd = [...iepGoals, ...GOAL_BANK]
      .filter(goal => selectedGoals.includes(goal.id))
      .map(goal => ({ ...goal, source: goal.source }))

    onUpdate({
      assignedGoals: [...data.assignedGoals, ...goalsToAdd]
    })
    
    setSelectedGoals([])
    setShowGoalBank(false)
  }

  const removeGoal = (goalId: string) => {
    onUpdate({
      assignedGoals: data.assignedGoals.filter(goal => goal.id !== goalId)
    })
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'iep':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">From IEP</Badge>
      case 'bank':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Goal Bank</Badge>
      default:
        return <Badge variant="secondary">Manual</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Student Info Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Assign Goals for {studentInfo.firstName} {studentInfo.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Grade:</span>
              <span className="ml-2 font-medium">{studentInfo.grade}</span>
            </div>
            <div>
              <span className="text-gray-500">School:</span>
              <span className="ml-2 font-medium">{studentInfo.school}</span>
            </div>
            <div>
              <span className="text-gray-500">Goals Assigned:</span>
              <span className="ml-2 font-medium">{data.assignedGoals.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IEP Goals (if available) */}
      {iepGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Goals from IEP Document ({iepGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                These goals were automatically extracted from the uploaded IEP document. 
                You can select which ones to assign to the student.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {iepGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedGoals.includes(goal.id)}
                      onCheckedChange={() => toggleGoalSelection(goal.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        {getSourceBadge(goal.source)}
                      </div>
                      <p className="text-xs text-gray-600">{goal.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{goal.domain}</Badge>
                        <Badge variant="outline" className="text-xs">{goal.level}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Bank */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Bank
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGoalBank(!showGoalBank)}
            >
              {showGoalBank ? 'Hide' : 'Browse'} Goal Bank
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showGoalBank && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredGoalBank.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedGoals.includes(goal.id)}
                      onCheckedChange={() => toggleGoalSelection(goal.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        {getSourceBadge('bank')}
                      </div>
                      <p className="text-xs text-gray-600">{goal.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{goal.domain}</Badge>
                        <Badge variant="outline" className="text-xs">{goal.level}</Badge>
                        <Badge variant="outline" className="text-xs">Target: {goal.target}%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedGoals.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm text-blue-800">
                  {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
                </span>
                <Button onClick={addSelectedGoals} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Selected Goals
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Assigned Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Assigned Goals ({data.assignedGoals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.assignedGoals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No goals assigned yet.</p>
              <p className="text-sm">Select goals from the IEP document or Goal Bank above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.assignedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        {getSourceBadge(goal.source)}
                      </div>
                      <p className="text-xs text-gray-600">{goal.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{goal.domain}</Badge>
                        <Badge variant="outline" className="text-xs">{goal.level}</Badge>
                        <Badge variant="outline" className="text-xs">Target: {goal.target}%</Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(goal.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Status */}
      {data.assignedGoals.length > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Ready to proceed!</strong> You have assigned {data.assignedGoals.length} goal{data.assignedGoals.length !== 1 ? 's' : ''} to {studentInfo.firstName}. 
            You can now complete the student intake process.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
