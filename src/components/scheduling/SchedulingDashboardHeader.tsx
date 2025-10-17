"use client"

import { CalendarCheck, CalendarClock, UsersRound, Cpu, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useSchedulingSuggestions } from "@/hooks/useScheduling"
import { ViewMode, ViewModeToggle } from "@/components/ui/view-mode-toggle"

const formatTime = (iso: string | null) => {
  if (!iso) return "No upcoming sessions"
  const date = new Date(iso)
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

interface SchedulingDashboardHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function SchedulingDashboardHeader({ viewMode, onViewModeChange }: SchedulingDashboardHeaderProps) {
  const { schedulingOverview, loading, refresh } = useSchedulingSuggestions()
  const { totalSuggestions, upcomingWithinWeek, upcomingNext, utilization, requestsPending } = schedulingOverview

  const headlineCopy = loading
    ? "Pulling the latest scheduling recommendations…"
    : upcomingWithinWeek > 0
    ? `${upcomingWithinWeek} sessions recommended in the next 7 days.`
    : "Stay proactive with AI scheduling insights."

  return (
    <Card
      noHover
      className="bg-gradient-to-r from-blue-50/80 via-white to-purple-50/80 border-none shadow-lg"
    >
      <CardHeader className="pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold text-foreground">Scheduling Assistant</CardTitle>
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
              className="min-w-[150px]"
            >
              <Cpu className="h-4 w-4 mr-2" />
              Refresh Suggestions
            </Button>
            <Button size="sm" className="min-w-[150px]">
              <Mail className="h-4 w-4 mr-2" />
              Notify Team
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricPanel
            title="AI Suggestions"
            value={totalSuggestions}
            subtitle="Generated this week"
            icon={<Cpu className="h-5 w-5 text-blue-600" />}
            loading={loading}
          />
          <MetricPanel
            title="Upcoming 7 Days"
            value={upcomingWithinWeek}
            subtitle="Sessions to confirm"
            icon={<CalendarClock className="h-5 w-5 text-purple-600" />}
            loading={loading}
          />
          <MetricPanel
            title="Utilization"
            value={`${utilization}%`}
            subtitle="Capacity forecast"
            icon={<UsersRound className="h-5 w-5 text-emerald-600" />}
            loading={loading}
          />
          <MetricPanel
            title="Pending Requests"
            value={requestsPending}
            subtitle="Awaiting approval"
            icon={<CalendarCheck className="h-5 w-5 text-amber-600" />}
            badgeLabel={requestsPending > 0 ? `${requestsPending}` : undefined}
            badgeVariant="secondary"
            loading={loading}
          />
        </div>
        <div className="mt-6 rounded-lg border border-dashed border-blue-200 bg-white/70 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Next suggested session:</span> {loading ? "Loading…" : formatTime(upcomingNext)}
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
    <div className="rounded-xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur">
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


