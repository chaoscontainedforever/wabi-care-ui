"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Save, FileText } from "lucide-react"
import { IntakeLifecycleCard, type IntakePhase, type PhaseConfig } from "./StudentIntakeSteps/IntakeLifecycleCard"
import { ReferralForm } from "./StudentIntakeSteps/ReferralForm"
import { PreAuthorizationForm } from "./StudentIntakeSteps/PreAuthorizationForm"
import { VerifyInsuranceForm } from "./StudentIntakeSteps/VerifyInsuranceForm"
import { DiagnosisForm } from "./StudentIntakeSteps/DiagnosisForm"
import { InitialAssessmentForm } from "./StudentIntakeSteps/InitialAssessmentForm"
const RecentDrafts = dynamic(() => import("./RecentDrafts"), {
  loading: () => <StepSkeleton title="Loading drafts" />,
})

interface IntakeData {
  referral: {
    referralSource: string
    referralDate: string
    referringPhysician: string
    physicianPhone: string
    referralNotes: string
    urgentPriority: boolean
    expectedStartDate: string
  }
  preAuthorization: {
    authorizationRequired: boolean
    authorizationType: string
    authorizationNumber: string
    authorizationStartDate: string
    authorizationEndDate: string
    serviceType: string
    unitsRequested: string
    unitsApproved: string
    authorizationNotes: string
    submittedDate: string
    status: "pending" | "submitted" | "approved" | "denied" | "pending-review"
  }
  verifyInsurance: {
    insuranceProvider: string
    policyNumber: string
    groupNumber: string
    policyHolderName: string
    policyHolderDOB: string
    relationship: string
    verificationStatus: "pending" | "verified" | "failed" | "needs-review"
    verificationDate?: string
    coverageType: string
    copayAmount?: string
    deductible?: string
    authorizationRequired: boolean
    authorizationNumber?: string
  }
  dataIntake: {
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
  diagnosis: {
    primaryDiagnosis: string
    diagnosisCode: string
    diagnosisDate: string
    diagnosingPhysician: string
    clinicalNotes: string
    severity: string
    comorbidities: string[]
    additionalDiagnoses: Array<{
      diagnosis: string
      code: string
      date: string
    }>
  }
    initialAssessment: {
      assessmentDate: string
      assessedBy: string
      assessmentType: string
      assessmentTools: string[]
      baselineData: string
      functionalAreas: Array<{
        area: string
        currentLevel: string
        notes: string
      }>
      treatmentPlan: {
        targetBehaviors: Array<{
          behavior: string
          frequency: string
          intensity: string
          context: string
        }>
        interventionStrategies: Array<{
          strategy: string
          description: string
        }>
        sessionFrequency: string
        sessionDuration: string
        location: string
      }
      goals: Array<{
        goal: string
        objective: string
        targetDate: string
        measurementCriteria: string
        milestones: Array<{
          milestone: string
          targetDate: string
        }>
      }>
      recommendations: string
      nextSteps: string
    }
}

const PHASES: PhaseConfig[] = [
  { id: "referral", label: "Referral", status: "in-progress" },
  { id: "verify-insurance", label: "Verify Insurance", status: "pending" },
  { id: "pre-authorization", label: "Preauthorization", status: "pending" },
  { id: "diagnosis", label: "Diagnosis Data", status: "pending" },
  { id: "initial-assessment", label: "Initial Assessment", status: "pending" },
]

export default function StudentIntakeFlow() {
  const router = useRouter()
  const [activePhase, setActivePhase] = useState<IntakePhase>("referral")
  const [phases, setPhases] = useState<PhaseConfig[]>(PHASES)
  const [intakeData, setIntakeData] = useState<IntakeData>({
    referral: {
      referralSource: '',
      referralDate: '',
      referringPhysician: '',
      physicianPhone: '',
      referralNotes: '',
      urgentPriority: false,
      expectedStartDate: ''
    },
    preAuthorization: {
      authorizationRequired: false,
      authorizationType: '',
      authorizationNumber: '',
      authorizationStartDate: '',
      authorizationEndDate: '',
      serviceType: '',
      unitsRequested: '',
      unitsApproved: '',
      authorizationNotes: '',
      submittedDate: '',
      status: "pending"
    },
    verifyInsurance: {
      insuranceProvider: '',
      policyNumber: '',
      groupNumber: '',
      policyHolderName: '',
      policyHolderDOB: '',
      relationship: '',
      verificationStatus: "pending",
      coverageType: '',
      authorizationRequired: false
    },
    dataIntake: {
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
    diagnosis: {
      primaryDiagnosis: '',
      diagnosisCode: '',
      diagnosisDate: '',
      diagnosingPhysician: '',
      clinicalNotes: '',
      severity: '',
      comorbidities: [],
      additionalDiagnoses: []
    },
    initialAssessment: {
      assessmentDate: '',
      assessedBy: '',
      assessmentType: '',
      assessmentTools: [],
      baselineData: '',
      functionalAreas: [],
      treatmentPlan: {
        targetBehaviors: [],
        interventionStrategies: [],
        sessionFrequency: '',
        sessionDuration: '',
        location: ''
      },
      goals: [],
      recommendations: '',
      nextSteps: ''
    }
  })
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [draftCount, setDraftCount] = useState(0)
  const [draftsOpen, setDraftsOpen] = useState(false)

  // Handle phase click
  const handlePhaseClick = (phase: IntakePhase) => {
    setActivePhase(phase)
    // Update phase status to in-progress when clicked
    setPhases(prev => prev.map(p => 
      p.id === phase ? { ...p, status: "in-progress" as const } : p
    ))
  }

  // Navigate to next phase
  const goToNextPhase = () => {
    const currentIndex = phases.findIndex(p => p.id === activePhase)
    if (currentIndex < phases.length - 1) {
      // Mark current phase as completed
      setPhases(prev => prev.map(p => 
        p.id === activePhase ? { ...p, status: "completed" as const } : p
      ))
      
      // Move to next phase
      const nextPhase = phases[currentIndex + 1].id
      setActivePhase(nextPhase as IntakePhase)
      setPhases(prev => prev.map(p => 
        p.id === nextPhase ? { ...p, status: "in-progress" as const } : p
      ))
    }
  }

  // Mark phase as completed
  const markPhaseComplete = (phase: IntakePhase) => {
    setPhases(prev => {
      const updated = prev.map(p => 
        p.id === phase ? { ...p, status: "completed" as const } : p
      )
      // Auto-advance to next phase if available
      const currentIndex = updated.findIndex(p => p.id === phase)
      if (currentIndex < updated.length - 1 && updated[currentIndex + 1].status === "pending") {
        const nextPhase = updated[currentIndex + 1].id
        setTimeout(() => {
          setActivePhase(nextPhase as IntakePhase)
          setPhases(currentPhases => currentPhases.map(p => 
            p.id === nextPhase ? { ...p, status: "in-progress" as const } : p
          ))
        }, 0)
      }
      return updated
    })
  }

  // Save draft data
  const saveDraft = async () => {
    setIsDraftSaving(true)
    try {
      // Create draft object
      const draftId = `draft-${Date.now()}`
      const studentName = 'Student Intake Draft' // Will be updated when student info is collected in later phases
      
      const draft = {
        id: draftId,
        studentName,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        activePhase,
        progress: Math.round((phases.filter(p => p.status === "completed").length / phases.length) * 100),
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
      setDraftCount(existingDrafts.length)
      
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
            setActivePhase(draft.activePhase || "pre-authorization")
            setPhases(draft.phases || PHASES)
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
          if (parsedDraft.intakeData) {
            setIntakeData(parsedDraft.intakeData)
            setActivePhase(parsedDraft.activePhase || "referral")
            setPhases(parsedDraft.phases || PHASES)
          } else {
            // Legacy format support
            setIntakeData(parsedDraft)
          }
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
      localStorage.setItem('studentIntakeDraft', JSON.stringify({ intakeData, activePhase, phases }))
      
      // Auto-save draft - student name will be added later when collected
      const studentName = 'Student Intake Draft'
      if (studentName && studentName.length > 0) {
        const existingDrafts = JSON.parse(localStorage.getItem('studentIntakeDrafts') || '[]')
        const draftIndex = existingDrafts.findIndex((d: any) => d.studentName === studentName)
        
        if (draftIndex >= 0) {
          // Update existing draft
          existingDrafts[draftIndex] = {
            ...existingDrafts[draftIndex],
            lastModified: new Date().toISOString(),
            activePhase,
            progress: Math.round((phases.filter(p => p.status === "completed").length / phases.length) * 100),
            phases,
            ...intakeData
          }
          localStorage.setItem('studentIntakeDrafts', JSON.stringify(existingDrafts))
        }
      }
    }, 2000)
    
    return () => clearTimeout(timeoutId)
  }, [intakeData, activePhase, phases])

  useEffect(() => {
    const drafts = JSON.parse(localStorage.getItem('studentIntakeDrafts') || '[]')
    setDraftCount(drafts.length)
  }, [refreshTrigger])

  const updateIntakeData = (phaseData: Partial<IntakeData>) => {
    setIntakeData(prev => ({ ...prev, ...phaseData }))
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

  const loadDraftManagement = () => {
    setDraftsOpen(true)
  }

  const handleContinueDraft = (draftId: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem('studentIntakeDrafts') || '[]')
      const draft = stored.find((d: any) => d.id === draftId)
      if (!draft) return
      setIntakeData(draft)
      setActivePhase(draft.activePhase || "referral")
      setPhases(draft.phases || PHASES)
      setDraftsOpen(false)
    } catch (error) {
      console.error('Failed to continue draft:', error)
    }
  }

  const renderCurrentPhaseForm = () => {
    switch (activePhase) {
      case "referral":
        return (
          <ReferralForm
            data={intakeData.referral}
            onUpdate={(data) => updateIntakeData({ referral: data })}
            onNext={goToNextPhase}
          />
        )
      case "verify-insurance":
        return (
          <VerifyInsuranceForm
            data={intakeData.verifyInsurance}
            onUpdate={(data) => updateIntakeData({ verifyInsurance: data })}
            onNext={goToNextPhase}
          />
        )
      case "pre-authorization":
        return (
          <PreAuthorizationForm
            data={intakeData.preAuthorization}
            onUpdate={(data) => updateIntakeData({ preAuthorization: data })}
            onNext={goToNextPhase}
          />
        )
      case "diagnosis":
        return (
          <DiagnosisForm
            data={intakeData.diagnosis}
            onUpdate={(data) => updateIntakeData({ diagnosis: data })}
            onNext={goToNextPhase}
          />
        )
      case "initial-assessment":
        return (
          <InitialAssessmentForm
            data={intakeData.initialAssessment}
            onUpdate={(data) => updateIntakeData({ initialAssessment: data })}
          />
        )
      default:
        return null
    }
  }

  const getPhaseTitle = () => {
    const phase = phases.find(p => p.id === activePhase)
    return phase?.label || "Student Intake"
  }

  return (
    <div className="w-full space-y-6">
      {/* Lifecycle Card */}
      <IntakeLifecycleCard
        phases={phases}
        activePhase={activePhase}
        onPhaseClick={handlePhaseClick}
      />

      {/* Phase Form Card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">{getPhaseTitle()}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={saveDraft} disabled={isDraftSaving} className="gap-2" size="sm">
                <Save className="h-4 w-4" />
                {isDraftSaving ? "Saving…" : "Save Draft"}
              </Button>
              <Button variant="ghost" className="gap-2" onClick={loadDraftManagement} size="sm">
                <FileText className="h-4 w-4" />
                Manage Drafts
                {draftCount > 0 && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {draftCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderCurrentPhaseForm()}
        </CardContent>
      </Card>

      <Dialog open={draftsOpen} onOpenChange={setDraftsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Intake Drafts</DialogTitle>
          </DialogHeader>
          <RecentDrafts onContinueDraft={handleContinueDraft} refreshTrigger={refreshTrigger} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StepSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-40 w-full" />
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  )
}
