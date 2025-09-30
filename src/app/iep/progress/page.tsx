"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, User, Target, Calendar } from "lucide-react"

export default function IEPProgressPage() {
  const mockProgress = [
    {
      id: 1,
      studentName: "John Doe",
      goalTitle: "Reading Comprehension",
      currentProgress: 75,
      targetProgress: 80,
      lastUpdated: "2024-01-10",
      status: "on-track"
    },
    {
      id: 2,
      studentName: "Sarah Smith",
      goalTitle: "Math Problem Solving",
      currentProgress: 45,
      targetProgress: 70,
      lastUpdated: "2024-01-08",
      status: "needs-attention"
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      goalTitle: "Social Communication",
      currentProgress: 85,
      targetProgress: 80,
      lastUpdated: "2024-01-12",
      status: "exceeding"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "bg-green-100 text-green-800"
      case "needs-attention": return "bg-yellow-100 text-yellow-800"
      case "exceeding": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">IEP Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor student progress toward IEP goals</p>
        </div>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="space-y-4">
        {mockProgress.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.studentName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.goalTitle}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Progress:</span>
                        <span className="text-sm">{item.currentProgress}% / {item.targetProgress}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.currentProgress / item.targetProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
