"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"

interface ReportGenerator {
  generateReport: (query: string) => { title: string; content: string } | null
}

interface ChatAssistantContextType {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  toggleChat: () => void
  width: number
  setWidth: (width: number) => void
  registerReportGenerator: (generator: ReportGenerator | null) => void
  generateReportFromQuery: (query: string) => { title: string; content: string } | null
}

const ChatAssistantContext = createContext<ChatAssistantContextType | undefined>(undefined)

export function ChatAssistantProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [reportGenerator, setReportGenerator] = useState<ReportGenerator | null>(null)
  
  // Responsive default width based on screen size
  const [width, setWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.min(
        window.innerWidth < 640 ? window.innerWidth * 0.8 : // Mobile: 80% of screen
        window.innerWidth < 768 ? window.innerWidth * 0.7 : // Small tablet: 70% of screen
        window.innerWidth < 1024 ? window.innerWidth * 0.5 : // Tablet: 50% of screen
        400, // Desktop: 400px
        500 // Absolute maximum
      )
    }
    return 400 // Fallback for SSR
  })

  const toggleChat = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const registerReportGenerator = useCallback((generator: ReportGenerator | null) => {
    setReportGenerator(generator)
  }, [])

  const generateReportFromQuery = useCallback((query: string) => {
    if (reportGenerator) {
      return reportGenerator.generateReport(query)
    }
    return null
  }, [reportGenerator])

  return (
    <ChatAssistantContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        toggleChat,
        width,
        setWidth,
        registerReportGenerator,
        generateReportFromQuery,
      }}
    >
      {children}
    </ChatAssistantContext.Provider>
  )
}

export function useChatAssistant() {
  const context = useContext(ChatAssistantContext)
  if (context === undefined) {
    throw new Error("useChatAssistant must be used within a ChatAssistantProvider")
  }
  return context
}
