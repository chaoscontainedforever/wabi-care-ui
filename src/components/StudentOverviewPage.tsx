"use client"

import { Suspense } from "react"
import { PageLayout } from "@/components/PageLayout"
import StudentOverviewContentInner from "./StudentOverviewContentInner"

export function StudentOverviewPage() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Students", href: "/students" },
        { label: "Student Overview" }
      ]}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <StudentOverviewContentInner />
      </Suspense>
    </PageLayout>
  )
}
