"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardCheck, FileText, Target, Plus, X } from "lucide-react"

interface InitialAssessmentData {
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

interface InitialAssessmentFormProps {
  data: InitialAssessmentData | undefined
  onUpdate: (data: InitialAssessmentData) => void
}

export function InitialAssessmentForm({ data, onUpdate }: InitialAssessmentFormProps) {
  // Initialize with default values if data is undefined
  const formData: InitialAssessmentData = data || {
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

  const updateField = (field: keyof InitialAssessmentData, value: any) => {
    onUpdate({ ...formData, [field]: value })
  }

  const updateTreatmentPlan = (field: keyof InitialAssessmentData["treatmentPlan"], value: any) => {
    onUpdate({ ...formData, treatmentPlan: { ...formData.treatmentPlan, [field]: value } })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Assessment Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assessmentDate">Assessment Date *</Label>
            <Input
              id="assessmentDate"
              type="date"
              value={formData.assessmentDate}
              onChange={(e) => updateField("assessmentDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assessedBy">Assessed By *</Label>
            <Input
              id="assessedBy"
              value={formData.assessedBy}
              onChange={(e) => updateField("assessedBy", e.target.value)}
              placeholder="BCBA Name"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="assessmentType">Assessment Type *</Label>
            <Select
              value={formData.assessmentType}
              onValueChange={(value) => updateField("assessmentType", value)}
            >
              <SelectTrigger id="assessmentType">
                <SelectValue placeholder="Select assessment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vb-mapp">VB-MAPP</SelectItem>
                <SelectItem value="ablls-r">ABLLS-R</SelectItem>
                <SelectItem value="afls">AFLS</SelectItem>
                <SelectItem value="peak">PEAK</SelectItem>
                <SelectItem value="vineland">Vineland Adaptive Behavior Scales</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="baselineData">Baseline Data *</Label>
            <Textarea
              id="baselineData"
              value={formData.baselineData}
              onChange={(e) => updateField("baselineData", e.target.value)}
              placeholder="Enter baseline assessment data, behavioral observations, and initial skill levels..."
              rows={6}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 pt-2">
          <Target className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Treatment Plan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sessionFrequency">Session Frequency *</Label>
            <Select
              value={formData.treatmentPlan.sessionFrequency}
              onValueChange={(value) => updateTreatmentPlan("sessionFrequency", value)}
            >
              <SelectTrigger id="sessionFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1x-week">1x per week</SelectItem>
                <SelectItem value="2x-week">2x per week</SelectItem>
                <SelectItem value="3x-week">3x per week</SelectItem>
                <SelectItem value="4x-week">4x per week</SelectItem>
                <SelectItem value="5x-week">5x per week (Mon-Fri)</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionDuration">Session Duration *</Label>
            <Select
              value={formData.treatmentPlan.sessionDuration}
              onValueChange={(value) => updateTreatmentPlan("sessionDuration", value)}
            >
              <SelectTrigger id="sessionDuration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30min">30 minutes</SelectItem>
                <SelectItem value="45min">45 minutes</SelectItem>
                <SelectItem value="60min">60 minutes</SelectItem>
                <SelectItem value="90min">90 minutes</SelectItem>
                <SelectItem value="120min">120 minutes (2 hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={formData.treatmentPlan.location}
              onValueChange={(value) => updateTreatmentPlan("location", value)}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="home">Home-based</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="hybrid">Hybrid (Clinic + Home)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Target Behaviors</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                updateTreatmentPlan("targetBehaviors", [
                  ...formData.treatmentPlan.targetBehaviors,
                  { behavior: "", frequency: "", intensity: "", context: "" }
                ])
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Behavior
            </Button>
          </div>
          
          {formData.treatmentPlan.targetBehaviors.map((behavior, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Target Behavior {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updated = formData.treatmentPlan.targetBehaviors.filter((_, i) => i !== index)
                    updateTreatmentPlan("targetBehaviors", updated)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Behavior Description *</Label>
                  <Input
                    value={behavior.behavior}
                    onChange={(e) => {
                      const updated = [...formData.treatmentPlan.targetBehaviors]
                      updated[index].behavior = e.target.value
                      updateTreatmentPlan("targetBehaviors", updated)
                    }}
                    placeholder="e.g., Aggressive behavior, Self-stimulatory behavior"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Input
                    value={behavior.frequency}
                    onChange={(e) => {
                      const updated = [...formData.treatmentPlan.targetBehaviors]
                      updated[index].frequency = e.target.value
                      updateTreatmentPlan("targetBehaviors", updated)
                    }}
                    placeholder="e.g., 10x per day, Daily"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Intensity</Label>
                  <Input
                    value={behavior.intensity}
                    onChange={(e) => {
                      const updated = [...formData.treatmentPlan.targetBehaviors]
                      updated[index].intensity = e.target.value
                      updateTreatmentPlan("targetBehaviors", updated)
                    }}
                    placeholder="e.g., Mild, Moderate, Severe"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Context/Triggers</Label>
                  <Input
                    value={behavior.context}
                    onChange={(e) => {
                      const updated = [...formData.treatmentPlan.targetBehaviors]
                      updated[index].context = e.target.value
                      updateTreatmentPlan("targetBehaviors", updated)
                    }}
                    placeholder="e.g., During transitions, When asked to complete tasks"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Intervention Strategies</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                updateTreatmentPlan("interventionStrategies", [
                  ...formData.treatmentPlan.interventionStrategies,
                  { strategy: "", description: "" }
                ])
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Strategy
            </Button>
          </div>
          
          {formData.treatmentPlan.interventionStrategies.map((strategy, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Intervention Strategy {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updated = formData.treatmentPlan.interventionStrategies.filter((_, i) => i !== index)
                    updateTreatmentPlan("interventionStrategies", updated)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Strategy Name *</Label>
                  <Input
                    value={strategy.strategy}
                    onChange={(e) => {
                      const updated = [...formData.treatmentPlan.interventionStrategies]
                      updated[index].strategy = e.target.value
                      updateTreatmentPlan("interventionStrategies", updated)
                    }}
                    placeholder="e.g., Discrete Trial Training (DTT), Natural Environment Teaching (NET)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={strategy.description}
                    onChange={(e) => {
                      const updated = [...formData.treatmentPlan.interventionStrategies]
                      updated[index].description = e.target.value
                      updateTreatmentPlan("interventionStrategies", updated)
                    }}
                    placeholder="Describe how this strategy will be implemented..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 pt-2">
          <Target className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Treatment Goals & Objectives</h3>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              updateField("goals", [
                ...formData.goals,
                {
                  goal: "",
                  objective: "",
                  targetDate: "",
                  measurementCriteria: "",
                  milestones: []
                }
              ])
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {formData.goals.map((goal, goalIndex) => (
          <div key={goalIndex} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-base">Goal {goalIndex + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const updated = formData.goals.filter((_, i) => i !== goalIndex)
                  updateField("goals", updated)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Goal Statement *</Label>
                <Input
                  value={goal.goal}
                  onChange={(e) => {
                    const updated = [...formData.goals]
                    updated[goalIndex].goal = e.target.value
                    updateField("goals", updated)
                  }}
                  placeholder="e.g., Improve communication skills, Reduce aggressive behaviors"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Objective *</Label>
                <Textarea
                  value={goal.objective}
                  onChange={(e) => {
                    const updated = [...formData.goals]
                    updated[goalIndex].objective = e.target.value
                    updateField("goals", updated)
                  }}
                  placeholder="Detailed objective describing what the student will achieve..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Date *</Label>
                <Input
                  type="date"
                  value={goal.targetDate}
                  onChange={(e) => {
                    const updated = [...formData.goals]
                    updated[goalIndex].targetDate = e.target.value
                    updateField("goals", updated)
                  }}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Measurement Criteria *</Label>
                <Textarea
                  value={goal.measurementCriteria}
                  onChange={(e) => {
                    const updated = [...formData.goals]
                    updated[goalIndex].measurementCriteria = e.target.value
                    updateField("goals", updated)
                  }}
                  placeholder="How will progress be measured? (e.g., 80% accuracy, 4/5 opportunities)"
                  rows={2}
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Milestones</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updated = [...formData.goals]
                    updated[goalIndex].milestones.push({
                      milestone: "",
                      targetDate: ""
                    })
                    updateField("goals", updated)
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Milestone
                </Button>
              </div>

              {goal.milestones.map((milestone, milestoneIndex) => (
                <div key={milestoneIndex} className="flex gap-2 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      value={milestone.milestone}
                      onChange={(e) => {
                        const updated = [...formData.goals]
                        updated[goalIndex].milestones[milestoneIndex].milestone = e.target.value
                        updateField("goals", updated)
                      }}
                      placeholder="Milestone description"
                    />
                    <Input
                      type="date"
                      value={milestone.targetDate}
                      onChange={(e) => {
                        const updated = [...formData.goals]
                        updated[goalIndex].milestones[milestoneIndex].targetDate = e.target.value
                        updateField("goals", updated)
                      }}
                      placeholder="Target date"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = [...formData.goals]
                      updated[goalIndex].milestones = updated[goalIndex].milestones.filter(
                        (_, i) => i !== milestoneIndex
                      )
                      updateField("goals", updated)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 pt-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Functional Areas Assessment</h3>
        </div>
        {formData.functionalAreas.map((area, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Functional Area</Label>
                <Input
                  value={area.area}
                  onChange={(e) => {
                    const updated = [...formData.functionalAreas]
                    updated[index].area = e.target.value
                    updateField("functionalAreas", updated)
                  }}
                  placeholder="e.g., Communication, Social Skills"
                />
              </div>
              <div className="space-y-2">
                <Label>Current Level</Label>
                <Input
                  value={area.currentLevel}
                  onChange={(e) => {
                    const updated = [...formData.functionalAreas]
                    updated[index].currentLevel = e.target.value
                    updateField("functionalAreas", updated)
                  }}
                  placeholder="e.g., Level 2"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={area.notes}
                  onChange={(e) => {
                    const updated = [...formData.functionalAreas]
                    updated[index].notes = e.target.value
                    updateField("functionalAreas", updated)
                  }}
                  placeholder="Additional notes"
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            updateField("functionalAreas", [
              ...formData.functionalAreas,
              { area: "", currentLevel: "", notes: "" }
            ])
          }}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Functional Area
        </Button>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="space-y-2 md:col-span-2 pt-2">
          <Label htmlFor="recommendations">Recommendations</Label>
          <Textarea
            id="recommendations"
            value={formData.recommendations}
            onChange={(e) => updateField("recommendations", e.target.value)}
            placeholder="Enter recommendations based on assessment..."
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nextSteps">Next Steps</Label>
          <Textarea
            id="nextSteps"
            value={formData.nextSteps}
            onChange={(e) => updateField("nextSteps", e.target.value)}
            placeholder="Enter recommended next steps..."
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
