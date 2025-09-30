"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const GoalDataContent = dynamic(() => import("@/components/GoalDataContent"), {
  loading: () => <div>Loading...</div>,
  ssr: false
})

export default function GoalDataPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoalDataContent />
    </Suspense>
  )
}
