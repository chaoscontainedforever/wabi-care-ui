"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import DashboardContent from "@/components/DashboardContent"

export function ClientDashboard() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex h-screen bg-background" suppressHydrationWarning>
        <div className="fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-primary-foreground rounded" />
              </div>
              <div>
                <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse mt-1" />
              </div>
            </div>
            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          </div>
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </div>
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-96 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card p-6">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background" suppressHydrationWarning>
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <DashboardContent />
      </main>
    </div>
  )
}
