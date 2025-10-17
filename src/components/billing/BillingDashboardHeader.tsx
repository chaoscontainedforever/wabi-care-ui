"use client"

import { RefreshCw, Download, FileSpreadsheet, ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useBillingClaims } from "@/hooks/useBilling"
import { ViewMode, ViewModeToggle } from "@/components/ui/view-mode-toggle"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
})

interface BillingDashboardHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function BillingDashboardHeader({ viewMode, onViewModeChange }: BillingDashboardHeaderProps) {
  const { billingOverview, loading, refresh } = useBillingClaims()
  const { pendingCount, pendingValue, readyCount, readyValue, auditConfidence, flaggedRate } = billingOverview

  const headlineCopy = loading
    ? "Loading current billing metrics…"
    : readyCount > 0
    ? `Ready to export ${readyCount} claims totaling ${currencyFormatter.format(readyValue)}.`
    : "Track claim readiness and audit confidence in real time."

  return (
    <Card
      noHover
      className="bg-gradient-to-r from-purple-50/80 via-white to-pink-50/80 border-none shadow-lg"
    >
      <CardHeader className="pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold text-foreground">Smart Billing</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {headlineCopy}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ViewModeToggle value={viewMode} onChange={onViewModeChange} className="bg-white/80" />
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
              className="min-w-[140px]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Metrics
            </Button>
            <Button size="sm" className="min-w-[140px]">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricPanel
            title="Pending Claims"
            value={pendingCount}
            subtitle={currencyFormatter.format(pendingValue)}
            icon={<FileSpreadsheet className="h-5 w-5 text-purple-600" />}
            loading={loading}
          />
          <MetricPanel
            title="Ready to Export"
            value={readyCount}
            subtitle={currencyFormatter.format(readyValue)}
            icon={<TrendingUp className="h-5 w-5 text-pink-600" />}
            badgeLabel={readyCount > 0 ? "Action" : undefined}
            badgeVariant="secondary"
            loading={loading}
          />
          <MetricPanel
            title="Audit Confidence"
            value={percentFormatter.format(auditConfidence / 100)}
            subtitle="Past 10 sessions"
            icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
            loading={loading}
          />
          <MetricPanel
            title="Flagged Rate"
            value={percentFormatter.format(flaggedRate / 100)}
            subtitle="Needs review"
            icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
            badgeLabel={flaggedRate > 0 ? `${flaggedRate}%` : undefined}
            badgeVariant="destructive"
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricPanelProps {
  title: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  badgeLabel?: string
  badgeVariant?: "secondary" | "destructive"
  loading?: boolean
}

function MetricPanel({ title, value, subtitle, icon, badgeLabel, badgeVariant = "secondary", loading }: MetricPanelProps) {
  return (
    <div className="rounded-xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between space-x-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <p className="text-2xl font-semibold text-foreground">{value}</p>
          )}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-inner">
            {icon}
          </span>
          {badgeLabel && (
            <Badge variant={badgeVariant} className="text-xs font-medium">
              {badgeLabel}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}


