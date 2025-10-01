"use client"

import DashboardContent from "@/components/DashboardContent"
import { PageLayout } from "@/components/PageLayout"

export function DashboardPage() {
  return (
    <PageLayout 
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <DashboardContent />
    </PageLayout>
  )
}
