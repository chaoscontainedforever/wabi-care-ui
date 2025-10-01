"use client"

import { useState, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  ChevronRight,
  CheckCircle,
  Bookmark,
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  ClipboardList,
  Star,
  BarChart3,
  Diamond,
  Sparkles,
  X,
  Save,
  Eye,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Undo,
  Minus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download
} from "@/components/icons"
import { useStudents } from "@/hooks/useSupabase"

function GoalDataContentInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedStudentId = searchParams.get('student')
  
  const { students, loading: studentsLoading } = useStudents()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [localSelectedStudentId, setLocalSelectedStudentId] = useState<string | null>(selectedStudentId)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [selectedDataType, setSelectedDataType] = useState("prompting-levels")
  const [goalTitle, setGoalTitle] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [prompts, setPrompts] = useState(["Independent", "1-2 Prompts", "More than 2 Prompts", "No response"])
  const [enableOutcomeTracking, setEnableOutcomeTracking] = useState(true)
  
  // Notes and voice recording state
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [notes, setNotes] = useState<string>("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [showTranscriptionReview, setShowTranscriptionReview] = useState(false)
  const [notesCount, setNotesCount] = useState(1)
  
  // Graph data state
  const [graphData, setGraphData] = useState([
    { trial: 1, score: 8, date: '2024-09-25' },
    { trial: 2, score: 6, date: '2024-09-26' },
    { trial: 3, score: 9, date: '2024-09-27' },
    { trial: 4, score: 7, date: '2024-09-28' },
    { trial: 5, score: 10, date: '2024-09-29' }
  ])
  const [dataPoints, setDataPoints] = useState(10)

  // Data types configuration
  const dataTypes = [
    { id: "accuracy", name: "Accuracy", icon: Target, description: "Measure accuracy of responses" },
    { id: "prompting-levels", name: "Prompting Levels", icon: ClipboardList, description: "Multiple Choice" },
    { id: "task-analysis", name: "Task Analysis", icon: CheckCircle, description: "Checkboxes" },
    { id: "task-with-prompts", name: "Task with prompts", icon: ClipboardList, description: "Multi-choice Grid" },
    { id: "rating-scale", name: "Rating Scale", icon: Star, description: "Scale-based assessment" },
    { id: "frequency", name: "Frequency", icon: BarChart3, description: "Count occurrences" },
    { id: "duration", name: "Duration", icon: Clock, description: "Time-based measurement" },
    { id: "opportunity", name: "Opportunity", icon: Diamond, description: "Opportunity-based tracking" }
  ]

  const handleStudentChange = useCallback((studentId: string) => {
    setLocalSelectedStudentId(studentId)
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('student', studentId)
    router.push(newUrl.pathname + newUrl.search)
  }, [router])

  const handleAddStudent = useCallback(() => {
    router.push('/students/new')
  }, [router])

  const handleAddPrompt = useCallback(() => {
    setPrompts(prev => [...prev, `Option ${prev.length + 1}`])
  }, [])

  const handleRemovePrompt = useCallback((index: number) => {
    setPrompts(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpdatePrompt = useCallback((index: number, value: string) => {
    setPrompts(prev => prev.map((prompt, i) => i === index ? value : prompt))
  }, [])

  const handleSaveGoal = useCallback(() => {
    // TODO: Implement goal saving logic
    console.log("Saving goal:", { goalTitle, goalDescription, selectedDataType, prompts, enableOutcomeTracking })
    setIsGoalModalOpen(false)
  }, [goalTitle, goalDescription, selectedDataType, prompts, enableOutcomeTracking])

  // Voice recording handlers
  const handleStartRecording = useCallback(() => {
    setIsRecording(true)
    // Mock voice recording - in real implementation, use Web Speech API
    setTimeout(() => {
      setIsRecording(false)
      setIsTranscribing(true)
      // Mock transcription
      setTimeout(() => {
        setTranscribedText("Student showed good progress with the math problems. Completed 8 out of 10 correctly. Needs more practice with subtraction.")
        setIsTranscribing(false)
        setShowTranscriptionReview(true)
      }, 2000)
    }, 3000)
  }, [])

  const handleStopRecording = useCallback(() => {
    setIsRecording(false)
  }, [])

  const handleAcceptTranscription = useCallback(() => {
    setNotes(transcribedText)
    setShowTranscriptionReview(false)
    setTranscribedText("")
  }, [transcribedText])

  const handleEditTranscription = useCallback(() => {
    setNotes(transcribedText)
    setShowTranscriptionReview(false)
    setTranscribedText("")
  }, [transcribedText])

  const handleLoadLastNote = useCallback(() => {
    // Mock loading last note
    setNotes("Previous note: Student demonstrated improved focus during reading session.")
  }, [])

  const handleAddNote = useCallback(() => {
    setNotesCount(prev => prev + 1)
    setNotes("")
  }, [])

  // Graph data handlers
  const handleAddDataPoint = useCallback(() => {
    const newTrial = graphData.length + 1
    const newScore = Math.floor(Math.random() * 11) // Random score 0-10
    const today = new Date().toISOString().split('T')[0]
    
    setGraphData(prev => [...prev, { trial: newTrial, score: newScore, date: today }])
    setDataPoints(prev => prev + 1)
  }, [graphData.length])

  const handleResetData = useCallback(() => {
    setGraphData([
      { trial: 1, score: 8, date: '2024-09-25' },
      { trial: 2, score: 6, date: '2024-09-26' },
      { trial: 3, score: 9, date: '2024-09-27' },
      { trial: 4, score: 7, date: '2024-09-28' },
      { trial: 5, score: 10, date: '2024-09-29' }
    ])
    setDataPoints(10)
  }, [])

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === localSelectedStudentId)
  }, [students, localSelectedStudentId])

  // Mock goals data for now
  const mockGoals = [
    {
      id: '1',
      title: 'Social Studies',
      description: 'Demo Student1 will take 5 bites, from a handheld snack, such as a cheese stick in 4 out of 5 opportunities.',
      domain: 'Social Studies',
      level: 'Level 3',
      target_percentage: 80,
      current_progress: 0,
      status: 'completed'
    },
    {
      id: '2',
      title: 'Writing',
      description: 'Demo Student1 will write his name legibly with all letters in the correct spatial order and distance with...',
      domain: 'Writing',
      level: 'Level 2',
      target_percentage: 75,
      current_progress: 0,
      status: 'pending'
    },
    {
      id: '3',
      title: 'Math',
      description: 'Demo Student1 will be at 70% proficiency at the 1st-grade level as measured by the...',
      domain: 'Math',
      level: 'Level 1',
      target_percentage: 70,
      current_progress: 0,
      status: 'pending'
    }
  ]

  const filteredGoals = useMemo(() => {
    return mockGoals.filter(goal => 
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  if (studentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top Ribbon */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Sep 29, 11:05 PM - 11:35 PM</span>
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Accommodations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm">Services Not Tracked</span>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Student Selection Ribbon */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">Select a student to view their goal data</span>
        </div>
        <div className="flex items-center space-x-3">
          {selectedStudent ? (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedStudent.profile_picture_url || ""} />
                <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{selectedStudent.name}</span>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Select value={localSelectedStudentId || ""} onValueChange={handleStudentChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={student.profile_picture_url || ""} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={handleAddStudent} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr_350px] lg:grid-cols-[300px_1fr_300px] md:grid-cols-1 gap-6 h-[calc(100vh-360px)]">
        {/* Left Panel - Goals */}
        <div className="flex flex-col">
          {/* Goals List Card */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Goals ({mockGoals.length}/{mockGoals.length})</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => setIsGoalModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
              <div className="p-4 border-b">
                <Input
                  placeholder="Search goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${
                      selectedGoal === goal.id ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedGoal(goal.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {goal.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {goal.domain} • Level {goal.level} • {goal.current_progress}% complete
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                ))}
                {filteredGoals.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No goals found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Panel - Data Collection Card */}
        <div className="flex flex-col">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-lg">Trial 1</CardTitle>
                <Button variant="ghost" size="sm">
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Phase
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
              {/* Data Collection Interface */}
              <div className="flex-1 p-4">
                <Tabs defaultValue="capture" className="w-full h-full">
                  {/* Tabs */}
                  <div className="mb-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="capture">Capture</TabsTrigger>
                      <TabsTrigger value="graph">Graph</TabsTrigger>
                      <TabsTrigger value="stats">Stats</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="capture" className="h-full">
                    {selectedGoal ? (
                      <div className="space-y-4 h-full">
                        {/* Reset Button */}
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" onClick={handleResetData}>
                            <Undo className="h-4 w-4 mr-2" />
                            Reset
                          </Button>
                        </div>

                        {/* Data Input Area */}
                        <div className="flex flex-col items-center space-y-4">
                          {/* Minus Button */}
                          <div className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                            <Minus className="h-8 w-8 text-gray-400" />
                          </div>

                          {/* Plus Button */}
                          <Button 
                            size="lg" 
                            onClick={handleAddDataPoint}
                            className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                          >
                            <Plus className="h-8 w-8" />
                          </Button>
                        </div>

                        {/* Goal Information */}
                        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Selected Goal</h4>
                          <p className="text-sm text-muted-foreground">
                            {mockGoals.find(g => g.id === selectedGoal)?.title || 'No goal selected'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Goal</h3>
                        <p className="text-gray-600">Choose a goal from the sidebar to start data collection.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="graph" className="h-full">
                    {selectedGoal ? (
                      <div className="space-y-4 h-full">
                        {/* Graph Header */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Progress Graph</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Data Points: {graphData.length}</span>
                            <Button variant="outline" size="sm" onClick={handleAddDataPoint}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Point
                            </Button>
                          </div>
                        </div>

                        {/* Simple Line Chart */}
                        <div className="flex-1 bg-white border rounded-lg p-4 overflow-hidden">
                          <div className="h-64 relative overflow-hidden">
                            <svg width="100%" height="100%" className="overflow-hidden" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">
                              {/* Grid lines */}
                              <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#grid)" />
                              
                              {/* Y-axis labels */}
                              {[0, 2, 4, 6, 8, 10].map((value) => (
                                <text
                                  key={value}
                                  x="20"
                                  y={220 - (value * 18)}
                                  className="text-xs fill-gray-500"
                                >
                                  {value}
                                </text>
                              ))}
                              
                              {/* X-axis labels */}
                              {graphData.map((point, index) => (
                                <text
                                  key={index}
                                  x={60 + (index * 30)}
                                  y="240"
                                  className="text-xs fill-gray-500"
                                  textAnchor="middle"
                                >
                                  T{point.trial}
                                </text>
                              ))}
                              
                              {/* Line chart */}
                              <polyline
                                fill="none"
                                stroke="#ec4899"
                                strokeWidth="3"
                                points={graphData.map((point, index) => 
                                  `${60 + (index * 30)},${220 - (point.score * 18)}`
                                ).join(' ')}
                              />
                              
                              {/* Data points */}
                              {graphData.map((point, index) => (
                                <circle
                                  key={index}
                                  cx={60 + (index * 30)}
                                  cy={220 - (point.score * 18)}
                                  r="4"
                                  fill="#ec4899"
                                  stroke="white"
                                  strokeWidth="2"
                                />
                              ))}
                            </svg>
                          </div>
                        </div>

                        {/* Data Summary */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 bg-muted/30 rounded-lg text-center">
                            <div className="text-2xl font-bold text-primary">{graphData.length}</div>
                            <div className="text-sm text-muted-foreground">Trials</div>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg text-center">
                            <div className="text-2xl font-bold text-primary">
                              {graphData.length > 0 ? Math.round(graphData.reduce((sum, point) => sum + point.score, 0) / graphData.length * 10) / 10 : 0}
                            </div>
                            <div className="text-sm text-muted-foreground">Average</div>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg text-center">
                            <div className="text-2xl font-bold text-primary">
                              {graphData.length > 0 ? Math.max(...graphData.map(p => p.score)) : 0}
                            </div>
                            <div className="text-sm text-muted-foreground">Best Score</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Goal</h3>
                        <p className="text-gray-600">Choose a goal from the sidebar to view progress graph.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="stats" className="h-full">
                    {selectedGoal ? (
                      <div className="space-y-4 h-full">
                        <h3 className="text-lg font-semibold">Statistics</h3>
                        
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-medium mb-2">Performance Trends</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Total Trials:</span>
                                <span className="font-medium">{graphData.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Average Score:</span>
                                <span className="font-medium">
                                  {graphData.length > 0 ? Math.round(graphData.reduce((sum, point) => sum + point.score, 0) / graphData.length * 10) / 10 : 0}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Highest Score:</span>
                                <span className="font-medium">{graphData.length > 0 ? Math.max(...graphData.map(p => p.score)) : 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Lowest Score:</span>
                                <span className="font-medium">{graphData.length > 0 ? Math.min(...graphData.map(p => p.score)) : 0}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-medium mb-2">Progress Analysis</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Improvement:</span>
                                <span className="font-medium text-green-600">
                                  {graphData.length > 1 ? 
                                    (graphData[graphData.length - 1].score > graphData[0].score ? '+' : '') + 
                                    (graphData[graphData.length - 1].score - graphData[0].score) : 0}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Consistency:</span>
                                <span className="font-medium">
                                  {graphData.length > 1 ? 
                                    Math.round((1 - (Math.max(...graphData.map(p => p.score)) - Math.min(...graphData.map(p => p.score))) / 10) * 100) + '%' : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Target Met:</span>
                                <span className="font-medium text-green-600">
                                  {graphData.length > 0 ? 
                                    Math.round((graphData.filter(p => p.score >= 8).length / graphData.length) * 100) + '%' : '0%'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Data Table */}
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-3">Recent Data Points</h4>
                          <div className="space-y-2">
                            {graphData.slice(-5).map((point, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                                <span className="text-sm">Trial {point.trial}</span>
                                <span className="text-sm font-medium">{point.score}/10</span>
                                <span className="text-xs text-muted-foreground">{point.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Goal</h3>
                        <p className="text-gray-600">Choose a goal from the sidebar to view statistics.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Notes Card */}
        <div className="flex flex-col">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Notes ({notesCount})</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleLoadLastNote}>
                  <Download className="h-4 w-4 mr-2" />
                  Load Last Note
                </Button>
                <Button size="sm" onClick={handleAddNote}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
              {/* Voice Recording Section */}
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Voice Recording</span>
                  {isRecording && (
                    <div className="flex items-center space-x-2 text-red-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs">Recording...</span>
                    </div>
                  )}
                  {isTranscribing && (
                    <div className="flex items-center space-x-2 text-blue-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs">Transcribing...</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!isRecording ? (
                    <Button 
                      onClick={handleStartRecording}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleStopRecording}
                      variant="destructive"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>

              {/* Transcription Review */}
              {showTranscriptionReview && (
                <div className="p-4 border-b bg-blue-50">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-2">Transcription Review</h4>
                    <div className="p-3 bg-white rounded border text-sm">
                      {transcribedText}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" onClick={handleAcceptTranscription} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleEditTranscription}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowTranscriptionReview(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Notes Editor */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter your notes here..."
                    className="w-full h-full resize-none border-0 focus:ring-0 text-sm"
                    rows={10}
                  />
                </div>
                
                {/* Rich Text Toolbar */}
                <div className="border-t p-2 bg-muted/30">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1"></div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1"></div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Code className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1"></div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Goal Creation Modal */}
      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-hidden">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <DialogTitle className="text-xl font-semibold">Goal</DialogTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">+ Objective</Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">RS Raju Sharma</span>
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">RS</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Data Types */}
            <div className="w-80 flex-shrink-0 border-r pr-4">
              <div className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow hover:shadow-lg hover:scale-105 transform">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Suggest Data Tracking Template
                </Button>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Data Types</h3>
                  <div className="space-y-2">
                    {dataTypes.map((dataType) => {
                      const Icon = dataType.icon
                      return (
                        <div
                          key={dataType.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedDataType === dataType.id 
                              ? 'bg-primary/10 border border-primary' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedDataType(dataType.id)}
                        >
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{dataType.name}</p>
                            <p className="text-xs text-muted-foreground">({dataType.description})</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Goal Definition Form */}
            <div className="flex-1 px-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Reading, Writing, Math"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="goal-description">Goal Description*</Label>
                  <Textarea
                    id="goal-description"
                    placeholder="Write goal here.."
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Prompts</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Save as template</Button>
                      <Button variant="outline" size="sm">Choose Prompts</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {prompts.map((prompt, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={prompt}
                          onChange={(e) => handleUpdatePrompt(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePrompt(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleAddPrompt} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Prompt
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="outcome-tracking"
                      checked={enableOutcomeTracking}
                      onCheckedChange={setEnableOutcomeTracking}
                    />
                    <Label htmlFor="outcome-tracking">Enable outcome tracking</Label>
                  </div>
                </div>

                <div>
                  <Button variant="outline" className="w-full">
                    Advanced Options
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Contextual Help & Preview */}
            <div className="w-80 flex-shrink-0 border-l pl-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What is Prompting Levels?</h3>
                  <p className="text-sm text-muted-foreground">
                    For goals that require you to measure prompting levels for a student or a multiple choice questions.
                  </p>
                </div>

                <Tabs defaultValue="live-preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="example">Example</TabsTrigger>
                    <TabsTrigger value="live-preview">Live preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="live-preview" className="mt-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start space-x-2">
                          <ArrowLeft className="h-4 w-4 mt-1 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Goal</p>
                            <p className="text-sm text-muted-foreground">
                              Student will develop an introductory paragraph with 2 or fewer prompts
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start space-x-2">
                          <ArrowLeft className="h-4 w-4 mt-1 text-primary" />
                          <div className="w-full">
                            <p className="text-sm font-medium mb-3">Options</p>
                            <RadioGroup defaultValue="more-than-2">
                              {prompts.map((prompt, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <RadioGroupItem value={prompt.toLowerCase().replace(/\s+/g, '-')} id={`preview-${index}`} />
                                  <Label htmlFor={`preview-${index}`} className="text-sm">{prompt}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSaveGoal} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow hover:shadow-lg hover:scale-105 transform">
              <Save className="h-4 w-4 mr-2" />
              Save Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GoalDataContentInner