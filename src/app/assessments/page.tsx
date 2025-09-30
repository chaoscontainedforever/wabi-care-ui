"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Plus, FileText, BarChart3 } from "lucide-react"

export default function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assessments</h1>
          <p className="text-muted-foreground">Manage student assessments and evaluations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Data Collection
            </CardTitle>
            <CardDescription>
              Track student progress and collect assessment data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Data Collection
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Form Bank
            </CardTitle>
            <CardDescription>
              Access assessment forms and templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Browse Forms
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Assessment Reports
            </CardTitle>
            <CardDescription>
              View assessment results and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
