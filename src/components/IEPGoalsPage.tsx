"use client"

import { IEPGoalsContent } from "@/components/IEPGoalsContent"
import { PageLayout } from "@/components/PageLayout"

export function IEPGoalsPage() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Data Collection", href: "/assessments" },
        { label: "Goal Bank" }
      ]}
    >
      <IEPGoalsContent />
    </PageLayout>
  )
}
