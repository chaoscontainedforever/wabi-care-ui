"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Save, CheckCircle } from "lucide-react"
import StudentInfoStep from "./StudentIntakeSteps/StudentInfoStep"
import SupportingDocumentsStep from "./StudentIntakeSteps/SupportingDocumentsStep"
import AssignGoalsStep from "./StudentIntakeSteps/AssignGoalsStep"
import RecentDrafts from "./RecentDrafts"

interface IntakeData {
  studentInfo: {
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
  supportingDocuments: {
    documents: Array<{
      id: string
      name: string
      type: string
      source: 'upload' | 'onedrive' | 'googledrive'
      url?: string
    }>
  }
  goals: {
    assignedGoals: Array<{
      id: string
      title: string
      description: string
      domain: string
      level: string
      target: number
    }>
  }
}

const STEPS = [
  { id: 1, title: "Student Information", description: "Basic student and parent details" },
  { id: 2, title: "Supporting Documents", description: "Upload assessment forms and documents" },
  { id: 3, title: "Assign Goals", description: "Set up student goals and objectives" }
]

export default function StudentIntakeFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [intakeData, setIntakeData] = useState<IntakeData>({
    studentInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      grade: '',
      school: '',
      studentId: '',
      parentName: '',
      parentEmail: '',
      parentPhone: ''
    },
    supportingDocuments: {
      documents: []
    },
    goals: {
      assignedGoals: []
    }
  })
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Save draft data
  const saveDraft = async () => {
    setIsDraftSaving(true)
    try {
      // Create draft object
      const draftId = `draft-${Date.now()}`
      const studentName = `${intakeData.studentInfo.firstName} ${intakeData.studentInfo.lastName}`.trim() || 'Unnamed Student'
      
      const draft = {
        id: draftId,
        studentName,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        currentStep,
        totalSteps: STEPS.length,
        progress: Math.round((currentStep / STEPS.length) * 100),
        ...intakeData
      }

      // Load existing drafts
      const existingDrafts = JSON.parse(localStorage.getItem('studentIntakeDrafts') || '[]')
      
      // Add or update draft
      const draftIndex = existingDrafts.findIndex((d: any) => d.studentName === studentName)
      if (draftIndex >= 0) {
        existingDrafts[draftIndex] = draft
      } else {
        existingDrafts.push(draft)
      }

      // Save to localStorage
      localStorage.setItem('studentIntakeDrafts', JSON.stringify(existingDrafts))
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Trigger refresh of Recent Drafts
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Failed to save draft:', error)
    } finally {
      setIsDraftSaving(false)
    }
  }

  // Load draft data on component mount
  useEffect(() => {
    const currentDraftId = localStorage.getItem('currentDraftId')
    
    if (currentDraftId) {
      // Load specific draft
      const savedDrafts = localStorage.getItem('studentIntakeDrafts')
      if (savedDrafts) {
        try {
          const drafts = JSON.parse(savedDrafts)
          const draft = drafts.find((d: any) => d.id === currentDraftId)
          if (draft) {
            setIntakeData(draft)
            setCurrentStep(draft.currentStep)
          }
        } catch (error) {
          console.error('Failed to load specific draft:', error)
        }
      }
      // Clear the current draft ID
      localStorage.removeItem('currentDraftId')
    } else {
      // Load general draft data
      const savedDraft = localStorage.getItem('studentIntakeDraft')
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft)
          setIntakeData(parsedDraft)
        } catch (error) {
          console.error('Failed to parse saved draft:', error)
        }
      }
    }
  }, [])

  // Auto-save draft when data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Save to general draft storage
      localStorage.setItem('studentIntakeDraft', JSON.stringify(intakeData))
      
      // Also update drafts list if we have student name
      const studentName = `${intakeData.studentInfo.firstName} ${intakeData.studentInfo.lastName}`.trim()
      if (studentName && studentName !== ' ') {
        const existingDrafts = JSON.parse(localStorage.getItem('studentIntakeDrafts') || '[]')
        const draftIndex = existingDrafts.findIndex((d: any) => d.studentName === studentName)
        
        if (draftIndex >= 0) {
          // Update existing draft
          existingDrafts[draftIndex] = {
            ...existingDrafts[draftIndex],
            lastModified: new Date().toISOString(),
            currentStep,
            progress: Math.round((currentStep / STEPS.length) * 100),
            ...intakeData
          }
          localStorage.setItem('studentIntakeDrafts', JSON.stringify(existingDrafts))
        }
      }
    }, 2000)
    
    return () => clearTimeout(timeoutId)
  }, [intakeData, currentStep])

  const updateIntakeData = (stepData: Partial<IntakeData>) => {
    setIntakeData(prev => ({ ...prev, ...stepData }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeIntake = async () => {
    try {
      // Mock API call to save complete intake
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Clear draft data
      localStorage.removeItem('studentIntakeDraft')
      
      // Redirect to student overview
      router.push('/student-overview')
    } catch (error) {
      console.error('Failed to complete intake:', error)
    }
  }

  const handleContinueDraft = (draftId: string) => {
    // Set the draft ID in localStorage for the intake flow to load
    localStorage.setItem('currentDraftId', draftId)
    // Reload the page to load the draft
    window.location.reload()
  }

  const progressPercentage = (currentStep / STEPS.length) * 100

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StudentInfoStep
            data={intakeData.studentInfo}
            onUpdate={(data) => updateIntakeData({ studentInfo: data })}
          />
        )
      case 2:
        return (
          <SupportingDocumentsStep
            data={intakeData.supportingDocuments}
            onUpdate={(data) => updateIntakeData({ supportingDocuments: data })}
          />
        )
      case 3:
        return (
          <AssignGoalsStep
            data={intakeData.goals}
            studentInfo={intakeData.studentInfo}
            onUpdate={(data) => updateIntakeData({ goals: data })}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Intake</h1>
            <p className="text-sm text-gray-600 mt-1">Create a new student profile and IEP record</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={saveDraft}
              disabled={isDraftSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isDraftSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-500 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="w-12 h-0.5 bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Intake Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Current Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg font-semibold">{STEPS[currentStep - 1].title}</span>
                <span className="text-sm text-gray-500">(Step {currentStep} of {STEPS.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderCurrentStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStep === STEPS.length ? (
                <Button
                  onClick={completeIntake}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Intake
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Drafts Sidebar */}
        <div className="lg:col-span-1">
          <RecentDrafts onContinueDraft={handleContinueDraft} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
