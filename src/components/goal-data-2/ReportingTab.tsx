"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatAssistant } from "@/components/ChatAssistantProvider"
import { useAuth } from "@/contexts/AuthContext"
import { 
  FileText,
  Download,
  Save,
  Share2,
  Users,
  BarChart3
} from "lucide-react"
import { format } from "date-fns"

const RichTextEditor = dynamic(() => import("@/components/session-reporting/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-lg border bg-muted animate-pulse" aria-hidden="true" />
  ),
})

interface ReportingTabProps {
  studentId: string
  studentName: string
}

interface SessionData {
  sessionId: string
  date: string
  startTime: string
  endTime: string | null
  durationSeconds: number
  trials: Array<{
    id: string
    timestamp: number
    outcome: "correct" | "incorrect" | "prompted"
    promptLevel: string
    goalId: string
  }>
  frequencyData: Array<{
    id: string
    timestamp: number
    behavior: string
    goalId: string
  }>
  durationData: Array<{
    id: string
    startTime: number
    endTime: number | null
    behavior: string
    duration: number
    goalId: string
  }>
  overallNotes: string
  dataCollectionMethod: "trial" | "frequency" | "duration" | "interval"
}

const reportTemplates = [
  { id: "standard", name: "Standard Session Report", icon: Users },
  { id: "iep", name: "IEP Progress Report", icon: FileText },
  { id: "insurance", name: "Insurance Claim Report", icon: FileText },
  { id: "detailed", name: "Detailed Progress Report", icon: FileText },
]

export function ReportingTab({ studentId, studentName }: ReportingTabProps) {
  const { registerReportGenerator } = useChatAssistant()
  const { user } = useAuth()
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [reportContent, setReportContent] = useState<string>("")
  const [reportTitle, setReportTitle] = useState<string>('Generated Report')
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0])
  const [activeTab, setActiveTab] = useState("editor")

  // Load sessions from localStorage
  useEffect(() => {
    const storedSessions = localStorage.getItem(`sessions_${studentId}`)
    if (storedSessions) {
      try {
        const parsed = JSON.parse(storedSessions)
        setSessions(parsed)
      } catch (error) {
        console.error("Error loading sessions:", error)
      }
    }
  }, [studentId])

  // Listen for report generation events from AI Assistant sidebar
  useEffect(() => {
    const handleReportGenerated = (event: CustomEvent) => {
      const { title, content } = event.detail
      setReportTitle(title)
      // Convert plain text to HTML format for the editor
      const htmlContent = content.split('\n').map(line => {
        if (line.trim() === '') return '<br>'
        if (line.startsWith('===') || line.startsWith('==')) return `<h2>${line.replace(/=/g, '').trim()}</h2>`
        if (line.match(/^[A-Z\s]+$/)) return `<h3>${line}</h3>`
        return `<p>${line}</p>`
      }).join('')
      setReportContent(htmlContent)
    }

    window.addEventListener('reportGenerated', handleReportGenerated as EventListener)
    return () => {
      window.removeEventListener('reportGenerated', handleReportGenerated as EventListener)
    }
  }, [])

  // Generate report based on user query
  const generateReportFromQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    // Parse date range from query
    let daysBack = 30 // default
    if (lowerQuery.includes('last 2 sessions') || lowerQuery.includes('last two sessions')) {
      daysBack = 365 // Get last 2 sessions regardless of date
    } else if (lowerQuery.includes('last week') || lowerQuery.includes('past week')) {
      daysBack = 7
    } else if (lowerQuery.includes('last month') || lowerQuery.includes('past month') || lowerQuery.includes('1 month')) {
      daysBack = 30
    } else if (lowerQuery.includes('last 2 months') || lowerQuery.includes('past 2 months')) {
      daysBack = 60
    } else if (lowerQuery.includes('last quarter') || lowerQuery.includes('past quarter') || lowerQuery.includes('3 months')) {
      daysBack = 90
    }

    // Filter sessions by date
    const now = new Date()
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
    let relevantSessions = sessions.filter(s => new Date(s.date) >= cutoffDate)
    
    // If query asks for "last 2 sessions", get the 2 most recent
    if (lowerQuery.includes('last 2 sessions') || lowerQuery.includes('last two sessions')) {
      relevantSessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2)
    }

    // Calculate statistics
    let totalTrials = 0
    let correctTrials = 0
    let incorrectTrials = 0
    let promptedTrials = 0
    let totalFrequency = 0
    let totalDuration = 0

    relevantSessions.forEach(session => {
      totalTrials += session.trials.length
      session.trials.forEach(trial => {
        if (trial.outcome === "correct") correctTrials++
        else if (trial.outcome === "incorrect") incorrectTrials++
        else if (trial.outcome === "prompted") promptedTrials++
      })
      totalFrequency += session.frequencyData.length
      totalDuration += session.durationData.reduce((sum, d) => sum + d.duration, 0)
    })

    const averageAccuracy = totalTrials > 0 ? Math.round((correctTrials / totalTrials) * 100) : 0

    // Determine report type
    let reportContent = ''
    let title = ''

    if (lowerQuery.includes('iep') || lowerQuery.includes('individualized education')) {
      title = `IEP Progress Report - ${studentName}`
      reportContent = `INDIVIDUALIZED EDUCATION PROGRAM (IEP) PROGRESS REPORT

Student: ${studentName}
Report Period: ${relevantSessions.length > 0 ? new Date(relevantSessions[relevantSessions.length - 1].date).toLocaleDateString() : 'N/A'} - ${new Date().toLocaleDateString()}
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
=================
This report summarizes ${studentName}'s progress based on ${relevantSessions.length} therapy session(s) conducted during the reporting period.

SESSION SUMMARY
===============
Total Sessions: ${relevantSessions.length}
Total Trials: ${totalTrials}
Average Accuracy: ${averageAccuracy}%
Correct Responses: ${correctTrials} (${totalTrials > 0 ? Math.round((correctTrials / totalTrials) * 100) : 0}%)
Incorrect Responses: ${incorrectTrials} (${totalTrials > 0 ? Math.round((incorrectTrials / totalTrials) * 100) : 0}%)
Prompted Responses: ${promptedTrials} (${totalTrials > 0 ? Math.round((promptedTrials / totalTrials) * 100) : 0}%)
Frequency Events: ${totalFrequency}
Total Duration: ${Math.floor(totalDuration / 60)} minutes ${totalDuration % 60} seconds

GOAL PROGRESS
=============
`
      // Group by goals
      const goalProgress: Record<string, { trials: number; correct: number; incorrect: number; prompted: number }> = {}
      relevantSessions.forEach(session => {
        session.trials.forEach(trial => {
          if (!goalProgress[trial.goalId]) {
            goalProgress[trial.goalId] = { trials: 0, correct: 0, incorrect: 0, prompted: 0 }
          }
          goalProgress[trial.goalId].trials++
          if (trial.outcome === "correct") goalProgress[trial.goalId].correct++
          else if (trial.outcome === "incorrect") goalProgress[trial.goalId].incorrect++
          else if (trial.outcome === "prompted") goalProgress[trial.goalId].prompted++
        })
      })

      Object.entries(goalProgress).forEach(([goalId, stats]) => {
        const accuracy = stats.trials > 0 ? Math.round((stats.correct / stats.trials) * 100) : 0
        reportContent += `Goal ID: ${goalId}
  Total Trials: ${stats.trials}
  Accuracy: ${accuracy}%
  Correct: ${stats.correct} | Incorrect: ${stats.incorrect} | Prompted: ${stats.prompted}

`
      })

      reportContent += `
DETAILED SESSION BREAKDOWN
==========================
`
      relevantSessions.forEach((session, idx) => {
        const sessionTrials = session.trials
        const sessionCorrect = sessionTrials.filter(t => t.outcome === "correct").length
        const sessionAccuracy = sessionTrials.length > 0 ? Math.round((sessionCorrect / sessionTrials.length) * 100) : 0
        
        reportContent += `Session ${idx + 1}: ${new Date(session.date).toLocaleDateString()}
  Duration: ${Math.floor(session.durationSeconds / 60)}m ${session.durationSeconds % 60}s
  Method: ${session.dataCollectionMethod}
  Trials: ${sessionTrials.length} (Accuracy: ${sessionAccuracy}%)
  Notes: ${session.overallNotes || 'None provided'}

`
      })

      reportContent += `
RECOMMENDATIONS
===============
Based on the data collected, the following recommendations are provided:
- Continue current intervention strategies as progress is being observed
- Monitor accuracy trends and adjust prompting levels as needed
- Review session notes for additional context and observations

Next Review Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Prepared by: AI Report Assistant
Date: ${new Date().toLocaleDateString()}`
    } else if (lowerQuery.includes('insurance') || lowerQuery.includes('claim')) {
      title = `Insurance Claim Report - ${studentName}`
      reportContent = `INSURANCE CLAIM REPORT
Applied Behavior Analysis (ABA) Therapy Services

CLIENT INFORMATION
==================
Student Name: ${studentName}
Student ID: ${studentId}
Service Period: ${relevantSessions.length > 0 ? new Date(relevantSessions[relevantSessions.length - 1].date).toLocaleDateString() : 'N/A'} - ${new Date().toLocaleDateString()}
Report Date: ${new Date().toLocaleDateString()}

SERVICE SUMMARY
===============
Total Sessions Provided: ${relevantSessions.length}
Total Service Hours: ${(relevantSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 3600).toFixed(2)} hours
Average Session Duration: ${relevantSessions.length > 0 ? Math.round(relevantSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / relevantSessions.length / 60) : 0} minutes

SERVICE DETAILS
===============
`
      relevantSessions.forEach((session, idx) => {
        reportContent += `Session ${idx + 1}
  Date: ${new Date(session.date).toLocaleDateString()}
  Start Time: ${session.startTime}
  End Time: ${session.endTime || 'In Progress'}
  Duration: ${Math.floor(session.durationSeconds / 60)} minutes
  Service Type: ABA Therapy Session
  Interventions: ${session.dataCollectionMethod}
  Data Points Collected: ${session.trials.length + session.frequencyData.length + session.durationData.length}

`
      })

      reportContent += `
TREATMENT OUTCOMES
==================
Total Treatment Trials: ${totalTrials}
Correct Responses: ${correctTrials} (${averageAccuracy}%)
Overall Progress: ${averageAccuracy >= 80 ? 'Excellent' : averageAccuracy >= 60 ? 'Good' : averageAccuracy >= 40 ? 'Moderate' : 'Needs Improvement'}

MEDICAL NECESSITY
=================
The services provided are medically necessary for the treatment of behavioral and developmental needs. All sessions were conducted by qualified professionals using evidence-based ABA interventions.

BILLING INFORMATION
===================
Total Billable Units: ${relevantSessions.length}
CPT Code: 97153 (Behavior Identification Assessment)
CPT Code: 97155 (Adaptive Behavior Treatment with Protocol Modification)

CERTIFICATION
=============
I certify that the services described in this report were medically necessary and were provided as stated.

Generated by: Wabi Care Platform
Date: ${new Date().toLocaleDateString()}`
    } else {
      // Default detailed report
      title = `Progress Report - ${studentName}`
      reportContent = `PROGRESS REPORT

Student: ${studentName}
Report Period: ${relevantSessions.length > 0 ? new Date(relevantSessions[relevantSessions.length - 1].date).toLocaleDateString() : 'N/A'} - ${new Date().toLocaleDateString()}
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
==================
Total Sessions: ${relevantSessions.length}
Total Trials: ${totalTrials}
Average Accuracy: ${averageAccuracy}%
Correct Responses: ${correctTrials}
Incorrect Responses: ${incorrectTrials}
Prompted Responses: ${promptedTrials}
Frequency Events: ${totalFrequency}
Total Duration: ${Math.floor(totalDuration / 60)} minutes

SESSION DETAILS
===============
`
      relevantSessions.forEach((session, idx) => {
        const sessionTrials = session.trials
        const sessionCorrect = sessionTrials.filter(t => t.outcome === "correct").length
        const sessionAccuracy = sessionTrials.length > 0 ? Math.round((sessionCorrect / sessionTrials.length) * 100) : 0
        
        reportContent += `Session ${idx + 1}
  Date: ${new Date(session.date).toLocaleDateString()}
  Duration: ${Math.floor(session.durationSeconds / 60)}m ${session.durationSeconds % 60}s
  Method: ${session.dataCollectionMethod}
  Trials: ${sessionTrials.length}
  Accuracy: ${sessionAccuracy}%
  Correct: ${sessionCorrect} | Incorrect: ${sessionTrials.filter(t => t.outcome === "incorrect").length} | Prompted: ${sessionTrials.filter(t => t.outcome === "prompted").length}
  Notes: ${session.overallNotes || 'None provided'}

`
      })

      reportContent += `
ANALYSIS
========
${studentName} participated in ${relevantSessions.length} therapy session(s) during this reporting period. The average accuracy rate of ${averageAccuracy}% indicates ${averageAccuracy >= 80 ? 'strong progress' : averageAccuracy >= 60 ? 'steady progress' : averageAccuracy >= 40 ? 'developing progress' : 'areas requiring additional support'}.

Generated by: AI Report Assistant
Date: ${new Date().toLocaleDateString()}`
    }

    return reportContent
  }

  // Register report generator with ChatAssistantProvider
  useEffect(() => {
    const reportGen = {
      generateReport: (query: string) => {
        const reportContent = generateReportFromQuery(query)
        const lowerQuery = query.toLowerCase()
        const reportTitleText = lowerQuery.includes('iep') ? `IEP Report - ${studentName}` :
                               lowerQuery.includes('insurance') || lowerQuery.includes('claim') ? `Insurance Claim Report - ${studentName}` :
                               `Progress Report - ${studentName}`
        return {
          title: reportTitleText,
          content: reportContent
        }
      }
    }
    
    registerReportGenerator(reportGen)
    
    return () => {
      registerReportGenerator(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, studentName, sessions, registerReportGenerator])

  const handleSave = () => {
    // Save report to localStorage or backend
    const reportData = {
      studentId,
      studentName,
      title: reportTitle,
      content: reportContent,
      template: selectedTemplate.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(`report_${studentId}_${Date.now()}`, JSON.stringify(reportData))
    alert("Report saved successfully!")
  }

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: reportTitle,
        text: reportContent.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
      }).catch(err => console.log('Error sharing', err))
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(reportContent.replace(/<[^>]*>/g, ''))
      alert("Report content copied to clipboard!")
    }
  }

  const handleExportWord = () => {
    if (!reportContent) return

    // Create a simple Word-compatible format
    const blob = new Blob([reportContent.replace(/<[^>]*>/g, '')], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    if (!reportContent) return

    // For PDF, we'll create a formatted HTML document and print it
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            h1 { color: #333; border-bottom: 2px solid #9333ea; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          <div>${reportContent}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    
    // Wait a bit for content to load, then print
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  const getUserDisplayName = () => {
    if (user?.email) {
      const name = user.email.split('@')[0]
      return name.split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')
    }
    return "User"
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl">Report Editor</CardTitle>
              </div>
              <div className="text-sm text-muted-foreground">
                {getUserDisplayName()} - {format(new Date(), 'yyyy-MM-dd')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedTemplate.id} onValueChange={(value) => {
                const template = reportTemplates.find(t => t.id === value)
                if (template) setSelectedTemplate(template)
              }}>
                <SelectTrigger className="w-[200px]">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = selectedTemplate.icon
                      return <IconComponent className="h-4 w-4" />
                    })()}
                    <span>{selectedTemplate.name}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates.map(template => {
                    const IconComponent = template.icon
                    return (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {template.name}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <Button
                onClick={handleSave}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Tabs */}
        <CardContent className="flex-1 overflow-hidden p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="editor" className="flex-1 mt-0 px-6 pb-6 overflow-hidden">
              <div className="h-full">
                <RichTextEditor
                  content={reportContent}
                  onChange={setReportContent}
                  placeholder="Start typing your session report..."
                  className="h-full min-h-[600px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 mt-0 px-6 pb-6 overflow-auto">
              <div className="border rounded-lg p-6 bg-white min-h-[600px]">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: reportContent || '<p class="text-muted-foreground italic">No content to preview</p>' }}
                />
              </div>
            </TabsContent>

            <TabsContent value="charts" className="flex-1 mt-0 px-6 pb-6 overflow-auto">
              <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Charts Coming Soon</p>
                <p className="text-sm">
                  Chart visualization features will be available here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
