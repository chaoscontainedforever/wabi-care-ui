"use client"

import AllStudentsContent from "@/components/AllStudentsContentOptimized"
import { PageLayout } from "@/components/PageLayout"

export function AllStudentsPage() {
  return (
    <PageLayout 
      breadcrumbs={[
        { label: "Students", href: "/students" },
        { label: "All Students" }
      ]}
    >
      <AllStudentsContent />
    </PageLayout>
  )
}
