"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, XCircle, AlertCircle, User, CreditCard } from "lucide-react"

interface InsuranceData {
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

interface VerifyInsuranceFormProps {
  data: InsuranceData | undefined
  onUpdate: (data: InsuranceData) => void
  onNext?: () => void
}

export function VerifyInsuranceForm({ data, onUpdate, onNext }: VerifyInsuranceFormProps) {
  const [manualVerificationComplete, setManualVerificationComplete] = useState(false)

  // Initialize with default values if data is undefined
  const formData: InsuranceData = data || {
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    policyHolderName: '',
    policyHolderDOB: '',
    relationship: '',
    verificationStatus: "pending",
    coverageType: '',
    authorizationRequired: false
  }

  const updateField = (field: keyof InsuranceData, value: any) => {
    onUpdate({ ...formData, [field]: value })
  }

  const handleVerify = async () => {
    // Mock verification process
    updateField("verificationStatus", "pending")
    setTimeout(() => {
      updateField("verificationStatus", "verified")
      updateField("verificationDate", new Date().toISOString().split("T")[0])
    }, 2000)
  }

  const getStatusBadge = () => {
    switch (formData.verificationStatus) {
      case "verified":
        return <Badge className="bg-emerald-500"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>
      case "failed":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
      case "needs-review":
        return <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" />Needs Review</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Insurance Provider Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-foreground">Insurance Provider Details</h3>
          </div>
          {getStatusBadge()}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
            <Select
              value={formData.insuranceProvider}
              onValueChange={(value) => updateField("insuranceProvider", value)}
            >
              <SelectTrigger id="insuranceProvider">
                <SelectValue placeholder="Select insurance provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aetna">Aetna</SelectItem>
                <SelectItem value="blue-cross">Blue Cross Blue Shield</SelectItem>
                <SelectItem value="cigna">Cigna</SelectItem>
                <SelectItem value="united-healthcare">United Healthcare</SelectItem>
                <SelectItem value="medicaid">Medicaid</SelectItem>
                <SelectItem value="medicare">Medicare</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyNumber">Policy Number *</Label>
            <Input
              id="policyNumber"
              value={formData.policyNumber}
              onChange={(e) => updateField("policyNumber", e.target.value)}
              placeholder="Enter policy number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupNumber">Group Number</Label>
            <Input
              id="groupNumber"
              value={formData.groupNumber}
              onChange={(e) => updateField("groupNumber", e.target.value)}
              placeholder="Enter group number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverageType">Coverage Type *</Label>
            <Select
              value={formData.coverageType}
              onValueChange={(value) => updateField("coverageType", value)}
            >
              <SelectTrigger id="coverageType">
                <SelectValue placeholder="Select coverage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="tertiary">Tertiary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Policy Holder Information */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 pt-2">
          <User className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Policy Holder Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="policyHolderName">Policy Holder Name *</Label>
            <Input
              id="policyHolderName"
              value={formData.policyHolderName}
              onChange={(e) => updateField("policyHolderName", e.target.value)}
              placeholder="Enter policy holder name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyHolderDOB">Policy Holder Date of Birth</Label>
            <Input
              id="policyHolderDOB"
              type="date"
              value={formData.policyHolderDOB}
              onChange={(e) => updateField("policyHolderDOB", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship to Patient *</Label>
            <Select
              value={formData.relationship}
              onValueChange={(value) => updateField("relationship", value)}
            >
              <SelectTrigger id="relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Self</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Coverage Details */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 pt-2">
          <CreditCard className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-foreground">Coverage Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="copayAmount">Copay Amount</Label>
            <Input
              id="copayAmount"
              type="number"
              step="0.01"
              value={formData.copayAmount || ""}
              onChange={(e) => updateField("copayAmount", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deductible">Deductible</Label>
            <Input
              id="deductible"
              type="number"
              step="0.01"
              value={formData.deductible || ""}
              onChange={(e) => updateField("deductible", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Authorization */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="authorizationRequired"
            checked={formData.authorizationRequired}
            onChange={(e) => updateField("authorizationRequired", e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="authorizationRequired" className="cursor-pointer font-semibold text-base">
            Authorization Required
          </Label>
        </div>

        {formData.authorizationRequired && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="authorizationNumber">Authorization Number</Label>
            <Input
              id="authorizationNumber"
              value={formData.authorizationNumber || ""}
              onChange={(e) => updateField("authorizationNumber", e.target.value)}
              placeholder="Enter authorization number"
            />
          </div>
        )}
      </div>

      {/* Verification Actions */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="manualVerification"
            checked={manualVerificationComplete}
            onChange={(e) => setManualVerificationComplete(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="manualVerification" className="cursor-pointer font-medium">
            Manual Verification Complete
          </Label>
        </div>

        <div className="flex justify-between pt-2">
          <Button onClick={handleVerify} variant="outline">
            Verify Insurance
          </Button>
          {onNext && (
            <Button 
              onClick={onNext}
              disabled={!formData.insuranceProvider || !formData.policyNumber || (!manualVerificationComplete && formData.verificationStatus === "pending")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Next: Preauthorization
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

