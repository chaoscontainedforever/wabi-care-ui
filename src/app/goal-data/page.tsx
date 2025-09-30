import { Suspense } from "react"
import GoalDataContent from "@/components/GoalDataContent"

export default function GoalDataPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoalDataContent />
    </Suspense>
  )
}

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'
