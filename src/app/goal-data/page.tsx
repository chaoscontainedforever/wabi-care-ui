import { Suspense } from "react"
import GoalDataContent from "@/components/GoalDataContent"

export default function GoalDataPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoalDataContent />
    </Suspense>
  )
}
