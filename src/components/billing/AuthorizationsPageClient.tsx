"use client"

import { useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, ShieldCheck, AlertTriangle, Timer, Inbox } from "lucide-react"
import { useAuthorizations } from "@/hooks/useAuthorizations"
import { useBilling } from "@/hooks/useBilling"
import PageLayout from "@/components/PageLayout"
import { formatDistanceToNow } from "date-fns"

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  tone,
}: {
  title: string
  value: number
  subtitle: string
  icon: ReactNode
  tone: "default" | "warning" | "danger"
}) {
  const toneClasses = {
    default: "border border-emerald-100",
    warning: "border border-amber-100",
    danger: "border border-rose-100",
  } as const

  return (
    <Card className={`h-full bg-card shadow-sm ${toneClasses[tone]}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardDescription className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold text-foreground">{value}</CardTitle>
        </div>
        <div className="rounded-full bg-muted p-2 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

export default function AuthorizationsPageClient() {
  const { claims } = useBilling()
  const { authorizations, loading, summary, refresh } = useAuthorizations(claims)

  const sortedAuthorizations = useMemo(() => {
    return [...authorizations].sort((a, b) => a.days_until_expiry - b.days_until_expiry)
  }, [authorizations])

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Authorizations</h1>
            <p className="text-muted-foreground">
              Track payer approvals, unit consumption, and renewal timelines for ABA services.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {loading ? "Refreshing" : "Refresh"}
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Active"
            value={summary.activeAuthorizations}
            subtitle="Current authorizations"
            icon={<ShieldCheck className="h-4 w-4" />}
            tone="default"
          />
          <SummaryCard
            title="Expiring Soon"
            value={summary.expiringSoon}
            subtitle="Within 30 days"
            icon={<Timer className="h-4 w-4 text-amber-500" />}
            tone="warning"
          />
          <SummaryCard
            title="Low Units"
            value={summary.lowUnits}
            subtitle="Below 20% remaining"
            icon={<Inbox className="h-4 w-4 text-amber-500" />}
            tone="warning"
          />
          <SummaryCard
            title="Expired"
            value={summary.expired}
            subtitle="Require immediate action"
            icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
            tone="danger"
          />
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-lg font-semibold">Authorization Registry</CardTitle>
            <CardDescription>Monitor utilization, expirations, and payer contacts.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {loading ? (
              <div className="space-y-3 px-6 py-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : sortedAuthorizations.length === 0 ? (
              <div className="flex h-40 items-center justify-center px-6 text-sm text-muted-foreground">
                No authorizations on file yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Authorization</TableHead>
                      <TableHead>Payer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Units</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAuthorizations.map((auth) => (
                      <TableRow key={auth.id}>
                        <TableCell>
                          <div className="font-medium text-foreground">{auth.student_name}</div>
                          <div className="text-xs text-muted-foreground">#{auth.student_id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">{auth.authorization_number}</div>
                          {auth.notes ? (
                            <div className="text-xs text-muted-foreground">{auth.notes}</div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">{auth.payer_name}</div>
                          {auth.payer_contact ? (
                            <div className="text-xs text-muted-foreground">{auth.payer_contact}</div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">{auth.service_label ?? auth.service_type ?? "—"}</div>
                          <div className="text-xs text-muted-foreground">
                            {auth.units_used} used · {auth.units_remaining} remaining
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-sm font-medium text-foreground">{auth.total_units}</div>
                          <div className="text-xs text-muted-foreground">{auth.percent_used}% used</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">{new Date(auth.expires_on).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {auth.days_until_expiry >= 0
                              ? formatDistanceToNow(new Date(auth.expires_on), { addSuffix: true })
                              : "Expired"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="capitalize">
                              {auth.status}
                            </Badge>
                            {auth.is_expired ? (
                              <Badge variant="destructive" className="text-xs">Expired</Badge>
                            ) : null}
                            {!auth.is_expired && auth.is_expiring_soon ? (
                              <Badge variant="secondary" className="text-xs text-amber-700">Expiring soon</Badge>
                            ) : null}
                            {!auth.is_expired && auth.is_low_units ? (
                              <Badge variant="secondary" className="text-xs text-amber-700">Low units</Badge>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
