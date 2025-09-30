"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  activeItem: string
  setActiveItem: (item: string) => void
  isMounted: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("dashboard")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        activeItem,
        setActiveItem,
        isMounted,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
