"use client"

import { memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Target, 
  TrendingUp, 
  FileText,
  BarChart3,
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

function DashboardContent() {
  // Mock data - in real app this would come from API
  const stats = [
    {
      title: "Active Students",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "Students currently enrolled"
    },
    {
      title: "IEP Goals",
      value: "156",
      change: "+8%",
      changeType: "positive" as const,
      icon: Target,
      description: "Goals in progress"
    },
    {
      title: "Assessments Due",
      value: "8",
      change: "-2",
      changeType: "negative" as const,
      icon: FileText,
      description: "Pending assessments"
    },
    {
      title: "Goal Completion",
      value: "78%",
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "This month"
    }
  ]

  const recentStudents = [
    {
      id: 1,
      name: "Emma Johnson",
      grade: "3rd Grade",
      status: "active",
      lastAssessment: "2 days ago",
      progress: 85,
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: 2,
      name: "Michael Chen",
      grade: "5th Grade",
      status: "active",
      lastAssessment: "1 week ago",
      progress: 72,
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      id: 3,
      name: "Sarah Williams",
      grade: "2nd Grade",
      status: "needs_attention",
      lastAssessment: "3 days ago",
      progress: 45,
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
      id: 4,
      name: "David Rodriguez",
      grade: "4th Grade",
      status: "active",
      lastAssessment: "1 day ago",
      progress: 91,
      avatar: "https://i.pravatar.cc/150?img=4"
    }
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: "FAST Assessment - Emma Johnson",
      dueDate: "Today",
      priority: "high",
      type: "assessment"
    },
    {
      id: 2,
      title: "IEP Review Meeting - Michael Chen",
      dueDate: "Tomorrow",
      priority: "medium",
      type: "meeting"
    },
    {
      id: 3,
      title: "VB-MAPP Assessment - Sarah Williams",
      dueDate: "Dec 15",
      priority: "high",
      type: "assessment"
    },
    {
      id: 4,
      title: "Progress Report - David Rodriguez",
      dueDate: "Dec 18",
      priority: "low",
      type: "report"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "needs_attention":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your students.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:scale-105 transition-all duration-200 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                  <span>from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <Card className="lg:col-span-2" noHover>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>Latest student activity and progress</CardDescription>
              </div>
              <Button size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 cursor-pointer group">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{student.grade}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{student.progress}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Last assessment</p>
                    <p className="text-sm font-medium">{student.lastAssessment}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card noHover>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your schedule for the next few days</CardDescription>
              </div>
              <Button size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    {task.type === "assessment" ? (
                      <FileText className="h-4 w-4 text-blue-600" />
                    ) : task.type === "meeting" ? (
                      <Calendar className="h-4 w-4 text-green-600" />
                    ) : (
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card noHover>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">New Assessment</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Target className="h-6 w-6" />
              <span className="text-sm">Create IEP Goal</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Add Student</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default memo(DashboardContent)
