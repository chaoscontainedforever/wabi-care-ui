import { Suspense } from "react"
import StudentOverviewContent from "@/components/StudentOverviewContent"

export default function StudentOverviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentOverviewContent />
    </Suspense>
  )
}

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'
