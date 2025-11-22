"use client"

import { Suspense } from "react"
import ParentPortalContent from "@/components/ParentPortalContent"

export default function ParentPortalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ParentPortalContent />
    </Suspense>
  )
}

