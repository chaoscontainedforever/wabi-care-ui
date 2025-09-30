"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Plus, AlertCircle } from "lucide-react"

export default function TasksPage() {
  const mockTasks = [
    {
      id: 1,
      title: "Complete IEP Review for John Doe",
      description: "Annual IEP review due this week",
      priority: "high",
      dueDate: "2024-01-15",
      status: "pending"
    },
    {
      id: 2,
      title: "Schedule Assessment Session",
      description: "AFLS assessment for Sarah Smith",
      priority: "medium",
      dueDate: "2024-01-18",
      status: "in-progress"
    },
    {
      id: 3,
      title: "Update Progress Reports",
      description: "Monthly progress reports for all students",
      priority: "low",
      dueDate: "2024-01-20",
      status: "completed"
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress": return <Clock className="h-4 w-4 text-blue-600" />
      case "pending": return <AlertCircle className="h-4 w-4 text-orange-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your daily tasks and assignments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="space-y-4">
        {mockTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
