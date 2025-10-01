"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  FileText, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  ChevronRight,
  AlertCircle
} from "lucide-react"

interface DraftIntake {
  id: string
  studentName: string
  createdAt: string
  lastModified: string
  currentStep: number
  totalSteps: number
  progress: number
  studentInfo: {
    firstName: string
    lastName: string
    dateOfBirth?: string
    grade?: string
    school?: string
  }
  supportingDocuments: {
    documents: Array<{
      id: string
      name: string
      type: string
    }>
  }
  goals: {
    assignedGoals: Array<{
      id: string
      title: string
    }>
  }
}

interface RecentDraftsProps {
  onContinueDraft: (draftId: string) => void
  refreshTrigger?: number
}

export default function RecentDrafts({ onContinueDraft, refreshTrigger }: RecentDraftsProps) {
  const [drafts, setDrafts] = useState<DraftIntake[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDrafts()
  }, [refreshTrigger])

  const loadDrafts = () => {
    try {
      // Load drafts from localStorage
      const savedDrafts = localStorage.getItem('studentIntakeDrafts')
      if (savedDrafts) {
        const parsedDrafts = JSON.parse(savedDrafts)
        // Show only the 3 most recent drafts
        const recentDrafts = parsedDrafts
          .sort((a: DraftIntake, b: DraftIntake) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
          .slice(0, 3)
        setDrafts(recentDrafts)
      }
    } catch (error) {
      console.error('Failed to load drafts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinueDraft = (draftId: string) => {
    onContinueDraft(draftId)
  }

  const deleteDraft = (draftId: string) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== draftId)
    setDrafts(updatedDrafts)
    
    // Update localStorage
    const allDrafts = JSON.parse(localStorage.getItem('studentIntakeDrafts') || '[]')
    const updatedAllDrafts = allDrafts.filter((draft: DraftIntake) => draft.id !== draftId)
    localStorage.setItem('studentIntakeDrafts', JSON.stringify(updatedAllDrafts))
  }

  const getStepName = (step: number) => {
    switch (step) {
      case 1: return 'Student Information'
      case 2: return 'Supporting Documents'
      case 3: return 'Assign Goals'
      default: return 'Unknown Step'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (drafts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No recent drafts</p>
            <p className="text-xs text-gray-500 mt-1">Start a new intake to create your first draft</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Drafts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs">
                  {draft.studentInfo.firstName.charAt(0)}{draft.studentInfo.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{draft.studentName}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Step {draft.currentStep}/3
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {getStepName(draft.currentStep)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(draft.lastModified).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-12 h-1 bg-gray-200 rounded-full">
                <div 
                  className={`h-1 rounded-full ${getProgressColor(draft.progress)}`}
                  style={{ width: `${draft.progress}%` }}
                ></div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleContinueDraft(draft.id)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteDraft(draft.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {drafts.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Showing {drafts.length} most recent draft{drafts.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
