"use client"

import { Suspense } from "react"
import { PageLayout } from "@/components/PageLayout"
import GoalDataContentInner from "./GoalDataContentInner"

export default function GoalDataContent() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Data Collection", href: "/assessments" },
        { label: "Goal Data" }
      ]}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <GoalDataContentInner />
      </Suspense>
    </PageLayout>
  )
}