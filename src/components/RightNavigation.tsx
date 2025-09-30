"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageCircle, 
  Send, 
  X, 
  Sparkles,
  Mail,
  Calendar,
  Phone,
  Paperclip,
  Mic,
  ChevronRight
} from "@/components/icons"

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface RightNavigationProps {
  isOpen: boolean
  onToggle: () => void
  currentStudent?: any
  currentGoal?: any
}

export function RightNavigation({ isOpen, onToggle, currentStudent, currentGoal }: RightNavigationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: 'assistant',
      content: "Hello! I'm Wabi Chat, your AI assistant for special education. I can help you with student management, IEP planning, data analysis, and answer questions about your platform. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I understand you'd like help with that. Let me assist you with creating a goal or analyzing your student data. Could you provide more specific details?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { icon: Sparkles, label: "AI Assistant", action: () => setIsExpanded(true) }
  ]

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }

  // Collapsed state - vertical stack of circular gradient buttons (matching left sidebar)
  if (!isExpanded) {
    return (
      <div className="fixed right-0 top-0 h-full w-16 bg-transparent z-40 flex flex-col items-center py-6">
        <div className="space-y-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              size="lg"
              className="rounded-full w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 p-0 flex items-center justify-center shadow-lg"
            >
              <action.icon className="h-5 w-5 text-white" />
            </Button>
          ))}
        </div>
        
        {/* Close button at bottom */}
        <div className="mt-auto">
          <Button
            onClick={onToggle}
            size="lg"
            className="rounded-full w-12 h-12 bg-gray-800 hover:bg-gray-900 border-0 p-0 flex items-center justify-center shadow-lg"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    )
  }

  // Expanded state - full chat interface
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-50 border-l border-gray-200 shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Wabi Chat</h3>
              <p className="text-sm text-gray-500">AI Assistant</p>
            </div>
          </div>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>


      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about students, IEPs..."
              className="flex-1 h-10 text-sm"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-gray-500 hover:text-gray-700"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-gray-500 hover:text-gray-700"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="h-10 w-10 p-0 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
          
          {/* Suggested Topics */}
          <div className="flex flex-wrap gap-2">
            {["Dashboard", "Students", "IEP Review", "Analytics"].map((topic) => (
              <Button
                key={topic}
                variant="outline"
                size="sm"
                onClick={() => setInput(`Tell me about ${topic.toLowerCase()}`)}
                className="text-xs h-7 px-3 bg-gray-50 hover:bg-gray-100 border-gray-200"
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}