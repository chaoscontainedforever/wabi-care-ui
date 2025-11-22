"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Minus,
  Clock,
  Activity,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Search,
  ChevronRight,
  Mic,
  MicOff,
  Users,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  BookOpen,
  BarChart3,
  LineChart,
  Volume2,
  VolumeX
} from "lucide-react"
import { LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ABCDataCollection, ABCData } from "./ABCDataCollection"
import { BSPViewer, BSP } from "./BSPViewer"

interface Goal {
  id: string
  title: string
  description: string
  category: string
  level: string
  completion: number
  dataType: "prompt-levels" | "task-analysis" | "duration" | "abc-data"
  prompts: string[]
  status: "active" | "completed" | "on-hold"
}

interface TrialData {
  id: string
  timestamp: number
  outcome: "correct" | "incorrect" | "prompted"
  promptLevel: string
  notes?: string
}

interface VoiceNote {
  id: string
  goalId?: string
  text: string
  timestamp: number
  duration: number
}

interface DataCollectionTabProps {
  studentId: string
  studentName: string
}

export function DataCollectionTab({ studentId, studentName }: DataCollectionTabProps) {
  // Mock goals - in real app, these would come from TreatmentPlanTab
  const [goals] = useState<Goal[]>([
    {
      id: "1",
      title: "Social Studies",
      description: "Improve social interaction skills",
      category: "Social Studies",
      level: "Level 3",
      completion: 0,
      dataType: "prompt-levels",
      prompts: ["Independent", "1-2 Prompts", "More than 2 Prompts", "No response"],
      status: "active"
    },
    {
      id: "2",
      title: "Writing",
      description: "Develop writing skills",
      category: "Writing",
      level: "Level 2",
      completion: 0,
      dataType: "prompt-levels",
      prompts: ["Independent", "1-2 Prompts", "More than 2 Prompts"],
      status: "active"
    },
    {
      id: "3",
      title: "Math",
      description: "Enhance mathematical abilities",
      category: "Math",
      level: "Level 1",
      completion: 0,
      dataType: "task-analysis",
      prompts: [],
      status: "active"
    },
    {
      id: "4",
      title: "Reduce Hand-Flapping Behavior",
      description: "Decrease hand-flapping behavior",
      category: "Behavior",
      level: "Baseline",
      completion: 0,
      dataType: "duration",
      prompts: [],
      status: "active"
    },
    {
      id: "abc-1",
      title: "Aggressive Behavior Reduction",
      description: "Track and reduce instances of aggressive behavior",
      category: "Behavior",
      level: "Baseline",
      completion: 0,
      dataType: "abc-data",
      prompts: [],
      status: "active"
    }
  ])

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(goals[0] || null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"capture" | "graph" | "stats">("capture")
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [sessionElapsedTime, setSessionElapsedTime] = useState(0)
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [currentTrial, setCurrentTrial] = useState(1)
  
  // Trial data collection
  const [trials, setTrials] = useState<TrialData[]>([])
  const [currentTrialPrompt, setCurrentTrialPrompt] = useState<string>("Independent")
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Notes state
  const [goalNotes, setGoalNotes] = useState<Record<string, string>>({})
  const [sessionNotes, setSessionNotes] = useState("")
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
  
  // BCBA monitoring
  const [isBCBAMonitoring, setIsBCBAMonitoring] = useState(false)
  const [bcbaObservers, setBcbaObservers] = useState<string[]>([])
  
  // Voice command recognition
  const [isVoiceCommandsActive, setIsVoiceCommandsActive] = useState(false)
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string>("")
  const voiceRecognitionRef = useRef<any>(null)
  const [currentDurationGoalId, setCurrentDurationGoalId] = useState<string | null>(null)
  
  // ABC data collection
  const [abcEntries, setAbcEntries] = useState<ABCData[]>([])
  const [currentABCField, setCurrentABCField] = useState<"antecedent" | "behavior" | "consequence" | null>(null)
  
  // BSP data
  const [bsp, setBsp] = useState<BSP | null>(null)

  const filteredGoals = goals.filter(goal =>
    goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Session timer
  useEffect(() => {
    if (isSessionActive && sessionStartTime) {
      sessionTimerRef.current = setInterval(() => {
        setSessionElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000))
      }, 1000)
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }
  }, [isSessionActive, sessionStartTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartSession = () => {
    setIsSessionActive(true)
    setSessionStartTime(Date.now())
    setSessionElapsedTime(0)
  }

  const handleStopSession = () => {
    setIsSessionActive(false)
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current)
    }
  }

  const handleTrialOutcome = (outcome: "correct" | "incorrect" | "prompted") => {
    if (!selectedGoal) return
    
    const trial: TrialData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      outcome,
      promptLevel: currentTrialPrompt,
      notes: goalNotes[selectedGoal.id] || undefined
    }
    setTrials(prev => [...prev, trial])
    setCurrentTrial(prev => prev + 1)
  }

  // Placeholder functions for frequency and duration data collection
  const handleFrequencyIncrement = () => {
    // This would increment frequency count for the selected goal
    // For now, we'll just log it
    console.log('Frequency increment for goal:', selectedGoal?.id)
  }

  const handleStartDuration = (goalId: string) => {
    setCurrentDurationGoalId(goalId)
    // This would start duration tracking
    console.log('Start duration for goal:', goalId)
  }

  const handleStopDuration = (goalId: string) => {
    setCurrentDurationGoalId(null)
    // This would stop duration tracking and record the duration
    console.log('Stop duration for goal:', goalId)
  }

  // ABC data handlers
  const handleAddABCEntry = (entry: Omit<ABCData, "id" | "timestamp">) => {
    const newEntry: ABCData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...entry
    }
    setAbcEntries(prev => [newEntry, ...prev])
  }

  const handleDeleteABCEntry = (id: string) => {
    setAbcEntries(prev => prev.filter(entry => entry.id !== id))
  }

  // Load BSP when goal changes
  useEffect(() => {
    if (selectedGoal && selectedGoal.dataType === "abc-data") {
      // Mock BSP - in production, fetch from API
      setBsp({
        id: `bsp-${selectedGoal.id}`,
        goalId: selectedGoal.id,
        behaviorDefinition: selectedGoal.description || "Aggressive behavior including hitting, kicking, or throwing objects",
        function: "escape",
        preventionStrategies: [
          "Provide visual schedule before transitions",
          "Offer choices when possible",
          "Use first-then language",
          "Ensure preferred items are accessible"
        ],
        replacementBehaviors: [
          "Request break using communication device",
          "Use deep breathing strategy",
          "Ask for help appropriately"
        ],
        responseStrategies: [
          "Block unsafe behavior immediately",
          "Redirect to replacement behavior",
          "Provide brief break if requested appropriately",
          "Do not provide attention for problem behavior"
        ],
        createdBy: "BCBA",
        lastUpdated: new Date().toISOString()
      })
    } else {
      setBsp(null)
    }
  }, [selectedGoal])

  // Voice recording functions
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }, [])

  const stopRecording = useCallback(async () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }

      // Mock transcription - replace with actual API call
      setIsTranscribing(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      const mockTranscription = `Voice note transcribed at ${new Date().toLocaleTimeString()}. This is a mock transcription. In production, this would use a speech-to-text API.`
      setTranscription(mockTranscription)
      setIsTranscribing(false)
    }
  }, [mediaRecorder, isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorder) {
      if (isPaused) {
        mediaRecorder.resume()
        setIsPaused(false)
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)
      } else {
        mediaRecorder.pause()
        setIsPaused(true)
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
        }
      }
    }
  }, [mediaRecorder, isPaused])

  const saveVoiceNote = () => {
    if (!transcription.trim()) return

    const note: VoiceNote = {
      id: Date.now().toString(),
      goalId: selectedGoal?.id,
      text: transcription,
      timestamp: Date.now(),
      duration: recordingTime
    }

    setVoiceNotes(prev => [...prev, note])
    
    if (selectedGoal) {
      setGoalNotes(prev => ({
        ...prev,
        [selectedGoal.id]: prev[selectedGoal.id] 
          ? `${prev[selectedGoal.id]}\n\n[Voice Note ${new Date().toLocaleTimeString()}]: ${transcription}`
          : `[Voice Note ${new Date().toLocaleTimeString()}]: ${transcription}`
      }))
    } else {
      setSessionNotes(prev => 
        prev 
          ? `${prev}\n\n[Voice Note ${new Date().toLocaleTimeString()}]: ${transcription}`
          : `[Voice Note ${new Date().toLocaleTimeString()}]: ${transcription}`
      )
    }

    setTranscription("")
    setAudioBlob(null)
    setRecordingTime(0)
  }

  // Voice command recognition
  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1]
      const transcript = lastResult[0].transcript.toLowerCase().trim()
      
      setLastVoiceCommand(transcript)
      
      // Map voice commands to actions
      if (!selectedGoal) return

      // Trial recording commands
      if (transcript.includes('correct') || transcript.includes('right') || transcript.includes('yes')) {
        const trial: TrialData = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          outcome: 'correct',
          promptLevel: currentTrialPrompt,
          notes: goalNotes[selectedGoal.id] || undefined
        }
        setTrials(prev => [...prev, trial])
        setCurrentTrial(prev => prev + 1)
      } else if (transcript.includes('incorrect') || transcript.includes('wrong') || transcript.includes('no')) {
        const trial: TrialData = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          outcome: 'incorrect',
          promptLevel: currentTrialPrompt,
          notes: goalNotes[selectedGoal.id] || undefined
        }
        setTrials(prev => [...prev, trial])
        setCurrentTrial(prev => prev + 1)
      } else if (transcript.includes('prompt') || transcript.includes('prompted')) {
        const trial: TrialData = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          outcome: 'prompted',
          promptLevel: currentTrialPrompt,
          notes: goalNotes[selectedGoal.id] || undefined
        }
        setTrials(prev => [...prev, trial])
        setCurrentTrial(prev => prev + 1)
      }
      
      // ABC data commands
      else if (transcript.includes('antecedent') && selectedGoal.dataType === 'abc-data') {
        const text = transcript.replace(/antecedent/i, '').trim()
        if (text) {
          setCurrentABCField('antecedent')
          // In a real implementation, this would update the ABC form field
          console.log('ABC Antecedent:', text)
        }
      } else if (transcript.includes('behavior') && selectedGoal.dataType === 'abc-data') {
        const text = transcript.replace(/behavior/i, '').trim()
        if (text) {
          setCurrentABCField('behavior')
          console.log('ABC Behavior:', text)
        }
      } else if (transcript.includes('consequence') && selectedGoal.dataType === 'abc-data') {
        const text = transcript.replace(/consequence/i, '').trim()
        if (text) {
          setCurrentABCField('consequence')
          console.log('ABC Consequence:', text)
        }
      }
      
      // Frequency commands
      else if (transcript.includes('count') || transcript.includes('frequency') || transcript.includes('increment')) {
        handleFrequencyIncrement()
      }
      
      // Duration commands
      else if (transcript.includes('start duration') || transcript.includes('begin duration')) {
        if (selectedGoal.dataType === 'duration') {
          handleStartDuration(selectedGoal.id)
        }
      } else if (transcript.includes('stop duration') || transcript.includes('end duration')) {
        if (selectedGoal.dataType === 'duration' && currentDurationGoalId === selectedGoal.id) {
          handleStopDuration(selectedGoal.id)
        }
      }
      
      // Navigation commands
      else if (transcript.includes('next trial') || transcript.includes('next')) {
        setCurrentTrial(prev => prev + 1)
      } else if (transcript.includes('previous trial') || transcript.includes('previous') || transcript.includes('back')) {
        setCurrentTrial(prev => Math.max(1, prev - 1))
      }
      
      // Session commands
      else if (transcript.includes('start session') && !isSessionActive) {
        setIsSessionActive(true)
        setSessionStartTime(Date.now())
        setSessionElapsedTime(0)
      } else if (transcript.includes('stop session') || transcript.includes('end session')) {
        if (isSessionActive) {
          setIsSessionActive(false)
          if (sessionTimerRef.current) {
            clearInterval(sessionTimerRef.current)
          }
        }
      }
    }

    recognition.onerror = (event: any) => {
      const error = event.error
      
      // Ignore common, non-critical errors that are expected during normal operation
      const ignorableErrors = ['no-speech', 'audio-capture', 'aborted', 'network']
      if (ignorableErrors.includes(error)) {
        // These are expected and can be safely ignored
        // 'network' errors are common when speech recognition service is temporarily unavailable
        // or when the user is offline - the recognition will retry automatically
        return
      }
      
      // Handle permission errors with user-friendly messages
      if (error === 'not-allowed') {
        console.warn('Speech recognition error: Microphone permission denied')
        // Only show alert if voice commands were actively being used
        if (isVoiceCommandsActive) {
          alert('Microphone permission denied. Please enable microphone access in your browser settings.')
          setIsVoiceCommandsActive(false)
        }
        return
      }
      
      // Log other unexpected errors for debugging
      if (error !== 'service-not-allowed') {
        console.warn('Speech recognition error:', error)
      }
    }

    recognition.onend = () => {
      // Restart recognition if it's still supposed to be active
      if (isVoiceCommandsActive) {
        try {
          recognition.start()
        } catch (error) {
          console.error('Error restarting recognition:', error)
        }
      }
    }

    voiceRecognitionRef.current = recognition

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGoal, isVoiceCommandsActive, isSessionActive, currentDurationGoalId, currentTrialPrompt, goalNotes])

  // Toggle voice commands
  const toggleVoiceCommands = useCallback(() => {
    if (!voiceRecognitionRef.current) {
      alert('Voice recognition is not available in your browser. Please use Chrome or Edge.')
      return
    }

    if (isVoiceCommandsActive) {
      try {
        voiceRecognitionRef.current.stop()
        setIsVoiceCommandsActive(false)
      } catch (error) {
        // Ignore errors when stopping (aborted errors are expected)
        setIsVoiceCommandsActive(false)
      }
    } else {
      try {
        voiceRecognitionRef.current.start()
        setIsVoiceCommandsActive(true)
      } catch (error: any) {
        // Handle specific error cases
        if (error.name === 'InvalidStateError' || error.message?.includes('already started')) {
          // Recognition might already be starting, try to stop and restart
          try {
            voiceRecognitionRef.current.stop()
            setTimeout(() => {
              try {
                voiceRecognitionRef.current.start()
                setIsVoiceCommandsActive(true)
              } catch (retryError) {
                console.warn('Error restarting voice recognition:', retryError)
                alert('Could not start voice recognition. Please try again.')
              }
            }, 100)
          } catch (stopError) {
            console.warn('Error stopping voice recognition:', stopError)
          }
        } else {
          console.error('Error starting voice recognition:', error)
          alert('Could not start voice recognition. Please check microphone permissions.')
        }
      }
    }
  }, [isVoiceCommandsActive])

  const handleSaveSession = () => {
    const sessionData = {
      sessionId: Date.now().toString(),
      studentId,
      startTime: sessionStartTime,
      endTime: Date.now(),
      duration: sessionElapsedTime,
      trials,
      goalNotes,
      sessionNotes,
      voiceNotes
    }
    
    // Save to localStorage
    const existingSessions = JSON.parse(localStorage.getItem(`sessions_${studentId}`) || '[]')
    existingSessions.push(sessionData)
    localStorage.setItem(`sessions_${studentId}`, JSON.stringify(existingSessions))
    
    alert("Session saved successfully!")
  }

  // Calculate statistics
  const trialStats = {
    total: trials.length,
    correct: trials.filter(t => t.outcome === "correct").length,
    incorrect: trials.filter(t => t.outcome === "incorrect").length,
    prompted: trials.filter(t => t.outcome === "prompted").length,
    percentage: trials.length > 0 
      ? Math.round((trials.filter(t => t.outcome === "correct").length / trials.length) * 100)
      : 0
  }

  // Chart data
  const chartData = trials.map((trial, index) => ({
    trial: index + 1,
    correct: trial.outcome === "correct" ? 1 : 0,
    incorrect: trial.outcome === "incorrect" ? 1 : 0,
    prompted: trial.outcome === "prompted" ? 1 : 0
  }))

  const getStatusIcon = (goal: Goal) => {
    if (goal.status === "completed") {
      return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    }
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      "Social Studies": "bg-blue-100 text-blue-800",
      "Writing": "bg-purple-100 text-purple-800",
      "Math": "bg-green-100 text-green-800",
      "Behavior": "bg-red-100 text-red-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-1 overflow-hidden gap-4">
      {/* Left Panel: Goals List */}
      <Card className="w-80 flex-shrink-0 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Goals ({goals.length}/{goals.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-2">
          <div className="mb-4">
            <Input
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            {filteredGoals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => setSelectedGoal(goal)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedGoal?.id === goal.id
                    ? "bg-primary/10 border border-primary"
                    : "hover:bg-muted"
                }`}
              >
                {getStatusIcon(goal)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{goal.title}</p>
                    <Badge className={`text-xs ${getCategoryBadge(goal.category)}`}>
                      {goal.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {goal.level} • {goal.completion}% complete
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Right Panel: Data Collection */}
      <Card className="flex-1 flex flex-col">
        {selectedGoal ? (
          <>
            {/* Header with Trial Navigation and Session Controls */}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentTrial(Math.max(1, currentTrial - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold">&lt; Trial {currentTrial} &gt;</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentTrial(currentTrial + 1)}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBCBAMonitoring(!isBCBAMonitoring)}
                    className={isBCBAMonitoring ? "bg-primary/10" : ""}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {isBCBAMonitoring ? "Monitoring" : "BCBA Join"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isSessionActive ? handleStopSession : handleStartSession}
                    className={isSessionActive ? "bg-red-50 text-red-600" : ""}
                  >
                    {isSessionActive ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Stop Session
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </>
                    )}
                  </Button>
                  {isSessionActive && (
                    <Badge variant="secondary" className="font-mono">
                      {formatTime(sessionElapsedTime)}
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveSession}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Session
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto">
              {/* Tabs: Capture, Graph, Stats */}
              <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="capture">Capture</TabsTrigger>
                  <TabsTrigger value="graph">Graph</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>

                {/* Capture Tab */}
                <TabsContent value="capture" className="space-y-4 mt-4">
                  {/* Session Setup */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Session Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Select Target Behavior</Label>
                          <Select value={selectedGoal.id} disabled>
                            <SelectTrigger>
                              <SelectValue>{selectedGoal.title}</SelectValue>
                            </SelectTrigger>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Current Prompt Level</Label>
                          <Select
                            value={currentTrialPrompt}
                            onValueChange={setCurrentTrialPrompt}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedGoal.prompts.length > 0 ? (
                                selectedGoal.prompts.map((prompt) => (
                                  <SelectItem key={prompt} value={prompt}>
                                    {prompt}
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem value="Independent">Independent</SelectItem>
                                  <SelectItem value="Verbal">Verbal</SelectItem>
                                  <SelectItem value="Visual">Visual</SelectItem>
                                  <SelectItem value="Model">Model</SelectItem>
                                  <SelectItem value="Partial Physical">Partial Physical</SelectItem>
                                  <SelectItem value="Full Physical">Full Physical</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm"><span className="font-semibold">Current Target:</span> {selectedGoal.title}</p>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Prompt Level:</span> {currentTrialPrompt}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conditional Data Collection Interface */}
                  {selectedGoal.dataType === "abc-data" ? (
                    <>
                      {/* BSP Quick Reference */}
                      <BSPViewer bsp={bsp} isCollapsible={true} />
                      
                      {/* ABC Data Collection */}
                      <ABCDataCollection
                        abcEntries={abcEntries}
                        onAddEntry={handleAddABCEntry}
                        onDeleteEntry={handleDeleteABCEntry}
                        isVoiceActive={isVoiceCommandsActive}
                      />
                    </>
                  ) : (
                    <>
                      {/* Trial Recording */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Trial Recording</CardTitle>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-4 text-sm">
                                <span><span className="font-semibold">Total Trials:</span> {trialStats.total}</span>
                                <span><span className="font-semibold">Accuracy:</span> {trialStats.percentage}%</span>
                              </div>
                              <Button
                                variant={isVoiceCommandsActive ? "default" : "outline"}
                                size="sm"
                                onClick={toggleVoiceCommands}
                                className={isVoiceCommandsActive ? "bg-primary text-primary-foreground" : ""}
                              >
                                {isVoiceCommandsActive ? (
                                  <>
                                    <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                                    Voice Active
                                  </>
                                ) : (
                                  <>
                                    <VolumeX className="h-4 w-4 mr-2" />
                                    Voice Off
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          {isVoiceCommandsActive && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                              <span>Listening for voice commands... Say "correct", "incorrect", or "prompted"</span>
                              {lastVoiceCommand && (
                                <span className="ml-2 italic">Last: "{lastVoiceCommand}"</span>
                              )}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Quick Action Buttons */}
                          <div className="grid grid-cols-3 gap-4">
                            <Button
                              size="lg"
                              className={`h-24 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold relative ${
                                isVoiceCommandsActive ? "ring-2 ring-emerald-300 ring-offset-2" : ""
                              }`}
                              onClick={() => handleTrialOutcome("correct")}
                            >
                              <CheckCircle2 className="h-6 w-6 mr-2" />
                              Correct
                              {isVoiceCommandsActive && (
                                <span className="absolute top-1 right-1 text-xs opacity-75">🎤</span>
                              )}
                            </Button>
                            <Button
                              size="lg"
                              className={`h-24 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold relative ${
                                isVoiceCommandsActive ? "ring-2 ring-red-300 ring-offset-2" : ""
                              }`}
                              onClick={() => handleTrialOutcome("incorrect")}
                            >
                              <XCircle className="h-6 w-6 mr-2" />
                              Incorrect
                              {isVoiceCommandsActive && (
                                <span className="absolute top-1 right-1 text-xs opacity-75">🎤</span>
                              )}
                            </Button>
                            <Button
                              size="lg"
                              className={`h-24 bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold relative ${
                                isVoiceCommandsActive ? "ring-2 ring-yellow-300 ring-offset-2" : ""
                              }`}
                              onClick={() => handleTrialOutcome("prompted")}
                            >
                              <AlertCircle className="h-6 w-6 mr-2" />
                              Prompted
                              {isVoiceCommandsActive && (
                                <span className="absolute top-1 right-1 text-xs opacity-75">🎤</span>
                              )}
                            </Button>
                          </div>

                          {/* Trial Statistics */}
                          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-emerald-600">{trialStats.correct}</p>
                              <p className="text-sm text-muted-foreground">Correct</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-red-600">{trialStats.incorrect}</p>
                              <p className="text-sm text-muted-foreground">Incorrect</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-yellow-600">{trialStats.prompted}</p>
                              <p className="text-sm text-muted-foreground">Prompted</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">{trialStats.percentage}%</p>
                              <p className="text-sm text-muted-foreground">Accuracy</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {/* Voice Notes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Voice Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        {!isRecording ? (
                          <Button
                            onClick={startRecording}
                            className="bg-gradient-to-r from-pink-500 to-purple-600"
                          >
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={pauseRecording}
                              variant="outline"
                            >
                              {isPaused ? (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Resume
                                </>
                              ) : (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={stopRecording}
                              variant="destructive"
                            >
                              <Square className="h-4 w-4 mr-2" />
                              Stop Recording
                            </Button>
                            <Badge variant="secondary" className="font-mono">
                              {formatTime(recordingTime)}
                            </Badge>
                            {isTranscribing && (
                              <Badge variant="secondary">
                                Transcribing...
                              </Badge>
                            )}
                          </>
                        )}
                      </div>

                      {transcription && (
                        <div className="space-y-2">
                          <Label>Transcription</Label>
                          <Textarea
                            value={transcription}
                            onChange={(e) => setTranscription(e.target.value)}
                            rows={4}
                            placeholder="Transcribed text will appear here..."
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={saveVoiceNote}
                              className="bg-gradient-to-r from-pink-500 to-purple-600"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save to {selectedGoal ? "Goal" : "Session"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setTranscription("")
                                setAudioBlob(null)
                              }}
                            >
                              Discard
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {selectedGoal ? `Notes for ${selectedGoal.title}` : "Session Notes"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={selectedGoal ? goalNotes[selectedGoal.id] || "" : sessionNotes}
                        onChange={(e) => {
                          if (selectedGoal) {
                            setGoalNotes(prev => ({
                              ...prev,
                              [selectedGoal.id]: e.target.value
                            }))
                          } else {
                            setSessionNotes(e.target.value)
                          }
                        }}
                        placeholder="Add notes here..."
                        rows={6}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Graph Tab */}
                <TabsContent value="graph" className="mt-4">
                  {chartData.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Trial Outcomes Over Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                          <RechartsLineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="trial" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="correct" stroke="#10b981" name="Correct" />
                            <Line type="monotone" dataKey="incorrect" stroke="#ef4444" name="Incorrect" />
                            <Line type="monotone" dataKey="prompted" stroke="#f59e0b" name="Prompted" />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <LineChart className="h-12 w-12 text-muted-foreground mb-4" />
                        <CardTitle className="text-lg mb-2">No Data Yet</CardTitle>
                        <CardDescription>Start collecting trials to see the graph</CardDescription>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Trials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{trialStats.total}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">{trialStats.percentage}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Correct</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{trialStats.correct}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Incorrect</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{trialStats.incorrect}</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">Select a Goal</CardTitle>
              <CardDescription>
                Choose a goal from the sidebar to start data collection
              </CardDescription>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
