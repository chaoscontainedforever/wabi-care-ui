"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface ChatAssistantContextType {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  toggleChat: () => void
  width: number
  setWidth: (width: number) => void
}

const ChatAssistantContext = createContext<ChatAssistantContextType | undefined>(undefined)

export function ChatAssistantProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false)
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

  const toggleChat = () => {
    setIsExpanded(prev => !prev)
  }

  return (
    <ChatAssistantContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        toggleChat,
        width,
        setWidth,
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
