"use client"

import { useState, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  FileText,
  Eye,
  Edit
} from "lucide-react"

// Mock data for students
const mockStudents = [
  {
    id: "1",
    name: "Emma Johnson",
    studentId: "EJ001",
    grade: "3rd Grade",
    age: "8 years old",
    disability: "Autism Spectrum Disorder",
    teacher: "Ms. Sarah Wilson",
    lastIEP: "2024-01-15",
    status: "Active",
    profilePicture: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2",
    name: "Michael Chen",
    studentId: "MC002",
    grade: "2nd Grade",
    age: "7 years old",
    disability: "ADHD",
    teacher: "Mr. David Rodriguez",
    lastIEP: "2024-01-10",
    status: "Active",
    profilePicture: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Sarah Williams",
    studentId: "SW003",
    grade: "4th Grade",
    age: "9 years old",
    disability: "Learning Disability",
    teacher: "Ms. Jennifer Smith",
    lastIEP: "2023-12-20",
    status: "Active",
    profilePicture: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "4",
    name: "David Rodriguez",
    studentId: "DR004",
    grade: "1st Grade",
    age: "6 years old",
    disability: "Speech and Language Impairment",
    teacher: "Ms. Lisa Brown",
    lastIEP: "2024-01-05",
    status: "Active",
    profilePicture: "https://i.pravatar.cc/150?img=4"
  }
]

// Mock progress data
const mockProgressData = {
  "1": {
    overallProgress: 85,
    goals: [
      { id: "1", title: "Communication Skills", progress: 90, trend: "up", status: "on-track" },
      { id: "2", title: "Social Interactions", progress: 75, trend: "up", status: "on-track" },
      { id: "3", title: "Academic Skills", progress: 80, trend: "stable", status: "on-track" },
      { id: "4", title: "Behavioral Regulation", progress: 70, trend: "down", status: "needs-attention" }
    ],
    assessments: [
      { date: "2024-01-15", type: "AFLS", score: 85, notes: "Strong progress in communication" },
      { date: "2024-01-10", type: "VB-MAPP", score: 78, notes: "Improving social skills" },
      { date: "2024-01-05", type: "ABLLS", score: 82, notes: "Academic skills developing well" }
    ],
    attendance: 95,
    behaviorIncidents: 2,
    lastReview: "2024-01-15"
  },
  "2": {
    overallProgress: 72,
    goals: [
      { id: "1", title: "Focus and Attention", progress: 80, trend: "up", status: "on-track" },
      { id: "2", title: "Task Completion", progress: 65, trend: "up", status: "on-track" },
      { id: "3", title: "Social Skills", progress: 70, trend: "stable", status: "on-track" },
      { id: "4", title: "Academic Performance", progress: 60, trend: "down", status: "needs-attention" }
    ],
    assessments: [
      { date: "2024-01-10", type: "AFLS", score: 72, notes: "Good focus during structured activities" },
      { date: "2024-01-08", type: "VB-MAPP", score: 68, notes: "Needs support with transitions" },
      { date: "2024-01-05", type: "ABLLS", score: 75, notes: "Academic skills improving" }
    ],
    attendance: 88,
    behaviorIncidents: 5,
    lastReview: "2024-01-10"
  }
}

function IEPReviewContent() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const selectedStudentData = selectedStudent ? mockStudents.find(s => s.id === selectedStudent) : null
  const progressData = selectedStudent ? mockProgressData[selectedStudent as keyof typeof mockProgressData] : null

  return (
    <div className="flex-1 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
      {/* Student Selection Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-full lg:w-72'} flex-shrink-0 transition-all duration-300`}>
        <Card className="sticky top-4" noHover>
          {!isSidebarCollapsed ? (
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Select Student</CardTitle>
                  <CardDescription>Choose a student to review progress</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarCollapsed(false)}
                className="h-8 w-8 p-0 mb-4"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="flex flex-col items-center space-y-3">
                {mockStudents.slice(0, 3).map((student) => (
                  <div
                    key={student.id}
                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={() => {
                      setSelectedStudent(student.id)
                      setIsSidebarCollapsed(false)
                    }}
                    title={student.name}
                  >
                    <img 
                      src={student.profilePicture} 
                      alt={student.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: 'none'}}>
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                ))}
                {mockStudents.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium">
                    +{mockStudents.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
          {!isSidebarCollapsed && (
            <CardContent className="p-0">
              <div className="space-y-1">
                {mockStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-3 cursor-pointer transition-all hover:bg-gray-50 border-l-4 ${
                      selectedStudent === student.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={student.profilePicture} 
                          alt={student.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling.style.display = 'flex'
                          }}
                        />
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: 'none'}}>
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate leading-tight">{student.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">ID: {student.studentId}</p>
                        <p className="text-xs text-muted-foreground truncate">{student.grade} • {student.disability}</p>
                      </div>
                      {selectedStudent === student.id && (
                        <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-4 lg:space-y-6">
        {selectedStudent && selectedStudentData && progressData ? (
          <>
            {/* Student Overview Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Student Photo */}
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedStudentData.profilePicture} 
                    alt={selectedStudentData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center" style={{display: 'none'}}>
                    <User className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                
                {/* Student Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedStudentData.name}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>ID: {selectedStudentData.studentId}</span>
                    <span>•</span>
                    <span>{selectedStudentData.grade}</span>
                    <span>•</span>
                    <span>{selectedStudentData.age}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{selectedStudentData.disability}</p>
                    <p>Teacher: {selectedStudentData.teacher}</p>
                  </div>
                </div>

                {/* Progress Summary */}
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {progressData.overallProgress}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                  <Badge variant={progressData.overallProgress >= 80 ? "default" : progressData.overallProgress >= 60 ? "secondary" : "destructive"} className="mt-2">
                    {progressData.overallProgress >= 80 ? "On Track" : progressData.overallProgress >= 60 ? "Progressing" : "Needs Support"}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View IEP
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Goals
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10" suppressHydrationWarning>
                <TabsTrigger value="overview" suppressHydrationWarning className="text-xs sm:text-sm py-2 sm:py-1">Overview</TabsTrigger>
                <TabsTrigger value="goals" suppressHydrationWarning className="text-xs sm:text-sm py-2 sm:py-1">Goal Progress</TabsTrigger>
                <TabsTrigger value="assessments" suppressHydrationWarning className="text-xs sm:text-sm py-2 sm:py-1">Assessments</TabsTrigger>
                <TabsTrigger value="analytics" suppressHydrationWarning className="text-xs sm:text-sm py-2 sm:py-1">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6" suppressHydrationWarning>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                          <p className="text-2xl font-bold">{progressData.attendance}%</p>
                        </div>
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Behavior Incidents</p>
                          <p className="text-2xl font-bold">{progressData.behaviorIncidents}</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Goals Met</p>
                          <p className="text-2xl font-bold">{progressData.goals.filter(g => g.progress >= 80).length}/{progressData.goals.length}</p>
                        </div>
                        <Target className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Last Review</p>
                          <p className="text-sm font-bold">{new Date(progressData.lastReview).toLocaleDateString()}</p>
                        </div>
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Progress Trend (Last 6 Months)
                    </CardTitle>
                    <CardDescription>Overall progress over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                      <div className="h-full flex flex-col">
                        {/* Chart Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                          </div>
                          <div className="text-sm text-gray-500">Last 6 months</div>
                        </div>
                        
                        {/* Simple Line Chart Representation */}
                        <div className="flex-1 relative min-h-0">
                          <svg className="w-full h-full max-h-32" viewBox="0 0 280 100" preserveAspectRatio="xMidYMid meet">
                            {/* Grid lines */}
                            <defs>
                              <pattern id="grid" width="28" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 28 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                              </pattern>
                            </defs>
                            <rect width="280" height="100" fill="url(#grid)" />
                            
                            {/* Progress line */}
                            <polyline
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              points="20,80 60,70 100,60 140,50 180,40 220,30 260,20"
                            />
                            
                            {/* Data points */}
                            <circle cx="20" cy="80" r="3" fill="#3b82f6" />
                            <circle cx="60" cy="70" r="3" fill="#3b82f6" />
                            <circle cx="100" cy="60" r="3" fill="#3b82f6" />
                            <circle cx="140" cy="50" r="3" fill="#3b82f6" />
                            <circle cx="180" cy="40" r="3" fill="#3b82f6" />
                            <circle cx="220" cy="30" r="3" fill="#3b82f6" />
                            <circle cx="260" cy="20" r="3" fill="#3b82f6" />
                            
                            {/* Y-axis labels */}
                            <text x="5" y="20" fontSize="8" fill="#6b7280">100%</text>
                            <text x="5" y="40" fontSize="8" fill="#6b7280">75%</text>
                            <text x="5" y="60" fontSize="8" fill="#6b7280">50%</text>
                            <text x="5" y="80" fontSize="8" fill="#6b7280">25%</text>
                            
                            {/* X-axis labels */}
                            <text x="20" y="95" fontSize="8" fill="#6b7280">Aug</text>
                            <text x="60" y="95" fontSize="8" fill="#6b7280">Sep</text>
                            <text x="100" y="95" fontSize="8" fill="#6b7280">Oct</text>
                            <text x="140" y="95" fontSize="8" fill="#6b7280">Nov</text>
                            <text x="180" y="95" fontSize="8" fill="#6b7280">Dec</text>
                            <text x="220" y="95" fontSize="8" fill="#6b7280">Jan</text>
                            <text x="260" y="95" fontSize="8" fill="#6b7280">Feb</text>
                          </svg>
                        </div>
                        
                        {/* Chart Summary */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-600">Improving</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span className="text-gray-600">+15% this month</span>
                            </div>
                          </div>
                          <div className="text-gray-500">Current: 75%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Goal Progress Tab */}
              <TabsContent value="goals" className="space-y-6" suppressHydrationWarning>
                <div className="space-y-4">
                  {progressData.goals.map((goal) => (
                    <Card key={goal.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{goal.title}</h3>
                            <Badge variant={goal.status === "on-track" ? "default" : "destructive"}>
                              {goal.status === "on-track" ? "On Track" : "Needs Attention"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{goal.progress}%</span>
                            {goal.trend === "up" ? (
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            ) : goal.trend === "down" ? (
                              <TrendingDown className="h-5 w-5 text-red-500" />
                            ) : (
                              <Activity className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              goal.progress >= 80 ? 'bg-green-500' : 
                              goal.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Assessments Tab */}
              <TabsContent value="assessments" className="space-y-6" suppressHydrationWarning>
                <div className="space-y-4">
                  {progressData.assessments.map((assessment, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{assessment.type} Assessment</h3>
                              <p className="text-sm text-gray-600">{new Date(assessment.date).toLocaleDateString()}</p>
                              <p className="text-sm text-gray-500">{assessment.notes}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{assessment.score}%</div>
                            <Badge variant={assessment.score >= 80 ? "default" : assessment.score >= 60 ? "secondary" : "destructive"}>
                              {assessment.score >= 80 ? "Excellent" : assessment.score >= 60 ? "Good" : "Needs Improvement"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6" suppressHydrationWarning>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Goal Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                        <div className="h-full flex flex-col">
                          {/* Chart Header */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-700">Goal Distribution</span>
                            <div className="text-sm text-gray-500">Total: 10 goals</div>
                          </div>
                          
                          {/* Pie Chart Representation */}
                          <div className="flex-1 flex items-center justify-center min-h-0">
                            <div className="relative w-24 h-24">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                                {/* Background circle */}
                                <circle cx="50" cy="50" r="40" fill="#e5e7eb" />
                                
                                {/* Academic slice (40%) */}
                                <circle 
                                  cx="50" cy="50" r="40" 
                                  fill="none" 
                                  stroke="#3b82f6" 
                                  strokeWidth="20" 
                                  strokeDasharray="25.13 62.83"
                                  strokeDashoffset="0"
                                />
                                
                                {/* Behavioral slice (30%) */}
                                <circle 
                                  cx="50" cy="50" r="40" 
                                  fill="none" 
                                  stroke="#10b981" 
                                  strokeWidth="20" 
                                  strokeDasharray="18.85 62.83"
                                  strokeDashoffset="-25.13"
                                />
                                
                                {/* Communication slice (20%) */}
                                <circle 
                                  cx="50" cy="50" r="40" 
                                  fill="none" 
                                  stroke="#f59e0b" 
                                  strokeWidth="20" 
                                  strokeDasharray="12.57 62.83"
                                  strokeDashoffset="-43.98"
                                />
                                
                                {/* Social slice (10%) */}
                                <circle 
                                  cx="50" cy="50" r="40" 
                                  fill="none" 
                                  stroke="#ef4444" 
                                  strokeWidth="20" 
                                  strokeDasharray="6.28 62.83"
                                  strokeDashoffset="-56.55"
                                />
                              </svg>
                              
                              {/* Center text */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-sm font-bold text-gray-700">10</div>
                                  <div className="text-xs text-gray-500">Goals</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Legend */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-600">Academic (4)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                              <span className="text-gray-600">Behavioral (3)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                              <span className="text-gray-600">Communication (2)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-600">Social (1)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Assessment Scores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                        <div className="h-full flex flex-col">
                          {/* Chart Header */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-700">Assessment Scores</span>
                            <div className="text-sm text-gray-500">Last 4 assessments</div>
                          </div>
                          
                          {/* Bar Chart Representation */}
                          <div className="flex-1 flex items-end justify-between px-2">
                            {/* AFLS Bar */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                              <div className="text-xs text-gray-600">78%</div>
                              <div className="text-xs text-gray-500">AFLS</div>
                            </div>
                            
                            {/* VB-MAPP Bar */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 bg-emerald-500 rounded-t" style={{height: '85%'}}></div>
                              <div className="text-xs text-gray-600">85%</div>
                              <div className="text-xs text-gray-500">VB-MAPP</div>
                            </div>
                            
                            {/* ABLLS Bar */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 bg-amber-500 rounded-t" style={{height: '70%'}}></div>
                              <div className="text-xs text-gray-600">70%</div>
                              <div className="text-xs text-gray-500">ABLLS</div>
                            </div>
                            
                            {/* FAST Bar */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 bg-red-500 rounded-t" style={{height: '45%'}}></div>
                              <div className="text-xs text-gray-600">45%</div>
                              <div className="text-xs text-gray-500">FAST</div>
                            </div>
                          </div>
                          
                          {/* Chart Summary */}
                          <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-600">Average: 70%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-gray-600">+5% vs last quarter</span>
                              </div>
                            </div>
                            <div className="text-gray-500">Best: VB-MAPP</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 space-y-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Student Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Please select a student from the sidebar to view their progress and review data.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(IEPReviewContent)
