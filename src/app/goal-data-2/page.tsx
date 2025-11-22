"use client"

import { Suspense } from "react"
import GoalData2Content from "@/components/GoalData2Content"

export default function GoalData2Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoalData2Content />
    </Suspense>
  )
}

