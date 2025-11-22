"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Bot, X, Send, User, GripVertical } from "lucide-react"
import { useChatAssistant } from "./ChatAssistantProvider"

interface ChatAssistantCardProps {
  isExpanded: boolean
  onToggle: () => void
  width: number
  onWidthChange: (width: number) => void
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function ChatAssistant({ isExpanded, onToggle, width, onWidthChange }: ChatAssistantCardProps) {
  const { generateReportFromQuery } = useChatAssistant()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you with your students today? I can help you generate reports, analyze data, and answer questions.',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isResizing, setIsResizing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Check if query is report-related
  const isReportQuery = (query: string): boolean => {
    const lowerQuery = query.toLowerCase()
    const reportKeywords = [
      'report', 'iep', 'insurance', 'claim', 'progress', 'session', 
      'generate', 'create', 'build', 'show', 'total', 'detailed'
    ]
    return reportKeywords.some(keyword => lowerQuery.includes(keyword))
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const query = inputValue.trim()
    setInputValue('')
    setIsProcessing(true)

    // Check if this is a report query
    if (isReportQuery(query)) {
      // Generate report using the registered generator
      const reportResult = generateReportFromQuery(query)
      
      if (reportResult) {
        // Dispatch custom event to update ReportingTab
        window.dispatchEvent(new CustomEvent('reportGenerated', {
          detail: {
            title: reportResult.title,
            content: reportResult.content,
            query: query
          }
        }))
        
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I've generated a ${reportResult.title} based on your request. The report has been displayed in the Reporting tab below. You can export it as Word or PDF using the export buttons.`,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, aiMessage])
          setIsProcessing(false)
        }, 500)
      } else {
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'I understand you\'re asking about: "' + query + '". To generate reports, please navigate to the Reporting tab and use the report assistant there, or I can help you with other questions about your students.',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, aiMessage])
          setIsProcessing(false)
        }, 1000)
      }
    } else {
      // Regular AI assistant response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I understand you\'re asking about: "' + query + '". Let me help you with that!',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        setIsProcessing(false)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !chatRef.current) return

      const newWidth = window.innerWidth - e.clientX // No right padding since it's flush with edge
      const minWidth = 280 // Smaller minimum for mobile
      // Responsive max width based on screen size
      const maxWidth = Math.min(
        window.innerWidth < 640 ? window.innerWidth * 0.9 : // Mobile: 90% of screen
        window.innerWidth < 768 ? window.innerWidth * 0.8 : // Small tablet: 80% of screen  
        window.innerWidth < 1024 ? window.innerWidth * 0.6 : // Tablet: 60% of screen
        window.innerWidth * 0.5, // Desktop: 50% of screen
        600 // Absolute maximum
      )

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        onWidthChange(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  return (
    <>
      {/* Expandable Chat Card - Side Panel - Starts below top navbar */}
      {isExpanded && (
        <div 
          ref={chatRef}
          className="fixed top-16 right-0 z-40 transition-all duration-200 ease-in-out border-l border-sidebar-border bg-sidebar"
          style={{ 
            width: `${width}px`, 
            height: 'calc(100vh - 4rem)'
          }}
        >
          {/* Resize handle - hidden on mobile */}
          <div
            className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors hidden lg:block z-10"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Chat Panel - Header matches top navbar style */}
          <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
            {/* Header - Matches top navbar style, with close button */}
            <div className="flex flex-row items-center justify-between h-16 px-6 border-b border-sidebar-border shrink-0">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">AI Assistant</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-hidden bg-sidebar">
              <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.role === 'user' ? 'text-pink-100' : 'text-muted-foreground'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {message.role === 'user' && (
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-sidebar-border bg-sidebar">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your students..."
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { ChatAssistant as ChatAssistantCard }