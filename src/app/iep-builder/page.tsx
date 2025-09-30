"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const IEPBuilderPage = dynamic(() => import("@/components/IEPBuilderPage").then(mod => ({ default: mod.IEPBuilderPage })), {
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p className="text-gray-600">Loading IEP Builder...</p>
      </div>
    </div>
  )
})

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="text-gray-600">Loading IEP Builder...</p>
        </div>
      </div>
    }>
      <IEPBuilderPage />
    </Suspense>
  )
}
