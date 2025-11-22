"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import PageLayout from "@/components/PageLayout"
import { useBilling, type BillingClaim, type BillingStatus } from "@/hooks/useBilling"
import { useStudents } from "@/hooks/useSupabase"
import {
  BillingClaimService,
  SessionService,
  type BillingServiceDefinition,
} from "@/lib/services"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"
import {
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Plus,
} from "lucide-react"

const CLAIM_STATUSES: BillingStatus[] = [
  "pending",
  "draft",
  "submitted",
  "ready",
  "approved",
  "paid",
  "flagged",
  "rejected",
]

const AUDIT_STATUS = ["all", "valid", "warning", "error"] as const

type AuditStatusFilter = (typeof AUDIT_STATUS)[number]

type ProcessedClaim = BillingClaim & {
  auditStatus: "valid" | "warning" | "error"
  cptDescription: string
  sessionDuration: number
  errors: string[]
  warnings: string[]
}

type ClaimFormValues = {
  id?: string
  student_id: string
  student_name?: string
  session_id?: string
  session_date: string
  service_type: string
  cpt_code: string
  units: number
  rate: number
  amount: number
  status: BillingStatus
  notes: string
}

const CPT_DESCRIPTIONS: Record<string, string> = {
  "97151": "Behavior identification assessment",
  "97153": "Adaptive behavior treatment by protocol",
  "97154": "Group adaptive behavior treatment",
  "97155": "Adaptive behavior treatment with protocol modification",
  "97156": "Family adaptive behavior treatment guidance",
}

export default function ClaimAuditPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { students } = useStudents()
  const { claims, loading, refresh } = useBilling()

  const [services, setServices] = useState<BillingServiceDefinition[]>([])
  const [availableSessions, setAvailableSessions] = useState<Awaited<ReturnType<typeof SessionService.getByStudentId>>>([])
  const [selectedClaims, setSelectedClaims] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<AuditStatusFilter>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">("view")
  const [formValues, setFormValues] = useState<ClaimFormValues | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [pendingIntent, setPendingIntent] = useState<
    | { type: "new" }
    | { type: "claim"; claimId: string; mode: "view" | "edit" }
    | null
  >(null)

  // Load billing services
  useEffect(() => {
    BillingClaimService.listServices()
      .then((data) => setServices(data))
      .catch((error) => console.error("Failed to load billing services", error))
  }, [])

  // Load sessions when the dialog is active and a student is chosen
  useEffect(() => {
    if (!dialogOpen || !formValues?.student_id) {
      setAvailableSessions([])
      return
    }

    SessionService.getByStudentId(formValues.student_id)
      .then((data) => setAvailableSessions(data ?? []))
      .catch((error) => console.error("Failed to load sessions", error))
  }, [dialogOpen, formValues?.student_id])

  // Clean up selected claims when the data refreshes
  useEffect(() => {
    setSelectedClaims((prev) => prev.filter((id) => claims.some((claim) => claim.id === id)))
  }, [claims])

  const serviceByKey = useMemo(() => {
    const map = new Map<string, BillingServiceDefinition>()
    for (const service of services) {
      map.set(service.service_key, service)
    }
    return map
  }, [services])

  const describeCpt = useCallback(
    (serviceType: string, cptCode: string) => {
      const override = CPT_DESCRIPTIONS[cptCode]
      if (override) return override
      const service = serviceByKey.get(serviceType)
      return service?.label ?? "Adaptive behavior treatment"
    },
    [serviceByKey]
  )

  const processedClaims = useMemo<ProcessedClaim[]>(() => {
    return claims.map((claim) => {
      const sessionDuration = claim.duration_minutes ?? Math.max(30, claim.units * 30)
      const cptDescription = describeCpt(claim.service_type, claim.cpt_code)

      const errors: string[] = []
      const warnings: string[] = []

      // TODO: Replace mock authorization check with database-driven data
      const hasAuthorization = true
      if (!hasAuthorization) {
        errors.push("No authorization found")
      }

      if (claim.units > 8 || sessionDuration > 180) {
        warnings.push("High unit count - verify session duration")
      }

      const auditStatus: "valid" | "warning" | "error" =
        errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid"

      return {
        ...claim,
        cptDescription,
        sessionDuration,
        errors,
        warnings,
        auditStatus,
      }
    })
  }, [claims, describeCpt])

  const filteredClaims = useMemo(() => {
    return processedClaims.filter((claim) => {
      const matchesSearch =
        claim.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.cpt_code.includes(searchTerm)

      const matchesStatus = filterStatus === "all" || claim.auditStatus === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [processedClaims, searchTerm, filterStatus])

  const applyServiceDefaults = useCallback(
    (serviceKey: string, prev: ClaimFormValues): ClaimFormValues => {
      const service = serviceByKey.get(serviceKey)
      if (!service) {
        return { ...prev, service_type: serviceKey }
      }

      const units =
        prev.units > 0
          ? prev.units
          : Math.max(
              1,
              Math.ceil(
                (service.default_duration_minutes ?? 60) /
                  (service.unit_increment_minutes ?? 30)
              )
            )
      const rate = Number(service.base_rate ?? prev.rate ?? 0)
      const amount = Number((units * rate).toFixed(2))

      return {
        ...prev,
        service_type: service.service_key,
        cpt_code: service.default_cpt_code,
        units,
        rate,
        amount,
      }
    },
    [serviceByKey]
  )

  const buildFormFromClaim = useCallback(
    (claim: BillingClaim): ClaimFormValues => ({
      id: claim.id,
      student_id: claim.student_id,
      student_name: claim.student_name,
      session_id: claim.session_id ?? undefined,
      session_date: claim.session_date,
      service_type: claim.service_type,
      cpt_code: claim.cpt_code,
      units: claim.units,
      rate: claim.rate,
      amount: claim.amount,
      status: claim.status,
      notes: claim.notes ?? "",
    }),
    []
  )

  const openViewClaim = useCallback(
    (claim: BillingClaim) => {
      setFormValues(buildFormFromClaim(claim))
      setDialogMode("view")
      setDialogOpen(true)
      setFormError(null)
    },
    [buildFormFromClaim]
  )

  const openEditClaim = useCallback(
    (claim: BillingClaim) => {
      setFormValues(buildFormFromClaim(claim))
      setDialogMode("edit")
      setDialogOpen(true)
      setFormError(null)
    },
    [buildFormFromClaim]
  )

  const openNewClaim = useCallback(() => {
    const defaultService = services[0]
    const baseRate = Number(defaultService?.base_rate ?? 0)
    const defaultUnits = defaultService
      ? Math.max(
          1,
          Math.ceil(
            (defaultService.default_duration_minutes ?? 60) /
              (defaultService.unit_increment_minutes ?? 30)
          )
        )
      : 1

    setFormValues({
      student_id: "",
      student_name: "",
      session_id: undefined,
      session_date: "",
      service_type: defaultService?.service_key ?? "",
      cpt_code: defaultService?.default_cpt_code ?? "",
      units: defaultUnits,
      rate: baseRate,
      amount: Number((defaultUnits * baseRate).toFixed(2)),
      status: "pending",
      notes: "",
    })
    setDialogMode("create")
    setDialogOpen(true)
    setFormError(defaultService ? null : "Add billing services before creating claims.")
  }, [services])

  // URL-driven intent (new/view/edit)
  useEffect(() => {
    const newFlag = searchParams.get("new")
    if (newFlag === "true") {
      if (services.length > 0) {
        openNewClaim()
      } else {
        setPendingIntent({ type: "new" })
      }
      router.replace("/billing/claim-audit", { scroll: false })
    }

    const claimId = searchParams.get("claim")
    if (claimId) {
      const modeParam = searchParams.get("mode")
      const mode: "view" | "edit" = modeParam === "edit" ? "edit" : "view"
      const claim = claims.find((item) => item.id === claimId)
      if (claim) {
        mode === "edit" ? openEditClaim(claim) : openViewClaim(claim)
      } else {
        setPendingIntent({ type: "claim", claimId, mode })
      }
      router.replace("/billing/claim-audit", { scroll: false })
    }
  }, [searchParams, services.length, claims, openEditClaim, openViewClaim, openNewClaim, router])

  useEffect(() => {
    if (!pendingIntent) return

    if (pendingIntent.type === "new") {
      if (services.length > 0) {
        openNewClaim()
        setPendingIntent(null)
      }
      return
    }

    const claim = claims.find((item) => item.id === pendingIntent.claimId)
    if (claim) {
      pendingIntent.mode === "edit" ? openEditClaim(claim) : openViewClaim(claim)
      setPendingIntent(null)
    }
  }, [pendingIntent, services.length, claims, openNewClaim, openEditClaim, openViewClaim])

  const handleSelectClaim = (claimId: string) => {
    setSelectedClaims((prev) =>
      prev.includes(claimId) ? prev.filter((id) => id !== claimId) : [...prev, claimId]
    )
  }

  const handleSelectAll = () => {
    if (selectedClaims.length === filteredClaims.length) {
      setSelectedClaims([])
    } else {
      setSelectedClaims(filteredClaims.map((claim) => claim.id))
    }
  }

  const handleRefreshClick = async () => {
    setSelectedClaims([])
    await refresh()
  }

  const handleStudentChange = (studentId: string) => {
    const student = students.find((item) => item.id === studentId)
    setFormValues((prev) =>
      prev
        ? {
            ...prev,
            student_id: studentId,
            student_name: student?.name,
            session_id: undefined,
            session_date: "",
          }
        : prev
    )
  }

  const handleSessionChange = (sessionId: string) => {
    const session = availableSessions.find((item) => item.id === sessionId)
    if (!session) return

    setFormValues((prev) => {
      if (!prev) return prev
      let next: ClaimFormValues = {
        ...prev,
        session_id: session.id,
        session_date: session.session_date ?? "",
      }
      if (session.service_type) {
        next = applyServiceDefaults(session.service_type, next)
      }
      return next
    })
  }

  const handleServiceChange = (serviceKey: string) => {
    setFormValues((prev) => (prev ? applyServiceDefaults(serviceKey, prev) : prev))
  }

  const handleUnitsChange = (units: number) => {
    const normalized = Number.isFinite(units) ? Math.max(1, Math.round(units)) : 1
    setFormValues((prev) =>
      prev
        ? {
            ...prev,
            units: normalized,
            amount: Number((normalized * prev.rate).toFixed(2)),
          }
        : prev
    )
  }

  const handleRateChange = (rate: number) => {
    const normalized = Number.isFinite(rate) ? Math.max(0, rate) : 0
    setFormValues((prev) =>
      prev
        ? {
            ...prev,
            rate: normalized,
            amount: Number((prev.units * normalized).toFixed(2)),
          }
        : prev
    )
  }

  const handleAmountChange = (amount: number) => {
    const normalized = Number.isFinite(amount) ? Math.max(0, amount) : 0
    setFormValues((prev) => (prev ? { ...prev, amount: normalized } : prev))
  }

  const handleStatusChange = (status: BillingStatus) => {
    setFormValues((prev) => (prev ? { ...prev, status } : prev))
  }

  const handleNotesChange = (notes: string) => {
    setFormValues((prev) => (prev ? { ...prev, notes } : prev))
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setDialogOpen(false)
      setDialogMode("view")
      setFormValues(null)
      setFormError(null)
      setAvailableSessions([])
      setSaving(false)
    } else {
      setDialogOpen(true)
    }
  }

  const validateForm = () => {
    if (!formValues) return "No data to save"
    if (!formValues.student_id) return "Select a student to continue."
    if (dialogMode === "create" && !formValues.session_id)
      return "Select a session to attach this claim to."
    if (!formValues.service_type) return "Choose a service type."
    if (formValues.units <= 0) return "Units must be at least 1."
    if (formValues.rate < 0) return "Rate cannot be negative."
    if (formValues.amount < 0) return "Amount cannot be negative."
    if (!formValues.cpt_code) return "Provide a CPT code."
    if (!formValues.session_date)
      return "Session date is required. Ensure the session is selected."
    return null
  }

  const handleSaveClaim = async () => {
    if (!formValues) return
    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }

    try {
      setSaving(true)
      setFormError(null)

      const normalizedAmount = Number(formValues.amount.toFixed(2))
      const normalizedNotes = formValues.notes.trim() ? formValues.notes.trim() : null

      if (dialogMode === "create") {
        const payload: TablesInsert<'billing_claims'> = {
          session_id: formValues.session_id!,
          student_id: formValues.student_id,
          service_type: formValues.service_type,
          cpt_code: formValues.cpt_code,
          units: formValues.units,
          rate: formValues.rate,
          amount: normalizedAmount,
          status: formValues.status,
          notes: normalizedNotes,
        }
        await BillingClaimService.createClaim(payload)
      } else if (formValues.id) {
        const updatePayload: TablesUpdate<'billing_claims'> = {
          session_id: formValues.session_id,
          service_type: formValues.service_type,
          cpt_code: formValues.cpt_code,
          units: formValues.units,
          rate: formValues.rate,
          amount: normalizedAmount,
          status: formValues.status,
          notes: normalizedNotes,
        }
        await BillingClaimService.updateClaim(formValues.id, updatePayload)
      }

      await refresh()
      setSelectedClaims([])
      setDialogOpen(false)
      setDialogMode("view")
      setFormValues(null)
    } catch (error) {
      console.error("Failed to save claim", error)
      setFormError("Unable to save claim. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const exportCsv = () => {
    const rows = processedClaims.filter((claim) => selectedClaims.includes(claim.id))
    const headers = [
      "Student Name",
      "Session Date",
      "CPT Code",
      "Units",
      "Duration (min)",
      "Claim Status",
      "Audit Status",
      "Amount",
    ]
    const data = rows.map((claim) => [
      claim.student_name,
      claim.session_date,
      claim.cpt_code,
      claim.units,
      claim.sessionDuration,
      claim.status,
      claim.auditStatus,
      claim.amount,
    ])
    const csv = [headers, ...data]
      .map((row) =>
        row
          .map((field) => {
            const value = String(field ?? "")
            const escaped = value.replace(/"/g, '""')
            return `"${escaped}"`
          })
          .join(",")
      )
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `claim-audit-${new Date().toISOString().split("T")[0]}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const dialogTitle =
    dialogMode === "create"
      ? "Create Claim"
      : dialogMode === "edit"
      ? "Edit Claim"
      : "Claim Details"
  const isCreate = dialogMode === "create"
  const isView = dialogMode === "view"

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Claim Audit</h1>
            <p className="text-muted-foreground">
              Auto-extract billing data and validate insurance claims
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefreshClick} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button
              variant="outline"
              onClick={exportCsv}
              disabled={selectedClaims.length === 0}
            >
              <Download className="h-4 w-4 mr-2" /> Export CSV ({selectedClaims.length})
            </Button>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={openNewClaim}
              disabled={services.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" /> New Claim
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard title="Total Claims" icon={<FileText className="h-4 w-4" />} value={processedClaims.length} />
          <SummaryCard title="Valid" icon={<CheckCircle className="h-4 w-4 text-green-600" />} value={processedClaims.filter((claim) => claim.auditStatus === "valid").length} valueClassName="text-green-600" />
          <SummaryCard title="Warnings" icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />} value={processedClaims.filter((claim) => claim.auditStatus === "warning").length} valueClassName="text-yellow-600" />
          <SummaryCard title="Errors" icon={<AlertTriangle className="h-4 w-4 text-red-600" />} value={processedClaims.filter((claim) => claim.auditStatus === "error").length} valueClassName="text-red-600" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by student or CPT code"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Label htmlFor="status-filter">Audit Status</Label>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as AuditStatusFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Claims</SelectItem>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="warning">Warnings</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Claims Audit Results</CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedClaims.length === filteredClaims.length && filteredClaims.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label className="text-sm">Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Loading claims...
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClaims.map((claim) => (
                  <ClaimRow
                    key={claim.id}
                    claim={claim}
                    selected={selectedClaims.includes(claim.id)}
                    onSelect={() => handleSelectClaim(claim.id)}
                    onView={() => openViewClaim(claim)}
                    onEdit={() => openEditClaim(claim)}
                  />
                ))}
                {filteredClaims.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No claims found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {formValues?.student_name || "Configure billing claim details for submission."}
            </DialogDescription>
          </DialogHeader>

          {formValues ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  {isCreate ? (
                    <Select value={formValues.student_id} onValueChange={handleStudentChange} disabled={saving}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="rounded-md border bg-muted px-3 py-2 text-sm">
                      {formValues.student_name ||
                        students.find((student) => student.id === formValues.student_id)?.name ||
                        "Unknown student"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Session</Label>
                  {isCreate ? (
                    <Select
                      value={formValues.session_id ?? ""}
                      onValueChange={handleSessionChange}
                      disabled={!formValues.student_id || saving || availableSessions.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            formValues.student_id ? "Select a session" : "Select a student first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {availableSessions.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            {new Date(session.session_date).toLocaleDateString()} · {session.session_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="rounded-md border bg-muted px-3 py-2 text-sm">
                      {formValues.session_date
                        ? new Date(formValues.session_date).toLocaleDateString()
                        : "Session not linked"}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select
                    value={formValues.service_type}
                    onValueChange={handleServiceChange}
                    disabled={isView || saving}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {services.map((service) => (
                        <SelectItem key={service.service_key} value={service.service_key}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>CPT Code</Label>
                  <Input
                    value={formValues.cpt_code}
                    onChange={(event) =>
                      setFormValues((prev) => (prev ? { ...prev, cpt_code: event.target.value } : prev))
                    }
                    disabled={isView || saving}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumberField
                  label="Units"
                  value={formValues.units}
                  onValueChange={handleUnitsChange}
                  disabled={isView || saving}
                />
                <NumberField
                  label="Rate"
                  prefix="$"
                  step={0.25}
                  value={formValues.rate}
                  onValueChange={handleRateChange}
                  disabled={isView || saving}
                />
                <NumberField
                  label="Amount"
                  prefix="$"
                  step={0.25}
                  value={formValues.amount}
                  onValueChange={handleAmountChange}
                  disabled={isView || saving}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formValues.status}
                  onValueChange={(value) => handleStatusChange(value as BillingStatus)}
                  disabled={isView || saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Claim status" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {CLAIM_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formValues.notes}
                  onChange={(event) => handleNotesChange(event.target.value)}
                  disabled={saving}
                  placeholder="Add any billing notes, authorization references, or payer feedback"
                />
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}
            </div>
          ) : (
            <div className="py-6 text-sm text-muted-foreground">No claim selected.</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Close
            </Button>
            {!isView && (
              <Button onClick={handleSaveClaim} disabled={saving}>
                {saving ? "Saving…" : "Save Claim"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}

function SummaryCard({
  title,
  icon,
  value,
  valueClassName,
}: {
  title: string
  icon: ReactNode
  value: number
  valueClassName?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName ?? ""}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

function ClaimRow({
  claim,
  selected,
  onSelect,
  onView,
  onEdit,
}: {
  claim: ProcessedClaim
  selected: boolean
  onSelect: () => void
  onView: () => void
  onEdit: () => void
}) {
  const getAuditBadge = () => {
    switch (claim.auditStatus) {
      case "valid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> Valid
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" /> Warning
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" /> Error
          </Badge>
        )
    }
  }

  const getClaimStatusBadge = () => {
    switch (claim.status) {
      case "approved":
      case "ready":
        return (
          <Badge variant="default" className="bg-emerald-100 text-emerald-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {claim.status === "approved" ? "Approved" : "Ready"}
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="outline" className="border-blue-300 text-blue-700">
            <Clock className="h-3 w-3 mr-1" /> Submitted
          </Badge>
        )
      case "pending":
      case "draft":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {claim.status === "draft" ? "Draft" : "Pending"}
          </Badge>
        )
      case "flagged":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" /> Flagged
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Checkbox checked={selected} onCheckedChange={onSelect} />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold capitalize">{claim.student_name}</h3>
              {getAuditBadge()}
              {getClaimStatusBadge()}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {claim.session_date ? new Date(claim.session_date).toLocaleDateString() : "Date TBD"}
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {claim.cpt_code} · {claim.cptDescription}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {claim.units} units ({claim.sessionDuration} min)
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" /> ${claim.amount.toLocaleString()}
              </div>
            </div>
            {claim.warnings.length > 0 && (
              <div className="text-sm text-yellow-700">
                {claim.warnings.map((warning, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {warning}
                  </div>
                ))}
              </div>
            )}
            {claim.errors.length > 0 && (
              <div className="text-sm text-red-600">
                {claim.errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {error}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </div>
    </div>
  )
}

function NumberField({
  label,
  value,
  onValueChange,
  prefix,
  step = 1,
  disabled,
}: {
  label: string
  value: number
  onValueChange: (value: number) => void
  prefix?: string
  step?: number
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
        {prefix ? <span className="px-3 text-sm text-muted-foreground">{prefix}</span> : null}
        <Input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          min={0}
          disabled={disabled}
          onChange={(event) => onValueChange(parseFloat(event.target.value))}
          className={`border-0 focus-visible:ring-0 ${prefix ? "pl-0" : "pl-3"}`}
        />
      </div>
    </div>
  )
}