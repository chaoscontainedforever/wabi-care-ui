"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Bot, MessageCircle, X, Send, User, GripVertical } from "lucide-react"

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you with your students today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isResizing, setIsResizing] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand you\'re asking about: "' + inputValue + '". Let me help you with that!',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
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

      const rect = chatRef.current.getBoundingClientRect()
      const newWidth = window.innerWidth - e.clientX - 16 // 16px for right padding
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
      {/* Floating Button - Always visible when collapsed */}
      {!isExpanded && (
        <Button
          onClick={onToggle}
          className="fixed top-4 right-2 z-50 h-12 w-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Expandable Chat Card */}
      {isExpanded && (
        <div 
          ref={chatRef}
          className="fixed top-2 right-2 z-50 transition-all duration-200 ease-in-out"
          style={{ 
            width: `${width}px`, 
            height: 'calc(100vh - 1rem)'
          }}
        >
          {/* Resize handle - hidden on mobile */}
          <div
            className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors hidden lg:block"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Chat Card */}
          <Card className="h-full flex flex-col bg-background border border-border shadow-xl rounded-lg">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <Separator />

            {/* Messages area */}
            <CardContent className="flex-1 p-0 overflow-hidden">
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
            </CardContent>

            {/* Input area */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your students..."
                  className="flex-1"
                  disabled={messages[messages.length - 1]?.role === 'user'}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || messages[messages.length - 1]?.role === 'user'}
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export { ChatAssistant as ChatAssistantCard }