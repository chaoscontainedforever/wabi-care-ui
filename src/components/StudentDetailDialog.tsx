"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Calendar, GraduationCap } from "@/components/icons"
import type { Tables } from "@/lib/database.types"

interface StudentDetailDialogProps {
  student: Tables<'students'>
}

export const StudentDetailDialog = memo(function StudentDetailDialog({ student }: StudentDetailDialogProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Full Name</Label>
              <p className="text-sm text-muted-foreground">{student.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Student ID</Label>
              <p className="text-sm text-muted-foreground">{student.student_id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Grade & Age</Label>
              <p className="text-sm text-muted-foreground">{student.grade} • Age {student.age}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Disability</Label>
              <p className="text-sm text-muted-foreground">{student.disability}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">School</Label>
              <p className="text-sm text-muted-foreground">{student.school}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Teacher</Label>
              <p className="text-sm text-muted-foreground">Sarah Wilson</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parent/Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Parent Name</Label>
              <p className="text-sm text-muted-foreground">Priya Sharma</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-3 w-3" />
                (412) 555-0194
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-3 w-3" />
                priya.sharma@email.com
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Address</Label>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                123 Oak Street, Pittsburgh, PA 15213
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IEP and Assessment Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">IEP Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">IEP Date</Label>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                March 15, 2024
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Next Review</Label>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                March 15, 2025
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge variant="outline" className="text-xs">
                Active
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Group</Label>
              <p className="text-sm text-muted-foreground">General Education</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Last Assessment</Label>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                August 20, 2024
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Assessment Type</Label>
              <p className="text-sm text-muted-foreground">VB-MAPP</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Notes</Label>
              <p className="text-sm text-muted-foreground">Student shows strong progress in communication skills</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

StudentDetailDialog.displayName = "StudentDetailDialog"
