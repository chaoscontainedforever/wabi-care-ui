"use client"

import { useMemo, useCallback, useState, type ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Plus,
  Eye,
  Download,
  Clock,
  RefreshCw,
  ShieldCheck,
  Upload,
  PiggyBank,
  Ban
} from "lucide-react"
import { PageLayout } from "@/components/PageLayout"
import { useBilling } from "@/hooks/useBilling"
import Link from "next/link"

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "—"
  const date = new Date(iso)
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

const formatCurrency = (value: number) =>
  value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const STATUS_VARIANTS = {
  submitted: {
    border: "border-sky-200",
    iconBg: "bg-sky-100 text-sky-700",
    metric: "text-sky-700",
  },
  pending: {
    border: "border-amber-200",
    iconBg: "bg-amber-100 text-amber-700",
    metric: "text-amber-700",
  },
  paid: {
    border: "border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-700",
    metric: "text-emerald-700",
  },
  flagged: {
    border: "border-orange-200",
    iconBg: "bg-orange-100 text-orange-700",
    metric: "text-orange-700",
  },
  rejected: {
    border: "border-rose-200",
    iconBg: "bg-rose-100 text-rose-700",
    metric: "text-rose-700",
  },
} as const

type StatusVariantKey = keyof typeof STATUS_VARIANTS

interface StatusMetricCardProps {
  title: string
  count: number
  amount: number
  subtitle: string
  variant: StatusVariantKey
  icon: ReactNode
}

function StatusMetricCard({ title, count, amount, subtitle, variant, icon }: StatusMetricCardProps) {
  const tone = STATUS_VARIANTS[variant]

  return (
    <Card className={`h-full border bg-card shadow-sm ${tone.border}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardDescription className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </CardDescription>
          <CardTitle className={`text-2xl font-semibold ${tone.metric}`}>{count}</CardTitle>
        </div>
        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${tone.iconBg}`}>{icon}</div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs font-medium text-muted-foreground">{formatCurrency(amount)} {subtitle}</p>
      </CardContent>
    </Card>
  )
}

type StatusFilterValue = "all" | BillingStatus
type TimeRangeValue = "30" | "90" | "180"

const STATUS_FILTERS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "ready", label: "Ready" },
  { value: "flagged", label: "Flagged" },
  { value: "rejected", label: "Rejected" },
]

const TIME_RANGE_OPTIONS: { value: TimeRangeValue; label: string }[] = [
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "180", label: "Last 6 months" },
]

export default function BillingPageClient() {
  const { claims, loading, billingOverview, refresh, statusBreakdown, payerSummaries } = useBilling()

  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all")
  const [timeRange, setTimeRange] = useState<TimeRangeValue>("90")
  const [payerFilter, setPayerFilter] = useState<string>("all")

  const handleRefresh = useCallback(() => {
    void refresh()
  }, [refresh])

  const payerOptions = useMemo(
    () => [
      { value: "all", label: "All payers" },
      ...payerSummaries.map((payer) => ({ value: payer.payerName, label: payer.payerName })),
    ],
    [payerSummaries]
  )

  const filteredClaims = useMemo(() => {
    const days = Number(timeRange)
    const rangeStart = new Date()
    rangeStart.setHours(0, 0, 0, 0)
    rangeStart.setDate(rangeStart.getDate() - days)

    return claims.filter((claim) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "paid"
          ? claim.status === "paid" || claim.status === "approved"
          : claim.status === statusFilter

      if (!matchesStatus) return false

      const matchesPayer =
        payerFilter === "all"
          ? true
          : (claim.payer_name ?? "Unassigned payer") === payerFilter

      if (!matchesPayer) return false

      const referenceDate = claim.last_status_change ?? claim.updated_at ?? claim.created_at
      return new Date(referenceDate) >= rangeStart
    })
  }, [claims, payerFilter, statusFilter, timeRange])

  const tableClaims = useMemo(() => filteredClaims.slice(0, 8), [filteredClaims])

  const timelineData = useMemo(() => {
    const months = Math.max(1, Math.round(Number(timeRange) / 30))
    const now = new Date()
    const buckets = [] as {
      key: string
      label: string
      start: Date
      end: Date
      submitted: number
      paid: number
      rejected: number
    }[]

    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      buckets.push({
        key: `${start.getFullYear()}-${start.getMonth()}`,
        label: start.toLocaleString(undefined, { month: "short", year: "numeric" }),
        start,
        end,
        submitted: 0,
        paid: 0,
        rejected: 0,
      })
    }

    const addToBucket = (dateString: string | null | undefined, field: "submitted" | "paid" | "rejected") => {
      if (!dateString) return
      const date = new Date(dateString)
      for (const bucket of buckets) {
        if (date >= bucket.start && date <= bucket.end) {
          bucket[field] += 1
          break
        }
      }
    }

    filteredClaims.forEach((claim) => {
      addToBucket(claim.submitted_at ?? claim.created_at, "submitted")
      if (claim.status === "paid" || claim.status === "approved") {
        addToBucket(claim.paid_at ?? claim.last_status_change, "paid")
      }
      if (claim.status === "rejected") {
        addToBucket(claim.denied_at ?? claim.last_status_change, "rejected")
      }
    })

    return buckets.map((bucket) => ({
      key: bucket.key,
      label: bucket.label,
      submitted: bucket.submitted,
      paid: bucket.paid,
      rejected: bucket.rejected,
    }))
  }, [filteredClaims, timeRange])

  const timelineMax = useMemo(
    () =>
      Math.max(
        1,
        ...timelineData.map((entry) => Math.max(entry.submitted, entry.paid, entry.rejected, 0))
      ),
    [timelineData]
  )

  const statusSummary = useMemo(() => {
    const pendingCount = statusBreakdown.pending.count + statusBreakdown.draft.count
    const pendingAmount = statusBreakdown.pending.amount + statusBreakdown.draft.amount
    const submittedCount = statusBreakdown.submitted.count
    const submittedAmount = statusBreakdown.submitted.amount
    const paidCount = statusBreakdown.paid.count + statusBreakdown.approved.count
    const paidAmount = statusBreakdown.paid.amountPaid + statusBreakdown.approved.amountPaid
    const flaggedCount = statusBreakdown.flagged.count
    const flaggedAmount = statusBreakdown.flagged.amount
    const rejectedCount = statusBreakdown.rejected.count
    const rejectedAmount = statusBreakdown.rejected.amount

    return {
      pending: { count: pendingCount, amount: pendingAmount },
      submitted: { count: submittedCount, amount: submittedAmount },
      paid: { count: paidCount, amount: paidAmount },
      flagged: { count: flaggedCount, amount: flaggedAmount },
      rejected: { count: rejectedCount, amount: rejectedAmount },
    }
  }, [statusBreakdown])

  const topPayers = useMemo(() => payerSummaries.slice(0, 4), [payerSummaries])

  // Recent claims for quick overview
  const recentClaims = useMemo(() => {
    return [...claims]
      .sort((a, b) => {
        const bTime = new Date(b.last_status_change ?? b.updated_at ?? b.created_at).getTime()
        const aTime = new Date(a.last_status_change ?? a.updated_at ?? a.created_at).getTime()
        return bTime - aTime
      })
      .slice(0, 5)
  }, [claims])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-emerald-100 text-emerald-700">
            <ShieldCheck className="mr-1 h-3 w-3" />Approved
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="default" className="bg-emerald-100 text-emerald-700">
            <DollarSign className="mr-1 h-3 w-3" />Paid
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="default" className="bg-emerald-100 text-emerald-800">
            <CheckCircle className="h-3 w-3 mr-1" />Ready
          </Badge>
        )
      case "pending":
      case "draft":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />Rejected
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="outline" className="border-blue-300 text-blue-700">
            <Clock className="h-3 w-3 mr-1" />Submitted
          </Badge>
        )
      case "flagged":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />Flagged
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Smart Billing", href: "/billing" },
        { label: "Billing Dashboard" }
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/billing/authorizations">
              <Button variant="outline">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Authorizations
              </Button>
            </Link>
            <Link href="/billing/claim-audit">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Claim Audit
              </Button>
            </Link>
            <Link href={{ pathname: "/billing/claim-audit", query: { new: "true" } }}>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Claim
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billingOverview.totalCount}</div>
              <p className="text-xs text-muted-foreground">Includes drafts, submitted, and paid</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(billingOverview.totalAmount)}</div>
              <p className="text-xs text-muted-foreground">Gross billed across all claims</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collected Amount</CardTitle>
              <PiggyBank className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(billingOverview.collectedAmount)}</div>
              <p className="text-xs text-muted-foreground">Payments posted on approved and paid claims</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Denial Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">{billingOverview.denialRate}%</div>
              <p className="text-xs text-muted-foreground">Rejected claims versus submitted</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="grid gap-3 rounded-xl border border-input/40 bg-card/80 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
          <div className="lg:col-span-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilterValue)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRangeValue)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={payerFilter} onValueChange={setPayerFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Payer" />
            </SelectTrigger>
            <SelectContent>
              {payerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Claim Lifecycle & Status */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-lg font-semibold">Claim Lifecycle & Status</CardTitle>
              <CardDescription>
                Monitor submissions, payments, and denials with targeted filters
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatusMetricCard
                title="Submitted"
                count={statusSummary.submitted.count}
                amount={statusSummary.submitted.amount}
                subtitle="this window"
                variant="submitted"
                icon={<Upload className="h-4 w-4 text-sky-600" />}
              />
              <StatusMetricCard
                title="Pending"
                count={statusSummary.pending.count}
                amount={statusSummary.pending.amount}
                subtitle="awaiting action"
                variant="pending"
                icon={<Clock className="h-4 w-4 text-amber-600" />}
              />
              <StatusMetricCard
                title="Paid"
                count={statusSummary.paid.count}
                amount={statusSummary.paid.amount}
                subtitle="collected"
                variant="paid"
                icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
              />
              <StatusMetricCard
                title="Flagged"
                count={statusSummary.flagged.count}
                amount={statusSummary.flagged.amount}
                subtitle="requires follow-up"
                variant="flagged"
                icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
              />
              <StatusMetricCard
                title="Rejected"
                count={statusSummary.rejected.count}
                amount={statusSummary.rejected.amount}
                subtitle="denied"
                variant="rejected"
                icon={<Ban className="h-4 w-4 text-rose-600" />}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
              <div className="rounded-xl border bg-card/90 p-4 shadow-sm lg:col-span-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Submission & Payment Trend</h3>
                  <Badge variant="outline" className="text-xs font-medium">
                    {timelineData.length} period{timelineData.length === 1 ? "" : "s"}
                  </Badge>
                </div>
                <div className="mt-4 space-y-3">
                  {timelineData.length === 0 ? (
                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                      No activity in the selected window.
                    </div>
                  ) : (
                    timelineData.map((point) => (
                      <div key={point.key} className="rounded-lg border bg-muted/10 p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{point.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {point.submitted + point.paid + point.rejected} total claims
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between text-xs font-medium text-sky-600">
                              <span>Submitted</span>
                              <span>{point.submitted}</span>
                            </div>
                            <Progress value={(point.submitted / timelineMax) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-xs font-medium text-emerald-600">
                              <span>Paid</span>
                              <span>{point.paid}</span>
                            </div>
                            <Progress value={(point.paid / timelineMax) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-xs font-medium text-rose-600">
                              <span>Rejected</span>
                              <span>{point.rejected}</span>
                            </div>
                            <Progress value={(point.rejected / timelineMax) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border bg-card/90 p-4 shadow-sm lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Top Payers</h3>
                  <Badge variant="secondary" className="text-[11px]">
                    {payerSummaries.length} tracked
                  </Badge>
                </div>
                <div className="space-y-3">
                  {topPayers.length === 0 ? (
                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                      No payer data yet.
                    </div>
                  ) : (
                    topPayers.map((payer) => (
                      <div
                        key={payer.payerName}
                        className="flex items-center justify-between rounded-lg border bg-muted/10 p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{payer.payerName}</p>
                          <p className="text-xs text-muted-foreground">{payer.totalClaims} claims</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{formatCurrency(payer.totalAmount)}</p>
                          <p className="text-xs text-muted-foreground">Paid {formatCurrency(payer.totalPaid)}</p>
                          {payer.followupCount > 0 ? (
                            <p className="text-xs font-medium text-amber-600">
                              {payer.followupCount} needs follow-up
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Filtered Claims</h3>
                <Badge variant="outline" className="text-xs font-medium">
                  {filteredClaims.length} result{filteredClaims.length === 1 ? "" : "s"}
                </Badge>
              </div>
              {loading ? (
                <div className="space-y-3 p-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : tableClaims.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Payer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Billed</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableClaims.map((claim) => (
                        <TableRow key={claim.id}>
                          <TableCell>
                            <div className="font-semibold text-foreground">{claim.student_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {claim.service_label ?? claim.service_type}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-foreground">{claim.payer_name ?? "Unassigned"}</div>
                            {claim.location ? (
                              <div className="text-xs text-muted-foreground">{claim.location}</div>
                            ) : null}
                          </TableCell>
                          <TableCell>{getStatusBadge(claim.status)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(claim.amount)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(claim.amount_paid)}</TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">{formatDateTime(claim.last_status_change)}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={{ pathname: "/billing/claim-audit", query: { id: claim.id } }}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Eye className="h-4 w-4" />
                                Review
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  No claims match the selected filters.
                </div>
              )}

              {tableClaims.length > 0 && filteredClaims.length > tableClaims.length ? (
                <div className="border-t px-4 py-2 text-right text-xs text-muted-foreground">
                  Showing first {tableClaims.length} of {filteredClaims.length} claims.
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Claim Audit
              </CardTitle>
              <CardDescription>Auto-extract billing data and validate insurance claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • CPT code mapping (97153, 97155, etc.)
                </div>
                <div className="text-sm text-muted-foreground">
                  • Unit calculation (30 min = 1 unit)
                </div>
                <div className="text-sm text-muted-foreground">
                  • Pre-validation against authorization
                </div>
                <div className="text-sm text-muted-foreground">
                  • Error flagging and CSV export
                </div>
              </div>
              <Link href="/billing/claim-audit">
                <Button className="w-full mt-4">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Claim Audit
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-purple-600" />
                Authorizations
              </CardTitle>
              <CardDescription>
                Monitor payer approvals, utilization, and renewal timelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">• Track active and expiring authorizations</div>
                <div className="text-sm text-muted-foreground">• Monitor units used versus remaining</div>
                <div className="text-sm text-muted-foreground">• Flag expiring approvals for follow-up</div>
              </div>
              <Link href="/billing/authorizations">
                <Button className="w-full mt-4" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Manage Authorizations
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Student Billing
              </CardTitle>
              <CardDescription>
                Manage individual student billing and payment tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • Individual student accounts
                </div>
                <div className="text-sm text-muted-foreground">
                  • Payment history tracking
                </div>
                <div className="text-sm text-muted-foreground">
                  • Outstanding balance management
                </div>
                <div className="text-sm text-muted-foreground">
                  • Insurance coordination
                </div>
              </div>
              <Link href="/students">
                <Button className="w-full mt-4" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Manage Students
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-600" />
                Reports & Export
              </CardTitle>
              <CardDescription>
                Generate billing reports and export data for accounting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • Monthly billing summaries
                </div>
                <div className="text-sm text-muted-foreground">
                  • Insurance claim reports
                </div>
                <div className="text-sm text-muted-foreground">
                  • Revenue analytics
                </div>
                <div className="text-sm text-muted-foreground">
                  • CSV/Excel export options
                </div>
              </div>
              <Link href="/reports">
                <Button className="w-full mt-4" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Claims */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Claims
            </CardTitle>
            <CardDescription>
              Latest billing activity and claim submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
                <span className="ml-2">Loading claims...</span>
              </div>
            ) : recentClaims.length > 0 ? (
              <div className="space-y-3">
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{claim.student_name}</h4>
                        {getStatusBadge(claim.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {claim.session_date ? new Date(claim.session_date).toLocaleDateString() : "Date TBD"} • {formatCurrency(claim.amount)} • {claim.service_label ?? claim.service_type}
                        {claim.payer_name ? ` • ${claim.payer_name}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={{ pathname: "/billing/claim-audit", query: { id: claim.id } }}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent claims found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

