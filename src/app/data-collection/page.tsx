"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const DataCollectionPage = dynamic(() => import("@/components/DataCollectionPage").then(mod => ({ default: mod.DataCollectionPage })), {
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p className="text-gray-600">Loading Data Collection...</p>
      </div>
    </div>
  ),
  ssr: false
})

export default function DataCollection() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="text-gray-600">Loading Data Collection...</p>
        </div>
      </div>
    }>
      <DataCollectionPage />
    </Suspense>
  )
}
