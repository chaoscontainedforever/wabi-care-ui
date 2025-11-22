import { useState, useEffect, useCallback, useMemo } from "react"

import { BillingClaimService } from "@/lib/services"

import { useStudents } from "./useSupabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey)

export type BillingStatus =
  | "draft"
  | "pending"
  | "submitted"
  | "ready"
  | "approved"
  | "paid"
  | "flagged"
  | "rejected"

export type BillingClaimEvent = {
  id: string
  status: BillingStatus
  eventType: string
  createdAt: string
  notes?: string | null
  metadata?: Record<string, unknown> | null
  createdBy?: string | null
}

export type BillingClaim = {
  id: string
  student_name: string
  student_external_id?: string
  student_id: string
  session_date: string
  session_type?: string
  duration_minutes: number
  cpt_code: string
  units: number
  rate: number
  amount: number
  amount_paid: number
  status: BillingStatus
  service_type: string
  service_label?: string
  session_id: string | null
  notes?: string | null
  payer_id?: string | null
  payer_name?: string | null
  payer_reference?: string | null
  location?: string | null
  submitted_at?: string | null
  processed_at?: string | null
  paid_at?: string | null
  denied_at?: string | null
  billed_at?: string | null
  created_at: string
  updated_at: string
  last_status_change: string
  status_reason?: string | null
  followup_required: boolean
  events: BillingClaimEvent[]
}

export type BillingStatusBreakdown = Record<
  BillingStatus,
  {
    count: number
    amount: number
    amountPaid: number
  }
>

export type BillingPayerSummary = {
  payerName: string
  payerId?: string | null
  totalClaims: number
  totalAmount: number
  totalPaid: number
  statusCounts: Record<BillingStatus, number>
  followupCount: number
}

export type BillingOverview = {
  totalCount: number
  totalAmount: number
  pendingCount: number
  pendingValue: number
  readyCount: number
  readyValue: number
  auditConfidence: number
  flaggedRate: number
  approvalRate: number
  submittedCount: number
  rejectedCount: number
  paidCount: number
  collectedAmount: number
  denialRate: number
}

const ALL_STATUSES: BillingStatus[] = [
  "draft",
  "pending",
  "submitted",
  "ready",
  "approved",
  "paid",
  "flagged",
  "rejected",
]

const PENDING_STATUSES: BillingStatus[] = ["pending", "draft", "submitted"]
const READY_STATUSES: BillingStatus[] = ["ready", "approved", "paid"]
const FLAGGED_STATUSES: BillingStatus[] = ["flagged", "rejected"]

const calculateMetrics = (claimsData: BillingClaim[]): BillingOverview => {
  const pending = claimsData.filter((claim) => PENDING_STATUSES.includes(claim.status))
  const ready = claimsData.filter((claim) => READY_STATUSES.includes(claim.status))
  const flagged = claimsData.filter((claim) => FLAGGED_STATUSES.includes(claim.status))
  const submitted = claimsData.filter((claim) => claim.status === "submitted")
  const paid = claimsData.filter((claim) => claim.status === "paid" || claim.status === "approved")
  const rejected = claimsData.filter((claim) => claim.status === "rejected")

  const totalAmount = claimsData.reduce((sum, claim) => sum + claim.amount, 0)
  const totalCount = claimsData.length
  const pendingValue = pending.reduce((sum, claim) => sum + claim.amount, 0)
  const readyValue = ready.reduce((sum, claim) => sum + claim.amount, 0)
  const collectedAmount = paid.reduce((sum, claim) => sum + (claim.amount_paid ?? 0), 0)

  const lastTen = [...claimsData]
    .sort((a, b) => new Date(b.last_status_change).getTime() - new Date(a.last_status_change).getTime())
    .slice(0, 10)
  const readyInLastTen = lastTen.filter((claim) => READY_STATUSES.includes(claim.status)).length

  const auditConfidence = lastTen.length === 0 ? 0 : Math.round((readyInLastTen / lastTen.length) * 100)
  const flaggedRate = totalCount === 0 ? 0 : Math.round((flagged.length / totalCount) * 100)
  const approvalRate = submitted.length === 0 ? (paid.length === 0 ? 0 : 100) : Math.round((paid.length / submitted.length) * 100)
  const denialRate = submitted.length === 0 ? 0 : Math.round((rejected.length / submitted.length) * 100)

  return {
    totalCount,
    totalAmount,
    pendingCount: pending.length,
    pendingValue,
    readyCount: ready.length,
    readyValue,
    auditConfidence,
    flaggedRate,
    approvalRate,
    submittedCount: submitted.length,
    rejectedCount: rejected.length,
    paidCount: paid.length,
    collectedAmount,
    denialRate,
  }
}

const initializeBreakdown = (): BillingStatusBreakdown =>
  ALL_STATUSES.reduce((acc, status) => {
    acc[status] = { count: 0, amount: 0, amountPaid: 0 }
    return acc
  }, {} as BillingStatusBreakdown)

const initializeStatusCounts = (): Record<BillingStatus, number> =>
  ALL_STATUSES.reduce((acc, status) => {
    acc[status] = 0
    return acc
  }, {} as Record<BillingStatus, number>)

const buildStatusBreakdown = (claims: BillingClaim[]): BillingStatusBreakdown => {
  const breakdown = initializeBreakdown()
  for (const claim of claims) {
    const bucket = breakdown[claim.status]
    bucket.count += 1
    bucket.amount += claim.amount
    if (claim.status === "paid" || claim.status === "approved") {
      bucket.amountPaid += claim.amount_paid ?? 0
    }
  }
  return breakdown
}

const buildPayerSummaries = (claims: BillingClaim[]): BillingPayerSummary[] => {
  const map = new Map<string, BillingPayerSummary>()

  for (const claim of claims) {
    const key = claim.payer_name ?? "Unassigned payer"
    if (!map.has(key)) {
      map.set(key, {
        payerName: key,
        payerId: claim.payer_id,
        totalClaims: 0,
        totalAmount: 0,
        totalPaid: 0,
        statusCounts: initializeStatusCounts(),
        followupCount: 0,
      })
    }

    const summary = map.get(key)!
    summary.totalClaims += 1
    summary.totalAmount += claim.amount
    summary.totalPaid += claim.amount_paid ?? 0
    summary.statusCounts[claim.status] = (summary.statusCounts[claim.status] ?? 0) + 1
    if (claim.followup_required) {
      summary.followupCount += 1
    }
    if (!summary.payerId && claim.payer_id) {
      summary.payerId = claim.payer_id
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount)
}

const toIso = (date: Date) => date.toISOString()

const buildMockClaims = (students: { id: string; name: string }[]): BillingClaim[] => {
  const fallbackStudents = students.length
    ? students
    : [
        { id: "1", name: "Alex Johnson" },
        { id: "2", name: "Sarah Williams" },
        { id: "3", name: "Michael Chen" },
        { id: "4", name: "Emma Davis" },
        { id: "5", name: "James Wilson" },
        { id: "6", name: "Priya Patel" },
      ]

  const serviceCatalog = [
    { key: "aba_direct", label: "ABA Direct Therapy", cpt: "97153", rate: 56.25 },
    { key: "aba_supervision", label: "ABA Supervision", cpt: "97155", rate: 75.0 },
    { key: "aba_family_guidance", label: "Family Guidance", cpt: "97156", rate: 60.0 },
    { key: "aba_group", label: "Group Treatment", cpt: "97154", rate: 45.0 },
    { key: "aba_assessment", label: "Behavior Assessment", cpt: "97151", rate: 90.0 },
  ]

  const payerCatalog = ["BlueCross BlueShield", "Aetna", "Cigna", "Tricare", "United Healthcare"]
  const locationCatalog = ["Clinic", "Telehealth", "Home"]
  const statusCycle: BillingStatus[] = ["submitted", "pending", "flagged", "ready", "approved", "paid", "rejected", "draft"]

  return fallbackStudents.map((student, index) => {
    const created = new Date()
    created.setDate(created.getDate() - index * 6)
    const sessionDate = new Date(created)
    sessionDate.setHours(10, 0, 0, 0)

    const service = serviceCatalog[index % serviceCatalog.length]
    const units = Math.max(1, (index % 4) + 1)
    const amount = Number((service.rate * units).toFixed(2))

    const submittedAt = new Date(created)
    submittedAt.setDate(submittedAt.getDate() + 1)
    const processedAt = new Date(submittedAt)
    processedAt.setHours(15)

    const status = statusCycle[index % statusCycle.length]
    const paidAt = status === "paid" || status === "approved" ? new Date(processedAt) : null
    if (paidAt) {
      paidAt.setDate(paidAt.getDate() + 7)
    }
    const deniedAt = status === "rejected" ? new Date(processedAt) : null
    if (deniedAt) {
      deniedAt.setDate(deniedAt.getDate() + 3)
    }

    const events: BillingClaimEvent[] = [
      {
        id: `evt-${student.id}-${index}-draft`,
        status: "draft",
        eventType: "draft_created",
        createdAt: toIso(created),
        notes: "Draft generated from completed session",
      },
    ]

    if (status !== "draft") {
      events.push({
        id: `evt-${student.id}-${index}-submitted`,
        status: "submitted",
        eventType: "submitted_to_payer",
        createdAt: toIso(submittedAt),
        notes: "Submitted to payer electronically",
      })
    }

    if (status === "flagged") {
      events.push({
        id: `evt-${student.id}-${index}-flagged`,
        status: "flagged",
        eventType: "requires_followup",
        createdAt: toIso(processedAt),
        notes: "Missing BCBA progress note",
      })
    }

    if (paidAt) {
      events.push({
        id: `evt-${student.id}-${index}-paid`,
        status: status === "paid" ? "paid" : "approved",
        eventType: "payment_posted",
        createdAt: toIso(paidAt),
        notes: "Remittance applied",
      })
    }

    if (deniedAt) {
      events.push({
        id: `evt-${student.id}-${index}-denied`,
        status: "rejected",
        eventType: "denied_by_payer",
        createdAt: toIso(deniedAt),
        notes: "Units exceeded authorization window",
      })
    }

    const lastStatusChange = events[events.length - 1]?.createdAt ?? toIso(created)
    const amountPaid = paidAt ? Number((amount * 0.92).toFixed(2)) : 0

    return {
      id: `claim-${student.id}-${index}`,
      student_name: student.name,
      student_external_id: `EXT-${student.id}`,
      student_id: student.id,
      session_date: toIso(sessionDate),
      session_type: "therapy_session",
      duration_minutes: units * 30,
      cpt_code: service.cpt,
      units,
      rate: service.rate,
      amount,
      amount_paid: amountPaid,
      status,
      service_type: service.key,
      service_label: service.label,
      session_id: null,
      notes:
        status === "flagged"
          ? "Payer requested BCBA signature before payment."
          : status === "rejected"
          ? "Authorization units exhausted."
          : null,
      payer_id: null,
      payer_name: payerCatalog[index % payerCatalog.length],
      payer_reference: `AUTH-${2020 + index}`,
      location: locationCatalog[index % locationCatalog.length],
      submitted_at: status === "draft" ? null : toIso(submittedAt),
      processed_at: status === "draft" ? null : toIso(processedAt),
      paid_at: paidAt ? toIso(paidAt) : null,
      denied_at: deniedAt ? toIso(deniedAt) : null,
      billed_at: status === "draft" ? null : toIso(submittedAt),
      created_at: toIso(created),
      updated_at: lastStatusChange,
      last_status_change: lastStatusChange,
      status_reason:
        status === "rejected"
          ? "Units exceeded authorization"
          : status === "flagged"
          ? "Missing supporting documentation"
          : null,
      followup_required: status === "flagged" || status === "rejected",
      events,
    }
  })
}

const normalizeSupabaseClaims = (
  rows: Awaited<ReturnType<typeof BillingClaimService.listClaims>>
): BillingClaim[] => {
  return rows.map((claim) => {
    const serviceLabel = claim.service?.label ?? claim.service_type
    const durationMinutes = claim.session?.duration_minutes ?? claim.service?.default_duration_minutes ?? 60
    const status = (claim.status ?? "draft") as BillingStatus
    const events = (claim.status_events ?? [])
      .map<BillingClaimEvent>((event) => ({
        id: event.id,
        status: (event.status as BillingStatus) ?? status,
        eventType: event.event_type,
        createdAt: event.created_at,
        notes: event.notes,
        metadata: (event.metadata as Record<string, unknown> | null) ?? null,
        createdBy: event.created_by,
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return {
      id: claim.id,
      student_name: claim.student?.name ?? "Unknown Student",
      student_external_id: claim.student?.student_id ?? undefined,
      student_id: claim.student_id,
      session_date: claim.session?.session_date ?? claim.created_at,
      session_type: claim.session?.session_type ?? undefined,
      duration_minutes: durationMinutes ?? 60,
      cpt_code: claim.cpt_code,
      units: Number(claim.units ?? 0),
      rate: Number(claim.rate ?? 0),
      amount: Number(claim.amount ?? 0),
      amount_paid: Number(claim.amount_paid ?? 0),
      status,
      service_type: claim.service_type,
      service_label: serviceLabel,
      session_id: claim.session_id ?? null,
      notes: claim.notes ?? null,
      payer_id: claim.payer_id ?? null,
      payer_name: claim.payer_name ?? null,
      payer_reference: claim.payer_reference ?? null,
      location: claim.location ?? null,
      submitted_at: claim.submitted_at ?? null,
      processed_at: claim.processed_at ?? null,
      paid_at: claim.paid_at ?? null,
      denied_at: claim.denied_at ?? null,
      billed_at: claim.billed_at ?? null,
      created_at: claim.created_at,
      updated_at: claim.updated_at,
      last_status_change: claim.last_status_change ?? claim.updated_at ?? claim.created_at,
      status_reason: claim.status_reason ?? null,
      followup_required: Boolean(claim.followup_required),
      events,
    }
  })
}

export function useBilling() {
  const [claims, setClaims] = useState<BillingClaim[]>([])
  const [metrics, setMetrics] = useState<BillingOverview>(() => calculateMetrics([]))
  const [loading, setLoading] = useState(true)

  const { students } = useStudents()
  const studentSummaries = useMemo(
    () => students.map((student) => ({ id: student.id, name: student.name })),
    [students]
  )

  const loadClaims = useCallback(
    async (options: { forceSync?: boolean } = {}) => {
      setLoading(true)
      try {
        if (!hasSupabaseConfig) {
          const mockClaims = buildMockClaims(studentSummaries)
          setClaims(mockClaims)
          setMetrics(calculateMetrics(mockClaims))
          return
        }

        await BillingClaimService.syncDrafts(options.forceSync)
        const supabaseClaims = await BillingClaimService.listClaims({ limit: 200 })
        const normalizedClaims = normalizeSupabaseClaims(supabaseClaims)

        setClaims(normalizedClaims)
        setMetrics(calculateMetrics(normalizedClaims))
      } catch (error) {
        console.error("Billing: failed to load claims", error)
        const mockClaims = buildMockClaims(studentSummaries)
        setClaims(mockClaims)
        setMetrics(calculateMetrics(mockClaims))
      } finally {
        setLoading(false)
      }
    },
    [studentSummaries]
  )

  useEffect(() => {
    void loadClaims()
  }, [loadClaims])

  const refresh = useCallback(async () => {
    await loadClaims({ forceSync: true })
  }, [loadClaims])

  const statusBreakdown = useMemo(() => buildStatusBreakdown(claims), [claims])
  const payerSummaries = useMemo(() => buildPayerSummaries(claims), [claims])

  return {
    claims,
    loading,
    refresh,
    billingOverview: metrics,
    statusBreakdown,
    payerSummaries,
  }
}
