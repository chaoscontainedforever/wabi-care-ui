"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Search, 
  Target, 
  BookOpen, 
  Users, 
  Clock,
  Edit,
  Eye,
  Copy,
  Star,
  Tag,
  GraduationCap,
  Brain,
  Heart,
  MessageSquare,
  Activity,
  Upload,
  FileSpreadsheet,
  File,
  Link,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  Grid3X3,
  List,
  Table
} from "lucide-react"

// Goal Bank Data Structure
const goalDomains = [
  { id: "academic", name: "Academic", icon: GraduationCap, color: "bg-blue-100 text-blue-800" },
  { id: "behavioral", name: "Behavioral", icon: Brain, color: "bg-red-100 text-red-800" },
  { id: "social", name: "Social", icon: Heart, color: "bg-green-100 text-green-800" },
  { id: "communication", name: "Communication", icon: MessageSquare, color: "bg-purple-100 text-purple-800" },
  { id: "motor", name: "Motor Skills", icon: Activity, color: "bg-orange-100 text-orange-800" },
  { id: "adaptive", name: "Adaptive", icon: Users, color: "bg-indigo-100 text-indigo-800" }
]

const goalLevels = ["Preschool", "Elementary", "Middle School", "High School", "Transition"]
const goalTypes = ["Annual Goal", "Short-term Objective", "Benchmark", "Behavioral Goal"]

// Document upload interfaces
interface UploadedDocument {
  id: string
  name: string
  type: 'excel' | 'word' | 'google-drive' | 'onedrive'
  url?: string
  file?: File
  status: 'uploading' | 'processing' | 'completed' | 'error'
  extractedGoals?: Goal[]
  uploadedAt: Date
  errorMessage?: string
}

interface Goal {
  id: string
  title: string
  description: string
  domain: string
  level: string
  type: string
  objectives: string[]
  measurement: string
  accommodations: string
  createdBy: string
  createdDate: string
  lastModified: string
  usageCount: number
  isTemplate: boolean
  tags: string[]
}

// Mock Goal Bank Data
const mockGoalBank = [
  {
    id: "1",
    title: "Reading Comprehension - Main Idea",
    description: "Student will identify the main idea in a grade-level text with 80% accuracy across 3 consecutive sessions",
    domain: "academic",
    level: "Elementary",
    type: "Annual Goal",
    objectives: [
      "Identify key details in text",
      "Distinguish between main idea and supporting details",
      "Summarize text in own words"
    ],
    measurement: "Teacher-created assessments, standardized tests",
    accommodations: "Extended time, visual supports, audio support",
    createdBy: "Dr. Sarah Johnson, BCBA",
    createdDate: "2024-01-15",
    lastModified: "2024-01-20",
    usageCount: 12,
    isTemplate: true,
    tags: ["reading", "comprehension", "elementary"]
  },
  {
    id: "2",
    title: "Social Interaction - Peer Engagement",
    description: "Student will initiate and maintain appropriate social interactions with peers during structured activities",
    domain: "social",
    level: "Elementary",
    type: "Annual Goal",
    objectives: [
      "Initiate conversations with peers",
      "Maintain eye contact during interactions",
      "Use appropriate social skills in group settings"
    ],
    measurement: "Daily observations, peer feedback, social skills checklist",
    accommodations: "Social stories, peer modeling, visual cues",
    createdBy: "Dr. Michael Chen, BCBA",
    createdDate: "2024-01-10",
    lastModified: "2024-01-18",
    usageCount: 8,
    isTemplate: true,
    tags: ["social", "interaction", "peers"]
  },
  {
    id: "3",
    title: "Math Problem Solving - Two-Step Problems",
    description: "Student will solve two-step word problems involving addition and subtraction with 85% accuracy",
    domain: "academic",
    level: "Elementary",
    type: "Annual Goal",
    objectives: [
      "Identify key information in word problems",
      "Choose appropriate operations",
      "Show work clearly and check answers"
    ],
    measurement: "Weekly math assessments, teacher observations",
    accommodations: "Calculator, visual aids, step-by-step guides",
    createdBy: "Dr. Sarah Johnson, BCBA",
    createdDate: "2024-01-05",
    lastModified: "2024-01-15",
    usageCount: 15,
    isTemplate: true,
    tags: ["math", "problem-solving", "word-problems"]
  },
  {
    id: "4",
    title: "Behavioral Regulation - Coping Strategies",
    description: "Student will use appropriate coping strategies when frustrated or overwhelmed",
    domain: "behavioral",
    level: "Elementary",
    type: "Annual Goal",
    objectives: [
      "Identify emotional triggers",
      "Use deep breathing techniques",
      "Request breaks when needed"
    ],
    measurement: "Daily behavior tracking, teacher reports, self-monitoring",
    accommodations: "Calm down corner, sensory tools, visual reminders",
    createdBy: "Dr. Lisa Rodriguez, BCBA",
    createdDate: "2024-01-08",
    lastModified: "2024-01-22",
    usageCount: 6,
    isTemplate: true,
    tags: ["behavior", "regulation", "coping"]
  },
  {
    id: "5",
    title: "Communication - Expressive Language",
    description: "Student will use 3-4 word phrases to express wants and needs",
    domain: "communication",
    level: "Preschool",
    type: "Annual Goal",
    objectives: [
      "Use single words to request items",
      "Combine 2-3 words in phrases",
      "Use appropriate grammar structures"
    ],
    measurement: "Language samples, communication logs, standardized assessments",
    accommodations: "AAC device, visual supports, modeling",
    createdBy: "Dr. Jennifer Smith, SLP",
    createdDate: "2024-01-12",
    lastModified: "2024-01-19",
    usageCount: 9,
    isTemplate: true,
    tags: ["communication", "expressive", "preschool"]
  }
]

export function IEPGoalsContent() {
  const [goals, setGoals] = useState(mockGoalBank)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [viewFormat, setViewFormat] = useState<"cards" | "list" | "table">("cards")

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDomain = selectedDomain === "All" || goal.domain === selectedDomain
    const matchesLevel = selectedLevel === "All" || goal.level === selectedLevel
    const matchesType = selectedType === "All" || goal.type === selectedType
    return matchesSearch && matchesDomain && matchesLevel && matchesType
  })

  const getDomainInfo = (domainId: string) => {
    return goalDomains.find(d => d.id === domainId) || goalDomains[0]
  }

  const getDomainIcon = (domainId: string) => {
    const domain = getDomainInfo(domainId)
    const Icon = domain.icon
    return <Icon className="h-4 w-4" />
  }


  const getUsageStats = () => {
    const totalGoals = goals.length
    const totalUsage = goals.reduce((sum, goal) => sum + goal.usageCount, 0)
    const mostUsed = goals.reduce((max, goal) => goal.usageCount > max.usageCount ? goal : max, goals[0])
    const recentGoals = goals.filter(goal => {
      const createdDate = new Date(goal.createdDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return createdDate > thirtyDaysAgo
    }).length

    return { totalGoals, totalUsage, mostUsed, recentGoals }
  }

  const stats = getUsageStats()

  const handleViewDetails = (goal: any) => {
    // Open a dialog to show goal details
    console.log("View details for goal:", goal.title)
    // TODO: Implement goal details dialog
  }

  const handleCopyGoal = (goal: any) => {
    // Copy goal to clipboard or create a copy
    console.log("Copy goal:", goal.title)
    // TODO: Implement goal copying functionality
  }

  // Document upload handlers
  const handleFileUpload = async (file: File, type: 'excel' | 'word') => {
    const documentId = `doc_${Date.now()}`
    const newDocument: UploadedDocument = {
      id: documentId,
      name: file.name,
      type,
      file,
      status: 'uploading',
      uploadedAt: new Date()
    }

    setUploadedDocuments(prev => [...prev, newDocument])

    // Simulate file processing
    setTimeout(() => {
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'processing' }
            : doc
        )
      )
    }, 1000)

    // Simulate goal extraction
    setTimeout(() => {
      const extractedGoals: Goal[] = [
        {
          id: `extracted_${Date.now()}_1`,
          title: "Reading Comprehension - Main Idea",
          description: "Student will identify the main idea in a grade-level text with 80% accuracy across 3 consecutive sessions",
          domain: "academic",
          level: "Elementary",
          type: "Annual Goal",
          objectives: ["Identify key details in text", "Distinguish between main idea and supporting details"],
          measurement: "Teacher-created assessments, standardized tests",
          accommodations: "Extended time, visual supports, audio support",
          createdBy: "Imported from Document",
          createdDate: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0],
          usageCount: 0,
          isTemplate: true,
          tags: ["reading", "comprehension", "imported"]
        },
        {
          id: `extracted_${Date.now()}_2`,
          title: "Social Skills - Peer Interaction",
          description: "Student will initiate appropriate social interactions with peers during structured activities",
          domain: "social",
          level: "Elementary",
          type: "Annual Goal",
          objectives: ["Initiate conversations with peers", "Maintain appropriate social distance"],
          measurement: "Daily observations, social skills checklist",
          accommodations: "Social stories, peer modeling, visual cues",
          createdBy: "Imported from Document",
          createdDate: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0],
          usageCount: 0,
          isTemplate: true,
          tags: ["social", "interaction", "imported"]
        }
      ]

      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'completed', extractedGoals }
            : doc
        )
      )
    }, 3000)
  }

  const handleCloudLink = (url: string, type: 'google-drive' | 'onedrive') => {
    const documentId = `cloud_${Date.now()}`
    const newDocument: UploadedDocument = {
      id: documentId,
      name: `Cloud Document - ${type}`,
      type,
      url,
      status: 'processing',
      uploadedAt: new Date()
    }

    setUploadedDocuments(prev => [...prev, newDocument])

    // Simulate cloud document processing
    setTimeout(() => {
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'completed', extractedGoals: [] }
            : doc
        )
      )
    }, 2000)
  }

  const importGoalsToBank = (goals: Goal[]) => {
    const newGoals = goals.map(goal => ({
      ...goal,
      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }))
    
    setGoals(prev => [...prev, ...newGoals])
    
    // Remove the document from uploaded list
    setUploadedDocuments(prev => prev.filter(doc => 
      !doc.extractedGoals?.some(g => goals.some(goal => goal.id === g.id))
    ))
  }

  const removeDocument = (documentId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goal Bank</h1>
          <p className="text-muted-foreground">Create and manage a library of IEP goals for BCBAs and teachers to use in IEP building</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={viewFormat === "cards" ? "default" : "outline"}
              onClick={() => setViewFormat("cards")}
              className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewFormat === "list" ? "default" : "outline"}
              onClick={() => setViewFormat("list")}
              className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewFormat === "table" ? "default" : "outline"}
              onClick={() => setViewFormat("table")}
              className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
            >
              <Table className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import Goals
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Import Goals from Documents</DialogTitle>
                <DialogDescription>
                  Upload Excel files, Word documents, or link to cloud storage to import existing goal banks
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Upload Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Excel Upload */}
                  <Card className="cursor-pointer hover:scale-105 transition-all duration-200 border-dashed border-2 border-gray-300 hover:border-blue-500">
                    <CardContent className="p-6 text-center">
                      <FileSpreadsheet className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Upload Excel</h3>
                      <p className="text-sm text-muted-foreground mb-4">Upload .xlsx files with goal banks</p>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'excel')
                        }}
                        className="hidden"
                        id="excel-upload-goals"
                      />
                      <Button asChild size="sm">
                        <label htmlFor="excel-upload-goals" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </label>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Word Upload */}
                  <Card className="cursor-pointer hover:scale-105 transition-all duration-200 border-dashed border-2 border-gray-300 hover:border-blue-500">
                    <CardContent className="p-6 text-center">
                      <File className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Upload Word</h3>
                      <p className="text-sm text-muted-foreground mb-4">Upload .docx files with goal lists</p>
                      <input
                        type="file"
                        accept=".docx,.doc"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'word')
                        }}
                        className="hidden"
                        id="word-upload-goals"
                      />
                      <Button asChild size="sm">
                        <label htmlFor="word-upload-goals" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </label>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Google Drive */}
                  <Card className="cursor-pointer hover:scale-105 transition-all duration-200 border-dashed border-2 border-gray-300 hover:border-blue-500">
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 font-bold text-lg">G</span>
                      </div>
                      <h3 className="font-semibold mb-2">Google Drive</h3>
                      <p className="text-sm text-muted-foreground mb-4">Link to Google Drive documents</p>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          const url = prompt("Enter Google Drive document URL:")
                          if (url) handleCloudLink(url, 'google-drive')
                        }}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Link Document
                      </Button>
                    </CardContent>
                  </Card>

                  {/* OneDrive */}
                  <Card className="cursor-pointer hover:scale-105 transition-all duration-200 border-dashed border-2 border-gray-300 hover:border-blue-500">
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 font-bold text-lg">O</span>
                      </div>
                      <h3 className="font-semibold mb-2">OneDrive</h3>
                      <p className="text-sm text-muted-foreground mb-4">Link to OneDrive documents</p>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          const url = prompt("Enter OneDrive document URL:")
                          if (url) handleCloudLink(url, 'onedrive')
                        }}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Link Document
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Uploaded Documents List */}
                {uploadedDocuments.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Uploaded Documents</h3>
                    <div className="space-y-3">
                      {uploadedDocuments.map((doc) => (
                        <Card key={doc.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {doc.type === 'excel' ? (
                                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                              ) : doc.type === 'word' ? (
                                <File className="h-8 w-8 text-blue-600" />
                              ) : (
                                <Link className="h-8 w-8 text-purple-600" />
                              )}
                              <div>
                                <h4 className="font-medium">{doc.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Uploaded {doc.uploadedAt.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {doc.status === 'uploading' && (
                                <Badge variant="outline" className="text-blue-600">
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                  Uploading
                                </Badge>
                              )}
                              {doc.status === 'processing' && (
                                <Badge variant="outline" className="text-yellow-600">
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                  Processing
                                </Badge>
                              )}
                              {doc.status === 'completed' && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                              {doc.status === 'error' && (
                                <Badge variant="outline" className="text-red-600">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Error
                                </Badge>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => removeDocument(doc.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {doc.extractedGoals && doc.extractedGoals.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium">Extracted Goals ({doc.extractedGoals.length})</h5>
                                <Button 
                                  size="sm"
                                  onClick={() => importGoalsToBank(doc.extractedGoals!)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Import All to Goal Bank
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {doc.extractedGoals.map((goal) => (
                                  <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h6 className="font-medium text-sm">{goal.title}</h6>
                                        <Badge variant="outline" className="text-xs">
                                          {goal.domain}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {goal.level}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => importGoalsToBank([goal])}
                                      className="ml-2"
                                    >
                                      Import
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Goal
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Goal Template</DialogTitle>
              <DialogDescription>
                Add a new goal template to the goal bank for use in IEP building
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input id="title" placeholder="Enter goal title" />
                </div>
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalDomains.map(domain => (
                        <SelectItem key={domain.id} value={domain.id}>
                          <div className="flex items-center gap-2">
                            <domain.icon className="h-4 w-4" />
                            {domain.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Goal Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the goal in detail. Be specific about what the student will achieve and how it will be measured."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="level">Grade Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Goal Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" placeholder="e.g., reading, comprehension, elementary" />
                </div>
              </div>

              <div>
                <Label htmlFor="objectives">Short-term Objectives</Label>
                <Textarea 
                  id="objectives" 
                  placeholder="List specific objectives that will help achieve this goal. One per line."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="measurement">Measurement Method</Label>
                  <Textarea 
                    id="measurement" 
                    placeholder="How will progress be measured?"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="accommodations">Accommodations</Label>
                  <Textarea 
                    id="accommodations" 
                    placeholder="What accommodations or supports are needed?"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddGoalOpen(false)}>
                  Create Goal Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>

      {/* Import Status */}
      {uploadedDocuments.length > 0 && (
        <Card noHover>
          <CardHeader>
            <CardTitle className="text-lg">Recent Imports</CardTitle>
            <CardDescription>Documents uploaded and processed for goal extraction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedDocuments.slice(-3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {doc.type === 'excel' ? (
                      <FileSpreadsheet className="h-6 w-6 text-green-600" />
                    ) : doc.type === 'word' ? (
                      <File className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Link className="h-6 w-6 text-purple-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.extractedGoals?.length || 0} goals extracted
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.status === 'completed' && doc.extractedGoals && doc.extractedGoals.length > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => importGoalsToBank(doc.extractedGoals!)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Import Goals
                      </Button>
                    )}
                    {doc.status === 'processing' && (
                      <Badge variant="outline" className="text-yellow-600">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Processing
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card noHover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGoals}</div>
            <p className="text-xs text-muted-foreground">Goal templates in bank</p>
          </CardContent>
        </Card>
        <Card noHover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
            <p className="text-xs text-muted-foreground">Times used in IEPs</p>
          </CardContent>
        </Card>
        <Card noHover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mostUsed?.usageCount || 0}</div>
            <p className="text-xs text-muted-foreground">Uses: {stats.mostUsed?.title || "N/A"}</p>
          </CardContent>
        </Card>
        <Card noHover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Additions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentGoals}</div>
            <p className="text-xs text-muted-foreground">Added in last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card noHover>
        <CardHeader>
          <CardTitle>Goal Library</CardTitle>
          <CardDescription>Search and filter goal templates by domain, level, and type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search goals, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Domains</SelectItem>
                {goalDomains.map(domain => (
                  <SelectItem key={domain.id} value={domain.id}>
                    <div className="flex items-center gap-2">
                      <domain.icon className="h-4 w-4" />
                      {domain.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                {goalLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                {goalTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Goals Display */}
          {viewFormat === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => {
              const domainInfo = getDomainInfo(goal.domain)
              return (
                <Card key={goal.id} className="hover:scale-105 transition-all duration-200 cursor-pointer group flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${domainInfo.color}`}>
                          {getDomainIcon(goal.domain)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{goal.level}</Badge>
                            <Badge variant="outline">{goal.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {goal.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>Created by {goal.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Target className="h-3 w-3" />
                          <span>Used {goal.usageCount} times</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Modified {new Date(goal.lastModified).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {goal.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full mt-auto">
                      <Button 
                        size="sm" 
                        onClick={() => handleViewDetails(goal)}
                        className="flex-1 min-w-0"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopyGoal(goal)}
                        className="flex-1 min-w-0"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            </div>
          )}

          {viewFormat === "list" && (
            <div className="space-y-4">
              {filteredGoals.map((goal) => {
                const domainInfo = getDomainInfo(goal.domain)
                return (
                  <Card key={goal.id} className="hover:scale-105 transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${domainInfo.color}`}>
                            {getDomainIcon(goal.domain)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{goal.title}</h3>
                            <p className="text-xs text-muted-foreground truncate">{goal.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{goal.level}</Badge>
                              <Badge variant="outline" className="text-xs">{goal.type}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <Button 
                            size="sm" 
                            onClick={() => handleViewDetails(goal)}
                            className="flex-1 min-w-0"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCopyGoal(goal)}
                            className="flex-1 min-w-0"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {viewFormat === "table" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Goal</th>
                    <th className="text-left p-3 font-medium">Domain</th>
                    <th className="text-left p-3 font-medium">Level</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Usage</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGoals.map((goal) => {
                    const domainInfo = getDomainInfo(goal.domain)
                    return (
                      <tr key={goal.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-sm">{goal.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-xs">{goal.description}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${domainInfo.color}`}>
                              {getDomainIcon(goal.domain)}
                            </div>
                            <span className="text-sm">{domainInfo.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">{goal.level}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">{goal.type}</Badge>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">{goal.usageCount} times</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(goal)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCopyGoal(goal)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filteredGoals.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No goals found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedDomain !== "All" || selectedLevel !== "All" || selectedType !== "All"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first goal template"
                }
              </p>
              <Button onClick={() => setIsAddGoalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Goal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}