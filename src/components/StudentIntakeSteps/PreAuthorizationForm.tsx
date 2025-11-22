"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"

interface PreAuthorizationData {
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

interface PreAuthorizationFormProps {
  data: PreAuthorizationData | undefined
  onUpdate: (data: PreAuthorizationData) => void
  onNext?: () => void
}

export function PreAuthorizationForm({ data, onUpdate, onNext }: PreAuthorizationFormProps) {
  // Initialize with default values if data is undefined
  const formData: PreAuthorizationData = data || {
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
  }

  const updateField = (field: keyof PreAuthorizationData, value: string | boolean) => {
    onUpdate({ ...formData, [field]: value })
  }

  const getStatusBadge = () => {
    switch (formData.status) {
      case "approved":
        return <Badge className="bg-emerald-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "denied":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Denied</Badge>
      case "pending-review":
        return <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" />Pending Review</Badge>
      case "submitted":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Submitted</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const isFormValid = formData.authorizationRequired 
    ? (formData.authorizationType && formData.authorizationNumber && formData.authorizationStartDate && formData.authorizationEndDate && formData.serviceType && formData.unitsRequested)
    : true // If authorization not required, form is valid

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-foreground">Pre-Authorization Information</h3>
          </div>
          {formData.authorizationRequired && getStatusBadge()}
        </div>

        <div className="flex items-center gap-2">
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
          <div className="space-y-4 pt-4 border-t border-primary/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authorizationType">Authorization Type *</Label>
                <Select
                  value={formData.authorizationType}
                  onValueChange={(value) => updateField("authorizationType", value)}
                >
                  <SelectTrigger id="authorizationType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">Initial</SelectItem>
                    <SelectItem value="reauthorization">Reauthorization</SelectItem>
                    <SelectItem value="add-units">Add Units</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorizationNumber">Authorization Number *</Label>
                <Input
                  id="authorizationNumber"
                  value={formData.authorizationNumber}
                  onChange={(e) => updateField("authorizationNumber", e.target.value)}
                  placeholder="Enter authorization number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorizationStartDate">Start Date *</Label>
                <Input
                  id="authorizationStartDate"
                  type="date"
                  value={formData.authorizationStartDate}
                  onChange={(e) => updateField("authorizationStartDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorizationEndDate">End Date *</Label>
                <Input
                  id="authorizationEndDate"
                  type="date"
                  value={formData.authorizationEndDate}
                  onChange={(e) => updateField("authorizationEndDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => updateField("serviceType", value)}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aba-therapy">ABA Therapy</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="parent-training">Parent Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitsRequested">Units Requested *</Label>
                <Input
                  id="unitsRequested"
                  type="number"
                  value={formData.unitsRequested}
                  onChange={(e) => updateField("unitsRequested", e.target.value)}
                  placeholder="e.g., 40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitsApproved">Units Approved</Label>
                <Input
                  id="unitsApproved"
                  type="number"
                  value={formData.unitsApproved}
                  onChange={(e) => updateField("unitsApproved", e.target.value)}
                  placeholder="e.g., 30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submittedDate">Submitted Date</Label>
                <Input
                  id="submittedDate"
                  type="date"
                  value={formData.submittedDate}
                  onChange={(e) => updateField("submittedDate", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="authorizationNotes">Authorization Notes</Label>
                <Textarea
                  id="authorizationNotes"
                  value={formData.authorizationNotes}
                  onChange={(e) => updateField("authorizationNotes", e.target.value)}
                  placeholder="Add any relevant notes about the authorization..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField("status", value as PreAuthorizationData["status"])}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                    <SelectItem value="pending-review">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {onNext && (
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={onNext}
            disabled={!isFormValid}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Next: Diagnosis Data
          </Button>
        </div>
      )}
    </div>
  )
}
