"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stethoscope, FileText } from "lucide-react"

interface DiagnosisData {
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

interface DiagnosisFormProps {
  data: DiagnosisData | undefined
  onUpdate: (data: DiagnosisData) => void
  onNext?: () => void
}

export function DiagnosisForm({ data, onUpdate, onNext }: DiagnosisFormProps) {
  // Initialize with default values if data is undefined
  const formData: DiagnosisData = data || {
    primaryDiagnosis: '',
    diagnosisCode: '',
    diagnosisDate: '',
    diagnosingPhysician: '',
    clinicalNotes: '',
    severity: '',
    comorbidities: [],
    additionalDiagnoses: []
  }

  const updateField = (field: keyof DiagnosisData, value: any) => {
    onUpdate({ ...formData, [field]: value })
  }

  const addComorbidity = () => {
    // Simplified - in real app would have a dialog or inline input
    updateField("comorbidities", [...formData.comorbidities, ""])
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Diagnosis Information</h3>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryDiagnosis">Primary Diagnosis *</Label>
              <Input
                id="primaryDiagnosis"
                value={formData.primaryDiagnosis}
                onChange={(e) => updateField("primaryDiagnosis", e.target.value)}
                placeholder="e.g., Autism Spectrum Disorder"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosisCode">Diagnosis Code (ICD-10) *</Label>
              <Input
                id="diagnosisCode"
                value={formData.diagnosisCode}
                onChange={(e) => updateField("diagnosisCode", e.target.value)}
                placeholder="e.g., F84.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosisDate">Diagnosis Date *</Label>
              <Input
                id="diagnosisDate"
                type="date"
                value={formData.diagnosisDate}
                onChange={(e) => updateField("diagnosisDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosingPhysician">Diagnosing Physician *</Label>
              <Input
                id="diagnosingPhysician"
                value={formData.diagnosingPhysician}
                onChange={(e) => updateField("diagnosingPhysician", e.target.value)}
                placeholder="Dr. Name"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => updateField("severity", value)}
              >
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                  <SelectItem value="profound">Profound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="clinicalNotes">Clinical Notes</Label>
              <Textarea
                id="clinicalNotes"
                value={formData.clinicalNotes}
                onChange={(e) => updateField("clinicalNotes", e.target.value)}
                placeholder="Enter clinical observations and notes..."
                rows={5}
              />
            </div>
          </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 pt-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Comorbidities & Additional Diagnoses</h3>
        </div>
          <div className="space-y-2">
            <Label>Comorbidities</Label>
            <div className="space-y-2">
              {formData.comorbidities.map((comorbidity, index) => (
                <Input
                  key={index}
                  value={comorbidity}
                  onChange={(e) => {
                    const updated = [...formData.comorbidities]
                    updated[index] = e.target.value
                    updateField("comorbidities", updated)
                  }}
                  placeholder="Enter comorbidity"
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addComorbidity}
                className="w-full"
              >
                + Add Comorbidity
              </Button>
            </div>
          </div>
      </div>

      {onNext && (
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={onNext}
            disabled={!formData.primaryDiagnosis || !formData.diagnosisCode}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Next: Initial Assessment
          </Button>
        </div>
      )}
    </div>
  )
}

