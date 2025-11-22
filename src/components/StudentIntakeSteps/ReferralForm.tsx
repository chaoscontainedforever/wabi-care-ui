"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Calendar } from "lucide-react"

interface ReferralData {
  referralSource: string
  referralDate: string
  referringPhysician: string
  physicianPhone: string
  referralNotes: string
  urgentPriority: boolean
  expectedStartDate: string
}

interface ReferralFormProps {
  data: ReferralData | undefined
  onUpdate: (data: ReferralData) => void
  onNext?: () => void
}

export function ReferralForm({ data, onUpdate, onNext }: ReferralFormProps) {
  // Initialize with default values if data is undefined
  const formData: ReferralData = data || {
    referralSource: '',
    referralDate: '',
    referringPhysician: '',
    physicianPhone: '',
    referralNotes: '',
    urgentPriority: false,
    expectedStartDate: ''
  }

  const updateField = (field: keyof ReferralData, value: string | boolean) => {
    onUpdate({ ...formData, [field]: value })
  }

  const isFormComplete = () => {
    return (
      formData.referralSource.trim() !== '' &&
      formData.referralDate.trim() !== ''
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Referral Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="referralSource">Referral Source *</Label>
            <Select
              value={formData.referralSource}
              onValueChange={(value) => updateField("referralSource", value)}
            >
              <SelectTrigger id="referralSource">
                <SelectValue placeholder="Select referral source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physician">Physician</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="parent">Parent/Guardian</SelectItem>
                <SelectItem value="self">Self-Referral</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralDate">Referral Date *</Label>
            <Input
              id="referralDate"
              type="date"
              value={formData.referralDate}
              onChange={(e) => updateField("referralDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referringPhysician">Referring Physician/Provider</Label>
            <Input
              id="referringPhysician"
              value={formData.referringPhysician}
              onChange={(e) => updateField("referringPhysician", e.target.value)}
              placeholder="Dr. John Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="physicianPhone">Provider Phone</Label>
            <Input
              id="physicianPhone"
              type="tel"
              value={formData.physicianPhone}
              onChange={(e) => updateField("physicianPhone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referralNotes">Referral Notes</Label>
          <Textarea
            id="referralNotes"
            value={formData.referralNotes}
            onChange={(e) => updateField("referralNotes", e.target.value)}
            placeholder="Additional notes about the referral..."
            rows={4}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="urgentPriority"
            checked={formData.urgentPriority}
            onChange={(e) => updateField("urgentPriority", e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="urgentPriority" className="cursor-pointer">
            Mark as urgent priority
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedStartDate">Expected Start Date</Label>
          <Input
            id="expectedStartDate"
            type="date"
            value={formData.expectedStartDate}
            onChange={(e) => updateField("expectedStartDate", e.target.value)}
          />
        </div>
      </div>

      {onNext && (
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={onNext} 
            disabled={!isFormComplete()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Next: Verify Insurance
          </Button>
        </div>
      )}
    </div>
  )
}

