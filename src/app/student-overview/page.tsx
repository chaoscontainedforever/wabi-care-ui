"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const StudentOverviewContent = dynamic(() => import("@/components/StudentOverviewContent"), {
  loading: () => <div>Loading...</div>,
  ssr: false
})

export default function StudentOverviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentOverviewContent />
    </Suspense>
  )
}
