"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const DashboardPage = dynamic(() => import("@/components/DashboardPage").then(mod => ({ default: mod.DashboardPage })), {
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p className="text-gray-600">Loading Dashboard...</p>
      </div>
    </div>
  )
})

export default function Page() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <p className="text-gray-600">Loading Dashboard...</p>
          </div>
        </div>
      }>
        <DashboardPage />
      </Suspense>
    </ProtectedRoute>
  )
}
