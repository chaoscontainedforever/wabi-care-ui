"use client"

import { useState } from "react"

import { PageLayout } from "@/components/PageLayout"
import { SchedulingDashboardHeader } from "@/components/scheduling/SchedulingDashboardHeader"
import { SchedulingWorkspace } from "@/components/scheduling/SchedulingWorkspace"
import type { ViewMode } from "@/components/ui/view-mode-toggle"

export default function SchedulingPageClient() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards")

  return (
    <PageLayout breadcrumbs={[{ label: "Scheduling", href: "/scheduling" }]}>
      <div className="space-y-6">
        <SchedulingDashboardHeader viewMode={viewMode} onViewModeChange={setViewMode} />
        <SchedulingWorkspace variant="full" viewMode={viewMode} />
      </div>
    </PageLayout>
  )
}

