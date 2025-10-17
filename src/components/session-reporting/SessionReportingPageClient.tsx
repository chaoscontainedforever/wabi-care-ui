"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Save, 
  Share2,
  BarChart3,
  Image,
  Table,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Users,
  Calendar,
  Clock,
  Target
} from "lucide-react"
import PageLayout from "@/components/PageLayout"
import RichTextEditor from "./RichTextEditor"
import DynamicChartEditor from "./DynamicChartEditor"
import { useStudents } from "@/hooks/useSupabase"
import { useGoals } from "@/hooks/useSupabase"

// Mock session data
const mockSessions = [
  {
    id: "session-1",
    studentId: "student-1",
    studentName: "Alex Johnson",
    date: "2024-01-15",
    duration: 60,
    therapist: "Dr. Sarah Wilson",
    goals: ["Math Addition", "Social Skills"],
    dataPoints: [
      { goal: "Math Addition", trials: 15, correct: 12, accuracy: 80 },
      { goal: "Social Skills", trials: 8, correct: 6, accuracy: 75 }
    ],
    notes: "Great session! Alex showed significant improvement in math skills.",
    status: "completed"
  },
  {
    id: "session-2", 
    studentId: "student-2",
    studentName: "Sarah Williams",
    date: "2024-01-14",
    duration: 45,
    therapist: "Dr. Sarah Wilson",
    goals: ["Reading Comprehension", "Behavior Management"],
    dataPoints: [
      { goal: "Reading Comprehension", trials: 10, correct: 8, accuracy: 80 },
      { goal: "Behavior Management", trials: 12, correct: 10, accuracy: 83 }
    ],
    notes: "Sarah was very engaged today. Minor behavioral incidents but overall positive.",
    status: "completed"
  }
]

// Mock report templates
const reportTemplates = [
  {
    id: "template-1",
    name: "Standard Session Report",
    description: "Comprehensive session report with graphs and analysis",
    sections: ["Session Overview", "Goal Performance", "Data Analysis", "Recommendations"]
  },
  {
    id: "template-2", 
    name: "Progress Summary",
    description: "Brief progress update for parents",
    sections: ["Key Achievements", "Areas of Focus", "Next Steps"]
  },
  {
    id: "template-3",
    name: "Detailed Analysis",
    description: "In-depth analysis for BCBA review",
    sections: ["Session Overview", "Detailed Data Analysis", "Graph Analysis", "Clinical Notes", "Recommendations"]
  }
]

export default function SessionReportingPageClient() {
  const { students } = useStudents()
  const { goals } = useGoals()
  
  const [selectedSession, setSelectedSession] = useState(mockSessions[0])
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0])
  const [reportContent, setReportContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [showChartEditor, setShowChartEditor] = useState(false)
  const [editingChart, setEditingChart] = useState<any>(null)
  
  const editorRef = useRef<HTMLDivElement>(null)

  // Rich text editor commands
  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }, [])

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      setReportContent(editorRef.current.innerHTML)
    }
  }, [])

  // Generate report from template
  const generateReportFromTemplate = useCallback(() => {
    if (!selectedSession || !selectedTemplate) return

    const templateContent = `
      <h1>Session Report - ${selectedSession.studentName}</h1>
      <h2>Session Overview</h2>
      <p><strong>Date:</strong> ${selectedSession.date}</p>
      <p><strong>Duration:</strong> ${selectedSession.duration} minutes</p>
      <p><strong>Therapist:</strong> ${selectedSession.therapist}</p>
      <p><strong>Goals:</strong> ${selectedSession.goals.join(", ")}</p>
      
      <h2>Goal Performance</h2>
      ${selectedSession.dataPoints.map(point => `
        <h3>${point.goal}</h3>
        <p>Trials: ${point.trials} | Correct: ${point.correct} | Accuracy: ${point.accuracy}%</p>
        <div class="chart-placeholder" data-goal="${point.goal}" data-trials="${point.trials}" data-correct="${point.correct}">
          [Chart will be rendered here]
        </div>
      `).join("")}
      
      <h2>Session Notes</h2>
      <p>${selectedSession.notes}</p>
      
      <h2>Recommendations</h2>
      <p>[Add recommendations based on session performance]</p>
    `
    
    setReportContent(templateContent)
    if (editorRef.current) {
      editorRef.current.innerHTML = templateContent
    }
  }, [selectedSession, selectedTemplate])

  // Export functions
  const handleExportPDF = useCallback(() => {
    // Mock PDF export - in real implementation, use libraries like jsPDF or Puppeteer
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Session Report - ${selectedSession.studentName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1, h2, h3 { color: #333; }
              .chart-placeholder { 
                border: 2px dashed #ccc; 
                padding: 20px; 
                text-align: center; 
                margin: 10px 0;
                background: #f9f9f9;
              }
            </style>
          </head>
          <body>
            ${reportContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [reportContent, selectedSession])

  const handleExportDOC = useCallback(() => {
    // Mock DOC export - in real implementation, use libraries like docx
    const blob = new Blob([reportContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `session-report-${selectedSession.studentName}-${selectedSession.date}.html`
    a.click()
    URL.revokeObjectURL(url)
  }, [reportContent, selectedSession])

  // Render chart placeholder
  const renderChartPlaceholder = (goal: string, trials: number, correct: number) => {
    const accuracy = Math.round((correct / trials) * 100)
    return (
      <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50 text-center">
        <div className="text-sm text-gray-600 mb-2">Interactive Chart: {goal}</div>
        <div className="text-lg font-semibold">Accuracy: {accuracy}%</div>
        <div className="text-sm text-gray-500">{correct}/{trials} trials</div>
        <Button 
          size="sm" 
          variant="outline" 
          className="mt-2"
          onClick={() => {
            setEditingChart({
              goal,
              trials,
              correct,
              accuracy
            })
            setShowChartEditor(true)
          }}
        >
          <BarChart3 className="h-4 w-4 mr-1" />
          Edit Chart
        </Button>
      </div>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Session Reporting</h1>
            <p className="text-muted-foreground">Create and edit session reports with dynamic graphs</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "Preview" : "Edit"}
            </Button>
            <Button 
              variant="outline"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={handleExportDOC}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export DOC
            </Button>
          </div>
        </div>

        {/* Session Selection Card - Horizontal Layout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Session Selection & Report Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Session Selection */}
              <div>
                <Label htmlFor="session-select">Choose Session</Label>
                <Select 
                  value={selectedSession.id} 
                  onValueChange={(value) => {
                    const session = mockSessions.find(s => s.id === value)
                    if (session) setSelectedSession(session)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a session" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{session.studentName}</span>
                          <span className="text-sm text-muted-foreground">{session.date}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template Selection */}
              <div>
                <Label htmlFor="template-select">Report Template</Label>
                <Select 
                  value={selectedTemplate.id} 
                  onValueChange={(value) => {
                    const template = reportTemplates.find(t => t.id === value)
                    if (template) setSelectedTemplate(template)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{template.name}</span>
                          <span className="text-sm text-muted-foreground">{template.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Report Button */}
              <div className="flex items-end">
                <Button 
                  onClick={generateReportFromTemplate}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>

              {/* Session Details - Compact */}
              <div className="lg:col-span-2">
                <Label>Session Details</Label>
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student:</span>
                    <span className="font-medium">{selectedSession.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{selectedSession.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{selectedSession.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Therapist:</span>
                    <span className="font-medium">{selectedSession.therapist}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Goals:</span>
                    <span className="font-medium">{selectedSession.goals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedSession.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Report Editor */}
        <div>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Report Editor
                    </CardTitle>
                    <CardDescription>
                      {selectedSession.studentName} - {selectedSession.date}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {selectedTemplate.name}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="charts">Charts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="mt-4">
                    <RichTextEditor
                      content={reportContent}
                      onChange={setReportContent}
                      placeholder="Start typing your session report..."
                      className="min-h-[600px]"
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="mt-4">
                    <div className="border rounded-lg p-6 bg-white min-h-[600px]">
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: reportContent }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="charts" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Dynamic Charts</h3>
                        <Button 
                          onClick={() => {
                            setEditingChart(null)
                            setShowChartEditor(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Chart
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSession.dataPoints.map((point, index) => (
                          <Card key={index}>
                            <CardHeader>
                              <CardTitle className="text-base">{point.goal}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {renderChartPlaceholder(point.goal, point.trials, point.correct)}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
        </div>

        {/* Chart Editor Modal */}
        {showChartEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <DynamicChartEditor
              goal={editingChart?.goal || "New Chart"}
              initialData={editingChart}
              onSave={(chartData) => {
                console.log("Chart saved:", chartData)
                setShowChartEditor(false)
                setEditingChart(null)
              }}
              onClose={() => {
                setShowChartEditor(false)
                setEditingChart(null)
              }}
            />
          </div>
        )}
      </div>
    </PageLayout>
  )
}
